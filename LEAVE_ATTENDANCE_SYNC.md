# Leave-Attendance Sync Feature

## Overview
Approved leaves are now automatically synced to the attendance system. When an HR or admin approves a leave, attendance records with "on-leave" status are automatically created for each day of the leave period.

## Features Implemented

### 1. Automatic Sync on Approval
- When a leave is **approved**, the system automatically creates attendance records for each day of the leave with status `on-leave`
- Each record includes a note indicating the leave type (e.g., "Casual Leave", "Sick Leave")
- If an attendance record already exists for that day, it will be updated to "on-leave" status

### 2. Automatic Removal on Rejection
- When a leave is **rejected**, any "on-leave" attendance records created for that leave period are automatically removed
- This ensures the attendance system stays accurate

### 3. Manual Sync for Existing Leaves
- A new API endpoint `/api/leaves/sync-attendance` allows admins/HR to sync all previously approved leaves to the attendance system
- This is useful for:
  - Initial system setup
  - Recovering from data inconsistencies
  - Syncing historical approved leaves

## How It Works

### For New Leave Approvals
1. Employee applies for leave
2. HR/Admin approves the leave
3. System automatically:
   - Creates attendance records for Oct 28 and Oct 29 (in your case)
   - Sets status to "on-leave"
   - Adds note: "Casual Leave"
   - Sets workingHours to 0

### For Existing Approved Leaves
You can manually trigger the sync by:
1. Login as Admin or HR
2. Open browser console (F12)
3. Run this command:
```javascript
fetch('http://localhost:5000/api/leaves/sync-attendance', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}).then(res => res.json()).then(data => console.log(data));
```

This will sync all approved leaves (including dheeraj's Oct 28-29 leave) to the attendance system.

## Verification

### Check in Attendance Page
1. Navigate to Attendance page
2. Change month to October 2025
3. You should see:
   - Oct 28 and Oct 29 marked as "On Leave" in the calendar
   - Attendance records table showing these dates with status "ON-LEAVE"

### Check as Employee
1. Login as dheeraj (EIM007)
2. Go to Attendance page
3. Should see own leave records in the attendance table

### Check as Admin/HR
1. Login as Admin or HR
2. Go to Attendance page
3. Select employee "dheeraj kumar" from dropdown
4. Should see his leave records for Oct 28-29

## Technical Details

### Files Modified
1. **backend/controllers/leaveController.js**
   - Added `syncLeaveToAttendance()` helper function
   - Added `removeLeaveFromAttendance()` helper function
   - Updated `updateLeaveStatus()` to call sync functions
   - Added `syncAllApprovedLeaves()` endpoint for manual sync

2. **backend/routes/leaveRoutes.js**
   - Added new route: `POST /api/leaves/sync-attendance`

### Database Changes
- No schema changes required
- Uses existing Attendance model with `status: 'on-leave'`
- Attendance records have `notes` field populated with leave type

### Attendance Status Values
- `present`: Employee checked in
- `absent`: No check-in recorded
- `half-day`: Partial day attendance
- `on-leave`: Employee on approved leave
- `holiday`: Public holiday (not yet implemented)

## Testing Checklist
- [x] Approve new leave → Check attendance calendar
- [x] Reject leave → Verify attendance records removed
- [x] Sync existing approved leaves → Check historical data
- [ ] Verify calendar colors for on-leave status
- [ ] Check attendance stats include leave days correctly
- [ ] Test with multi-day leaves (more than 2 days)
- [ ] Test with overlapping leave requests

## Next Steps (Future Enhancements)
1. Add visual indicator on calendar for leave days (use teal/cyan color)
2. Update attendance statistics to categorize leave days separately
3. Prevent check-in/check-out on approved leave days
4. Add leave balance tracking and sync with attendance
5. Email notifications when leaves are synced to attendance
