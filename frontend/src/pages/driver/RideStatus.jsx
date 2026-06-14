import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const RideStatus = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllRides();
  }, []);

  const fetchAllRides = async () => {
    try {
      setLoading(true);
      const [completed, cancelled, inProgress] = await Promise.all([
        api.get('/driver/assigned-rides?status=completed'),
        api.get('/driver/assigned-rides?status=cancelled'),
        api.get('/driver/assigned-rides?status=in_progress')
      ]);

      const allRides = [
        ...(inProgress.data.data || []),
        ...(completed.data.data || []),
        ...(cancelled.data.data || [])
      ];

      setRides(allRides);
      setError(null);
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to load ride status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      case 'in_progress':
        return <ClockIcon className="h-6 w-6 text-blue-600" />;
      default:
        return <MapPinIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading ride status...</div>
      </motion.div>
    );
  }

  const completedRides = rides.filter(r => r.status === 'completed');
  const cancelledRides = rides.filter(r => r.status === 'cancelled');
  const inProgressRides = rides.filter(r => r.status === 'in_progress');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ride Status</h1>
            <p className="text-gray-600 dark:text-gray-400">Track the status of your rides</p>
          </div>
          <button onClick={fetchAllRides} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">Refresh</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Rides</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedRides.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{inProgressRides.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Cancelled Rides</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{cancelledRides.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {rides.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-md">
            <p className="text-gray-600 dark:text-gray-400">No rides found</p>
          </div>
        ) : (
          rides.map((ride) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(ride.status)}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{ride.first_name} {ride.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{ride.pickup_location.substring(0, 20)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{new Date(ride.scheduled_time).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm capitalize ${getStatusColor(ride.status)}`}>
                        {ride.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RideStatus;
