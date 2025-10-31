import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// ⏰ HELPER FUNCTION: Calculate if a date is a working day
const isWorkingDay = (date, saturdayWorking = false) => {
  const dayOfWeek = date.getDay();
  // Sunday is always off
  if (dayOfWeek === 0) return false;
  // Saturday depends on user setting
  if (dayOfWeek === 6) return saturdayWorking;
  // Monday to Friday are working days
  return true;
};

// ⏰ HELPER FUNCTION: Count working days in a date range
const countWorkingDays = (startDate, endDate, saturdayWorking = false) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    if (isWorkingDay(current, saturdayWorking)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    let query = {};

    // === FILTER BY MANAGEMENT LEVEL ===
    const userLevel = req.user.managementLevel || 0;
    
    console.log('👤 User Level:', userLevel, 'User ID:', req.user.id);
    console.log('📋 Query params:', { employeeId, startDate, endDate });
    
    // L0 (Employee): Only see own attendance
    if (userLevel === 0) {
      query.employee = req.user.id;
      console.log('🔒 L0 Employee: Restricted to own records');
    }
    // L1 (Manager): See own attendance + direct reports
    else if (userLevel === 1) {
      const teamMemberIds = req.user.teamMembers || [];
      query.employee = { $in: [req.user.id, ...teamMemberIds] };
      console.log('👔 L1 Manager: Can view team', teamMemberIds.length, 'members');
    }
    // L2 (Senior Manager): See own + L1 managers + their L0 reports
    else if (userLevel === 2) {
      const l1Managers = await User.find({ 
        reportingManager: req.user.id,
        managementLevel: 1 
      }).select('_id teamMembers');
      
      const l1ManagerIds = l1Managers.map(m => m._id);
      const l0EmployeeIds = l1Managers.flatMap(m => m.teamMembers || []);
      
      query.employee = { $in: [req.user.id, ...l1ManagerIds, ...l0EmployeeIds] };
      console.log('🎯 L2 Senior Manager: Can view', l1ManagerIds.length, 'managers and their teams');
    }
    // L3 (Admin): See all attendance
    else if (userLevel === 3) {
      // L3 Admin can see ALL records - no employee filter by default
      console.log('👑 L3 Admin: Full access to all records');
      
      // Only apply employee filter if specifically requested
      if (employeeId) {
        query.employee = employeeId;
        console.log('🔍 L3 filtering by specific employee:', employeeId);
      }
      // Otherwise, don't add employee filter - show all
    }

    // Apply date filters
    if (startDate && endDate) {
      // Normalize dates to midnight for proper comparison
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);  // End of day
      
      query.date = { $gte: start, $lte: end };
      
      console.log('📅 Date Range:', {
        startDate,
        endDate,
        normalizedStart: start,
        normalizedEnd: end
      });
    }

    console.log('🔍 Final Query:', JSON.stringify(query, null, 2));

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName employeeId managementLevel department position')
      .sort({ date: -1 });

    console.log('✅ Attendance Found:', attendance.length, 'records');

    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    console.error('❌ Attendance query error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 📅 CHECK IF TODAY IS SUNDAY (WEEK OFF - FIXED FOR ALL)
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Today is Sunday - Week Off. You cannot check in.' 
      });
    }
    
    // 📅 CHECK IF TODAY IS SATURDAY (VARIABLE - USER SPECIFIC)
    if (dayOfWeek === 6) {
      // Fetch user to check saturdayWorking setting
      const user = await User.findById(req.user.id).select('saturdayWorking');
      if (!user.saturdayWorking) {
        return res.status(400).json({ 
          success: false, 
          message: 'Today is Saturday - Week Off for you. You cannot check in.' 
        });
      }
      // If saturdayWorking is true, allow check-in
    }

    let attendance = await Attendance.findOne({
      employee: req.user.id,
      date: today,
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employee: req.user.id,
        date: today,
        checkIn: new Date(),
        status: 'present',
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'present';
      await attendance.save();
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user.id,
      date: today,
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workingHours = Math.round(hours * 100) / 100;
    
    // ⏱️ AUTO-CALCULATE STATUS BASED ON WORKING HOURS
    // < 5 hours = absent, 5-7.5 hours = half-day, > 7.5 hours = present
    if (attendance.workingHours < 5) {
      attendance.status = 'absent';
    } else if (attendance.workingHours >= 5 && attendance.workingHours < 7.5) {
      attendance.status = 'half-day';
    } else {
      attendance.status = 'present';
    }
    
    await attendance.save();

    res.status(200).json({ 
      success: true, 
      data: attendance,
      message: `Checked out successfully. Status: ${attendance.status} (${attendance.workingHours} hours)` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const userId = req.user.id;
    const userLevel = req.user.managementLevel || 0;
    
    // Build query based on management level
    let matchQuery = {};
    
    // === FILTER BY MANAGEMENT LEVEL ===
    // L0 (Employee): Only see own stats
    if (userLevel === 0) {
      matchQuery.employee = userId;
    }
    // L1 (Manager): See own stats or direct reports
    else if (userLevel === 1) {
      if (employeeId) {
        // Verify employeeId is in team or self
        const teamMemberIds = req.user.teamMembers || [];
        if (employeeId === userId || teamMemberIds.includes(employeeId)) {
          matchQuery.employee = employeeId;
        } else {
          return res.status(403).json({ success: false, message: 'Not authorized to view this employee stats' });
        }
      } else {
        matchQuery.employee = userId; // Default to own stats
      }
    }
    // L2 (Senior Manager): See own + L1 managers + their L0 reports
    else if (userLevel === 2) {
      if (employeeId) {
        // Get all allowed employees
        const l1Managers = await User.find({ 
          reportingManager: userId,
          managementLevel: 1 
        }).select('_id teamMembers');
        
        const l1ManagerIds = l1Managers.map(m => m._id.toString());
        const l0EmployeeIds = l1Managers.flatMap(m => (m.teamMembers || []).map(id => id.toString()));
        const allowedIds = [userId, ...l1ManagerIds, ...l0EmployeeIds];
        
        if (allowedIds.includes(employeeId)) {
          matchQuery.employee = employeeId;
        } else {
          return res.status(403).json({ success: false, message: 'Not authorized to view this employee stats' });
        }
      } else {
        matchQuery.employee = userId; // Default to own stats
      }
    }
    // L3 (Admin): Can view anyone's stats
    else if (userLevel === 3) {
      if (employeeId) {
        matchQuery.employee = employeeId;
      } else {
        matchQuery.employee = userId; // Default to own stats
      }
    }
    
    // Date range filter
    if (startDate && endDate) {
      matchQuery.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else {
      // Default to current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      matchQuery.date = { $gte: firstDay, $lte: lastDay };
    }

    // Get employee info for saturdayWorking setting
    const targetEmployeeId = matchQuery.employee;
    const employee = await User.findById(targetEmployeeId).select('saturdayWorking');
    const saturdayWorking = employee?.saturdayWorking || false;

    // Get attendance records
    const records = await Attendance.find(matchQuery);
    
    // Calculate stats
    const totalDays = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const halfDay = records.filter(r => r.status === 'half-day').length;
    const onLeave = records.filter(r => r.status === 'on-leave').length;
    
    // ✅ Calculate ACTUAL working days (excluding Sundays and Saturdays based on user setting)
    const start = matchQuery.date?.$gte || new Date();
    const end = matchQuery.date?.$lte || new Date();
    const workingDays = countWorkingDays(start, end, saturdayWorking);
    
    const attendancePercentage = workingDays > 0 
      ? ((present + halfDay * 0.5) / workingDays) * 100 
      : 0;

    const stats = {
      totalDays,
      present,
      absent,
      halfDay,
      onLeave,
      attendancePercentage: Math.round(attendancePercentage * 10) / 10,
      workingDays,
      saturdayWorking, // Include in response
      period: {
        start: matchQuery.date?.$gte,
        end: matchQuery.date?.$lte
      }
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
