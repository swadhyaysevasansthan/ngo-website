import pool from '../config/database.js';
import { verifyPassRecord } from '../utils/passQRUtils.js';

/**
 * Handle scan-based check-in from mobile scanner devices.
 * Atomically checks state and updates it to prevent duplicate check-ins.
 */
export const checkInPass = async (req, res) => {
  const { token, eventId } = req.body;
  const scannerId = req.scanner.id;
  const gate = req.scanner.gate || req.body.gate || 'Main Gate';

  if (!token) {
    return res.status(400).json({
      success: false,
      result: 'INVALID',
      message: 'QR token is required.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch and lock the pass record for update.
    // This blocks other concurrent transactions trying to access/modify the same pass.
    const passRes = await client.query(
      'SELECT * FROM event_passes WHERE qr_token = $1 FOR UPDATE',
      [token]
    );
    const passRecord = passRes.rows[0];

    // Determine target event context
    const targetEventId = eventId ? parseInt(eventId, 10) : (passRecord ? passRecord.event_id : null);

    // 2. Run validations
    const validation = verifyPassRecord(passRecord, targetEventId);

    if (!validation.valid) {
      // Log the failure to audit trail
      await client.query(
        `INSERT INTO checkin_logs (event_id, pass_id, scanner_id, gate, action, result, raw_token, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          targetEventId || (passRecord ? passRecord.event_id : 0),
          passRecord ? passRecord.id : null,
          scannerId,
          gate,
          'SCAN',
          validation.result,
          token,
          req.ip,
          req.headers['user-agent']
        ]
      );

      await client.query('COMMIT');

      return res.status(400).json({
        success: false,
        result: validation.result,
        message: validation.message,
        checkedInAt: passRecord?.checked_in_at || null,
        gate: passRecord?.gate || null
      });
    }

    // 3. Perform check-in update
    const checkedInAt = new Date();
    await client.query(
      `UPDATE event_passes 
       SET status = 'CHECKED_IN', checked_in_at = $1, checked_in_by = $2, gate = $3, updated_at = NOW() 
       WHERE id = $4`,
      [checkedInAt, scannerId, gate, passRecord.id]
    );

    // 4. Create successful audit log
    await client.query(
      `INSERT INTO checkin_logs (event_id, pass_id, scanner_id, gate, action, result, raw_token, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        passRecord.event_id,
        passRecord.id,
        scannerId,
        gate,
        'SCAN',
        'SUCCESS',
        token,
        req.ip,
        req.headers['user-agent']
      ]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      result: 'SUCCESS',
      message: 'Check-in successful!',
      passNumber: passRecord.pass_number,
      guestName: passRecord.guest_name,
      category: passRecord.category,
      checkedInAt,
      gate
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Check-in error:', error);
    return res.status(500).json({
      success: false,
      result: 'ERROR',
      message: 'An error occurred during check-in processing.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * Handle manual fallback check-in from Admin Dashboard.
 */
export const manualCheckIn = async (req, res) => {
  const { passId, gate } = req.body;
  const actualGate = gate || 'Admin Desk';

  if (!passId) {
    return res.status(400).json({
      success: false,
      result: 'INVALID',
      message: 'Pass ID is required.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the pass record for update
    const passRes = await client.query(
      'SELECT * FROM event_passes WHERE id = $1 FOR UPDATE',
      [passId]
    );
    const passRecord = passRes.rows[0];

    if (!passRecord) {
      await client.query('COMMIT');
      return res.status(404).json({
        success: false,
        result: 'INVALID',
        message: 'Pass not found.'
      });
    }

    const validation = verifyPassRecord(passRecord, passRecord.event_id);

    if (!validation.valid) {
      // Log manual check-in failure
      await client.query(
        `INSERT INTO checkin_logs (event_id, pass_id, scanner_id, gate, action, result, raw_token, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          passRecord.event_id,
          passRecord.id,
          null,
          actualGate,
          'MANUAL_CHECKIN',
          validation.result,
          passRecord.qr_token,
          req.ip,
          req.headers['user-agent']
        ]
      );

      await client.query('COMMIT');

      return res.status(400).json({
        success: false,
        result: validation.result,
        message: validation.message,
        checkedInAt: passRecord.checked_in_at,
        gate: passRecord.gate
      });
    }

    // Perform check-in update
    const checkedInAt = new Date();
    await client.query(
      `UPDATE event_passes 
       SET status = 'CHECKED_IN', checked_in_at = $1, gate = $2, updated_at = NOW() 
       WHERE id = $3`,
      [checkedInAt, actualGate, passRecord.id]
    );

    // Log manual check-in success
    await client.query(
      `INSERT INTO checkin_logs (event_id, pass_id, scanner_id, gate, action, result, raw_token, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        passRecord.event_id,
        passRecord.id,
        null,
        actualGate,
        'MANUAL_CHECKIN',
        'SUCCESS',
        passRecord.qr_token,
        req.ip,
        req.headers['user-agent']
      ]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      result: 'SUCCESS',
      message: 'Manual check-in successful!',
      passNumber: passRecord.pass_number,
      guestName: passRecord.guest_name,
      category: passRecord.category,
      checkedInAt,
      gate: actualGate
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Manual check-in error:', error);
    return res.status(500).json({
      success: false,
      result: 'ERROR',
      message: 'An error occurred during manual check-in.',
      error: error.message
    });
  } finally {
    client.release();
  }
};
