# MongoDB Setup Guide

You need a MongoDB database to run the backend. Choose one of these options:

## Option 1: MongoDB Atlas (Cloud - Free & Easy) ⭐ RECOMMENDED

### Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `ehmadmin`
   - Password: `ehm123456` (or your own)
   - User Privileges: Read and write to any database
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" (left menu)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://ehmadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update Backend .env File**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with:
   ```env
   MONGODB_URI=mongodb+srv://ehmadmin:ehm123456@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Replace the cluster URL with yours
   - Add `/ehm_travel` before the `?`

7. **Done!** Now run:
   ```bash
   cd backend
   npm run seed
   npm run dev
   ```

---

## Option 2: Local MongoDB (Windows)

### Install MongoDB Community Server:

1. **Download**
   - Go to: https://www.mongodb.com/try/download/community
   - Choose Windows
   - Download and run installer

2. **Install**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Service (check the box)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB**
   - If installed as service, it starts automatically
   - Or manually run: `mongod`

5. **Run Seed Script**
   ```bash
   cd backend
   npm run seed
   npm run dev
   ```

---

## Troubleshooting

**"Connection refused"**
- MongoDB is not running
- Check if MongoDB service is started
- Or use MongoDB Atlas (cloud)

**"Authentication failed"**
- Check username and password in connection string
- Make sure database user is created in Atlas

**"Network timeout"**
- Check IP whitelist in MongoDB Atlas
- Make sure you allowed your IP address

---

## Recommended: MongoDB Atlas (Cloud)

✅ **Advantages:**
- No local installation needed
- Free tier available
- Always accessible
- Automatic backups
- Better for development

For production, MongoDB Atlas is highly recommended!

