# 🔧 Quick MongoDB Fix

## ⚡ Fastest Solution: MongoDB Atlas (5 minutes)

### Step 1: Create Free Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (free)

### Step 2: Create Cluster
1. Click **"Build a Database"**
2. Choose **"FREE"** (M0)
3. Click **"Create"**

### Step 3: Create Database User
1. Click **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Username: `ehmadmin`
4. Password: `ehm123456` (remember this!)
5. Click **"Add User"**

### Step 4: Allow Network Access
1. Click **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** (left menu)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string

### Step 6: Update .env File

Open `backend/.env` and replace the `MONGODB_URI` line:

**Your connection string will look like:**
```
mongodb+srv://ehmadmin:ehm123456@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

**Important:** 
- Replace `ehm123456` with your actual password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Make sure `/ehm_travel` is in the path (before the `?`)

### Step 7: Restart Backend
```powershell
cd backend
npm run seed
npm run dev
```

---

## 🖥️ Alternative: Install MongoDB Locally

If you prefer local MongoDB:

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install:** Run installer, choose "Complete"
3. **Start:** MongoDB should run as Windows service automatically
4. **Verify:** Check if port 27017 is listening

Your `.env` should have:
```env
MONGODB_URI=mongodb://localhost:27017/ehm_travel
```

---

## ✅ After Setup

1. **Seed Database:**
   ```powershell
   cd backend
   npm run seed
   ```

2. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

3. **You should see:**
   ```
   MongoDB Connected: cluster0.xxxxx.mongodb.net
   Server is running on port 5000
   ```

---

## 🆘 Still Having Issues?

- Check your connection string format
- Verify username/password are correct
- Make sure IP is whitelisted in Atlas
- Check internet connection (for Atlas)

