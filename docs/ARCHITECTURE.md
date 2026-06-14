# System Architecture

## Overview

RideBook is a comprehensive, enterprise-level ride booking and transportation management system built with modern technology stack and scalable architecture principles.

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│              Client Browser                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  React   │  │ Tailwind │  │ Framer   │ │
│  │   App    │  │   CSS    │  │ Motion   │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└──────────────────┬──────────────────────────┘
                    │ HTTPS/WSS
┌──────────────────▼──────────────────────────┐
│            CDN / Load Balancer               │
│  (Cloudflare, AWS CloudFront, etc.)          │
└──────────────────┬──────────────────────────┘
                    │
┌──────────────────▼──────────────────────────┐
│         Application Server (Node.js)         │
│  ┌──────────────────────────────────────┐   │
│  │         Express.js API Layer          │   │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐  │   │
│  │  │Auth    │ │Booking │ │Admin     │  │   │
│  │  │Ctrl    │ │Ctrl    │ │Ctrl      │  │   │
│  │  └────────┘ └────────┘ └──────────┘  │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Redis   │  │ Socket   │  │  JWT     │  │
│  │  Cache   │  │   IO     │  │  Auth    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────────────────┘
                    │
┌──────────────────▼──────────────────────────┐
│           MySQL Database Cluster             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Master  │  │  Slave   │  │  Slave   │  │
│  │          │  │  (Read)  │  │  (Read)  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│  Replication & Backup Strategy              │
└─────────────────────────────────────────────┘

External Services Integration:
- Google Maps API (Routing, Geocoding)
- Email Service (SMTP, SendGrid)
- Payment Gateway (Stripe, Paystack)
- SMS Service (Twilio, Vonage)
```

## Component Architecture

### Frontend Architecture

```
frontend/
├── Public Assets
│   ├── Fonts
│   ├── Images
│   └── Icons
│
├── Components
│   ├── Layout Components
│   │   ├── PublicLayout
│   │   └── DashboardLayout
│   ├── UI Components
│   │   ├── Button
│   │   ├── Modal
│   │   └── Card
│   └── Feature Components
│       ├── BookingForm
│       ├── RideMap
│       └── DriverTracker
│
├── Pages
│   ├── Public/
│   │   ├── LandingPage
│   │   ├── Login
│   │   ├── Register
│   │   ├── About
│   │   └── Contact
│   ├── User/
│   │   ├── Dashboard
│   │   ├── BookRide
│   │   ├── RideHistory
│   │   └── Profile
│   ├── Admin/
│   │   ├── Dashboard
│   │   ├── ManageUsers
│   │   ├── ManageDrivers
│   │   ├── ManageVehicles
│   │   ├── ManageBookings
│   │   └── ReportsAnalytics
│   └── Driver/
│       ├── Dashboard
│       ├── AssignedRides
│       ├── RideStatus
│       └── Profile
│
├── Contexts (State Management)
│   ├── AuthContext
│   └── ThemeContext
│
├── Services (API Integration)
│   ├── api.js (Base API client)
│   ├── authService.js
│   ├── bookingService.js
│   ├── userService.js
│   ├── adminService.js
│   └── driverService.js
│
└── Config
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

### Backend Architecture

```
backend/
├── Server
│   └── server.js (Express app + Socket.io)
│
├── Config
│   ├── database.js (MySQL connection pool)
│   └── constants.js
│
├── Middleware
│   ├── auth.js (JWT authentication)
│   ├── validation.js
│   └── errorHandler.js
│
├── Routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── admin.routes.js
│   ├── driver.routes.js
│   ├── booking.routes.js
│   └── map.routes.js
│
├── Controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── admin.controller.js
│   ├── driver.controller.js
│   └── booking.controller.js
│
└── Utils
    ├── helpers.js
    ├── email.js (Email sending)
    ├── fare.js (Fare calculation)
    └── validators.js
```

### Database Architecture

```sql
-- User Management Layer
users (id, email, password, role)
└── drivers (user_id, license, rating)
└── users (again for driver user details)

-- Fleet Management Layer
vehicles (id, model, capacity, status)
drivers (id, vehicle_id, status)

-- Booking Management Layer
bookings (id, booking_id, user_id, driver_id, vehicle_id)
└── ride_history (booking_id, ratings, feedback)
└── payments (booking_id, amount, status)

-- Support Systems
notifications (id, user_id, type)
activity_logs (id, user_id, action)
schedule_conflicts (id, booking_id)
```

## Technology Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3
- **Animation**: Framer Motion 10.12
- **HTTP Client**: Axios 1.4
- **Maps**: @react-google-maps/api 2.19
- **Charts**: Recharts 2.7
- **Forms**: React Hook Form 7.45
- **State**: Zustand 4.4
- **UI Components**: Headless UI 1.7

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Password**: bcryptjs 2.4
- **Real-time**: Socket.io 4.6
- **Email**: Nodemailer 6.9
- **Rate Limiting**: express-rate-limit 6.9
- **Security**: Helmet 7.0
- **Logging**: Morgan 1.10

### Infrastructure
- **Database**: MySQL 8.0+
- **Cache**: Redis (optional)
- **CDN**: Cloudflare/AWS CloudFront
- **Hosting**: AWS/DigitalOcean/Heroku
- **SSL**: Let's Encrypt

## Data Flow

### Booking Flow

```
User Interface
    ↓
[Book Ride Form]
    ↓
Frontend Validation
    ↓
POST /api/bookings
    ↓
Authentication Middleware
    ↓
Backend Validation
    ↓
Database Transaction:
  - Create booking record
  - Check driver availability
  - Assign driver
  - Update driver status
    ↓
Calculate Fare
    ↓
Create Notification
    ↓
Emit WebSocket Event
    ↓
Response to Client
    ↓
Real-time Map Update
```

### Real-time Location Update Flow

```
Driver Mobile App
    ↓
[Collect GPS Location]
    ↓
Socket.io Connection
    ↓
emit('driver-location-update')
    ↓
Backend WebSocket Handler
    ↓
Broadcast to Ride Participants
    ↓
io.to(`ride-${bookingId}`).emit()
    ↓
User/Admin Interface
    ↓
Update Map Display
```

## Authentication Flow

```
1. User Registration/Login
   ├── Frontend: POST /auth/register or /auth/login
   ├── Backend: Hash password (bcrypt)
   ├── Generate JWT token
   └── Return token + user data

2. Authenticated Requests
   ├── Frontend: Add Authorization header
   ├── Backend: Verify JWT token
   ├── Extract user info from token
   └── Process request

3. Token Refresh
   ├── Check token expiration
   ├── Generate new token if needed
   └── Update client token
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────┐
│  Request Authentication              │
└─────────────────┬───────────────────┘
                  │
            ┌─────▼────────┐
            │  JWT Verify  │
            └─────┬────────┘
                  │
        ┌─────────┴────────────┐
        │                      │
    Valid                    Invalid
        │                      │
        ▼                      ▼
  ┌──────────┐          ┌────────────┐
  │Authorize │          │Return 401  │
  │ by Role  │          │Unauthorized│
  └──────────┘          └────────────┘
```

### Data Security

- **Passwords**: Hashed with bcrypt (10 rounds)
- **Sensitive Data**: Encrypted at rest
- **API Keys**: Environment variables only
- **HTTPS**: All communications encrypted
- **SQL Injection**: Parameterized queries
- **XSS**: Helmet.js security headers

## Scalability Architecture

### Horizontal Scaling

```
Load Balancer (Nginx)
        │
    ┌───┴───┬──────────┬──────────┐
    │       │          │          │
  Server1 Server2   Server3   Server4
    │       │          │          │
    └───────┴──────────┴──────────┘
            │
        Database Pool
        (Connection Pooling)
```

### Caching Strategy

```
User Request
    │
    ▼
┌──────────────────┐
│  Cache (Redis)   │ ← Hit: Return
└──────────────────┘
    │ Miss
    ▼
┌──────────────────┐
│  Database Query  │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│ Update Cache     │
└──────────────────┘
    │
    ▼
Return to Client
```

## Performance Optimization

### Database Optimization

- Connection pooling (10 connections)
- Indexes on frequently queried fields
- Query optimization and caching
- Read replicas for scaling

### Frontend Optimization

- Code splitting by route
- Lazy loading components
- Image optimization
- CSS minification
- Gzip compression

### API Optimization

- Response pagination
- Field selection (only needed fields)
- Rate limiting
- Request compression

## Monitoring & Logging

```
Application Logs
    ├── Request logs (Morgan)
    ├── Error logs
    ├── Database query logs
    └── Business logic logs
            │
            ▼
    ┌──────────────────┐
    │  Log Aggregation │
    │  (ELK/Datadog)   │
    └──────────────────┘
            │
            ▼
    ┌──────────────────┐
    │   Dashboards     │
    │   Alerts         │
    │   Reports        │
    └──────────────────┘
```

## Disaster Recovery

### Backup Strategy

```
Production Database
    │
    ├─► Daily Backup → S3 Storage
    ├─► Binary Logs → S3 Storage
    └─► Replication → Standby Database
```

### Recovery Scenarios

1. **Database Failure**: Promote read replica
2. **Application Failure**: Auto-restart via PM2
3. **Complete Data Loss**: Restore from backup
4. **Partial Data Loss**: Point-in-time recovery

## System Limits & Quotas

| Component | Limit | Notes |
|-----------|-------|-------|
| Connection Pool | 10 | MySQL connections |
| Queue Limit | 0 | Unlimited queue |
| API Rate Limit | 100 req/15min | Per IP address |
| Max Upload | 5MB | File uploads |
| Session Timeout | 7 days | Token expiration |
| Booking Advance | 30 days | Max advance booking |

## Integration Points

### External APIs

1. **Google Maps**
   - Route calculations
   - Distance matrix
   - Geocoding

2. **Payment Gateway**
   - Card processing
   - Payment verification
   - Refunds

3. **Email Service**
   - Booking confirmations
   - Notifications
   - Reports

4. **SMS Service**
   - OTP verification
   - Ride updates
   - Driver alerts

## System Resilience

- **Circuit Breaker**: Prevent cascade failures
- **Retry Logic**: Automatic retry with backoff
- **Fallback**: Graceful degradation
- **Health Checks**: Continuous monitoring
- **Load Balancing**: Distribute traffic
- **Rate Limiting**: Prevent overload

## Future Enhancements

1. **Machine Learning**
   - Predictive pricing
   - Route optimization
   - Demand forecasting

2. **Mobile Apps**
   - Native iOS app
   - Native Android app
   - Push notifications

3. **Analytics**
   - Advanced reporting
   - Custom dashboards
   - Real-time insights

4. **AI/Chatbot**
   - Customer support
   - Booking assistant
   - Automated responses

---

For detailed implementation, see:
- [Installation Guide](./INSTALLATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API.md)
