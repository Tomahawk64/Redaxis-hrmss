# 💼 Redaxis HRMS (Human Resource Management System)

A **complete, production-ready** web-based HRMS platform developed using the **MERN Stack** — **MongoDB**, **Express.js**, **React.js**, and **Node.js**.

🌐 **Live System**: Fully functional with 13 pages, role-based access, and comprehensive HR features!
✅ **Status**: 100% Complete - All features implemented and operational!

---

## 🚀 Tech Stack

- ⚙ **Backend**: Node.js, Express.js  
- 🖥 **Frontend**: React.js 19.1.0, Vite 7.0.4, Bootstrap 5.3.7  
- 🗄 **Database**: MongoDB with Mongoose ODM  
- 🔐 **Authentication**: JWT (JSON Web Tokens)
- 🎨 **UI Framework**: Bootstrap 5 + React Icons + React Calendar

---

## ✨ Complete Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, HR, Employee)
- JWT-based secure authentication
- Password encryption with bcrypt
- Protected routes on frontend and backend

### 👥 Employee Management (✅ FULLY IMPLEMENTED)
- Complete CRUD operations for employees
- Department and position management
- Employee statistics and filtering
- Search by name, email, or ID
- Role-based access (Admin/HR can edit, Employees view-only)
- Salary information management

### 🕒 Attendance Tracking
- Check-in/Check-out system
- Attendance reports and statistics
- Working hours calculation

### 💰 Payroll Management
- Salary processing and calculation
- Allowances and deductions
- Payslip generation

### 📅 Event Management
- Schedule company events
- Event participation tracking
- Calendar integration

### 📝 Leave Management
- Leave application system
- Approval workflow
- Leave balance tracking

### 📊 Dashboard
- Real-time statistics
- Quick actions
- System overview

### 🎉 Additional Features
- Feed/News posts
- Employee recognition
- Internal chat system
- Profile management

---

## 🎯 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd HRMS_UptoSkills-main
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 4. Configure Environment Variables

Backend (.env in backend folder):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/redaxis_hrms
JWT_SECRET=redaxis_hrms_secret_key_2025_secure_token
JWT_EXPIRE=7d
NODE_ENV=development
```

Frontend (.env in root folder):
```
VITE_API_URL=http://localhost:5000/api
```

#### 5. Start MongoDB
Make sure MongoDB is running on your system.

#### 6. Seed the Database
```bash
cd backend
npm run seed
```

#### 7. Start the Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### 8. Start the Frontend
```bash
# In root directory
npm run dev
```
Frontend will run on http://localhost:5173

---

## 👤 Login Credentials

### Administrator Account
- **Email**: admin@redaxis.com
- **Password**: Admin@123
- **Access**: Full system access

### HR Manager Account
- **Email**: maria@redaxis.com
- **Password**: Maria@123
- **Access**: HR operations, employee management

### Employee Accounts
1. **John Cena** (Engineering)
   - Email: john@redaxis.com
   - Password: John@123

2. **Sarah Johnson** (Marketing)
   - Email: sarah@redaxis.com
   - Password: Sarah@123

3. **David Smith** (Sales)
   - Email: david@redaxis.com
   - Password: David@123

4. **Emily Brown** (Finance)
   - Email: emily@redaxis.com
   - Password: Emily@123

---

## 📁 Project Structure

```
HRMS_UptoSkills-main/
├── backend/
│   ├── config/
│   │   └── seed.js              # Database seeding
│   ├── controllers/             # Business logic
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth & validation
│   ├── utils/                   # Helper functions
│   ├── server.js                # Express server
│   └── package.json
├── src/
│   ├── components/              # React components
│   ├── services/                # API service layer
│   ├── assets/                  # Images & static files
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## � API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile
- PUT `/api/auth/change-password` - Change password

### Employees
- GET `/api/employees` - Get all employees
- GET `/api/employees/:id` - Get employee by ID
- POST `/api/employees` - Create employee (Admin/HR)
- PUT `/api/employees/:id` - Update employee (Admin/HR)
- DELETE `/api/employees/:id` - Delete employee (Admin)
- GET `/api/employees/stats` - Get statistics (Admin/HR)

### Attendance
- GET `/api/attendance` - Get attendance records
- POST `/api/attendance/check-in` - Check in
- POST `/api/attendance/check-out` - Check out
- GET `/api/attendance/stats` - Get attendance stats

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event
- POST `/api/events/:id/join` - Join event

### Payroll
- GET `/api/payroll` - Get payroll records
- GET `/api/payroll/:id` - Get payroll by ID
- POST `/api/payroll` - Create payroll (Admin/HR)
- PUT `/api/payroll/:id` - Update payroll (Admin/HR)
- POST `/api/payroll/:id/process` - Process payroll (Admin/HR)

### Leaves
- GET `/api/leaves` - Get leave applications
- POST `/api/leaves` - Apply for leave
- PUT `/api/leaves/:id/status` - Approve/Reject (Admin/HR)

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

---

## 🛠️ Technologies Used

### Frontend
- React 19.1.0
- React Router DOM 7.6.3
- Bootstrap 5.3.7
- React Icons 5.5.0
- React Calendar 6.0.0
- Vite 7.0.4

### Backend
- Express.js 4.18.2
- Mongoose 8.0.0
- JSON Web Token 9.0.2
- Bcrypt.js 2.4.3
- CORS 2.8.5
- Dotenv 16.3.1

---

## 📝 License

This project is licensed under the *MIT License*.  
Feel free to use, modify, and share it as per the license terms.

---

## 🤝 Support

For issues or questions, please contact the development team.

**Redaxis HRMS** - *Empowering HR with Technology* 🚀

