# API Documentation

## Base URL

```
http://localhost:5000/api
```

Production: `https://your-api-domain.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {token}
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Description of response",
  "data": { ... },
  "errors": [ ... ]
}
```

## Status Codes

- `200 OK`: Successful GET, PUT request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234801234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "USR123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "USR123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "profilePicture": null
  }
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer {token}
```

### Refresh Token

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

---

## User Endpoints

### Get User Profile

```http
GET /users/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "user_id": "USR123456",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+234801234567",
    "role": "user",
    "profile_picture": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Update User Profile

```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+234802345678",
  "profilePicture": "url_to_image"
}
```

### Get Notifications

```http
GET /users/notifications?page=1&limit=10&isRead=false
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10
- `isRead` (optional): Filter by read status

### Mark Notification as Read

```http
PATCH /users/notifications/{notificationId}
Authorization: Bearer {token}
```

---

## Booking Endpoints

### Create Booking

```http
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "pickupLocation": "Main Gate",
  "pickupLat": 12.456,
  "pickupLng": 4.567,
  "dropoffLocation": "Library",
  "dropoffLat": 12.458,
  "dropoffLng": 4.569,
  "scheduledTime": "2024-01-15T10:00:00Z",
  "distance": 2.5,
  "duration": 15,
  "fare": 750
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "bookingId": "BK1705313100500",
  "fare": 750,
  "driver": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+234801234567",
    "rating": 4.8
  }
}
```

### Get Bookings

```http
GET /bookings?status=pending&page=1&limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): pending, confirmed, in_progress, completed, cancelled, no_show
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": 1,
      "booking_id": "BK1705313100500",
      "user_id": 1,
      "driver_id": 2,
      "pickup_location": "Main Gate",
      "dropoff_location": "Library",
      "scheduled_time": "2024-01-15T10:00:00Z",
      "distance_km": 2.5,
      "duration_minutes": 15,
      "fare_amount": 750,
      "status": "pending",
      "driver_first_name": "John",
      "driver_last_name": "Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Get Booking Details

```http
GET /bookings/{bookingId}
Authorization: Bearer {token}
```

### Update Booking Status

```http
PATCH /bookings/{bookingId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Cancel Booking

```http
PUT /bookings/{bookingId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

---

## Driver Endpoints

### Get Driver Profile

```http
GET /drivers/profile
Authorization: Bearer {token}
```

### Get Assigned Rides

```http
GET /drivers/assigned-rides?status=confirmed&page=1&limit=10
Authorization: Bearer {token}
```

### Update Driver Location

```http
PUT /drivers/location
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 12.456,
  "longitude": 4.567
}
```

### Update Ride Status

```http
PUT /drivers/rides/{bookingId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress"
}
```

### Update Driver Status

```http
PUT /drivers/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "available|busy|offline|on_break"
}
```

---

## Admin Endpoints

### Get Admin Dashboard

```http
GET /admin/dashboard
Authorization: Bearer {token}
```

**Requires Role:** admin

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "totalUsers": 1234,
    "totalDrivers": 45,
    "totalVehicles": 50,
    "bookingsToday": 156,
    "revenueToday": 125000
  }
}
```

### Get All Users

```http
GET /admin/users?page=1&limit=10&search=john
Authorization: Bearer {token}
```

### Get All Bookings

```http
GET /admin/bookings?status=completed&page=1&limit=10
Authorization: Bearer {token}
```

### Deactivate User

```http
PATCH /admin/users/{userId}/deactivate
Authorization: Bearer {token}
```

### Get Reports

```http
GET /admin/reports?period=month
Authorization: Bearer {token}
```

**Query Parameters:**
- `period`: day, week, month

**Response:**
```json
{
  "success": true,
  "reports": {
    "total_bookings": 450,
    "completed": 420,
    "cancelled": 25,
    "no_show": 5,
    "total_revenue": 315000
  }
}
```

---

## Map Endpoints

### Get Directions

```http
GET /maps/directions?origin=Main Gate&destination=Library
Authorization: Bearer {token}
```

### Calculate Distance

```http
GET /maps/distance?origin=Main Gate&destination=Library
Authorization: Bearer {token}
```

---

## Error Responses

### Invalid Request

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Forbidden

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

---

## Rate Limiting

API requests are rate limited:
- **Standard**: 100 requests per 15 minutes per IP
- **Admin**: 200 requests per 15 minutes per IP

When rate limited, you'll receive:
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Webhooks

### Booking Status Changed

```http
POST {WEBHOOK_URL}
Content-Type: application/json

{
  "event": "booking.status_changed",
  "bookingId": "BK1705313100500",
  "oldStatus": "pending",
  "newStatus": "confirmed",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Code Examples

### JavaScript/Node.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Login
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return data;
};

// Book ride
const bookRide = async (bookingData) => {
  const { data } = await api.post('/bookings', bookingData);
  return data;
};
```

### Python

```python
import requests

API_URL = 'http://localhost:5000/api'

# Login
response = requests.post(f'{API_URL}/auth/login', json={
    'email': 'user@example.com',
    'password': 'SecurePass123'
})
token = response.json()['token']

# Book ride
headers = {'Authorization': f'Bearer {token}'}
booking = requests.post(f'{API_URL}/bookings', headers=headers, json={
    'pickupLocation': 'Main Gate',
    'dropoffLocation': 'Library',
    'scheduledTime': '2024-01-15T10:00:00Z',
    'distance': 2.5,
    'duration': 15,
    'fare': 750
})
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'

# Book ride (using token from login)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation":"Main Gate",
    "pickupLat":12.456,
    "pickupLng":4.567,
    "dropoffLocation":"Library",
    "dropoffLat":12.458,
    "dropoffLng":4.569,
    "scheduledTime":"2024-01-15T10:00:00Z",
    "distance":2.5,
    "duration":15,
    "fare":750
  }'
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Validate input** on both client and server
3. **Store tokens securely** (use httpOnly cookies)
4. **Implement token refresh** for long-lived sessions
5. **Use pagination** for large datasets
6. **Handle errors gracefully** with proper error codes
7. **Log API usage** for debugging
8. **Rate limit** to prevent abuse

---

For support, contact: support@waziriumaru.edu.ng
