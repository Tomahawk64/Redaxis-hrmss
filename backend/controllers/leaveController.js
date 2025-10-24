import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

// Helper function to sync approved leave to attendance system
const syncLeaveToAttendance = async (leave) => {
  try {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    // Normalize dates to start of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const attendanceRecords = [];
    const currentDate = new Date(startDate);
    
    // Generate attendance records for each day in the leave period
    while (currentDate <= endDate) {
      const dateToCreate = new Date(currentDate);
      
      // Try to find existing attendance record
      const existingAttendance = await Attendance.findOne({
        employee: leave.employee,
        date: dateToCreate
      });
      
      if (existingAttendance) {
        // Update existing record - use 'half-day' status for half-day leaves, 'on-leave' for others
        existingAttendance.status = leave.leaveType === 'half-day' ? 'half-day' : 'on-leave';
        existingAttendance.notes = `${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave`;
        await existingAttendance.save();
        attendanceRecords.push(existingAttendance);
      } else {
        // Create new attendance record - use 'half-day' status for half-day leaves, 'on-leave' for others
        const attendanceData = {
          employee: leave.employee,
          date: dateToCreate,
          status: leave.leaveType === 'half-day' ? 'half-day' : 'on-leave',
          notes: `${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave`,
          workingHours: leave.leaveType === 'half-day' ? 4 : 0
        };
        
        const attendance = await Attendance.create(attendanceData);
        attendanceRecords.push(attendance);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`✅ Synced ${attendanceRecords.length} days to attendance for leave ${leave._id}`);
    return attendanceRecords;
  } catch (error) {
    console.error('❌ Error syncing leave to attendance:', error);
    throw error;
  }
};

// Helper function to remove leave from attendance when rejected
const removeLeaveFromAttendance = async (leave) => {
  try {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Find and delete attendance records that were created for this leave (both on-leave and half-day)
    const result = await Attendance.deleteMany({
      employee: leave.employee,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['on-leave', 'half-day'] }
    });
    
    console.log(`✅ Removed ${result.deletedCount} leave attendance records for leave ${leave._id}`);
    return result;
  } catch (error) {
    console.error('❌ Error removing leave from attendance:', error);
    throw error;
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = {};

    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate('employee', 'firstName lastName employeeId role')
      .populate('approvedBy', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLeave = async (req, res) => {
  try {
    req.body.employee = req.user.id;
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await Leave.findById(req.params.id).populate('employee', 'firstName lastName role');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Check if HR is trying to approve their own leave
    if (req.user.role === 'hr' && leave.employee._id.toString() === req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'HR cannot approve their own leave. Only admin can approve HR leave requests.' 
      });
    }

    // Check if HR is trying to approve another HR's leave
    if (req.user.role === 'hr' && leave.employee.role === 'hr') {
      return res.status(403).json({ 
        success: false, 
        message: 'HR cannot approve other HR leave requests. Only admin can approve HR leaves.' 
      });
    }

    leave.status = status;
    leave.remarks = remarks;
    leave.approvedBy = req.user.id;
    leave.approvalDate = new Date();
    await leave.save();

    // Sync with attendance system
    if (status === 'approved') {
      console.log(`📅 Syncing approved leave to attendance system...`);
      await syncLeaveToAttendance(leave);
    } else if (status === 'rejected') {
      console.log(`🗑️ Removing rejected leave from attendance system...`);
      await removeLeaveFromAttendance(leave);
    }

    // Populate approver details before sending response
    await leave.populate('approvedBy', 'firstName lastName employeeId');

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error('❌ Error updating leave status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Only allow employee to cancel their own pending leave
    if (leave.employee.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this leave' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending leaves can be cancelled' });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Leave cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync all approved leaves to attendance system (useful for initial setup or data migration)
export const syncAllApprovedLeaves = async (req, res) => {
  try {
    console.log('🔄 Starting to sync all approved leaves to attendance...');
    
    // Find all approved leaves
    const approvedLeaves = await Leave.find({ status: 'approved' });
    
    console.log(`Found ${approvedLeaves.length} approved leaves to sync`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const leave of approvedLeaves) {
      try {
        await syncLeaveToAttendance(leave);
        successCount++;
      } catch (error) {
        console.error(`Error syncing leave ${leave._id}:`, error);
        errorCount++;
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: `Synced ${successCount} approved leaves to attendance system`,
      successCount,
      errorCount,
      total: approvedLeaves.length
    });
  } catch (error) {
    console.error('❌ Error syncing approved leaves:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
