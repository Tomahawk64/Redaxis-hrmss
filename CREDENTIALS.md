# 🔐 REDAXIS HRMS - LOGIN CREDENTIALS & USAGE GUIDE

## 📋 System Access Credentials

### 👨‍💼 ADMINISTRATOR ACCOUNT
**Full system access with all permissions**
- **Email**: admin@redaxis.com
- **Password**: Admin@123
- **Employee ID**: ADMIN001
- **Role**: System Administrator
- **Department**: Human Resources
- **Access Level**: Complete system control, user management, all reports

### 👩‍💼 HR MANAGER ACCOUNT
**HR operations and employee management**
- **Email**: maria@redaxis.com
- **Password**: Maria@123
- **Employee ID**: HR001
- **Name**: Maria D'Souza
- **Role**: HR Manager
- **Department**: Human Resources
- **Access Level**: Employee management, attendance, payroll, leave approvals

### 👨‍💻 EMPLOYEE ACCOUNTS

#### 1. John Cena - Senior Software Engineer
- **Email**: john@redaxis.com
- **Password**: John@123
- **Employee ID**: EMP001
- **Department**: Engineering
- **Position**: Senior Software Engineer
- **Access Level**: Personal dashboard, attendance, leave applications, events

#### 2. Sarah Johnson - Marketing Manager
- **Email**: sarah@redaxis.com
- **Password**: Sarah@123
- **Employee ID**: EMP002
- **Department**: Marketing
- **Position**: Marketing Manager
- **Access Level**: Personal dashboard, attendance, leave applications, events

#### 3. David Smith - Sales Executive
- **Email**: david@redaxis.com
- **Password**: David@123
- **Employee ID**: EMP003
- **Department**: Sales
- **Position**: Sales Executive
- **Access Level**: Personal dashboard, attendance, leave applications, events

#### 4. Emily Brown - Financial Analyst
- **Email**: emily@redaxis.com
- **Password**: Emily@123
- **Employee ID**: EMP004
- **Department**: Finance
- **Position**: Financial Analyst
- **Access Level**: Personal dashboard, attendance, leave applications, events

---

## 🚀 QUICK START GUIDE

### Starting the System

1. **Start MongoDB**
   - Ensure MongoDB is running on your system
   - Default connection: mongodb://localhost:27017/redaxis_hrms

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   - Backend runs on: http://localhost:5000
   - API Base URL: http://localhost:5000/api

3. **Start Frontend Application**
   ```bash
   # In root directory
   npm run dev
   ```
   - Frontend runs on: http://localhost:5173

4. **First Time Setup - Seed Database**
   ```bash
   cd backend
   npm run seed
   ```
   This creates all demo users, departments, and sample data.

---

## 📱 USING THE SYSTEM

### Login Process
1. Navigate to http://localhost:5173
2. You'll see the login page
3. Enter any of the credentials above
4. Click "Sign In"
5. You'll be redirected to the dashboard

### Dashboard Features
- **Check In/Out**: Track your daily attendance
- **Statistics Cards**: View system metrics
- **Quick Actions**: Access common features
- **System Status**: Monitor overall health

### Navigation Menu
- **Dashboard**: Main overview and statistics
- **Chat**: Internal messaging system (Coming Soon)
- **Employees**: View and manage employees
- **Feed**: Company news and updates (Coming Soon)
- **Recognition**: Employee recognition and awards (Coming Soon)
- **Event**: Schedule and join company events
- **Profile**: Manage your profile (Coming Soon)
- **Settings**: System settings (Coming Soon)

### Event Management
1. Click "Event" in sidebar
2. View scheduled events
3. Select date and time
4. Click "Schedule New Event" to create
5. Fill in event details
6. Submit to create event

### Attendance
- Use "Check In" button on dashboard to mark arrival
- Use "Check Out" button to mark departure
- System automatically calculates working hours

---

## 🔧 API TESTING

### Using Postman or Thunder Client

#### Login Example
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@redaxis.com",
  "password": "Admin@123"
}
```

Response will include JWT token for authentication.

#### Get Dashboard Stats (Protected)
```http
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Create Event (Protected)
```http
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "title": "Team Meeting",
  "date": "2025-08-01",
  "time": "10:00",
  "duration": "1 Hour",
  "timezone": "Asia/Kolkata",
  "conferenceDetails": "Zoom link to be shared",
  "description": "Monthly team sync"
}
```

---

## 🎯 ROLE-BASED ACCESS

### Admin Can:
- ✅ View/Create/Edit/Delete all employees
- ✅ Access all attendance records
- ✅ Process payroll for all employees
- ✅ Approve/Reject leave applications
- ✅ Manage departments
- ✅ View all statistics
- ✅ Full system access

### HR Manager Can:
- ✅ View/Create/Edit employees
- ✅ Manage attendance
- ✅ Process payroll
- ✅ Approve/Reject leaves
- ✅ Manage departments
- ✅ View HR statistics
- ❌ Cannot delete employees

### Employee Can:
- ✅ View own dashboard
- ✅ Check in/out attendance
- ✅ Apply for leaves
- ✅ View own payslips
- ✅ Participate in events
- ✅ Use chat and feed
- ❌ Cannot access other employees' data
- ❌ Cannot approve leaves
- ❌ Cannot process payroll

---

## 🗄️ DATABASE INFORMATION

**Database Name**: redaxis_hrms

**Collections**:
- users - All employee/user accounts
- departments - Department information
- attendance - Daily attendance records
- events - Scheduled events
- leaves - Leave applications
- payrolls - Salary records
- feeds - Company feed posts
- recognitions - Employee recognitions
- chats - Chat messages

---

## 🛠️ TROUBLESHOOTING

### Cannot Login
- Check if backend server is running
- Verify MongoDB is running
- Ensure database is seeded
- Check browser console for errors

### API Not Working
- Verify backend is running on port 5000
- Check CORS is enabled
- Ensure JWT token is valid
- Check API endpoint URLs

### Frontend Not Loading
- Clear browser cache
- Check if frontend is running on port 5173
- Verify all npm packages are installed
- Check browser console for errors

### Database Connection Issues
- Ensure MongoDB is running
- Check MongoDB connection string in .env
- Verify database name is correct
- Check MongoDB logs

---

## 📊 DEMO SCENARIOS

### Scenario 1: Admin Managing Employees
1. Login as admin@redaxis.com
2. Go to Employees section
3. View all employees
4. Create/Edit employee records
5. View employee statistics

### Scenario 2: Employee Daily Routine
1. Login as john@redaxis.com
2. Click "Check In" on dashboard
3. View today's attendance
4. Apply for leave if needed
5. Check upcoming events
6. Click "Check Out" at end of day

### Scenario 3: HR Processing Payroll
1. Login as maria@redaxis.com
2. Access payroll section
3. Create payroll for month
4. Review salary calculations
5. Process payments
6. Generate payslips

### Scenario 4: Event Management
1. Login with any account
2. Go to Events section
3. View scheduled events
4. Select date and time
5. Create new event
6. Join existing events

---

## 📞 SUPPORT

For technical issues or questions:
- Check API response in browser console
- Verify backend logs in terminal
- Review MongoDB connection
- Check system requirements

**System Status**: ✅ Fully Operational
**Last Updated**: October 2025
**Version**: 1.0.0

---

## 🎉 THANK YOU FOR USING REDAXIS HRMS!

**Remember**: This is a demo system with sample data. In production:
- Use strong, unique passwords
- Enable HTTPS
- Set up proper database backups
- Implement rate limiting
- Add proper error logging
- Use environment-specific configurations
