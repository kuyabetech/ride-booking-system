import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const DriverDashboard = () => {
  const [driverData, setDriverData] = useState(null);
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverStatus, setDriverStatus] = useState('online');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, ridesRes] = await Promise.all([
        api.get('/driver/profile'),
        api.get('/driver/assigned-rides?status=confirmed')
      ]);

      if (profileRes.data.success) {
        const driver = profileRes.data.driver;
        setDriverData(driver);
        // Map 'available' to 'online' for frontend display
        setDriverStatus(driver.status === 'available' ? 'online' : (driver.status || 'offline'));
      }

      if (ridesRes.data.success) {
        setActiveRides(ridesRes.data.data || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const newStatus = driverStatus === 'online' ? 'offline' : 'online';
      await api.put('/driver/status', { status: newStatus });
      setDriverStatus(newStatus);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update driver status');
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </motion.div>
    );
  }

  const stats = [
    { label: 'Active Rides', value: activeRides.length, icon: MapPinIcon, color: 'primary' },
    { label: 'Total Trips', value: driverData?.total_trips || 0, icon: CheckCircleIcon, color: 'green' },
    { label: 'Current Rating', value: `${(parseFloat(driverData?.rating) || 0).toFixed(1)}/5`, icon: ClockIcon, color: 'yellow' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Rides */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Rides</h3>
        <div className="space-y-4">
          {activeRides.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">No active rides assigned</p>
          ) : (
            activeRides.map((ride) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{ride.first_name} {ride.last_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ride.pickup_location} → {ride.dropoff_location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{new Date(ride.scheduled_time).toLocaleTimeString()}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      ride.status === 'in_progress'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {ride.status === 'in_progress' ? 'In Progress' : 'Confirmed'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Driver Status */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white shadow-md">
        <h3 className="text-lg font-bold mb-4">Driver Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary-100">Current Status</p>
            <p className="text-2xl font-bold capitalize">{driverStatus}</p>
          </div>
          <div>
            <p className="text-primary-100">Rating</p>
            <p className="text-2xl font-bold">{(parseFloat(driverData?.rating) || 0).toFixed(1)} ★</p>
          </div>
        </div>
        <button onClick={handleStatusChange} className="mt-4 bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
          {driverStatus === 'online' ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
    </motion.div>
  );
};

export default DriverDashboard;
