import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AssignedRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('confirmed');

  useEffect(() => {
    fetchRides();
  }, [statusFilter]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/driver/assigned-rides?status=${statusFilter}`);
      if (response.data.success) {
        setRides(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to load assigned rides');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading rides...</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Assigned Rides</h1>
            <p className="text-gray-600 dark:text-gray-400">View all rides assigned to you</p>
          </div>
          <button onClick={fetchRides} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">Refresh</button>
        </div>
      </div>

      <div className="flex gap-2">
        {['confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              statusFilter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rides.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-md">
            <p className="text-gray-600 dark:text-gray-400">No rides with status "{statusFilter.replace('_', ' ')}"</p>
          </div>
        ) : (
          rides.map((ride) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <MapPinIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Route Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pickup Location</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{ride.pickup_location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dropoff Location</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{ride.dropoff_location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger & Ride Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{ride.first_name} {ride.last_name}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ride.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(ride.scheduled_time).toLocaleString()}</p>
                  </div>
                  {ride.distance_km && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{ride.distance_km} km</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fare & Status */}
              <div className="flex justify-between items-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fare</p>
                    <p className="font-bold text-lg text-green-600">₦{(ride.fare_amount || 0).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold capitalize ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  ride.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {ride.status.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AssignedRides;
