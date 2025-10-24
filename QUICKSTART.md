# 🚀 QUICK START - REDAXIS HRMS

## ⚡ 3-MINUTE SETUP

### STEP 1: Install MongoDB (Choose One Method)

#### Option A: MongoDB Atlas (Cloud - NO INSTALLATION) ⭐ RECOMMENDED
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create user: `redaxis_admin` / `Redaxis2025!`
5. Whitelist IP: "Allow from Anywhere"
6. Get connection string
7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://redaxis_admin:Redaxis2025!@cluster0.xxxxx.mongodb.net/redaxis_hrms
   ```

#### Option B: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service

### STEP 2: Seed Database
```powershell
cd backend
npm run seed
```

### STEP 3: Start System

#### Easy Way - Use Startup Script
```powershell
.\START.ps1
```

#### Manual Way
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### STEP 4: Login
1. Open http://localhost:5173
2. Login with:
   - **Admin**: admin@redaxis.com / Admin@123
   - **HR**: maria@redaxis.com / Maria@123
   - **Employee**: john@redaxis.com / John@123

---

## ✅ YOU'RE DONE!

The system is now running. Enjoy your complete HRMS!

---

## 📚 Need More Help?

- **Full Instructions**: See `README.md`
- **All Credentials**: See `CREDENTIALS.md`  
- **MongoDB Help**: See `MONGODB_SETUP.md`
- **Full Summary**: See `PROJECT_SUMMARY.md`

---

## 🎯 What Can You Do?

### Try These Features:
1. ✅ **Dashboard** - Check in/out, view stats
2. ✅ **Events** - Create and join events
3. ✅ **Employees** - Manage employee data (Admin/HR)
4. ✅ **Attendance** - Track daily attendance
5. ✅ **Leaves** - Apply and approve leaves
6. ✅ **Payroll** - Process salaries (Admin/HR)

---

## 🆘 Troubleshooting

### MongoDB Not Connected?
- Check MongoDB is running
- Verify connection string in `backend/.env`
- Try MongoDB Atlas instead

### Frontend Won't Start?
```powershell
npm install
npm run dev
```

### Backend Won't Start?
```powershell
cd backend
npm install
npm run dev
```

### Ports Already in Use?
Close any apps using ports 5000 or 5173

---

## 🎉 ENJOY YOUR HRMS SYSTEM!
