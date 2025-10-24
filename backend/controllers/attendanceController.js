import Attendance from '../models/Attendance.js';

export const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    let query = {};

    if (employeeId) query.employee = employeeId;
    if (startDate && endDate) {
      // Normalize dates to midnight for proper comparison
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);  // End of day
      
      query.date = { $gte: start, $lte: end };
      
      console.log('Attendance Query:', {
        employeeId,
        startDate,
        endDate,
        normalizedStart: start,
        normalizedEnd: end,
        query
      });
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName employeeId')
      .sort({ date: -1 });

    console.log('Attendance Found:', attendance.length, 'records');
    if (attendance.length > 0) {
      console.log('First record:', attendance[0]);
    }

    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    console.error('Attendance query error:', error);
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
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
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
    const userRole = req.user.role;
    
    // Build query based on role and parameters
    let matchQuery = {};
    
    // If specific employee requested (admin/HR can view anyone's stats)
    if (employeeId && (userRole === 'admin' || userRole === 'hr')) {
      matchQuery.employee = employeeId;
    } else if (employeeId && employeeId !== userId) {
      // Regular user trying to view others' stats - not allowed
      return res.status(403).json({ success: false, message: 'Not authorized' });
    } else {
      // Default to current user
      matchQuery.employee = userId;
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

    // Get attendance records
    const records = await Attendance.find(matchQuery);
    
    // Calculate stats
    const totalDays = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const halfDay = records.filter(r => r.status === 'half-day').length;
    const onLeave = records.filter(r => r.status === 'on-leave').length;
    
    // Calculate working days in the period
    const start = matchQuery.date?.$gte || new Date();
    const end = matchQuery.date?.$lte || new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const workingDays = diffDays; // Can be adjusted to exclude weekends
    
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
