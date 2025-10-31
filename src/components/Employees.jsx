import { useState, useEffect } from 'react';
import { employeesAPI, departmentsAPI, teamAPI, assetsAPI } from '../services/api';
import { getUser } from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  const currentUser = getUser();
  const canManage = currentUser?.managementLevel >= 2; // Only L2 and L3 can manage employees

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    panCard: '',
    aadharCard: '',
    department: '',
    position: '',
    reportingManager: '',
    managementLevel: 0,
    canApproveLeaves: false,
    canManageAttendance: false,
    saturdayWorking: false,
    dateOfBirth: '',
    joiningDate: new Date().toISOString().split('T')[0],
    assetsAllocated: '',
    salary: {
      basic: 0,
      allowances: 0,
      deductions: 0,
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchManagers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await teamAPI.getManagers();
      setManagers(response.data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      // Set empty array if fetch fails - this is okay, user can still create employees without RM
      setManagers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up the form data before sending
      const submitData = {
        ...formData,
        // Convert empty string to null for reportingManager
        reportingManager: formData.reportingManager || null,
        // Ensure managementLevel is a number
        managementLevel: parseInt(formData.managementLevel) || 0,
      };

      // Remove assetsAllocated from employee data - we'll handle it separately
      const assetToAllocate = submitData.assetsAllocated;
      delete submitData.assetsAllocated;

      let employeeId;
      if (editEmployee) {
        await employeesAPI.update(editEmployee._id, submitData);
        employeeId = editEmployee._id;
        alert('Employee updated successfully!');
      } else {
        const result = await employeesAPI.create(submitData);
        employeeId = result.data._id;
        alert('Employee created successfully!');
      }

      // Add asset if provided
      if (assetToAllocate && assetToAllocate.trim()) {
        try {
          await assetsAPI.addAsset(employeeId, { assetName: assetToAllocate.trim() });
        } catch (assetError) {
          console.error('Failed to add asset:', assetError);
          alert(`Employee saved, but asset allocation failed: ${assetError.message}`);
        }
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      alert(error.message || 'Operation failed');
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: '',
      phone: employee.phone || '',
      panCard: employee.panCard || '',
      aadharCard: employee.aadharCard || '',
      department: employee.department?._id || '',
      position: employee.position || '',
      reportingManager: employee.reportingManager?._id || '',
      managementLevel: employee.managementLevel || 0,
      canApproveLeaves: employee.canApproveLeaves || false,
      canManageAttendance: employee.canManageAttendance || false,
      saturdayWorking: employee.saturdayWorking || false,
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
      joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
      salary: employee.salary || { basic: 0, allowances: 0, deductions: 0 },
      address: employee.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      assetsAllocated: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesAPI.delete(id);
        alert('Employee deleted successfully!');
        fetchEmployees();
      } catch (error) {
        alert(error.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setEditEmployee(null);
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      panCard: '',
      aadharCard: '',
      department: '',
      position: '',
      reportingManager: '',
      managementLevel: 0,
      canApproveLeaves: false,
      canManageAttendance: false,
      saturdayWorking: false,
      dateOfBirth: '',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: { basic: 0, allowances: 0, deductions: 0 },
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      assetsAllocated: '',
    });
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDept || emp.department?._id === filterDept;
    const matchesRole = !filterRole || emp.role === filterRole;
    return matchesSearch && matchesDept && matchesRole;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Employee Management</h2>
          <p className="text-muted">Manage employee information and records</p>
        </div>
        {canManage && (
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <i className="bi bi-plus-circle me-2"></i>Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => { setSearchTerm(''); setFilterDept(''); setFilterRole(''); }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Level</th>
                  <th>Reporting Manager</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee._id}>
                    <td className="fw-bold">{employee.employeeId}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={employee.profileImage || '/assets/client.jpg'}
                          alt={employee.firstName}
                          className="rounded-circle me-2"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <span>{employee.firstName} {employee.lastName}</span>
                      </div>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.department?.name || 'N/A'}</td>
                    <td>{employee.position || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        employee.managementLevel === 3 ? 'bg-danger' :
                        employee.managementLevel === 2 ? 'bg-warning' :
                        employee.managementLevel === 1 ? 'bg-info' : 'bg-primary'
                      }`}>
                        L{employee.managementLevel} - {
                          employee.managementLevel === 3 ? 'ADMIN' :
                          employee.managementLevel === 2 ? 'SR. MANAGER' :
                          employee.managementLevel === 1 ? 'MANAGER' : 'EMPLOYEE'
                        }
                      </span>
                    </td>
                    <td>
                      {employee.reportingManager ? (
                        <span className="text-muted small">
                          {employee.reportingManager.firstName} {employee.reportingManager.lastName}
                        </span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        employee.status === 'active' ? 'bg-success' :
                        employee.status === 'on-leave' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    {canManage && (
                      <td>
                        {/* L2 can edit L0 and L1, but not themselves, other L2s, or L3 */}
                        {(currentUser?.managementLevel === 3 || 
                          (currentUser?.managementLevel === 2 && 
                           employee.managementLevel < 2 && 
                           employee._id !== currentUser?.id)) && (
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(employee)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                        {currentUser?.managementLevel === 3 && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(employee._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                <p>No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && canManage && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">{editEmployee ? 'Edit Employee' : 'Add New Employee'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto' }}>
                  <div className="row g-3">
                    {/* Basic Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Basic Information</h6>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Employee ID *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        disabled={editEmployee}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control form-control-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Password {!editEmployee && '*'}</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        required={!editEmployee}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder={editEmployee ? 'Leave blank to keep unchanged' : ''}
                      />
                    </div>

                    {/* Identity Documents */}
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Identity Documents</h6>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">PAN Card</label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        value={formData.panCard || ''}
                        onChange={(e) => setFormData({...formData, panCard: e.target.value.toUpperCase()})}
                        placeholder="ABCDE1234F"
                        maxLength="10"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="Enter valid PAN (e.g., ABCDE1234F)"
                      />
                      <small className="text-muted">Format: ABCDE1234F</small>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Aadhar Card</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formData.aadharCard || ''}
                        onChange={(e) => setFormData({...formData, aadharCard: e.target.value.replace(/\D/g, '')})}
                        placeholder="123456789012"
                        maxLength="12"
                        pattern="\d{12}"
                        title="Enter 12-digit Aadhar number"
                      />
                      <small className="text-muted">12-digit number</small>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      />
                    </div>

                    {/* Organization Details */}
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Organization Details</h6>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Department</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.department}
                        onChange={(e) => {
                          setFormData({
                            ...formData, 
                            department: e.target.value,
                            position: ''
                          });
                        }}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Position</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        disabled={!formData.department}
                      >
                        <option value="">Select Position</option>
                        {formData.department && departments
                          .find(dept => dept._id === formData.department)
                          ?.positions?.map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Joining Date</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      />
                    </div>

                    {/* Hierarchy & Permissions */}
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Hierarchy & Permissions</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Management Level</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.managementLevel}
                        onChange={(e) => {
                          const level = parseInt(e.target.value);
                          setFormData({
                            ...formData, 
                            managementLevel: level,
                            canApproveLeaves: level >= 1,
                            canManageAttendance: level >= 1
                          });
                        }}
                      >
                        <option value="0">L0 - Employee</option>
                        <option value="1">L1 - Reporting Manager</option>
                        <option value="2">L2 - Senior Manager</option>
                        {currentUser?.managementLevel === 3 && <option value="3">L3 - Admin</option>}
                      </select>
                      <small className="text-muted">L1+ can approve leaves & manage attendance</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Reporting Manager</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.reportingManager}
                        onChange={(e) => setFormData({...formData, reportingManager: e.target.value})}
                      >
                        <option value="">No Manager (Top Level)</option>
                        {managers
                          .filter(mgr => mgr._id !== editEmployee?._id)
                          .map(mgr => (
                            <option key={mgr._id} value={mgr._id}>
                              {mgr.firstName} {mgr.lastName} - L{mgr.managementLevel}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Work Schedule */}
                    <div className="col-md-6">
                      <label className="form-label">Saturday Work Schedule</label>
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="saturdayWorking"
                          checked={formData.saturdayWorking}
                          onChange={(e) => setFormData({...formData, saturdayWorking: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="saturdayWorking">
                          Saturday is a working day
                        </label>
                      </div>
                      <small className="text-muted">Enable if this employee works on Saturdays. Sundays are week off for all.</small>
                    </div>

                    {/* Assets Information */}
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Assets Allocated</h6>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Asset Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g., Laptop HP EliteBook, iPhone 13, etc."
                        value={formData.assetsAllocated}
                        onChange={(e) => setFormData({...formData, assetsAllocated: e.target.value})}
                      />
                      <small className="text-muted">Enter asset name to be allocated to this employee</small>
                    </div>

                    {/* Salary Information */}
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold text-primary border-bottom pb-2">Salary Information</h6>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Basic Salary</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.salary.basic}
                        onChange={(e) => setFormData({...formData, salary: {...formData.salary, basic: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Allowances</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.salary.allowances}
                        onChange={(e) => setFormData({...formData, salary: {...formData.salary, allowances: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Deductions</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.salary.deductions}
                        onChange={(e) => setFormData({...formData, salary: {...formData.salary, deductions: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ flexShrink: 0 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editEmployee ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
