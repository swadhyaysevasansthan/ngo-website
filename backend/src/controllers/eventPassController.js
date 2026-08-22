import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { 
  generateQRToken, 
  generatePassNumber, 
  getNextPassSequence 
} from '../utils/passQRUtils.js';

// ============================================================
// EVENTS CRUD
// ============================================================

export const createEvent = async (req, res) => {
  const { name, slug, description, eventDate, venue } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Name and unique slug are required' });
  }

  try {
    const checkSlug = await pool.query('SELECT id FROM events WHERE slug = $1', [slug]);
    if (checkSlug.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An event with this slug already exists' });
    }

    const result = await pool.query(
      `INSERT INTO events (name, slug, description, event_date, venue, status)
       VALUES ($1, $2, $3, $4, $5, 'draft')
       RETURNING *`,
      [name, slug, description, eventDate || null, venue || null]
    );

    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event', error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date DESC, id DESC');
    res.json({ success: true, events: result.rows });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve events' });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve event' });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, eventDate, venue, status } = req.body;

  if (!name || !slug || !status) {
    return res.status(400).json({ success: false, message: 'Name, slug, and status are required' });
  }

  try {
    // Ensure slug uniqueness excluding current event
    const checkSlug = await pool.query('SELECT id FROM events WHERE slug = $1 AND id <> $2', [slug, id]);
    if (checkSlug.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An event with this slug already exists' });
    }

    const result = await pool.query(
      `UPDATE events 
       SET name = $1, slug = $2, description = $3, event_date = $4, venue = $5, status = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, slug, description, eventDate || null, venue || null, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: 'Failed to update event', error: error.message });
  }
};

// ============================================================
// EVENT PASSES CRUD & LIFECYCLE
// ============================================================

export const createPass = async (req, res) => {
  const { eventId, guestName, mobile, email, category, notes } = req.body;

  if (!eventId || !guestName) {
    return res.status(400).json({ success: false, message: 'Event ID and guest name are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get event details to generate pass number
    const eventRes = await client.query('SELECT id, slug FROM events WHERE id = $1', [eventId]);
    if (eventRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const event = eventRes.rows[0];

    // Lock sequence generation using database helper
    const seq = await getNextPassSequence(client, eventId);
    const passNumber = generatePassNumber(event.slug, seq);
    const qrToken = generateQRToken();

    const result = await client.query(
      `INSERT INTO event_passes (event_id, pass_number, guest_name, mobile, email, category, qr_token, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ISSUED', $8)
       RETURNING *`,
      [eventId, passNumber, guestName, mobile || null, email || null, category || null, qrToken, notes || null]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, pass: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create pass error:', error);
    res.status(500).json({ success: false, message: 'Failed to create pass', error: error.message });
  } finally {
    client.release();
  }
};

export const bulkImportPasses = async (req, res) => {
  const { eventId, guests } = req.body; // guests is Array of { guestName, mobile, email, category, notes }

  if (!eventId || !Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ success: false, message: 'Event ID and a list of guests are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get event details
    const eventRes = await client.query('SELECT id, slug FROM events WHERE id = $1', [eventId]);
    if (eventRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const event = eventRes.rows[0];

    // Fetch initial starting sequence number
    let nextSeq = await getNextPassSequence(client, eventId);
    const insertedPasses = [];

    for (const guest of guests) {
      if (!guest.guestName) continue; // Skip entries without names

      const passNumber = generatePassNumber(event.slug, nextSeq);
      const qrToken = generateQRToken();
      nextSeq++;

      const resInsert = await client.query(
        `INSERT INTO event_passes (event_id, pass_number, guest_name, mobile, email, category, qr_token, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ISSUED', $8)
         RETURNING id, pass_number, guest_name, category`,
        [
          eventId,
          passNumber,
          guest.guestName,
          guest.mobile || null,
          guest.email || null,
          guest.category || null,
          qrToken,
          guest.notes || null
        ]
      );
      insertedPasses.push(resInsert.rows[0]);
    }

    await client.query('COMMIT');
    res.json({ success: true, count: insertedPasses.length, passes: insertedPasses });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk import passes error:', error);
    res.status(500).json({ success: false, message: 'Bulk import failed', error: error.message });
  } finally {
    client.release();
  }
};

export const getPasses = async (req, res) => {
  const { eventId, status, search, limit = 50, offset = 0 } = req.query;

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required' });
  }

  try {
    let queryText = `
      SELECT p.*, sd.name as scanner_name 
      FROM event_passes p
      LEFT JOIN scanner_devices sd ON p.checked_in_by = sd.id
      WHERE p.event_id = $1
    `;
    const params = [eventId];
    let paramIndex = 2;

    if (status) {
      queryText += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (p.guest_name ILIKE $${paramIndex} OR p.mobile ILIKE $${paramIndex} OR p.pass_number ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get count first
    const countQuery = queryText.replace('p.*, sd.name as scanner_name', 'COUNT(*)');
    const countRes = await pool.query(countQuery, params);
    const totalCount = parseInt(countRes.rows[0].count, 10);

    // Apply sorting and limit/offset
    queryText += ` ORDER BY p.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const passesRes = await pool.query(queryText, params);

    res.json({
      success: true,
      passes: passesRes.rows,
      totalCount
    });
  } catch (error) {
    console.error('Get passes error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve passes' });
  }
};

export const getPassById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, sd.name as scanner_name, e.name as event_name
       FROM event_passes p
       LEFT JOIN scanner_devices sd ON p.checked_in_by = sd.id
       INNER JOIN events e ON p.event_id = e.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    res.json({ success: true, pass: result.rows[0] });
  } catch (error) {
    console.error('Get pass by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve pass details' });
  }
};

export const cancelPass = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE event_passes 
       SET status = 'CANCELLED', updated_at = NOW() 
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    res.json({ success: true, message: 'Pass cancelled successfully', pass: result.rows[0] });
  } catch (error) {
    console.error('Cancel pass error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel pass' });
  }
};

export const reissueQR = async (req, res) => {
  const { id } = req.params;
  const newQrToken = generateQRToken();

  try {
    const result = await pool.query(
      `UPDATE event_passes 
       SET qr_token = $1, status = 'ISSUED', checked_in_at = NULL, checked_in_by = NULL, gate = NULL, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newQrToken, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    res.json({ success: true, message: 'New QR pass reissued successfully', pass: result.rows[0] });
  } catch (error) {
    console.error('Reissue QR error:', error);
    res.status(500).json({ success: false, message: 'Failed to reissue QR pass' });
  }
};

// ============================================================
// ATTENDANCE & STATS
// ============================================================

export const getAttendanceStats = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required' });
  }

  try {
    // 1. General numbers
    const generalRes = await pool.query(
      `SELECT 
         COUNT(*) as total_passes,
         COUNT(CASE WHEN status = 'CHECKED_IN' THEN 1 END) as checked_in,
         COUNT(CASE WHEN status = 'ISSUED' THEN 1 END) as pending,
         COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled
       FROM event_passes
       WHERE event_id = $1`,
      [eventId]
    );

    // 2. Breakdown by category
    const categoryRes = await pool.query(
      `SELECT 
         COALESCE(category, 'General') as category,
         COUNT(*) as total_passes,
         COUNT(CASE WHEN status = 'CHECKED_IN' THEN 1 END) as checked_in
       FROM event_passes
       WHERE event_id = $1
       GROUP BY category
       ORDER BY total_passes DESC`,
      [eventId]
    );

    // 3. Checked in breakdown by gate
    const gateRes = await pool.query(
      `SELECT 
         COALESCE(gate, 'Unknown') as gate,
         COUNT(*) as count
       FROM event_passes
       WHERE event_id = $1 AND status = 'CHECKED_IN'
       GROUP BY gate
       ORDER BY count DESC`,
      [eventId]
    );

    res.json({
      success: true,
      stats: {
        summary: generalRes.rows[0],
        categories: categoryRes.rows,
        gates: gateRes.rows
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
};

export const getCheckInLogs = async (req, res) => {
  const { eventId } = req.params;
  const { limit = 100 } = req.query;

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT cl.*, p.guest_name, p.pass_number, sd.name as scanner_name
       FROM checkin_logs cl
       LEFT JOIN event_passes p ON cl.pass_id = p.id
       LEFT JOIN scanner_devices sd ON cl.scanner_id = sd.id
       WHERE cl.event_id = $1
       ORDER BY cl.scanned_at DESC
       LIMIT $2`,
      [eventId, parseInt(limit, 10)]
    );

    res.json({ success: true, logs: result.rows });
  } catch (error) {
    console.error('Get check-in logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve check-in logs' });
  }
};

export const deletePass = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // First delete any associated check-in logs
    await client.query('DELETE FROM checkin_logs WHERE pass_id = $1', [id]);
    
    // Then delete the pass itself
    const result = await client.query(
      'DELETE FROM event_passes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Pass permanently deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete pass error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete pass permanently', error: error.message });
  } finally {
    client.release();
  }
};

export const deletePassesBulk = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Pass IDs are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete check-in logs for these passes
    await client.query('DELETE FROM checkin_logs WHERE pass_id = ANY($1)', [ids]);

    // Delete passes
    const result = await client.query(
      'DELETE FROM event_passes WHERE id = ANY($1) RETURNING *',
      [ids]
    );

    await client.query('COMMIT');
    res.json({ success: true, count: result.rows.length, message: `Successfully deleted ${result.rows.length} passes permanently` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk delete passes error:', error);
    res.status(500).json({ success: false, message: 'Failed bulk delete passes', error: error.message });
  } finally {
    client.release();
  }
};

export const clearAllCheckInLogs = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM checkin_logs WHERE event_id = $1 RETURNING *',
      [eventId]
    );
    res.json({ success: true, message: `Successfully cleared all ${result.rows.length} scan logs` });
  } catch (error) {
    console.error('Clear check-in logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear check-in logs', error: error.message });
  }
};

export const deleteCheckInLog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM checkin_logs WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Log entry not found' });
    }
    res.json({ success: true, message: 'Scan log entry deleted successfully' });
  } catch (error) {
    console.error('Delete log entry error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete scan log entry', error: error.message });
  }
};

// ============================================================
// SCANNER DEVICES MANAGEMENT (ADMIN)
// ============================================================

export const getScannerDevices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sd.id, sd.name, sd.device_code, sd.event_id, sd.gate, sd.is_active, sd.last_seen_at, sd.created_at, e.name as event_name
       FROM scanner_devices sd
       LEFT JOIN events e ON sd.event_id = e.id
       ORDER BY sd.name ASC`
    );
    res.json({ success: true, scanners: result.rows });
  } catch (error) {
    console.error('Get scanners error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve scanner devices', error: error.message });
  }
};

export const createScannerDevice = async (req, res) => {
  const { name, deviceCode, password, eventId, gate } = req.body;

  if (!name || !deviceCode || !password) {
    return res.status(400).json({ success: false, message: 'Name, device code, and password are required' });
  }

  try {
    const checkCode = await pool.query('SELECT id FROM scanner_devices WHERE device_code = $1', [deviceCode]);
    if (checkCode.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'A scanner with this device code already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO scanner_devices (name, device_code, password_hash, event_id, gate, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, name, device_code, event_id, gate, is_active, created_at`,
      [name, deviceCode, passwordHash, eventId || null, gate || null]
    );

    res.status(201).json({ success: true, scanner: result.rows[0] });
  } catch (error) {
    console.error('Create scanner error:', error);
    res.status(500).json({ success: false, message: 'Failed to create scanner device', error: error.message });
  }
};

export const toggleScannerActive = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (isActive === undefined) {
    return res.status(400).json({ success: false, message: 'isActive status is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE scanner_devices 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, device_code, is_active`,
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Scanner device not found' });
    }

    res.json({ success: true, scanner: result.rows[0] });
  } catch (error) {
    console.error('Toggle scanner error:', error);
    res.status(500).json({ success: false, message: 'Failed to update scanner status' });
  }
};
