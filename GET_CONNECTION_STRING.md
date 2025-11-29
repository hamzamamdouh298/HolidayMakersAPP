# 🔗 How to Get MongoDB Atlas Connection String

## Step-by-Step Instructions

### Step 1: Log in to MongoDB Atlas
1. Go to: **https://cloud.mongodb.com/**
2. Log in with your account (email/password)

### Step 2: Select Your Cluster
1. You'll see your clusters on the dashboard
2. Click on your cluster (or create one if you don't have any)

### Step 3: Get Connection String
1. Click the **"Connect"** button on your cluster
2. A popup will appear with connection options
3. Choose **"Connect your application"** (or "Drivers")
4. Select:
   - **Driver:** Node.js
   - **Version:** 5.5 or later (or latest)
5. You'll see a connection string that looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 4: Copy the Connection String
1. Click the **copy icon** (📋) next to the connection string
2. Or manually select and copy the entire string

### Step 5: Important - Add Database Name
The connection string you get will have `<password>` - you need to:
1. Replace `<password>` with your actual database user password
2. Add `/ehm_travel` before the `?` (this is your database name)

**Example:**
- **What you get:**
  ```
  mongodb+srv://ehmadmin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
  ```

- **What you need (after replacing password and adding database):**
  ```
  mongodb+srv://ehmadmin:yourpassword123@cluster0.abc123.mongodb.net/ehm_travel?retryWrites=true&w=majority
  ```

---

## 📸 Visual Guide

1. **Dashboard** → See your cluster
2. **Click "Connect"** → On your cluster card
3. **Choose "Connect your application"**
4. **Copy the string** → Click copy icon
5. **Replace `<password>`** → With your actual password
6. **Add `/ehm_travel`** → Before the `?`

---

## 🔑 Don't Have Database User Password?

If you forgot your database user password:

1. Go to **"Database Access"** (left sidebar)
2. Find your user
3. Click **"Edit"** or **"..."** menu
4. Click **"Edit Password"**
5. Set a new password (remember it!)
6. Use this password in your connection string

---

## ✅ Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Found your cluster
- [ ] Clicked "Connect"
- [ ] Selected "Connect your application"
- [ ] Copied the connection string
- [ ] Replaced `<password>` with actual password
- [ ] Added `/ehm_travel` before the `?`

---

## 🆘 Can't Find Your Cluster?

**If you don't see any clusters:**
1. Click **"Build a Database"** or **"Create"**
2. Choose **"FREE"** (M0) tier
3. Select region and create
4. Wait 1-3 minutes for it to deploy
5. Then follow steps above

---

## 📝 Once You Have It

Paste your complete connection string here and I'll:
1. ✅ Update the `.env` file
2. ✅ Seed the database
3. ✅ Start both servers

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ehm_travel?retryWrites=true&w=majority
```

---

**Need help?** If you're stuck at any step, let me know which step you're on!

