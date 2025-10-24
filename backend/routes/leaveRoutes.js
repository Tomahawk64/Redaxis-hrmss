import express from 'express';
import { getLeaves, createLeave, updateLeaveStatus, deleteLeave, syncAllApprovedLeaves } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getLeaves);
router.post('/sync-attendance', protect, authorize('admin', 'hr'), syncAllApprovedLeaves);
router.post('/', protect, createLeave);
router.patch('/:id/status', protect, authorize('admin', 'hr'), updateLeaveStatus);
router.put('/:id/status', protect, authorize('admin', 'hr'), updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

export default router;
