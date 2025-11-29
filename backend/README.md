# EHM Travel Management System - Backend API

A robust Node.js/Express REST API for the EHM Travel Management System with MongoDB database, JWT authentication, and role-based access control.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - Complete CRUD operations for users
- 🎭 **Role-Based Access Control** - Fine-grained permissions system
- 📅 **Reservation Management** - Full reservation lifecycle management
- 🔍 **Advanced Filtering** - Search, filter, and pagination support
- 📊 **Statistics & Reports** - Real-time analytics
- 🛡️ **Security** - Password hashing, input validation, and protected routes

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **CORS:** Enabled for frontend integration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - Local installation or MongoDB Atlas account
- npm or yarn package manager

## Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory (copy from `env.example`):

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ehm_travel

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running:

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** - Update `MONGODB_URI` in `.env` with your connection string.

### 5. Seed Database

Initialize the database with default roles and users:

```bash
node scripts/seedData.js
```

This creates:
- **Admin User:** username: `admin`, password: `admin123`
- **Manager User:** username: `manager`, password: `manager123`
- **Regular User:** username: `user`, password: `user123`

### 6. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout user | Private |
| PUT | `/updatepassword` | Update password | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/` | Get all users | viewUsers |
| GET | `/:id` | Get single user | viewUsers |
| POST | `/` | Create user | createUsers |
| PUT | `/:id` | Update user | editUsers |
| DELETE | `/:id` | Delete user | deleteUsers |
| POST | `/bulk-delete` | Delete multiple users | deleteUsers |

### Role Routes (`/api/roles`)

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/` | Get all roles | viewRoles |
| GET | `/:id` | Get single role | viewRoles |
| POST | `/` | Create role | createRoles |
| PUT | `/:id` | Update role | editRoles |
| DELETE | `/:id` | Delete role | deleteRoles |

### Reservation Routes (`/api/reservations`)

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/` | Get all reservations | viewReservations |
| GET | `/stats` | Get statistics | viewReservations |
| GET | `/:id` | Get single reservation | viewReservations |
| POST | `/` | Create reservation | createReservations |
| PUT | `/:id` | Update reservation | editReservations |
| DELETE | `/:id` | Delete reservation | deleteReservations |
| POST | `/:id/duplicate` | Duplicate reservation | createReservations |
| POST | `/bulk-delete` | Delete multiple reservations | deleteReservations |

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Get All Reservations (Protected)
```bash
curl http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileNumber": "30123456",
    "client": "John Doe",
    "phone": "+201234567890",
    "currency": "EGP",
    "branch": "Main Branch"
  }'
```

## Database Schema

### User Model
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- fullName (String)
- phone (String)
- role (Reference to Role)
- branch (String)
- department (String)
- isActive (Boolean)

### Role Model
- name (String, unique)
- displayName (String)
- description (String)
- permissions (Object with boolean flags)
- isSystem (Boolean)
- isActive (Boolean)

### Reservation Model
- fileNumber (String, unique)
- client (String)
- phone (String)
- date (Date)
- followUp (String)
- amount (String)
- user (Reference to User)
- branch (String)
- salesOfficer (String)
- progress (String: Pending/In Progress/Complete/Cancelled)
- confirmStatus (String: Confirmed/UnConfirmed)
- type (String: individual/corporate/government/etc.)
- currency (String)
- notes (String)
- isDeleted (Boolean - soft delete)

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── roleController.js    # Role management
│   └── reservationController.js # Reservation management
├── middleware/
│   └── auth.js              # Authentication & authorization
├── models/
│   ├── User.js              # User schema
│   ├── Role.js              # Role schema
│   └── Reservation.js       # Reservation schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── roleRoutes.js        # Role endpoints
│   └── reservationRoutes.js # Reservation endpoints
├── scripts/
│   └── seedData.js          # Database seeding
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env                     # Environment variables (create this)
├── env.example              # Environment template
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # This file
```

## Security Best Practices

1. **Change Default Credentials** - Immediately change default user passwords in production
2. **Use Strong JWT Secret** - Generate a strong random string for `JWT_SECRET`
3. **Enable HTTPS** - Use HTTPS in production
4. **Rate Limiting** - Consider adding rate limiting for API endpoints
5. **Input Validation** - All inputs are validated before processing
6. **Password Hashing** - Passwords are hashed using bcrypt

## Development

### Running with Auto-Reload
```bash
npm run dev
```

### Testing API Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "EHM Travel API is running",
  "timestamp": "2025-10-27T..."
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify network connectivity

### Authentication Errors
- Verify JWT_SECRET is set correctly
- Check token expiration
- Ensure Bearer token is included in headers

### Permission Denied
- Check user role and permissions
- Verify the route requires the correct permission
- Review role configuration

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Enable HTTPS
5. Use MongoDB Atlas for cloud database
6. Set up logging and monitoring
7. Implement rate limiting
8. Regular backups

## Support

For issues or questions, please contact the development team.

## License

ISC

