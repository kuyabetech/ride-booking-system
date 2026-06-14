import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  HomeIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  let navigation = [];

  if (user?.role === 'user') {
    navigation = [
      { name: 'Dashboard', href: '/user/dashboard', icon: HomeIcon },
      { name: 'Book a Ride', href: '/user/book-ride', icon: MapPinIcon },
      { name: 'Ride History', href: '/user/ride-history', icon: ClipboardDocumentListIcon },
      { name: 'Profile', href: '/user/profile', icon: UserIcon },
    ];
  } else if (user?.role === 'admin') {
    navigation = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
      { name: 'Users', href: '/admin/users', icon: UserIcon },
      { name: 'Drivers', href: '/admin/drivers', icon: UserIcon },
      { name: 'Driver Applications', href: '/admin/manage-driver-applications', icon: ClipboardDocumentListIcon },
      { name: 'Vehicles', href: '/admin/vehicles', icon: Cog6ToothIcon },
      { name: 'Bookings', href: '/admin/bookings', icon: ClipboardDocumentListIcon },
      { name: 'Reports', href: '/admin/reports', icon: ClipboardDocumentListIcon },
    ];
  } else if (user?.role === 'driver') {
    navigation = [
      { name: 'Dashboard', href: '/driver/dashboard', icon: HomeIcon },
      { name: 'Assigned Rides', href: '/driver/assigned-rides', icon: MapPinIcon },
      { name: 'Ride Status', href: '/driver/ride-status', icon: ClipboardDocumentListIcon },
      { name: 'Profile', href: '/driver/profile', icon: UserIcon },
    ];
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {sidebarOpen ? 'RideBook' : 'RB'}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            {sidebarOpen && <span className="ml-3 text-sm">Theme</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.firstName}!
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
