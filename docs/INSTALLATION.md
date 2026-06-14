# Ride Booking System - Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org)
- **MySQL** (v8.0 or higher) - Download from [mysql.com](https://www.mysql.com)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)
- **Google Maps API Key** (for map integration)

## Project Structure

```
ride-booking-system/
├── backend/              # Node.js + Express API
├── frontend/             # React + Vite application
├── database/             # MySQL schema and migrations
├── docs/                 # Documentation files
└── README.md             # Project README
```

## Step 1: Database Setup

### 1.1 Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Enter your MySQL password when prompted
```

### 1.2 Create Database and User

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS ride_booking_system;

-- Create a dedicated user (optional but recommended)
CREATE USER 'ridebook_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON ride_booking_system.* TO 'ridebook_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 1.3 Import Schema

```bash
# From the project root directory
mysql -u root -p ride_booking_system < database/schema.sql

# Or if using the dedicated user
mysql -u ridebook_user -p ride_booking_system < database/schema.sql
```

Verify the database was created:
```bash
mysql -u root -p ride_booking_system -e "SHOW TABLES;"
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env .env.local
```

Edit `.env.local` with your configuration:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_key_2024
JWT_REFRESH_SECRET=your_refresh_token_secret_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ride_booking_system
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EMAIL_USER=noreply@waziriumaru.edu.ng
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

**Important Configuration:**
- `JWT_SECRET`: Generate a strong random string (use `openssl rand -base64 32`)
- `DB_PASSWORD`: Use your MySQL password
- `GOOGLE_MAPS_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com)
- `EMAIL_PASS`: Use Gmail App Password if using Gmail

### 2.4 Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
MySQL database connected successfully
Server running on port 5000
```

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Step 4: Access Application

### Default Admin Credentials

```
Email: admin@waziriumaru.edu.ng
Password: Admin@123
```

### Demo Driver Credentials

```
Email: driver1@waziriumaru.edu.ng
Password: Driver@123
```

### User Registration

Create a new account through the sign-up page with any credentials.

## Step 5: Verify Installation

### Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Check Database Connection

The backend logs should show:
```
MySQL database connected successfully
```

### Frontend Access

Open `http://localhost:5173` in your browser. You should see the RideBook landing page.

## Troubleshooting

### Port Already in Use

If port 5000 (backend) or 5173 (frontend) is already in use:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MySQL Connection Error

```bash
# Check MySQL is running
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Test connection
mysql -u root -p ride_booking_system -e "SELECT 1;"
```

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors

```bash
# Reinstall all dependencies
npm install

# For specific package
npm install package-name@latest
```

## Next Steps

After successful installation:

1. **Configure Google Maps**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project
   - Enable Maps API
   - Create API key
   - Update `.env` files

2. **Set Up Email Service**
   - For Gmail: Generate App Password
   - For other providers: Get SMTP credentials

3. **Development**
   - Start modifying features
   - Add more database schemas as needed
   - Implement additional API endpoints

4. **Production Deployment**
   - See DEPLOYMENT.md for production setup

## Project Structure Details

```
backend/
├── config/              # Database configuration
├── controllers/         # Route handlers
├── middleware/          # Authentication, validation
├── routes/              # API endpoints
├── utils/               # Helper functions
├── server.js            # Main server file
└── package.json         # Dependencies

frontend/
├── src/
│   ├── pages/           # React page components
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── services/        # API service files
│   ├── layouts/         # Layout components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies
```

## Support

For issues or questions:
- Check the [documentation](./docs/)
- Review API endpoints in [API.md](./docs/API.md)
- Check system architecture in [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## License

This project is built for Waziri Umaru Federal Polytechnic Birnin Kebbi.
