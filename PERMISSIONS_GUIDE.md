# HRMS Permission System Guide

## Management Levels Overview

The HRMS system uses a 4-level hierarchy (L0-L3) with specific permissions for each level:

### L0 - Employee (managementLevel: 0)
**Role**: Regular employee with limited access
**Permissions**:
- ✅ View own profile and information
- ✅ View own attendance records
- ✅ Check-in and check-out (mark attendance)
- ✅ View own leave records
- ❌ Cannot view other employees
- ❌ Cannot view team attendance
- ❌ Cannot create/update/delete employees
- ❌ Cannot manage attendance for others

### L1 - Manager (managementLevel: 1)
**Role**: Team leader managing direct reports
**Permissions**:
- ✅ View own profile
- ✅ View direct reports (team members)
- ✅ View own attendance + team attendance
- ✅ Manually create/update attendance for team
- ✅ Manage leaves for direct reports
- ✅ Check-in and check-out
- ❌ Cannot create/update employee records
- ❌ Cannot delete employees
- ❌ Cannot view employees outside their team

### L2 - Senior Manager (managementLevel: 2)
**Role**: Manages multiple L1 managers and their teams
**Permissions**:
- ✅ View own profile
- ✅ View L1 managers under them
- ✅ View L0 employees under their L1 managers
- ✅ View attendance for self + L1 + L0 under them
- ✅ Create new L0 and L1 employees
- ✅ Update L0 and L1 employee records
- ✅ Manage attendance for L0 and L1 under them
- ✅ Approve leaves for their hierarchy
- ❌ Cannot view or manage other L2 or L3 employees
- ❌ Cannot delete employees
- ❌ Cannot create L2 or L3 level employees

### L3 - Admin/CEO (managementLevel: 3)
**Role**: System administrator with full access
**Permissions**:
- ✅ View ALL employees (L0, L1, L2, L3)
- ✅ View ALL attendance records
- ✅ Create employees at any level (L0, L1, L2, L3)
- ✅ Update any employee record
- ✅ Delete any employee
- ✅ Manage attendance for anyone
- ✅ Approve/reject any leave
- ✅ Access all system features
- ✅ Full administrative control

## API Endpoints Permission Matrix

### Attendance Endpoints

| Endpoint | L0 | L1 | L2 | L3 | Notes |
|----------|----|----|----|----|-------|
| GET /api/attendance | ✅ | ✅ | ✅ | ✅ | Filtered by level automatically |
| GET /api/attendance/stats | ✅ | ✅ | ✅ | ✅ | Filtered by level automatically |
| POST /api/attendance/check-in | ✅ | ✅ | ✅ | ✅ | Everyone can mark their own |
| POST /api/attendance/check-out | ✅ | ✅ | ✅ | ✅ | Everyone can mark their own |
| POST /api/attendance | ❌ | ✅ | ✅ | ✅ | Create attendance for team |
| PUT /api/attendance/:id | ❌ | ✅ | ✅ | ✅ | Update attendance for team |

### Employee Endpoints

| Endpoint | L0 | L1 | L2 | L3 | Notes |
|----------|----|----|----|----|-------|
| GET /api/employees | ✅ | ✅ | ✅ | ✅ | Filtered by level automatically |
| GET /api/employees/:id | ✅ | ✅ | ✅ | ✅ | If in scope |
| GET /api/employees/stats | ❌ | ❌ | ✅ | ✅ | Senior management only |
| POST /api/employees | ❌ | ❌ | ✅ | ✅ | L2 can create L0/L1 only |
| PUT /api/employees/:id | ❌ | ❌ | ✅ | ✅ | L2 can update L0/L1 only |
| DELETE /api/employees/:id | ❌ | ❌ | ❌ | ✅ | Admin only |

## Backend Implementation Details

### Middleware Functions

1. **protect**: Verifies JWT token and loads user
2. **authorize(...roles)**: Checks user.role (admin/hr/employee)
3. **authorizeLevel(minLevel)**: Checks user.managementLevel >= minLevel

### Controller Logic

#### Attendance Controller (getAttendance)
```javascript
// L0: query.employee = req.user.id
// L1: query.employee = { $in: [self, ...teamMembers] }
// L2: query.employee = { $in: [self, ...l1Managers, ...l0Employees] }
// L3: No employee filter (show all), unless specific employeeId requested
```

#### Employee Controller (getEmployees)
```javascript
// L0: query._id = req.user.id
// L1: query._id = { $in: [self, ...teamMembers] }
// L2: query._id = { $in: [self, ...l1Managers, ...l0Employees] }
// L3: No filter (show all)
```

## Frontend Integration

### User Context
The user's managementLevel is stored in localStorage and should be checked before showing UI elements:

```javascript
const currentUser = getUser();
const userLevel = currentUser?.managementLevel || 0;

// Check permissions
const canViewTeam = userLevel >= 1;
const canManageEmployees = userLevel >= 2;
const canDeleteEmployees = userLevel >= 3;
```

### Conditional Rendering Examples

```jsx
// Show employee management button only for L2+
{userLevel >= 2 && (
  <button onClick={handleCreateEmployee}>Add Employee</button>
)}

// Show delete button only for L3
{userLevel >= 3 && (
  <button onClick={handleDelete}>Delete</button>
)}

// Show team attendance for L1+
{userLevel >= 1 && (
  <select onChange={handleEmployeeFilter}>
    <option value="">All Team Members</option>
    {employees.map(emp => <option key={emp._id}>{emp.name}</option>)}
  </select>
)}
```

## Testing Checklist

### L0 Employee Tests
- [ ] Can view only own profile
- [ ] Can view only own attendance
- [ ] Can check-in/check-out
- [ ] Cannot see other employees
- [ ] Cannot create/update/delete employees
- [ ] Gets 403 error when trying to access restricted endpoints

### L1 Manager Tests
- [ ] Can view own profile + team members
- [ ] Can view team attendance
- [ ] Can manually create attendance for team
- [ ] Cannot create/update employee records
- [ ] Cannot view employees outside team
- [ ] Gets 403 error when trying to manage employees

### L2 Senior Manager Tests
- [ ] Can view L1 managers and their L0 teams
- [ ] Can view attendance for their hierarchy
- [ ] Can create L0 and L1 employees
- [ ] Can update L0 and L1 employees
- [ ] Cannot view/update other L2 or L3 employees
- [ ] Cannot delete employees
- [ ] Cannot create L2 or L3 employees

### L3 Admin Tests
- [ ] Can view ALL employees
- [ ] Can view ALL attendance records
- [ ] Can create employees at any level
- [ ] Can update any employee
- [ ] Can delete any employee
- [ ] Has full system access

## Security Notes

1. **Double-layer protection**: Both route middleware and controller logic enforce permissions
2. **Hierarchy validation**: L2 users are prevented from accessing L2/L3 data even if they bypass route protection
3. **Automatic filtering**: Database queries automatically filter based on managementLevel
4. **Explicit checks**: Create/Update/Delete operations have explicit level checks before execution
5. **Audit logging**: All permission checks are logged for debugging

## Troubleshooting

### Issue: Admin cannot see attendance
**Solution**: Ensure admin user has `managementLevel: 3` in database

### Issue: Employee sees team members
**Solution**: Check that employee has `managementLevel: 0` (not 1 or higher)

### Issue: L2 can update L3 users
**Solution**: Controller should check target employee's level before allowing update

### Issue: Attendance not showing
**Solution**: 
1. Check user's managementLevel in JWT token
2. Verify date range filters
3. Check console logs for query details
4. Ensure attendance records have valid employee references
