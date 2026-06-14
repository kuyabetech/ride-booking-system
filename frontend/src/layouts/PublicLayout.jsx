import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">RideBook</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition ${
                    location.pathname === item.href
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-700" />
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.firstName}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className="flex space-x-2 mt-4">
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 text-center text-primary-600 border border-primary-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 text-center bg-primary-600 text-white rounded-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RideBook</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Transportation management for institutions
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary-600">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="mailto:support@ridebook.com" className="hover:text-primary-600">Email Support</a></li>
                <li><a href="tel:+234800000000" className="hover:text-primary-600">Call Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; 2024 Waziri Umaru Federal Polytechnic Birnin Kebbi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
