import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowTrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/reports?period=${dateRange}`);
      if (response.data.success) {
        const data = response.data.reports || {};
        setReportsData(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading reports...</div>
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

  const revenueData = [
    { date: 'Week 1', revenue: (reportsData?.total_revenue || 0) / 4 },
    { date: 'Week 2', revenue: (reportsData?.total_revenue || 0) / 4 },
    { date: 'Week 3', revenue: (reportsData?.total_revenue || 0) / 4 },
    { date: 'Week 4', revenue: (reportsData?.total_revenue || 0) / 4 },
  ];

  const bookingData = [
    { date: 'Mon', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Tue', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Wed', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Thu', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Fri', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Sat', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
    { date: 'Sun', completed: (reportsData?.completed || 0) / 7, cancelled: (reportsData?.cancelled || 0) / 7 },
  ];

  const completionRate = reportsData?.total_bookings > 0 
    ? ((reportsData?.completed / reportsData?.total_bookings) * 100).toFixed(1)
    : 0;

  const stats = [
    { label: 'Total Revenue', value: `₦${(reportsData?.total_revenue || 0).toLocaleString()}`, change: '+12.5%', icon: '📊' },
    { label: 'Total Bookings', value: reportsData?.total_bookings || 0, change: '+8.2%', icon: '📅' },
    { label: 'Completion Rate', value: `${completionRate}%`, change: '+2.1%', icon: '✅' },
    { label: 'No Shows', value: reportsData?.no_show || 0, change: '-5.3%', icon: '⭐' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">View detailed reports and system performance metrics</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchReportsData} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">Refresh</button>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span className="text-sm">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bookings Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Metric</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">This Month</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Last Month</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Total Revenue</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">₦3,059,000</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">₦2,720,000</td>
                <td className="px-6 py-3 text-sm text-green-600">+12.5%</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Total Bookings</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">438</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">405</td>
                <td className="px-6 py-3 text-sm text-green-600">+8.2%</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Completion Rate</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">96.3%</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">94.2%</td>
                <td className="px-6 py-3 text-sm text-green-600">+2.1%</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Avg Customer Rating</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">4.7/5.0</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">4.4/5.0</td>
                <td className="px-6 py-3 text-sm text-green-600">+0.3</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Active Users</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">1,234</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">1,105</td>
                <td className="px-6 py-3 text-sm text-green-600">+11.6%</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">Active Drivers</td>
                <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">102</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">95</td>
                <td className="px-6 py-3 text-sm text-green-600">+7.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Export Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Download PDF</button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Export Data</button>
      </div>
    </motion.div>
  );
};

export default ReportsAnalytics;
