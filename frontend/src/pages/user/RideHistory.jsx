import React from 'react';
import { motion } from 'framer-motion';

const RideHistory = () => {
  const rides = [
    { id: 1, from: 'Main Gate', to: 'Library', date: '2024-01-15', time: '10:30 AM', status: 'completed', fare: '₦500', rating: 5 },
    { id: 2, from: 'Hostel A', to: 'Cafeteria', date: '2024-01-14', time: '02:45 PM', status: 'completed', fare: '₦300', rating: 4 },
    { id: 3, from: 'Admin Block', to: 'Clinic', date: '2024-01-13', time: '09:15 AM', status: 'completed', fare: '₦400', rating: 5 },
    { id: 4, from: 'Auditorium', to: 'Sports Complex', date: '2024-01-12', time: '03:00 PM', status: 'completed', fare: '₦600', rating: 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ride History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">From</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">To</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fare</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Rating</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <motion.tr
                  key={ride.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{ride.from}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{ride.to}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {ride.date} {ride.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{ride.fare}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < ride.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Rides</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">4</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Amount Spent</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">₦1,800</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Average Rating</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">4.5 ★</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RideHistory;
