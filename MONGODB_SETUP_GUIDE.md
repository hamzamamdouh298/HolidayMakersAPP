# MongoDB Setup Guide

## 🚀 Quick Setup: MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Update .env File
1. Open `backend/.env`
2. Replace `MONGODB_URI` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
   ```
   **Important:** Replace `username` and `password` with your actual credentials!

### Step 4: Configure Database Access
1. In Atlas, go to "Database Access"
2. Create a database user (username/password)
3. Use these credentials in your connection string

### Step 5: Configure Network Access
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

### Step 6: Restart Backend
```powershell
cd backend
npm run dev
```

---

## 🖥️ Option 2: Install MongoDB Locally

### Windows Installation

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and run installer

2. **Install MongoDB:**
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (optional GUI)

3. **Verify Installation:**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB:**
   - If installed as service: It should start automatically
   - If not: Run `mongod` in a terminal

5. **Verify MongoDB is Running:**
   ```powershell
   # Check if port 27017 is listening
   netstat -ano | findstr ":27017"
   ```

6. **Update .env (if needed):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ehm_travel
   ```

---

## ✅ Verify Connection

After setting up MongoDB (Atlas or Local):

1. **Test Database Connection:**
   ```powershell
   cd backend
   npm run test-db
   ```

2. **Seed the Database:**
   ```powershell
   cd backend
   npm run seed
   ```

3. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

You should see:
```
MongoDB Connected: localhost
Server is running on port 5000
```

---

## 🔧 Troubleshooting

### "MongoDB connection failed"
- ✅ Check if MongoDB is running (local) or cluster is active (Atlas)
- ✅ Verify connection string in `.env` file
- ✅ Check network access (Atlas)
- ✅ Verify username/password are correct

### "Authentication failed"
- ✅ Check database user credentials in Atlas
- ✅ Make sure password doesn't have special characters (or URL encode them)

### "Connection timeout"
- ✅ Check your internet connection (Atlas)
- ✅ Verify IP address is whitelisted in Atlas Network Access
- ✅ Check firewall settings

---

## 📝 Quick Reference

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/ehm_travel
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

---

## 🎯 Recommended: MongoDB Atlas

**Why use Atlas?**
- ✅ Free tier available
- ✅ No installation needed
- ✅ Works immediately
- ✅ Cloud-based (accessible from anywhere)
- ✅ Automatic backups
- ✅ Easy to scale

**Free Tier Includes:**
- 512 MB storage
- Shared RAM
- Perfect for development

---

Need help? Check the main README.md or MongoDB documentation.

