import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const stats = [
    { label: 'Total Rides', value: '12', icon: MapPinIcon, color: 'primary' },
    { label: 'Completed Today', value: '2', icon: ClockIcon, color: 'green' },
    { label: 'Account Balance', value: '₦5,000', icon: CreditCardIcon, color: 'blue' }
  ];

  const recentRides = [
    { id: 1, from: 'Main Gate', to: 'Library', date: 'Today', status: 'completed', fare: '₦500' },
    { id: 2, from: 'Hostel A', to: 'Cafeteria', date: 'Yesterday', status: 'completed', fare: '₦300' },
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

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/user/book-ride"
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg text-center font-semibold hover:from-primary-700 hover:to-primary-800 transition transform hover:scale-[1.02]"
          >
            Book a Ride
          </Link>
          <Link
            to="/user/ride-history"
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            View History
          </Link>
          <Link
            to="/user/profile"
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            My Profile
          </Link>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Rides</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">From</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">To</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fare</th>
              </tr>
            </thead>
            <tbody>
              {recentRides.map((ride) => (
                <tr key={ride.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{ride.from}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{ride.to}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{ride.date}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{ride.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
