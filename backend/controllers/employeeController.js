import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    const { status, department, role, search } = req.query;
    const userLevel = req.user.managementLevel || 0;
    
    let query = {};

    // === FILTER BY MANAGEMENT LEVEL ===
    // L0 (Employee): Can only view own profile
    if (userLevel === 0) {
      query._id = req.user.id;
      console.log('🔒 L0 Employee: Viewing own profile only');
    }
    // L1 (Manager): Can view own profile + direct reports
    else if (userLevel === 1) {
      const teamMemberIds = req.user.teamMembers || [];
      query._id = { $in: [req.user.id, ...teamMemberIds] };
      console.log('👔 L1 Manager: Can view', teamMemberIds.length, 'team members');
    }
    // L2 (Senior Manager): Can view + manage L1 and L0 under them
    else if (userLevel === 2) {
      const l1Managers = await User.find({ 
        reportingManager: req.user.id,
        managementLevel: 1 
      }).select('_id teamMembers');
      
      const l1ManagerIds = l1Managers.map(m => m._id);
      const l0EmployeeIds = l1Managers.flatMap(m => m.teamMembers || []);
      
      // L2 can see themselves, L1 managers, and L0 employees (but NOT other L2 or L3)
      query._id = { $in: [req.user.id, ...l1ManagerIds, ...l0EmployeeIds] };
      console.log('🎯 L2 Senior Manager: Can view', l1ManagerIds.length, 'managers and their teams');
    }
    // L3 (Admin): Can view ALL employees
    else if (userLevel === 3) {
      // No filter - admin sees everyone
      console.log('👑 L3 Admin: Full access to all employees');
    }

    // Apply additional filters
    if (status) query.status = status;
    if (department) query.department = department;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await User.find(query)
      .select('-password')
      .populate('department')
      .populate('reportingManager', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });

    console.log('✅ Employees Found:', employees.length, 'records for L' + userLevel);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error('❌ Get employees error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .select('-password')
      .populate('department');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (L2 and L3 only)
export const createEmployee = async (req, res) => {
  try {
    const userLevel = req.user.managementLevel || 0;
    
    // Only L2 and L3 can create employees
    if (userLevel < 2) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to create employees. Only L2 (Senior Manager) and L3 (Admin) can create employees.' 
      });
    }
    
    // L2 can only create L0 and L1 employees
    const newEmployeeLevel = req.body.managementLevel || 0;
    if (userLevel === 2 && newEmployeeLevel >= 2) {
      return res.status(403).json({ 
        success: false, 
        message: 'L2 Senior Managers can only create L0 (Employee) and L1 (Manager) level users.' 
      });
    }
    
    console.log(`✨ L${userLevel} creating new employee with level L${newEmployeeLevel}`);
    
    const employee = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('❌ Create employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (L2 and L3 only)
export const updateEmployee = async (req, res) => {
  try {
    const userLevel = req.user.managementLevel || 0;
    const targetEmployeeId = req.params.id;
    
    // Check if user has permission to update
    // L0 and L1 cannot update employee records
    if (userLevel < 2) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update employee records. Only L2 (Senior Manager) and L3 (Admin) can update employees.' 
      });
    }
    
    // Get target employee to check their level
    const targetEmployee = await User.findById(targetEmployeeId);
    if (!targetEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    const targetLevel = targetEmployee.managementLevel || 0;
    
    // L2 can only update L0 and L1 employees under them
    if (userLevel === 2) {
      // Check if target employee is in their hierarchy
      if (targetLevel >= 2) {
        return res.status(403).json({ 
          success: false, 
          message: 'L2 Senior Managers cannot update other L2 or L3 level employees.' 
        });
      }
      
      // Verify the employee is under their management
      const l1Managers = await User.find({ 
        reportingManager: req.user.id,
        managementLevel: 1 
      }).select('_id teamMembers');
      
      const l1ManagerIds = l1Managers.map(m => m._id.toString());
      const l0EmployeeIds = l1Managers.flatMap(m => (m.teamMembers || []).map(id => id.toString()));
      const allowedIds = [...l1ManagerIds, ...l0EmployeeIds];
      
      if (!allowedIds.includes(targetEmployeeId)) {
        return res.status(403).json({ 
          success: false, 
          message: 'You can only update employees in your management hierarchy.' 
        });
      }
    }
    
    // L3 can update anyone
    console.log(`✏️ L${userLevel} updating employee:`, targetEmployeeId);
    
    // Remove password from update if it's empty
    const updateData = { ...req.body };
    if (!updateData.password || updateData.password.trim() === '') {
      delete updateData.password;
    } else {
      // Hash the password before updating (findByIdAndUpdate bypasses pre-save middleware)
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const employee = await User.findByIdAndUpdate(targetEmployeeId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('❌ Update employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (L3 Admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const userLevel = req.user.managementLevel || 0;
    
    // Only L3 can delete employees
    if (userLevel < 3) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only L3 (Admin) can delete employees.' 
      });
    }
    
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    console.log(`🗑️ L3 Admin deleting employee:`, req.params.id);
    
    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats
// @access  Private (Admin/HR)
export const getEmployeeStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ status: 'active' });
    const inactive = await User.countDocuments({ status: 'inactive' });
    const onLeave = await User.countDocuments({ status: 'on-leave' });

    const byDepartment = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    const byRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        onLeave,
        byDepartment,
        byRole,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
