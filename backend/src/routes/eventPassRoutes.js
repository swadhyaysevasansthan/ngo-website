import express from 'express';
import { verifyAdmin } from '../middleware/auth.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  createPass,
  bulkImportPasses,
  getPasses,
  getPassById,
  cancelPass,
  reissueQR,
  getAttendanceStats,
  getCheckInLogs,
  deletePass,
  deletePassesBulk,
  clearAllCheckInLogs,
  deleteCheckInLog,
  getScannerDevices,
  createScannerDevice,
  toggleScannerActive
} from '../controllers/eventPassController.js';
import { manualCheckIn } from '../controllers/checkInController.js';

const router = express.Router();

// Apply verifyAdmin middleware to all admin-facing routes in this namespace
router.use(verifyAdmin);

// Event routes
router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);

// ── IMPORTANT: Specific named sub-routes MUST come before the generic /:id ──
// Manual fallback check-in
router.post('/manual-checkin', manualCheckIn);

// Bulk import
router.post('/import', bulkImportPasses);
router.post('/delete-bulk', deletePassesBulk);

// Stats & logs (must be before /:id to avoid being caught as a pass ID)
router.get('/attendance/:eventId', getAttendanceStats);
router.get('/check-in-logs/:eventId', getCheckInLogs);
router.delete('/check-in-logs/event/:eventId', clearAllCheckInLogs);
router.delete('/check-in-logs/log/:id', deleteCheckInLog);

// Scanner devices management
router.get('/scanners', getScannerDevices);
router.post('/scanners', createScannerDevice);
router.patch('/scanners/:id/active', toggleScannerActive);
// ─────────────────────────────────────────────────────────────────────────────

// Pass routes (generic /:id MUST come last)
router.post('/', createPass);
router.get('/', getPasses);
router.get('/:id', getPassById);
router.post('/:id/cancel', cancelPass);
router.post('/:id/reissue', reissueQR);
router.delete('/:id', deletePass);

export default router;
