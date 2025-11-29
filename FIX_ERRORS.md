# Fixing Setup Errors

## ✅ Issues Found and Fixed

### 1. Port 5000 Already in Use ✅ FIXED
- **Error:** `EADDRINUSE: address already in use :::5000`
- **Solution:** Killed the process using port 5000
- **Status:** ✅ Fixed

### 2. MongoDB Not Running ❌ NEEDS SETUP
- **Error:** `connect ECONNREFUSED 127.0.0.1:27017`
- **Cause:** MongoDB is not installed or not running on your computer
- **Solution:** Choose one of the options below

---

## 🔧 MongoDB Setup - Choose One Option

### Option 1: MongoDB Atlas (Cloud - FREE & EASIEST) ⭐ RECOMMENDED

**Why use Atlas?**
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works immediately
- ✅ No local setup required

**Quick Setup Steps:**

1. **Sign up for MongoDB Atlas** (2 minutes)
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a region close to you
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Create Database User**
   - Click "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `ehmadmin` (or any username)
   - Password: Create a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left menu)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://ehmadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Update Your .env File**
   - Open `backend/.env`
   - Find the line: `MONGODB_URI=mongodb://localhost:27017/ehm_travel`
   - Replace it with:
     ```
     MONGODB_URI=mongodb+srv://ehmadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
     ```
   - Replace `YOUR_PASSWORD` with your actual password
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
   - Make sure to add `/ehm_travel` before the `?`

7. **Test the Connection**
   ```bash
   cd backend
   node test-db-connection.js
   ```
   Should show: ✅ MongoDB Connection Successful!

8. **Seed the Database**
   ```bash
   npm run seed
   ```

9. **Start the Server**
   ```bash
   npm run dev
   ```

---

### Option 2: Install MongoDB Locally (Windows)

**Steps:**

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Choose Windows
   - Download and run installer

2. **Install**
   - Run the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - Install MongoDB Compass (optional GUI)

3. **Verify**
   - MongoDB should start automatically as a service
   - Test connection:
     ```bash
     cd backend
     node test-db-connection.js
     ```

4. **If MongoDB doesn't start automatically:**
   - Open Services (Win+R, type `services.msc`)
   - Find "MongoDB" service
   - Right-click → Start

5. **Seed and Run**
   ```bash
   cd backend
   npm run seed
   npm run dev
   ```

---

## 🚀 After MongoDB is Set Up

Once MongoDB is configured (either Atlas or local), run these commands:

```bash
# 1. Test MongoDB connection
cd backend
node test-db-connection.js

# 2. Seed the database (first time only)
npm run seed

# 3. Start the backend server
npm run dev
```

You should see:
```
MongoDB Connected: localhost (or your Atlas cluster)
Server is running on port 5000
Environment: development
```

Then in a **new terminal**, start the frontend:

```bash
cd my-app
npm start
```

---

## 📝 Summary of What Was Fixed

1. ✅ Port 5000 conflict - Process killed
2. ✅ Dependencies reinstalled
3. ✅ .env file created
4. ⏳ MongoDB setup - **YOU NEED TO DO THIS**

---

## 🆘 Still Having Issues?

1. **MongoDB connection still fails:**
   - Double-check your connection string in `backend/.env`
   - Make sure there are no extra spaces
   - For Atlas: Make sure IP is whitelisted

2. **Port 5000 still in use:**
   - Change port in `backend/.env`: `PORT=5001`
   - Update `my-app/src/services/api.js`: Change `http://localhost:5000` to `http://localhost:5001`

3. **Other errors:**
   - Share the exact error message
   - Check that Node.js is installed: `node --version`

---

**Recommended:** Use MongoDB Atlas (Option 1) - it's the fastest and easiest way to get started!

