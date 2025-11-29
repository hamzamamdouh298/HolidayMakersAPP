# Quick Start Guide - EHM Backend API

Get your backend up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create Environment File

Copy the example environment file:

```bash
# Windows
copy env.example .env

# Linux/Mac
cp env.example .env
```

Edit `.env` and update if needed (default values work for local development):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ehm_travel
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
- If installed as service: MongoDB runs automatically
- If not: Run `mongod` in a separate terminal

**Linux/Mac:**
```bash
sudo systemctl start mongod
# or
mongod
```

**Using MongoDB Atlas (Cloud):**
- Create a free cluster at https://cloud.mongodb.com
- Get your connection string
- Update `MONGODB_URI` in `.env`

## Step 4: Seed the Database

Initialize with default roles and users:

```bash
npm run seed
```

You'll see:
```
✓ Seed data created successfully!

Default Users:
  Admin:   username: admin   | password: admin123
  Manager: username: manager | password: manager123
  User:    username: user    | password: user123
```

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

## Step 6: Test the API

Open a browser or use curl to test:

**Health Check:**
```
http://localhost:5000/api/health
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

You'll get a token. Use it for protected routes:

```bash
curl http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Users

After seeding, you have three users:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin | admin123 | Administrator | Full Access |
| manager | manager123 | Manager | Manage reservations & reports |
| user | user123 | User | View & create reservations |

## Common Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed database
npm run seed
```

## Troubleshooting

**"MongoDB connection failed"**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Try: `mongod` in a new terminal

**"Port 5000 already in use"**
- Change PORT in .env to another number (e.g., 5001)
- Or stop the process using port 5000

**"Module not found"**
- Run `npm install` again
- Delete node_modules and run `npm install`

## Next Steps

1. ✅ Test all endpoints using the API documentation
2. ✅ Connect your React frontend
3. ✅ Customize roles and permissions
4. ✅ Add more users through the frontend

## API Endpoints Summary

- **Auth:** `/api/auth` - login, register, logout
- **Users:** `/api/users` - user management
- **Roles:** `/api/roles` - role management
- **Reservations:** `/api/reservations` - reservation management

Full documentation: See `README.md`

## Need Help?

Check the main README.md for detailed documentation and API examples.

Happy coding! 🚀

