# 🧪 Quick Testing Guide - Leave to Attendance Sync

## ⚡ Quick Test (5 minutes)

### Step 1: Sync Existing Approved Leaves
1. **Login as HR/Admin** (Maria D'Souza - HR001)
2. **Press F12** to open browser console
3. **Copy and paste this command**:
```javascript
fetch('http://localhost:5000/api/leaves/sync-attendance', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Sync Result:', data);
  alert(`Synced ${data.successCount} leaves to attendance!`);
});
```
4. **Expected Response**:
```json
{
  "success": true,
  "message": "Synced 3 approved leaves to attendance system",
  "successCount": 3,
  "errorCount": 0,
  "total": 3
}
```

### Step 2: Verify in Attendance (As HR/Admin)
1. **Navigate to Attendance** page (sidebar)
2. **Change month to October 2025**
3. **Select "dheeraj kumar" from employee dropdown**
4. **Look at the table** - You should see:
   - Oct 21: Present (with check-in/out times)
   - Oct 23: Present (today)
   - **Oct 28: ON-LEAVE** ← NEW! 🎉
   - **Oct 29: ON-LEAVE** ← NEW! 🎉

### Step 3: Verify as Employee
1. **Logout** and **login as dheeraj** (dcsissdc / EIM007)
2. **Go to Attendance** page
3. **Look at October 2025**
4. **Expected**: See your own leave records in the table
   - Should see Oct 28-29 with "ON-LEAVE" status
   - Calendar should show those dates

### Step 4: Test New Leave Approval (Optional)
1. **Login as employee** (dheeraj)
2. **Go to Leaves** page
3. **Click "Apply for Leave"**
4. **Fill form**:
   - Leave Type: Casual
   - Start Date: November 5, 2025
   - End Date: November 6, 2025
   - Reason: "Personal work"
5. **Submit**
6. **Logout and login as HR/Admin**
7. **Go to Leaves**, find the pending leave
8. **Click Approve** (green button)
9. **Go to Attendance** page
10. **Change to November 2025**
11. **Select dheeraj from dropdown**
12. **Expected**: Nov 5-6 should show as "ON-LEAVE" immediately! ⚡

---

## 📊 What You Should See

### Attendance Table (After Sync)
| Date | Employee | Check-In | Check-Out | Working Hours | Status |
|------|----------|----------|-----------|---------------|--------|
| 10/29/2025 | - | N/A | N/A | 0h 0m | **ON-LEAVE** 🆕 |
| 10/28/2025 | - | N/A | N/A | 0h 0m | **ON-LEAVE** 🆕 |
| 10/23/2025 | - | 12:44 PM | 05:44 PM | 4h 59m | PRESENT |
| 10/21/2025 | - | 08:46 PM | N/A | N/A | PRESENT |

### Console Logs (Backend)
```
🔄 Starting to sync all approved leaves to attendance...
Found 3 approved leaves to sync
✅ Synced 2 days to attendance for leave 68fxxxxx
✅ Synced 2 days to attendance for leave 68fxxxxx
✅ Synced 6 days to attendance for leave 68fxxxxx
```

### Console Logs (Frontend)
```
✅ Sync Result: {
  success: true,
  successCount: 3,
  total: 3
}
```

---

## ❓ Troubleshooting

### "successCount: 0" - No leaves synced
**Problem**: No approved leaves found
**Solution**: 
1. Go to Leaves page
2. Verify there are approved leaves (green "APPROVED" badge)
3. Try approving a pending leave first

### "Cannot connect to server"
**Problem**: Backend not running
**Solution**:
```bash
cd backend
npm run dev
```

### "Still don't see leaves in attendance"
**Problem**: Browser cache or filter issue
**Solution**:
1. **Hard refresh** browser (Ctrl + Shift + R)
2. Check you're looking at the **correct month** (October 2025)
3. If admin/HR, check you **selected the employee** from dropdown
4. Clear any date filters

### "Unauthorized" error
**Problem**: Not logged in as admin/HR
**Solution**:
1. Logout
2. Login as Maria (HR) or Admin
3. Try sync command again

---

## 🎯 Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Approve leave | ✅ Attendance records created immediately |
| Reject leave | ❌ Attendance records removed |
| Manual sync | ✅ All historical approved leaves synced |
| Employee views attendance | ✅ Sees own leave records |
| HR views attendance | ✅ Sees all employee leave records |
| Calendar view | 📅 Leave days visible (may need color enhancement) |

---

## 🚀 Next Steps After Testing

If everything works:
1. ✅ Leave system is fully integrated with attendance
2. ✅ Historical data is migrated
3. ✅ Future leaves will auto-sync
4. ✅ Employees can track their leaves in attendance
5. ✅ HR has unified view of attendance + leaves

**Optional Enhancements** (not implemented yet):
- Add distinct calendar color for leave days (teal/cyan)
- Block check-in on approved leave days
- Separate stats for leave vs present days
- Email notifications on sync

---

**Need Help?** Check the backend terminal for detailed logs or browser console for errors.
