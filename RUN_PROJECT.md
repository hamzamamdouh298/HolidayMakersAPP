# 🚀 How to Run the Project

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB running locally OR MongoDB Atlas account

---

## Step 1: Setup Backend

### 1.1 Environment File
✅ Already created: `backend/.env`

### 1.2 Install Dependencies (if needed)
```powershell
cd backend
npm install
```

### 1.3 Start MongoDB
**Option A: Local MongoDB**
- If MongoDB is installed as a Windows service, it should be running automatically
- If not, open a new terminal and run: `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at https://cloud.mongodb.com
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

### 1.4 Seed Database (First Time Only)
```powershell
cd backend
npm run seed
```

This creates default users:
- **Admin:** username: `admin`, password: `admin123`
- **Manager:** username: `manager`, password: `manager123`
- **User:** username: `user`, password: `user123`

### 1.5 Start Backend Server
```powershell
cd backend
npm run dev
```

Backend will run on: **http://localhost:5000**

---

## Step 2: Setup Frontend

### 2.1 Install Dependencies (if needed)
```powershell
cd my-app
npm install
```

### 2.2 Start Frontend Server
```powershell
cd my-app
npm start
```

Frontend will run on: **http://localhost:3000**

The browser should open automatically.

---

## Quick Start (Both Servers)

Open **TWO** terminal windows:

### Terminal 1 - Backend:
```powershell
cd E:\holidaymakers1-main\backend
npm run dev
```

### Terminal 2 - Frontend:
```powershell
cd E:\holidaymakers1-main\my-app
npm start
```

---

## Verify Everything Works

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should see: `{"status":"success","message":"EHM Travel API is running"}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Login page should appear
   - Login with: `admin` / `admin123`

---

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Try: `mongod` in a new terminal

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): Press `Y` when prompted to use a different port

### Module Not Found
- Delete `node_modules` folder
- Run `npm install` again

### Database Not Seeded
- Run: `cd backend && npm run seed`
- Make sure MongoDB is running first

---

## Default Login Credentials

After seeding the database:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| manager | manager123 | Manager |
| user | user123 | User |

---

## Project Structure

```
holidaymakers1-main/
├── backend/          # Node.js/Express API (Port 5000)
│   ├── .env         # Environment variables
│   └── server.js    # Entry point
│
└── my-app/          # React Frontend (Port 3000)
    └── src/
        └── App.js   # Main component
```

---

## Next Steps

1. ✅ Backend running on http://localhost:5000
2. ✅ Frontend running on http://localhost:3000
3. ✅ Login with admin credentials
4. ✅ Start using the application!

Happy coding! 🎉

