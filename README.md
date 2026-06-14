# RideBook - Enterprise Ride Booking System

## Overview

**RideBook** is a comprehensive, enterprise-level transportation management and ride booking system designed for **Waziri Umaru Federal Polytechnic Birnin Kebbi**. It provides a complete solution for booking rides, managing drivers and vehicles, tracking trips in real-time, and generating detailed analytics.

## Key Features

### User Features
- ✅ Real-time ride booking with fare estimation
- ✅ Live GPS tracking of rides
- ✅ Ride history and rating system
- ✅ Multiple payment options (cash, card, wallet)
- ✅ Account management and profile editing
- ✅ Push notifications for ride updates
- ✅ Emergency contact integration

### Driver Features
- ✅ Accept/decline ride assignments
- ✅ Real-time location sharing
- ✅ Earnings tracking and statistics
- ✅ Rating and feedback system
- ✅ Schedule management
- ✅ Document verification (license, insurance)

### Admin Features
- ✅ Comprehensive dashboard with KPIs
- ✅ User and driver management
- ✅ Vehicle fleet management
- ✅ Booking monitoring and control
- ✅ Advanced analytics and reporting
- ✅ Revenue tracking
- ✅ System configuration
- ✅ Activity audit logs

### System Features
- ✅ Real-time notifications
- ✅ Conflict resolution for double bookings
- ✅ Automated fare calculation with surge pricing
- ✅ Schedule optimization
- ✅ Multi-role based access control
- ✅ Enterprise-grade security
- ✅ Scalable architecture

## Technology Stack

### Frontend
```
- React 18.2 (UI Framework)
- Vite 4.4 (Build tool)
- Tailwind CSS 3.3 (Styling)
- Framer Motion (Animations)
- React Router (Navigation)
- Axios (HTTP Client)
```

### Backend
```
- Node.js 18+ (Runtime)
- Express.js 4.18 (Web Framework)
- MySQL 8.0 (Database)
- Socket.io 4.6 (Real-time Communication)
- JWT (Authentication)
- bcryptjs (Password Hashing)
```

### Infrastructure
```
- Docker (Containerization)
- Nginx (Reverse Proxy)
- Redis (Caching)
- CloudFlare (CDN)
```

## Project Structure

```
ride-booking-system/
├── backend/
│   ├── config/              # Database and configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication, validation
│   ├── routes/              # API endpoints
│   ├── utils/               # Helper functions
│   ├── server.js            # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React context (auth, theme)
│   │   ├── services/        # API service layer
│   │   ├── layouts/         # Layout components
│   │   ├── App.jsx          # Main app
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── database/
│   └── schema.sql           # MySQL database schema
│
├── docs/
│   ├── INSTALLATION.md      # Setup instructions
│   ├── DEPLOYMENT.md        # Production deployment
│   ├── API.md               # API documentation
│   ├── ARCHITECTURE.md      # System architecture
│   └── README.md            # This file
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Google Maps API Key

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/ride-booking-system.git
   cd ride-booking-system
   ```

2. **Database Setup**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env .env.local
   # Edit .env.local with your credentials
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env .env.local
   # Edit .env.local with your API URL
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### Default Credentials

```
Admin User:
  Email: admin@waziriumaru.edu.ng
  Password: Admin@123

Demo Driver:
  Email: driver1@waziriumaru.edu.ng
  Password: Driver@123

Demo Driver 2:
  Email: driver2@waziriumaru.edu.ng
  Password: Driver@123
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/status` - Update booking status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/notifications` - Get notifications

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/reports` - Get reports

### Drivers
- `GET /api/drivers/profile` - Get driver profile
- `GET /api/drivers/assigned-rides` - Get assigned rides
- `PUT /api/drivers/location` - Update location
- `PUT /api/drivers/status` - Update driver status

See [API.md](docs/API.md) for complete documentation.

## Database Schema

### Core Tables
- **users** - All system users
- **drivers** - Driver information
- **vehicles** - Fleet vehicles
- **bookings** - Ride bookings
- **ride_history** - Historical ride data
- **payments** - Payment records
- **notifications** - User notifications
- **activity_logs** - Audit trail
- **schedule_conflicts** - Conflict tracking

See [database/schema.sql](database/schema.sql) for full schema.

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ SQL injection prevention
- ✅ XSS protection with Helmet.js
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ HTTPS/SSL enforcement
- ✅ Role-based access control
- ✅ Activity logging & audit trail

## Performance Features

- ✅ Database connection pooling
- ✅ Query optimization and indexing
- ✅ Redis caching layer
- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ API response pagination
- ✅ Real-time updates with WebSocket
- ✅ Load balancing support

## Deployment

### Production Options

1. **AWS (EC2 + RDS)**
   - Scalable cloud infrastructure
   - Managed database service
   - Global CDN with CloudFront

2. **DigitalOcean**
   - App Platform for automatic deployment
   - Managed MySQL Database
   - Spaces for file storage

3. **Heroku**
   - Simple one-click deployment
   - Automatic scaling
   - GitHub integration

4. **Self-hosted**
   - Full control over infrastructure
   - Docker containerization
   - Nginx reverse proxy

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed setup.

## Installation & Setup

Detailed instructions available in [INSTALLATION.md](docs/INSTALLATION.md)

## System Architecture

The system follows a modular, scalable architecture:

```
Frontend (React + Vite + Tailwind)
    ↓
API Gateway (Express.js + Socket.io)
    ↓
Business Logic Layer (Controllers)
    ↓
Data Access Layer (MySQL)
    ↓
Cache Layer (Redis - Optional)
```

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Features Roadmap

### Phase 1 (Current)
- ✅ Basic ride booking
- ✅ Driver assignment
- ✅ Real-time tracking
- ✅ Admin dashboard
- ✅ Payment integration

### Phase 2 (Planned)
- 📅 Mobile native apps
- 📅 AI-based fare optimization
- 📅 Advanced analytics
- 📅 SMS notifications
- 📅 Push notifications

### Phase 3 (Future)
- 📅 Machine learning for demand forecasting
- 📅 Integration with payment gateways
- 📅 Multi-language support
- 📅 Accessibility features
- 📅 Blockchain integration for transparency

## Monitoring & Support

### Health Checks
- API endpoint: `/api/health`
- Database connectivity verified on startup
- Real-time monitoring dashboard

### Logging
- Request logging (Morgan)
- Error tracking
- Activity audit logs
- Performance metrics

### Support
- Technical Documentation
- API Documentation
- Troubleshooting Guide
- Email: support@waziriumaru.edu.ng
- Phone: +234 (0) 800-000-0000

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for Waziri Umaru Federal Polytechnic Birnin Kebbi.

## Acknowledgments

Built with modern technologies and best practices for enterprise-level applications.

## Contact

**Waziri Umaru Federal Polytechnic Birnin Kebbi**
- Email: info@waziriumaru.edu.ng
- Phone: +234 (0) 68-721-900
- Website: www.waziriumaru.edu.ng
- Location: Birnin Kebbi, Kebbi State, Nigeria

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready ✅

For comprehensive documentation, see the `/docs` directory.
