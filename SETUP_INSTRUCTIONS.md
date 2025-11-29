# Setup Instructions - Getting Started on Your Computer

This guide will help you set up and run the EHM Travel Management System on your computer.

## ✅ What Has Been Done

1. ✅ Created `.env` file in the `backend` directory
2. ✅ Reinstalled backend dependencies
3. ✅ Reinstalled frontend dependencies

## 📋 Prerequisites

Before running the project, make sure you have:

1. **Node.js** installed (v14 or higher)
   - Check by running: `node --version`
   - Download from: https://nodejs.org/

2. **MongoDB** installed and running
   - **Option A: Local MongoDB**
     - Download from: https://www.mongodb.com/try/download/community
     - Make sure MongoDB service is running
   - **Option B: MongoDB Atlas (Cloud - Free)**
     - Sign up at: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get your connection string

## 🚀 Step-by-Step Setup

### Step 1: Configure MongoDB Connection

Open `backend/.env` and update the MongoDB connection:

**For Local MongoDB (default):**
```env
MONGODB_URI=mongodb://localhost:27017/ehm_travel
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ehm_travel
```
Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### Step 2: Seed the Database (First Time Only)

Open a terminal in the `backend` directory and run:

```bash
cd backend
npm run seed
```

This will create default users:
- **Admin:** username: `admin`, password: `admin123`
- **Manager:** username: `manager`, password: `manager123`
- **User:** username: `user`, password: `user123`

### Step 3: Start the Backend Server

In the `backend` directory, run:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

### Step 4: Start the Frontend (In a New Terminal)

Open a **new terminal** window, navigate to the `my-app` directory, and run:

```bash
cd my-app
npm start
```

The React app will open automatically in your browser at `http://localhost:3000`

## 🔐 Default Login Credentials

After seeding the database, you can login with:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator (Full Access) |
| manager | manager123 | Manager |
| user | user123 | Regular User |

## 📝 Important Notes

1. **Keep both terminals open** - You need both backend and frontend running simultaneously
2. **MongoDB must be running** - The backend won't start without a MongoDB connection
3. **Ports in use:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`
   - Make sure these ports are not used by other applications

## 🛠️ Troubleshooting

### "MongoDB connection failed"
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `backend/.env`
- For local MongoDB, try running `mongod` in a separate terminal

### "Port 5000 already in use"
- Change `PORT=5000` to another port (e.g., `PORT=5001`) in `backend/.env`
- Update `API_URL` in `my-app/src/services/api.js` to match the new port

### "Module not found" errors
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check that `CLIENT_URL` in `backend/.env` matches your frontend URL
- Check that `API_URL` in `my-app/src/services/api.js` is `http://localhost:5000/api`

## 📁 Project Structure

```
ree/
├── backend/          # Node.js/Express API
│   ├── .env         # Environment variables (configure this!)
│   ├── server.js    # Backend entry point
│   └── ...
├── my-app/          # React frontend
│   ├── src/
│   └── ...
└── SETUP_INSTRUCTIONS.md  # This file
```

## 🎯 Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd my-app
npm start
```

## ✅ Verification

1. Backend is running: Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"success","message":"EHM Travel API is running"}`

2. Frontend is running: Visit `http://localhost:3000`
   - Should show the login page

3. Login: Use `admin` / `admin123` to access the system

## 🔒 Security Note

**Important:** Change the default passwords and JWT_SECRET before using in production!

---

Need help? Check the `backend/README.md` and `backend/QUICK_START.md` for more detailed information.

