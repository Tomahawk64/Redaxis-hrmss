# 🗄️ MongoDB Installation Guide for Redaxis HRMS

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select:
     - Version: 7.0.x (Latest)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install MongoDB as a Service (check this option)
   - Install MongoDB Compass (GUI tool) - Recommended

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   - MongoDB should start automatically as a Windows service
   - Or manually: Open Services → Find "MongoDB Server" → Start

### Alternative: MongoDB Community Edition (Portable)

If you prefer not to install as a service:

1. Download ZIP version from MongoDB website
2. Extract to `C:\mongodb`
3. Create data directory: `C:\mongodb\data`
4. Start MongoDB manually:
   ```powershell
   cd C:\mongodb\bin
   .\mongod.exe --dbpath C:\mongodb\data
   ```

---

## Option 2: MongoDB Atlas (Cloud Database) - NO INSTALLATION NEEDED

### Setup MongoDB Atlas

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)
   - Verify your email

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select your closest region
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `redaxis_admin`
   - Password: Generate secure password or use: `Redaxis2025!`
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://redaxis_admin:<password>@cluster0.xxxxx.mongodb.net/`

6. **Update Backend .env File**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://redaxis_admin:Redaxis2025!@cluster0.xxxxx.mongodb.net/redaxis_hrms?retryWrites=true&w=majority
   JWT_SECRET=redaxis_hrms_secret_key_2025_secure_token
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
   
   ⚠️ Replace:
   - `<password>` with your actual password
   - `cluster0.xxxxx.mongodb.net` with your cluster address
   - `/redaxis_hrms` is your database name

---

## Quick Start After MongoDB Setup

### 1. Seed the Database
```powershell
cd backend
npm run seed
```

You should see:
```
✅ MongoDB Connected
🗑️  Cleared existing data
✅ Departments created
✅ Users created
✅ Events created
✅ Feed posts created
✅ Recognitions created

🎉 Database seeded successfully!

📝 Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💼 ADMIN ACCOUNT:
   Email: admin@redaxis.com
   Password: Admin@123
   Role: Administrator (Full Access)

... (more credentials)
```

### 2. Start Backend Server
```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Redaxis HRMS Server running on port 5000
✅ MongoDB connected successfully
```

### 3. Start Frontend (in new terminal)
```powershell
# In root directory
npm run dev
```

You should see:
```
VITE v7.0.4  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 4. Open Browser
Navigate to: http://localhost:5173

---

## Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Check MongoDB service is running:
   ```powershell
   # Check service status
   Get-Service MongoDB*
   ```

2. Start MongoDB service:
   ```powershell
   # Start service
   Start-Service MongoDB
   ```

3. Or check MongoDB Atlas connection string is correct

### Database Access Denied

**Error**: `MongoServerError: Authentication failed`

**Solution**:
- Verify username/password in connection string
- Check database user has correct permissions
- For Atlas: Ensure IP is whitelisted

### Cannot Find Database

**Error**: Database appears empty after seeding

**Solution**:
```powershell
# Re-run seed script
cd backend
npm run seed
```

---

## MongoDB Compass (GUI Tool)

If installed, you can view your database visually:

1. Open MongoDB Compass
2. Connect to:
   - Local: `mongodb://localhost:27017`
   - Atlas: Use your Atlas connection string
3. Navigate to `redaxis_hrms` database
4. View collections: users, events, departments, etc.

---

## Recommended: Use MongoDB Atlas for Easy Setup

MongoDB Atlas is recommended because:
- ✅ No local installation required
- ✅ Works from any computer
- ✅ Free tier available
- ✅ Automatic backups
- ✅ Better security
- ✅ Cloud accessible

---

## Next Steps

Once MongoDB is running:
1. ✅ Seed the database: `cd backend && npm run seed`
2. ✅ Start backend: `cd backend && npm run dev`
3. ✅ Start frontend: `npm run dev`
4. ✅ Login with credentials from CREDENTIALS.md

---

## Need Help?

Check these logs:
- **Backend logs**: Terminal where backend is running
- **MongoDB logs**: Check Windows Services or MongoDB Compass
- **Frontend logs**: Browser console (F12)

**Status Check Commands**:
```powershell
# Check if MongoDB is running (Windows)
Get-Service MongoDB*

# Check if ports are in use
netstat -ano | findstr :5000  # Backend
netstat -ano | findstr :27017 # MongoDB
netstat -ano | findstr :5173  # Frontend
```
