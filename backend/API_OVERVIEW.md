# EHM Travel Management System - Complete Backend API

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Quick Setup](#quick-setup)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Permission System](#permission-system)

## Overview

A complete Node.js backend API with MongoDB for managing travel reservations, users, and roles with enterprise-grade security and features.

## Architecture

```
Client (React App) → Express API → MongoDB Database
                  ↓
              JWT Auth + RBAC
```

### Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4.x
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, CORS, input validation

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Protected routes

✅ **User Management**
- Create, read, update, delete users
- User profiles with roles
- Bulk operations
- Search and filtering

✅ **Role Management**
- Custom roles with granular permissions
- System roles (protected)
- Permission inheritance

✅ **Reservation Management**
- Full CRUD operations
- Soft delete (data recovery)
- Duplicate reservations
- Advanced search & filtering
- Statistics and analytics
- Bulk operations

✅ **Additional Features**
- Pagination support
- Real-time statistics
- Audit trails (created by, updated by)
- Data validation
- Error handling

## Quick Setup

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file
cp env.example .env

# 3. Start MongoDB
mongod

# 4. Seed database
npm run seed

# 5. Start server
npm run dev
```

Server runs on: `http://localhost:5000`

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "username": "admin",
      "email": "admin@ehm.com",
      "fullName": "System Administrator",
      "role": {
        "name": "admin",
        "displayName": "Administrator",
        "permissions": {...}
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 2. Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+201234567890",
  "roleName": "user"
}
```

#### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

### User Endpoints

#### Get All Users
```http
GET /users?page=1&limit=20&search=john&branch=Main%20Branch
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `search` - Search in username, fullName, email
- `branch` - Filter by branch
- `role` - Filter by role name
- `isActive` - Filter by active status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Create User
```http
POST /users
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+201234567890",
  "roleName": "user",
  "branch": "Cairo Branch",
  "department": "Sales"
}
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullName": "John Updated",
  "isActive": true
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer YOUR_TOKEN
```

#### Bulk Delete Users
```http
POST /users/bulk-delete
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "userIds": ["id1", "id2", "id3"]
}
```

### Role Endpoints

#### Get All Roles
```http
GET /roles?page=1&limit=20
Authorization: Bearer YOUR_TOKEN
```

#### Create Role
```http
POST /roles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "sales",
  "displayName": "Sales Team",
  "description": "Sales department role",
  "permissions": {
    "viewReservations": true,
    "createReservations": true,
    "editReservations": true,
    "deleteReservations": false
  }
}
```

### Reservation Endpoints

#### Get All Reservations
```http
GET /reservations?page=1&limit=20&search=john&progress=Pending
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `search` - Search across multiple fields
- `fileNumber` - Filter by file number
- `client` - Filter by client name
- `progress` - Filter by progress status
- `confirmStatus` - Filter by confirmation status
- `branch` - Filter by branch
- `dateFrom` - Filter from date
- `dateTo` - Filter to date

#### Get Reservation Statistics
```http
GET /reservations/stats
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 150,
    "pending": 45,
    "inProgress": 30,
    "completed": 70,
    "confirmed": 120,
    "unconfirmed": 30
  }
}
```

#### Create Reservation
```http
POST /reservations
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fileNumber": "30123456",
  "client": "Ahmed Mohamed",
  "phone": "+201234567890",
  "date": "2025-10-27",
  "followUp": "Pending",
  "amount": "5000",
  "branch": "Main Branch",
  "salesOfficer": "John Doe",
  "progress": "Pending",
  "confirmStatus": "UnConfirmed",
  "type": "individual",
  "currency": "EGP",
  "notes": "Flight + Hotel package"
}
```

#### Update Reservation
```http
PUT /reservations/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "progress": "In Progress",
  "confirmStatus": "Confirmed",
  "notes": "Updated notes"
}
```

#### Duplicate Reservation
```http
POST /reservations/:id/duplicate
Authorization: Bearer YOUR_TOKEN
```

#### Delete Reservation (Soft Delete)
```http
DELETE /reservations/:id
Authorization: Bearer YOUR_TOKEN
```

#### Bulk Delete Reservations
```http
POST /reservations/bulk-delete
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reservationIds": ["id1", "id2", "id3"]
}
```

## Authentication Flow

1. **User Login**
   ```
   POST /api/auth/login → Returns JWT token
   ```

2. **Store Token**
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

3. **Use Token in Requests**
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Token Validation**
   - Server validates token on protected routes
   - Returns 401 if invalid/expired
   - Returns user data if valid

## Permission System

### Available Permissions

**Dashboard:**
- `viewDashboard` - Access to dashboard

**Reservations:**
- `viewReservations` - View reservations
- `createReservations` - Create new reservations
- `editReservations` - Edit existing reservations
- `deleteReservations` - Delete reservations
- `exportReservations` - Export reservation data

**Users:**
- `viewUsers` - View users
- `createUsers` - Create new users
- `editUsers` - Edit existing users
- `deleteUsers` - Delete users

**Roles:**
- `viewRoles` - View roles
- `createRoles` - Create new roles
- `editRoles` - Edit existing roles
- `deleteRoles` - Delete roles

**Reports:**
- `viewReports` - View reports
- `exportReports` - Export reports

**System:**
- `manageSettings` - Manage system settings
- `manageSystem` - Full system management

### Default Roles

**Administrator (admin)**
- ✅ All permissions enabled
- Cannot be deleted (system role)

**Manager (manager)**
- ✅ Manage reservations
- ✅ View users
- ✅ View & export reports
- ❌ Cannot manage system settings

**User (user)**
- ✅ View dashboard
- ✅ View & create reservations
- ❌ Limited edit/delete permissions

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

## Data Validation

All endpoints validate input data:
- Required fields are checked
- Email format validation
- Password minimum length (6 characters)
- Unique constraints (username, email, fileNumber)
- Enum validation for status fields

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT token securely** (httpOnly cookies recommended for production)
3. **Handle token expiration** (refresh tokens or re-login)
4. **Validate input on both client and server**
5. **Use environment variables** for sensitive data
6. **Implement rate limiting** in production
7. **Log important operations** for audit trails

## Development Tips

**Testing with curl:**
```bash
# Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.token')

# Use token
curl http://localhost:5000/api/reservations \
  -H "Authorization: Bearer $TOKEN"
```

**Testing with Postman:**
1. Import endpoints as collection
2. Set environment variable for token
3. Use {{token}} in Authorization header

## Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up logging (Winston, Morgan)
- [ ] Configure backup strategy
- [ ] Add monitoring (PM2, New Relic)
- [ ] Implement refresh tokens
- [ ] Add API documentation (Swagger)

## Support

For detailed setup instructions, see:
- `README.md` - Complete documentation
- `QUICK_START.md` - 5-minute setup guide

---

**Version:** 1.0.0  
**Last Updated:** October 2025

