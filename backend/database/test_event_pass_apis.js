/**
 * test_event_pass_apis.js
 *
 * Full integration test suite for QR Event Pass & Check-In System APIs.
 * Spawns the Express server on an ephemeral port, runs E2E API tests,
 * and cleans up all created test data from the DB.
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pg from 'pg';
import app from '../src/server.js';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const TEST_PORT = 5001;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

async function runTests() {
  console.log('🚀 Starting QR Event Pass & Check-In Integration Tests...\n');

  // Start the server
  const server = app.listen(TEST_PORT, () => {
    console.log(`📡 Test server listening on port ${TEST_PORT}`);
  });

  let testEventId = null;
  let testScannerId = null;
  let testPassId1 = null;
  let testPassToken1 = null;
  let testPassId2 = null;
  let testPassToken2 = null;
  let bulkPassId = null;

  try {
    // 1. Generate Admin Token for testing admin endpoints
    const adminToken = jwt.sign(
      { id: 9999, username: 'test-admin-account' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('✅ Generated Admin JWT for test requests.');

    // 2. Create Event (Admin)
    const createEventRes = await fetch(`${BASE_URL}/event-passes/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Integration Test Event 2026',
        slug: 'test-event-2026',
        description: 'Temporary event created during API integration tests.',
        eventDate: '2026-12-31',
        venue: 'Test Stadium, Gate 4'
      })
    });
    const createEventData = await createEventRes.json();
    if (!createEventRes.ok || !createEventData.success) {
      throw new Error(`Failed to create event: ${JSON.stringify(createEventData)}`);
    }
    testEventId = createEventData.event.id;
    console.log(`✅ Created test event: ID ${testEventId}`);

    // 3. List Events (Admin)
    const listEventsRes = await fetch(`${BASE_URL}/event-passes/events`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const listEventsData = await listEventsRes.json();
    const eventFound = listEventsData.events.some(e => e.id === testEventId);
    console.log(`✅ List events test: ${eventFound ? 'PASSED' : 'FAILED'}`);

    // 4. Update Event (Admin)
    const updateEventRes = await fetch(`${BASE_URL}/event-passes/events/${testEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Integration Test Event 2026 (Updated)',
        slug: 'test-event-2026',
        description: 'Temporary event updated description.',
        eventDate: '2026-12-31',
        venue: 'Updated Test Arena',
        status: 'active'
      })
    });
    const updateEventData = await updateEventRes.json();
    console.log(`✅ Update event test: ${updateEventData.event.status === 'active' ? 'PASSED' : 'FAILED'}`);

    // 5. Create Scanner Device (Admin)
    const createScannerRes = await fetch(`${BASE_URL}/event-passes/scanners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Test Scanner Phone 1',
        deviceCode: 'TEST-SCAN-01',
        password: 'securePassword123',
        eventId: testEventId,
        gate: 'North Gate'
      })
    });
    const createScannerData = await createScannerRes.json();
    if (!createScannerRes.ok || !createScannerData.success) {
      throw new Error(`Failed to create scanner: ${JSON.stringify(createScannerData)}`);
    }
    testScannerId = createScannerData.scanner.id;
    console.log(`✅ Created scanner device: ID ${testScannerId}`);

    // 6. Scanner Device Login
    const scannerLoginRes = await fetch(`${BASE_URL}/scanner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceCode: 'TEST-SCAN-01',
        password: 'securePassword123'
      })
    });
    const scannerLoginData = await scannerLoginRes.json();
    if (!scannerLoginRes.ok || !scannerLoginData.success) {
      throw new Error(`Scanner login failed: ${JSON.stringify(scannerLoginData)}`);
    }
    const scannerToken = scannerLoginData.token;
    console.log('✅ Scanner login test: PASSED (Token acquired)');

    // 7. Get Scanner Profile (Scanner)
    const scannerMeRes = await fetch(`${BASE_URL}/scanner/me`, {
      headers: { 'Authorization': `Bearer ${scannerToken}` }
    });
    const scannerMeData = await scannerMeRes.json();
    console.log(`✅ Scanner profile test: ${scannerMeData.scanner.device_code === 'TEST-SCAN-01' ? 'PASSED' : 'FAILED'}`);

    // 8. Create Pass 1 (Admin)
    const createPass1Res = await fetch(`${BASE_URL}/event-passes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        eventId: testEventId,
        guestName: 'Jane Doe',
        mobile: '+919999988888',
        email: 'jane@example.com',
        category: 'VIP',
        notes: 'VIP Guest'
      })
    });
    const createPass1Data = await createPass1Res.json();
    testPassId1 = createPass1Data.pass.id;
    testPassToken1 = createPass1Data.pass.qr_token;
    console.log(`✅ Created Pass 1: ID ${testPassId1}, Token: ${testPassToken1.slice(0, 8)}...`);

    // 9. Scan check-in Pass 1 (Scanner) - SUCCESS
    const checkin1Res = await fetch(`${BASE_URL}/scanner/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${scannerToken}`
      },
      body: JSON.stringify({
        token: testPassToken1,
        eventId: testEventId
      })
    });
    const checkin1Data = await checkin1Res.json();
    console.log(`✅ Scan check-in Pass 1: ${checkin1Data.result === 'SUCCESS' ? 'PASSED' : 'FAILED'}`);

    // 10. Scan check-in Pass 1 (Scanner) - DUPLICATE
    const checkinDuplicateRes = await fetch(`${BASE_URL}/scanner/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${scannerToken}`
      },
      body: JSON.stringify({
        token: testPassToken1,
        eventId: testEventId
      })
    });
    const checkinDuplicateData = await checkinDuplicateRes.json();
    console.log(`✅ Duplicate check-in protection test: ${checkinDuplicateData.result === 'ALREADY_CHECKED_IN' ? 'PASSED' : 'FAILED'}`);

    // 11. Create Pass 2 (Admin)
    const createPass2Res = await fetch(`${BASE_URL}/event-passes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        eventId: testEventId,
        guestName: 'Bob Smith',
        category: 'Guest'
      })
    });
    const createPass2Data = await createPass2Res.json();
    testPassId2 = createPass2Data.pass.id;
    testPassToken2 = createPass2Data.pass.qr_token;
    console.log(`✅ Created Pass 2: ID ${testPassId2}`);

    // 12. Cancel Pass 2 (Admin)
    const cancelRes = await fetch(`${BASE_URL}/event-passes/${testPassId2}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const cancelData = await cancelRes.json();
    console.log(`✅ Cancel pass test: ${cancelData.pass.status === 'CANCELLED' ? 'PASSED' : 'FAILED'}`);

    // 13. Scan check-in Pass 2 (Scanner) - CANCELLED
    const checkinCancelledRes = await fetch(`${BASE_URL}/scanner/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${scannerToken}`
      },
      body: JSON.stringify({
        token: testPassToken2,
        eventId: testEventId
      })
    });
    const checkinCancelledData = await checkinCancelledRes.json();
    console.log(`✅ Cancelled check-in rejection test: ${checkinCancelledData.result === 'CANCELLED' ? 'PASSED' : 'FAILED'}`);

    // 14. Reissue Pass 2 (Admin)
    const reissueRes = await fetch(`${BASE_URL}/event-passes/${testPassId2}/reissue`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const reissueData = await reissueRes.json();
    const newPassToken2 = reissueData.pass.qr_token;
    console.log(`✅ Reissue pass test: ${reissueData.pass.status === 'ISSUED' && newPassToken2 !== testPassToken2 ? 'PASSED' : 'FAILED'}`);

    // 15. Scan check-in Pass 2 (Scanner) - SUCCESS
    const checkinReissuedRes = await fetch(`${BASE_URL}/scanner/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${scannerToken}`
      },
      body: JSON.stringify({
        token: newPassToken2,
        eventId: testEventId
      })
    });
    const checkinReissuedData = await checkinReissuedRes.json();
    console.log(`✅ Reissued scan check-in test: ${checkinReissuedData.result === 'SUCCESS' ? 'PASSED' : 'FAILED'}`);

    // 16. Bulk Import Passes (Admin)
    const bulkImportRes = await fetch(`${BASE_URL}/event-passes/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        eventId: testEventId,
        guests: [
          { guestName: 'Bulk Guest 1', category: 'General' },
          { guestName: 'Bulk Guest 2', category: 'General', mobile: '9876543210' }
        ]
      })
    });
    const bulkImportData = await bulkImportRes.json();
    console.log(`✅ Bulk import test: ${bulkImportData.count === 2 ? 'PASSED' : 'FAILED'}`);
    bulkPassId = bulkImportData.passes[0].id;

    // 17. Manual Check-in (Admin)
    const manualCheckinRes = await fetch(`${BASE_URL}/event-passes/manual-checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        passId: bulkPassId,
        gate: 'VIP Desk'
      })
    });
    const manualCheckinData = await manualCheckinRes.json();
    console.log(`✅ Manual fallback check-in test: ${manualCheckinData.result === 'SUCCESS' ? 'PASSED' : 'FAILED'}`);

    // 18. Attendance Statistics (Admin)
    const attendanceStatsRes = await fetch(`${BASE_URL}/event-passes/attendance/${testEventId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const attendanceStatsData = await attendanceStatsRes.json();
    const stats = attendanceStatsData.stats.summary;
    // Expected: Pass 1 (Checked-in), Pass 2 (Checked-in), Bulk 1 (Checked-in), Bulk 2 (Pending) -> 4 total, 3 checked in, 1 pending
    const statsValid = parseInt(stats.total_passes) === 4 && parseInt(stats.checked_in) === 3;
    console.log(`✅ Attendance stats query test: ${statsValid ? 'PASSED' : 'FAILED'} (Total: ${stats.total_passes}, Checked in: ${stats.checked_in})`);

    // 19. Check-in Logs (Admin)
    const logsRes = await fetch(`${BASE_URL}/event-passes/check-in-logs/${testEventId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const logsData = await logsRes.json();
    console.log(`✅ Check-in logs count test: ${logsData.logs.length >= 4 ? 'PASSED' : 'FAILED'} (Logs: ${logsData.logs.length})`);

    // 20. Disable Scanner Device (Admin)
    const disableScannerRes = await fetch(`${BASE_URL}/event-passes/scanners/${testScannerId}/active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ isActive: false })
    });
    const disableScannerData = await disableScannerRes.json();
    console.log(`✅ Disable scanner test: ${disableScannerData.scanner.is_active === false ? 'PASSED' : 'FAILED'}`);

    // 21. Re-verify disabled scanner auth
    const verifyMeAfterDisableRes = await fetch(`${BASE_URL}/scanner/me`, {
      headers: { 'Authorization': `Bearer ${scannerToken}` }
    });
    console.log(`✅ Scanner deactivation enforcement: ${verifyMeAfterDisableRes.status === 403 ? 'PASSED' : 'FAILED'}`);

  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    // 22. Clean up test database records
    if (testEventId) {
      console.log('\n🧹 Cleaning up test database records...');
      try {
        await pool.query('DELETE FROM checkin_logs WHERE event_id = $1', [testEventId]);
        console.log('   ✓ Cleared checkin_logs');
        await pool.query('DELETE FROM event_passes WHERE event_id = $1', [testEventId]);
        console.log('   ✓ Cleared event_passes');
        await pool.query('DELETE FROM scanner_devices WHERE event_id = $1', [testEventId]);
        console.log('   ✓ Cleared scanner_devices');
        await pool.query('DELETE FROM events WHERE id = $1', [testEventId]);
        console.log('   ✓ Cleared events');
        console.log('✅ Database cleanup completed.');
      } catch (cleanupErr) {
        console.error('❌ Database cleanup failed:', cleanupErr.message);
      }
    }

    // Stop server
    server.close(() => {
      console.log('📡 Test server stopped.');
    });
    await pool.end();
  }
}

runTests();
