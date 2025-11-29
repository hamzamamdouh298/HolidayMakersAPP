# Statistics API Documentation

## Base URL
```
http://localhost:5000/api/statistics
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Get General Statistics

**Endpoint:** `GET /api/statistics`

**Description:** Retrieves comprehensive statistics including overview, reservations, users, financial data, and trends.

**Authentication:** Required

**Request:**
```http
GET /api/statistics HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "overview": {
      "totalReservations": 235,
      "activeReservations": 142,
      "totalUsers": 45,
      "activeUsers": 38
    },
    "reservations": {
      "byStatus": [
        { "_id": "Pending", "count": 75 },
        { "_id": "In Progress", "count": 45 },
        { "_id": "Completed", "count": 95 },
        { "_id": "Cancelled", "count": 20 }
      ],
      "byConfirmStatus": [
        { "_id": "Confirmed", "count": 180 },
        { "_id": "UnConfirmed", "count": 55 }
      ],
      "byType": [
        { "_id": "individual", "count": 120 },
        { "_id": "corporate", "count": 80 },
        { "_id": "government", "count": 25 },
        { "_id": "travel_agent", "count": 10 }
      ],
      "byCurrency": [
        { "_id": "EGP", "count": 150 },
        { "_id": "USD", "count": 60 },
        { "_id": "EUR", "count": 25 }
      ],
      "byBranch": [
        { "_id": "Main Branch", "count": 140 },
        { "_id": "Branch 1", "count": 65 },
        { "_id": "Branch 2", "count": 30 }
      ]
    },
    "trends": {
      "monthly": [
        { "_id": { "year": 2024, "month": 5 }, "count": 32 },
        { "_id": { "year": 2024, "month": 6 }, "count": 38 },
        { "_id": { "year": 2024, "month": 7 }, "count": 45 },
        { "_id": { "year": 2024, "month": 8 }, "count": 52 },
        { "_id": { "year": 2024, "month": 9 }, "count": 48 },
        { "_id": { "year": 2024, "month": 10 }, "count": 20 }
      ]
    },
    "recent": [
      {
        "_id": "67123abc...",
        "fileNumber": "F-0123",
        "client": "John Doe",
        "date": "2024-10-20T10:30:00.000Z",
        "amount": "5000",
        "progress": "Pending",
        "confirmStatus": "Confirmed",
        "user": {
          "_id": "60d5ec49f...",
          "fullName": "Ahmed Ali",
          "username": "ahmed_ali"
        }
      }
      // ... more reservations
    ],
    "users": {
      "byDepartment": [
        { "_id": "Sales", "count": 20 },
        { "_id": "Accounting", "count": 12 },
        { "_id": "Operation", "count": 13 }
      ],
      "byBranch": [
        { "_id": "Main Branch", "count": 25 },
        { "_id": "Branch 1", "count": 12 },
        { "_id": "Branch 2", "count": 8 }
      ],
      "topPerformers": [
        {
          "_id": "60d5ec49f...",
          "reservationCount": 125,
          "fullName": "Ahmed Ali",
          "username": "ahmed_ali",
          "branch": "Main Branch"
        },
        {
          "_id": "60d5ec50f...",
          "reservationCount": 98,
          "fullName": "Sara Ahmed",
          "username": "sara_ahmed",
          "branch": "Branch 1"
        }
        // ... top 5 performers
      ]
    },
    "financial": {
      "totalsByCurrency": [
        { "_id": "EGP", "total": 1250000.50 },
        { "_id": "USD", "total": 125000.00 },
        { "_id": "EUR", "total": 45000.75 }
      ]
    },
    "destinations": [
      { "_id": "Dubai", "count": 45 },
      { "_id": "Cairo", "count": 38 },
      { "_id": "Mecca", "count": 32 },
      { "_id": "Paris", "count": 28 },
      { "_id": "London", "count": 22 }
      // ... top 10 destinations
    ]
  }
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "status": "error",
  "message": "Failed to get statistics",
  "error": "Database connection error"
}
```

---

### 2. Get Reservation Statistics (with Date Filter)

**Endpoint:** `GET /api/statistics/reservations`

**Description:** Retrieves reservation statistics with optional date range filtering.

**Authentication:** Required

**Query Parameters:**
- `startDate` (optional): ISO date string (e.g., "2024-01-01")
- `endDate` (optional): ISO date string (e.g., "2024-12-31")

**Request:**
```http
GET /api/statistics/reservations?startDate=2024-01-01&endDate=2024-10-31 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "totalCount": 235,
    "statusBreakdown": [
      { "_id": "Pending", "count": 75 },
      { "_id": "In Progress", "count": 45 },
      { "_id": "Completed", "count": 95 },
      { "_id": "Cancelled", "count": 20 }
    ],
    "typeBreakdown": [
      { "_id": "individual", "count": 120 },
      { "_id": "corporate", "count": 80 },
      { "_id": "government", "count": 25 },
      { "_id": "travel_agent", "count": 10 }
    ]
  }
}
```

**Example with No Date Filter:**
```http
GET /api/statistics/reservations HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*Returns statistics for all reservations regardless of date.*

---

### 3. Get User Performance

**Endpoint:** `GET /api/statistics/user/:userId?`

**Description:** Retrieves performance statistics for a specific user or the currently logged-in user.

**Authentication:** Required

**URL Parameters:**
- `userId` (optional): MongoDB ObjectId of the user. If omitted, returns stats for the authenticated user.

**Request (Specific User):**
```http
GET /api/statistics/user/60d5ec49f1b2c8e4f8a1b2c3 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request (Current User):**
```http
GET /api/statistics/user HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "reservationCount": 125,
    "reservationsByStatus": [
      { "_id": "Pending", "count": 30 },
      { "_id": "In Progress", "count": 25 },
      { "_id": "Completed", "count": 60 },
      { "_id": "Cancelled", "count": 10 }
    ],
    "recentActivity": [
      {
        "_id": "67123abc...",
        "fileNumber": "F-0150",
        "client": "John Smith",
        "date": "2024-10-25T14:30:00.000Z",
        "amount": "8500",
        "progress": "In Progress"
      },
      {
        "_id": "67123def...",
        "fileNumber": "F-0149",
        "client": "Jane Doe",
        "date": "2024-10-24T11:20:00.000Z",
        "amount": "6200",
        "progress": "Completed"
      }
      // ... last 5 reservations
    ]
  }
}
```

---

## Frontend Usage Examples

### Using the Statistics API Service

```javascript
import { statisticsAPI } from './services/api';

// Example 1: Get general statistics
async function loadStatistics() {
  try {
    const response = await statisticsAPI.getGeneral();
    if (response.status === 'success') {
      console.log('Overview:', response.data.overview);
      console.log('Reservations:', response.data.reservations);
      console.log('Trends:', response.data.trends);
    }
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}

// Example 2: Get reservation statistics with date filter
async function loadFilteredStats() {
  try {
    const startDate = '2024-01-01';
    const endDate = '2024-10-31';
    const response = await statisticsAPI.getReservationStats(startDate, endDate);
    
    if (response.status === 'success') {
      console.log('Total Count:', response.data.totalCount);
      console.log('Status Breakdown:', response.data.statusBreakdown);
    }
  } catch (error) {
    console.error('Failed to load filtered stats:', error);
  }
}

// Example 3: Get current user's performance
async function loadMyPerformance() {
  try {
    const response = await statisticsAPI.getUserPerformance();
    
    if (response.status === 'success') {
      console.log('My Reservations:', response.data.reservationCount);
      console.log('By Status:', response.data.reservationsByStatus);
      console.log('Recent Activity:', response.data.recentActivity);
    }
  } catch (error) {
    console.error('Failed to load performance:', error);
  }
}

// Example 4: Get specific user's performance (managers/admins)
async function loadUserPerformance(userId) {
  try {
    const response = await statisticsAPI.getUserPerformance(userId);
    
    if (response.status === 'success') {
      console.log(`User ${userId} Reservations:`, response.data.reservationCount);
    }
  } catch (error) {
    console.error('Failed to load user performance:', error);
  }
}
```

### Using Fetch Directly

```javascript
// Get general statistics
const getStatistics = async () => {
  const token = localStorage.getItem('ehm_token');
  
  const response = await fetch('http://localhost:5000/api/statistics', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
};

// Get filtered reservation statistics
const getReservationStats = async (startDate, endDate) => {
  const token = localStorage.getItem('ehm_token');
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(
    `http://localhost:5000/api/statistics/reservations?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  return data;
};
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error message (in development mode only)"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have permission to access this resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

**Example Error Handling:**
```javascript
try {
  const response = await statisticsAPI.getGeneral();
  if (response.status === 'success') {
    // Handle success
  }
} catch (error) {
  if (error.message.includes('401')) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Show permission denied message
    alert('You do not have permission to view statistics');
  } else {
    // Show generic error
    alert('Failed to load statistics. Please try again.');
  }
}
```

---

## Performance Considerations

### Caching
The statistics data is calculated in real-time. For production environments, consider:
- Implementing Redis cache with TTL (Time To Live)
- Caching results for 5-15 minutes
- Invalidating cache when new data is added

### Rate Limiting
Consider implementing rate limiting for statistics endpoints:
- Max 60 requests per minute per user
- Use middleware like `express-rate-limit`

### Optimization
The controller uses MongoDB aggregation pipelines for optimal performance:
- Indexed fields: `fileNumber`, `client`, `date`, `isDeleted`
- Efficient grouping and sorting
- Limited result sets where appropriate

---

## Testing with cURL

### Get General Statistics
```bash
curl -X GET http://localhost:5000/api/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Filtered Reservation Statistics
```bash
curl -X GET "http://localhost:5000/api/statistics/reservations?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User Performance
```bash
curl -X GET http://localhost:5000/api/statistics/user/60d5ec49f1b2c8e4f8a1b2c3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **Authorization**: Users can only see statistics they have permission to view
3. **Data Privacy**: Sensitive user data is not exposed
4. **Input Validation**: All date parameters are validated
5. **SQL Injection Prevention**: MongoDB queries are parameterized

---

## Support & Maintenance

For issues or questions:
1. Check server logs: `backend/logs/`
2. Verify MongoDB connection
3. Ensure all dependencies are installed: `npm install`
4. Check environment variables in `.env`

**Last Updated:** October 27, 2025
**API Version:** 1.0.0

