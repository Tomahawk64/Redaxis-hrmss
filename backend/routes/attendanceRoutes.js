import express from 'express';
import {
  getAttendance,
  createAttendance,
  checkIn,
  checkOut,
  updateAttendance,
  getAttendanceStats,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAttendance);
router.get('/stats', protect, getAttendanceStats);
router.post('/', protect, authorize('admin', 'hr'), createAttendance);
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.put('/:id', protect, authorize('admin', 'hr'), updateAttendance);

export default router;
