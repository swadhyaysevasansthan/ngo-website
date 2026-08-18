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

// Pass routes
router.post('/', createPass);
router.post('/import', bulkImportPasses);
router.get('/', getPasses);
router.get('/:id', getPassById);
router.post('/:id/cancel', cancelPass);
router.post('/:id/reissue', reissueQR);

// Manual fallback check-in
router.post('/manual-checkin', manualCheckIn);

// Stats & logs
router.get('/attendance/:eventId', getAttendanceStats);
router.get('/check-in-logs/:eventId', getCheckInLogs);

// Scanner devices management
router.get('/scanners', getScannerDevices);
router.post('/scanners', createScannerDevice);
router.patch('/scanners/:id/active', toggleScannerActive);

export default router;
