import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UsersIcon, ClipboardDocumentListIcon, ArrowTrendingUpIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        const data = response.data.data || {};
        setDashboardData(data);
        setError(null);
        
        // Generate chart data from dashboard data
        const monthlyData = [
          { month: 'Jan', bookings: 0, revenue: 0 },
          { month: 'Feb', bookings: 0, revenue: 0 },
          { month: 'Mar', bookings: 0, revenue: 0 },
          { month: 'Apr', bookings: 0, revenue: 0 },
          { month: 'May', bookings: data.bookingsToday || 0, revenue: data.revenueToday || 0 },
          { month: 'Jun', bookings: 0, revenue: 0 },
        ];
        setChartData(monthlyData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    { label: 'Total Users', value: dashboardData?.totalUsers || 0, icon: UsersIcon, color: 'primary' },
    { label: 'Active Bookings', value: dashboardData?.bookingsToday || 0, icon: ClipboardDocumentListIcon, color: 'green' },
    { label: 'Total Revenue', value: `₦${(dashboardData?.revenueToday || 0).toLocaleString()}`, icon: CreditCardIcon, color: 'blue' },
    { label: 'Total Drivers', value: dashboardData?.totalDrivers || 0, icon: ArrowTrendingUpIcon, color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue & Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#3b82f6" />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Manage Users</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">View and manage system users</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">View Reports</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Detailed analytics and reports</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">System Settings</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Configure system parameters</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
