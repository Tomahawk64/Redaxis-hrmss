import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'hr'), getEmployeeStats);
router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployee);
router.post('/', protect, authorize('admin', 'hr'), createEmployee);
router.put('/:id', protect, authorize('admin', 'hr'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);

export default router;
