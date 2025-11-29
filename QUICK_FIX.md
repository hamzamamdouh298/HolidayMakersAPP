# Quick Fix - Get Running in 5 Minutes

## The Problem
- ✅ Port 5000 conflict - **FIXED**
- ❌ MongoDB not running - **NEEDS YOUR ACTION**

## Fastest Solution: MongoDB Atlas (Cloud)

### Step 1: Get MongoDB Atlas Connection String (3 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create FREE cluster
4. Create database user (username + password)
5. Allow access from anywhere
6. Get connection string (click "Connect" → "Connect your application")

### Step 2: Update .env File (1 minute)

Open `backend/.env` and change this line:

**FROM:**
```
MONGODB_URI=mongodb://localhost:27017/ehm_travel
```

**TO:**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

Replace:
- `YOUR_USERNAME` with your Atlas username
- `YOUR_PASSWORD` with your Atlas password  
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 3: Test & Run (1 minute)

```bash
# Test connection
cd backend
node test-db-connection.js

# If successful, seed database
npm run seed

# Start server
npm run dev
```

### Step 4: Start Frontend (new terminal)

```bash
cd my-app
npm start
```

---

## That's It! 🎉

Your app should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Login with: `admin` / `admin123`

---

**Need help?** See `FIX_ERRORS.md` for detailed instructions.

