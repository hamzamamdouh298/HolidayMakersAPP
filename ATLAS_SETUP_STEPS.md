# 🚀 MongoDB Atlas Setup - Step by Step

## Step 1: Create Account & Cluster

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with your email (or use Google/GitHub)
3. **Fill in:**
   - First Name
   - Last Name
   - Email
   - Password
4. **Click "Get started free"**

## Step 2: Create Free Cluster

1. **Choose:** "Build a Database"
2. **Select:** "FREE" (M0 Sandbox) - it's free forever
3. **Cloud Provider:** Choose any (AWS, Google Cloud, or Azure)
4. **Region:** Choose closest to you (e.g., `us-east-1` for US)
5. **Cluster Name:** Leave default or name it `ehm-cluster`
6. **Click:** "Create Cluster" (takes 1-3 minutes)

## Step 3: Create Database User

1. **Click:** "Database Access" in left sidebar
2. **Click:** "Add New Database User" button
3. **Authentication Method:** Password
4. **Username:** `ehmadmin` (or your choice)
5. **Password:** `ehm123456` (or create your own - **REMEMBER THIS!**)
6. **Database User Privileges:** 
   - Select: "Read and write to any database"
7. **Click:** "Add User"

## Step 4: Allow Network Access

1. **Click:** "Network Access" in left sidebar
2. **Click:** "Add IP Address" button
3. **Choose:** "Allow Access from Anywhere" (for development)
   - This adds `0.0.0.0/0` to whitelist
4. **Click:** "Confirm"

## Step 5: Get Connection String

1. **Go back to:** "Database" (left sidebar)
2. **Click:** "Connect" button on your cluster
3. **Choose:** "Connect your application"
4. **Driver:** Node.js
5. **Version:** 5.5 or later
6. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://ehmadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

**Important:** Replace `<password>` with your actual password!

**Example connection string:**
```
mongodb+srv://ehmadmin:ehm123456@cluster0.abc123.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

**What to change:**
- Replace `<password>` with your password (ehm123456 in example)
- Add `/ehm_travel` before the `?` (this is the database name)
- Keep everything else the same

**Final format:**
```
MONGODB_URI=mongodb+srv://ehmadmin:ehm123456@cluster0.abc123.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

---

## ✅ After Setup

1. **Update** `backend/.env` file with your connection string
2. **Run seed:**
   ```powershell
   cd backend
   npm run seed
   ```
3. **Start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running on port 5000
```

---

## 🆘 Common Issues

**"Authentication failed"**
- Check username and password in connection string
- Make sure password doesn't have special characters (or URL encode them)

**"IP not whitelisted"**
- Go to Network Access in Atlas
- Make sure "Allow Access from Anywhere" is added

**"Connection timeout"**
- Check internet connection
- Verify cluster is running (green status in Atlas)

---

## 📝 Quick Checklist

- [ ] Account created
- [ ] Free cluster created
- [ ] Database user created (username/password)
- [ ] Network access allowed (0.0.0.0/0)
- [ ] Connection string copied
- [ ] .env file updated with connection string
- [ ] Database seeded (`npm run seed`)
- [ ] Backend started (`npm run dev`)

---

**Need help?** Once you have your connection string, I can help you update the .env file!

