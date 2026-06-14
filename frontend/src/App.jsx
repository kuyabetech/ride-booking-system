import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import BookRide from './pages/user/BookRide';
import RideHistory from './pages/user/RideHistory';
import UserProfile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDrivers from './pages/admin/ManageDrivers';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageVehiclesEnhanced from './pages/admin/ManageVehiclesEnhanced';
import ManageBookings from './pages/admin/ManageBookings';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import ManageDriverApplications from './pages/admin/ManageDriverApplications';
import UserDetail from './pages/admin/UserDetail';
import DriverDetail from './pages/admin/DriverDetail';
import VehicleDetail from './pages/admin/VehicleDetail';
import BookingDetail from './pages/admin/BookingDetail';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import AssignedRides from './pages/driver/AssignedRides';
import RideStatus from './pages/driver/RideStatus';
import DriverProfile from './pages/driver/Profile';
import DriverRegistration from './pages/DriverRegistration';
import TestPage from './pages/Test';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              {/* Test Route */}
              <Route path="/test" element={<TestPage />} />

              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/driver-registration" element={<DriverRegistration />} />
              </Route>

              {/* User Routes */}
              <Route element={<PrivateRoute allowedRoles={['user']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/user/book-ride" element={<BookRide />} />
                  <Route path="/user/ride-history" element={<RideHistory />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/users/:userId" element={<UserDetail />} />
                  <Route path="/admin/drivers" element={<ManageDrivers />} />
                  <Route path="/admin/drivers/:driverId" element={<DriverDetail />} />
                  <Route path="/admin/driver-applications" element={<ManageDriverApplications />} />
                  <Route path="/admin/vehicles" element={<ManageVehicles />} />
                  <Route path="/admin/vehicles/:vehicleId" element={<VehicleDetail />} />
                  <Route path="/admin/vehicles-enhanced" element={<ManageVehiclesEnhanced />} />
                  <Route path="/admin/bookings" element={<ManageBookings />} />
                  <Route path="/admin/bookings/:bookingId" element={<BookingDetail />} />
                  <Route path="/admin/reports" element={<ReportsAnalytics />} />
                </Route>
              </Route>

              {/* Driver Routes */}
              <Route element={<PrivateRoute allowedRoles={['driver']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/driver/dashboard" element={<DriverDashboard />} />
                  <Route path="/driver/assigned-rides" element={<AssignedRides />} />
                  <Route path="/driver/ride-status" element={<RideStatus />} />
                  <Route path="/driver/profile" element={<DriverProfile />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
