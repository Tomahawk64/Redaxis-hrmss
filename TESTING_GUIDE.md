# 🧪 Redaxis HRMS - Testing Guide

## Quick Testing Checklist

Use this guide to test all the newly implemented features and verify role-based access control.

---

## 🔑 Test Credentials

### Admin Account (Full Access)
```
Email: admin@redaxis.com
Password: admin123
```

### HR Manager Account
```
Email: maria@redaxis.com
Password: hr123
```

### Employee Account 1
```
Email: john@redaxis.com
Password: employee123
```

### Employee Account 2
```
Email: sarah@redaxis.com
Password: employee123
```

---

## ✅ Testing Scenarios

### 1. **Login & Authentication** ✅
- [ ] Open http://localhost:5173/
- [ ] Login with admin@redaxis.com / admin123
- [ ] Verify redirect to Dashboard
- [ ] Check user info displayed in sidebar (name, position)
- [ ] Logout and verify redirect to login page

### 2. **Dashboard** ✅
- [ ] View statistics cards (Total Employees, Active Today, On Leave, Upcoming Events)
- [ ] Click "Check In" button
- [ ] Verify success message
- [ ] Click "Check Out" button
- [ ] Verify working hours calculated

### 3. **Employees Page** ✅

**As Admin:**
- [ ] Navigate to Employees page from sidebar
- [ ] View complete employee list with photos
- [ ] Test search functionality (search by name)
- [ ] Filter by department
- [ ] Filter by role
- [ ] Click "Add Employee" button
- [ ] Fill form and create new employee
- [ ] Click edit icon on any employee
- [ ] Modify employee details
- [ ] Click delete icon on an employee (Admin only)
- [ ] Verify employee deleted

**As Employee (john@redaxis.com):**
- [ ] Login as john@redaxis.com
- [ ] Navigate to Employees page
- [ ] Verify no "Add Employee" button visible
- [ ] Verify no edit/delete buttons visible
- [ ] Verify can view team members only

### 4. **Profile Page** ✅
- [ ] Click "Profile" in sidebar
- [ ] View personal information
- [ ] Click "Edit Profile" button
- [ ] Update first name, last name, phone
- [ ] Update address information
- [ ] Click "Save Changes"
- [ ] Verify success message
- [ ] Click "Change Password" button
- [ ] Enter current password
- [ ] Enter new password (min 6 characters)
- [ ] Confirm new password
- [ ] Click "Change Password"
- [ ] Verify success message

### 5. **Attendance Page** ✅
- [ ] Navigate to Attendance page
- [ ] View attendance calendar with color-coded dates
- [ ] Check statistics cards (Total Days, Present, Absent, Attendance %)
- [ ] View "Today's Attendance" card
- [ ] Click "Check In" (if not already checked in)
- [ ] Verify check-in time displayed
- [ ] Click "Check Out"
- [ ] Verify working hours calculated
- [ ] Click different dates on calendar
- [ ] View attendance records table
- [ ] Verify legend (Present=Green, Absent=Red, Half-day=Yellow, Leave=Blue)

**As Admin:**
- [ ] Login as admin
- [ ] View all employees' attendance in table
- [ ] Verify "Employee" column visible

**As Employee:**
- [ ] Login as employee
- [ ] Verify only personal attendance visible
- [ ] No "Employee" column in table

### 6. **Payroll Page** ✅

**As Admin:**
- [ ] Navigate to Payroll page
- [ ] Click "Process Payroll" button
- [ ] Confirm payroll processing
- [ ] Verify success message
- [ ] View all employees' payroll records
- [ ] Filter by month and year
- [ ] Click eye icon to view payslip details
- [ ] View complete salary breakdown
- [ ] Click download icon
- [ ] Verify payslip HTML file downloaded

**As Employee:**
- [ ] Login as employee (john@redaxis.com)
- [ ] Navigate to Payroll page
- [ ] Verify only personal payslips visible
- [ ] View statistics (Total Payslips, This Year, Latest Net Salary)
- [ ] Click eye icon to view details
- [ ] Click download icon
- [ ] Verify payslip downloaded with correct details

### 7. **Feed Page** ✅

**As Admin:**
- [ ] Navigate to Feed page
- [ ] Click "Create Post" button
- [ ] Select post type (Announcement)
- [ ] Write post content
- [ ] Click "Post"
- [ ] Verify post appears in feed
- [ ] Try different post types (Update, Achievement)
- [ ] Verify color-coded badges

**As Any User:**
- [ ] View company feed posts
- [ ] Click "Like" button on a post
- [ ] Verify like count increases
- [ ] Write a comment in comment box
- [ ] Press Enter or click "Post"
- [ ] Verify comment appears
- [ ] View author profile picture and details

### 8. **Recognition Page** ✅
- [ ] Navigate to Recognition page
- [ ] View statistics (Received, Given, Total)
- [ ] Click "Give Recognition" button
- [ ] Select an employee from dropdown
- [ ] Choose recognition category (e.g., Teamwork)
- [ ] Write recognition message
- [ ] Click "Send Recognition"
- [ ] Verify recognition appears in feed
- [ ] Click filter buttons (All, Received by Me, Given by Me)
- [ ] Verify filtering works
- [ ] Click "Like" on a recognition card
- [ ] Verify like count increases
- [ ] View different category badges and colors

### 9. **Chat Page** ✅
- [ ] Navigate to Chat page
- [ ] View conversations list (left side)
- [ ] Search for an employee in search box
- [ ] Click on an employee to start chat
- [ ] Verify chat window opens
- [ ] Type a message
- [ ] Press Enter or click send button
- [ ] Verify message appears in chat
- [ ] Verify message timestamp
- [ ] Select another conversation
- [ ] Verify conversation history loads
- [ ] View sent messages (blue, right-aligned)
- [ ] View received messages (gray, left-aligned)

### 10. **Settings Page** ✅
- [ ] Navigate to Settings page
- [ ] Toggle notification switches:
  - [ ] Email Notifications
  - [ ] Push Notifications
  - [ ] Company Updates
  - [ ] Event Reminders
- [ ] Toggle privacy switches:
  - [ ] Public Profile
  - [ ] Show Email
  - [ ] Show Phone Number
- [ ] Change theme preference (Light/Dark/Auto)
- [ ] Change language preference
- [ ] Click "Save Settings"
- [ ] Verify success notification appears
- [ ] Refresh page
- [ ] Verify settings persisted

**As Admin:**
- [ ] Verify "Admin Settings" section visible
- [ ] View admin-only options

**As Employee:**
- [ ] Verify no "Admin Settings" section

### 11. **Events Page** ✅
- [ ] Navigate to Event page
- [ ] View list of upcoming events
- [ ] Click on an event card
- [ ] View event details
- [ ] Click "Join Event" button
- [ ] Verify success message

**As Admin/HR:**
- [ ] Click "Schedule Event" button
- [ ] Fill event details (title, description, date, time, location)
- [ ] Click "Submit"
- [ ] Verify event created

---

## 🎯 Role-Based Access Verification

### Admin Role Testing:
✅ Can access all pages
✅ Can create, edit, delete employees
✅ Can process payroll
✅ Can view all attendance
✅ Can create posts and events
✅ Can delete records
✅ Sees admin settings

### HR Role Testing:
✅ Can access all pages
✅ Can create, edit employees (cannot delete)
✅ Can process payroll
✅ Can view all attendance
✅ Can create posts and events
✅ No delete permissions

### Employee Role Testing:
✅ Can access all pages
✅ Cannot edit other employees (view-only)
✅ Can only view personal payslips
✅ Can only view personal attendance
✅ Can edit own profile
✅ Can participate in social features
✅ No admin/HR specific features visible

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:** 
```bash
cd backend
node server.js
```
Verify backend running on port 5000

### Issue: "Blank page on frontend"
**Solution:**
```bash
npm run dev
```
Verify frontend running on port 5173

### Issue: "MongoDB connection failed"
**Solution:**
- Check MongoDB is running
- Verify connection string in backend/.env
- Try: `mongodb://localhost:27017/redaxis_hrms`

### Issue: "Login fails"
**Solution:**
- Run seed script: `cd backend && node config/seed.js`
- Verify credentials match CREDENTIALS.md

### Issue: "Pages showing 404"
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Restart Vite dev server

---

## 📊 Expected Results

### After Complete Testing:
- ✅ All 13 pages load without errors
- ✅ Role-based restrictions work correctly
- ✅ Forms submit successfully
- ✅ Data displays correctly
- ✅ CRUD operations work
- ✅ Filters and search function properly
- ✅ Downloads work (payslips)
- ✅ Notifications appear on actions
- ✅ Navigation is smooth
- ✅ UI is responsive

---

## 🎉 Success Criteria

You've successfully tested the system if:

1. ✅ Logged in with all 4 test accounts
2. ✅ Accessed all 13 pages
3. ✅ Performed CRUD operations where applicable
4. ✅ Verified role-based restrictions
5. ✅ Downloaded a payslip
6. ✅ Sent a message in chat
7. ✅ Created a post in feed
8. ✅ Gave recognition to someone
9. ✅ Checked in/out attendance
10. ✅ Updated profile and changed password

---

## 📝 Test Report Template

After testing, document results:

```
Date: _______________
Tester: _______________

✅ Login & Authentication
✅ Dashboard
✅ Employees Page
✅ Profile Page
✅ Attendance Page
✅ Payroll Page
✅ Feed Page
✅ Recognition Page
✅ Chat Page
✅ Settings Page
✅ Events Page

Role-Based Access:
✅ Admin role verified
✅ HR role verified
✅ Employee role verified

Issues Found: _______________
Overall Status: PASS / FAIL
```

---

## 🚀 Performance Testing

### Load Time Expectations:
- Login page: < 1 second
- Dashboard: < 2 seconds
- Employee list: < 3 seconds (depends on data)
- Attendance calendar: < 2 seconds
- Payroll records: < 2 seconds

### Network Activity:
- API calls should complete in < 1 second
- JWT token should persist across page refreshes
- No console errors in browser

---

## 🎊 Completion Checklist

After successful testing:
- [ ] All pages load correctly
- [ ] No console errors
- [ ] All features functional
- [ ] Role-based access working
- [ ] Data persists correctly
- [ ] UI is responsive
- [ ] Forms validate properly
- [ ] Success/error messages display
- [ ] Downloads work
- [ ] Navigation is smooth

**If all checked: Congratulations! Your Redaxis HRMS is production-ready! 🎉**

---

## 📞 Support

For issues or questions:
1. Check FEATURES_COMPLETE.md for feature details
2. Review IMPLEMENTATION_SUMMARY.md for technical info
3. Verify backend and frontend are running
4. Check MongoDB connection
5. Clear browser cache and retry

---

**Happy Testing! 🧪**
