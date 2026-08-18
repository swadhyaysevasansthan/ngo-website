/**
 * test_pass_qr_utils.js
 *
 * Tests the QR token and pass validation utilities.
 */
import { 
  generateQRToken, 
  generatePassNumber, 
  generateScannerPassword, 
  verifyPassRecord 
} from '../src/utils/passQRUtils.js';

function runTests() {
  console.log('🧪 Running passQRUtils unit tests...\n');

  // 1. generateQRToken
  const token = generateQRToken();
  console.log('Testing generateQRToken:');
  console.log(`  Generated: ${token}`);
  const is64Hex = /^[0-9a-f]{64}$/.test(token);
  console.log(`  Valid 64-char hex: ${is64Hex ? 'PASS' : 'FAIL'}`);

  // 2. generatePassNumber
  console.log('\nTesting generatePassNumber:');
  const pass1 = generatePassNumber('annual-2026', 5);
  console.log(`  Slug "annual-2026", seq 5: ${pass1}`);
  const pass1Valid = pass1 === 'ANNUA-2026-0005';
  console.log(`  Correct format (ANNUA-2026-0005): ${pass1Valid ? 'PASS' : 'FAIL'}`);

  const pass2 = generatePassNumber('event', 123);
  console.log(`  Slug "event", seq 123: ${pass2}`);
  const pass2Valid = pass2 === 'EVENT-2026-0123';
  console.log(`  Correct format (EVENT-2026-0123): ${pass2Valid ? 'PASS' : 'FAIL'}`);

  // 3. generateScannerPassword
  console.log('\nTesting generateScannerPassword:');
  const password = generateScannerPassword(12);
  console.log(`  Generated password: ${password}`);
  const lenValid = password.length === 12;
  const noAmbChars = !/[01lIO]/.test(password);
  console.log(`  Length 12: ${lenValid ? 'PASS' : 'FAIL'}`);
  console.log(`  No ambiguous chars (0,1,l,I,O): ${noAmbChars ? 'PASS' : 'FAIL'}`);

  // 4. verifyPassRecord
  console.log('\nTesting verifyPassRecord:');
  
  // Test case: null pass
  const resNull = verifyPassRecord(null);
  console.log(`  Null pass check -> valid: ${resNull.valid}, result: ${resNull.result} (${resNull.result === 'INVALID' ? 'PASS' : 'FAIL'})`);

  // Test case: cancelled pass
  const resCancelled = verifyPassRecord({ status: 'CANCELLED' });
  console.log(`  Cancelled pass check -> valid: ${resCancelled.valid}, result: ${resCancelled.result} (${resCancelled.result === 'CANCELLED' ? 'PASS' : 'FAIL'})`);

  // Test case: already checked in
  const resCheckedIn = verifyPassRecord({ status: 'CHECKED_IN', gate: 'Main Gate', checked_in_at: new Date() });
  console.log(`  Checked-in pass check -> valid: ${resCheckedIn.valid}, result: ${resCheckedIn.result} (${resCheckedIn.result === 'ALREADY_CHECKED_IN' ? 'PASS' : 'FAIL'})`);

  // Test case: wrong event
  const resWrongEvent = verifyPassRecord({ status: 'ISSUED', event_id: 1 }, 2);
  console.log(`  Wrong event pass check -> valid: ${resWrongEvent.valid}, result: ${resWrongEvent.result} (${resWrongEvent.result === 'WRONG_EVENT' ? 'PASS' : 'FAIL'})`);

  // Test case: valid pass
  const resValid = verifyPassRecord({ status: 'ISSUED', event_id: 1 }, 1);
  console.log(`  Valid pass check -> valid: ${resValid.valid}, result: ${resValid.result} (${resValid.result === 'SUCCESS' ? 'PASS' : 'FAIL'})`);

  const allPassed = is64Hex && pass1Valid && pass2Valid && lenValid && noAmbChars && 
                    resNull.result === 'INVALID' && resCancelled.result === 'CANCELLED' && 
                    resCheckedIn.result === 'ALREADY_CHECKED_IN' && resWrongEvent.result === 'WRONG_EVENT' && 
                    resValid.result === 'SUCCESS';
  
  console.log(`\n🎉 Test suite results: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
}

runTests();
