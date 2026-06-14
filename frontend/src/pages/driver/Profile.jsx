import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IdentificationIcon, TruckIcon, StarIcon, ClockIcon, CheckCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/driver/profile');
      if (response.data.success) {
        setProfile(response.data.driver);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load driver profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Driver Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile and vehicle information</p>
          </div>
          <button onClick={fetchProfile} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">Refresh</button>
        </div>
      </div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <IdentificationIcon className="h-6 w-6 text-primary-600" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.first_name} {profile?.last_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <EnvelopeIcon className="h-4 w-4" />
              Email
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" />
              Phone
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.phone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Joining Date</label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Date(profile?.joining_date).toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>

      {/* License Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TruckIcon className="h-6 w-6 text-primary-600" />
          License Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">License Number</label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.driver_license || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">License Expiry</label>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.license_expiry ? new Date(profile.license_expiry).toLocaleDateString() : 'N/A'}</p>
              {profile?.license_expiry && new Date(profile.license_expiry) < new Date() && (
                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs font-semibold">Expired</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Total Trips</label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.total_trips || 0}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Current Status</label>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              (profile?.status === 'available' || profile?.status === 'online') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              profile?.status === 'busy' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {profile?.status === 'available' ? 'online' : (profile?.status || 'offline')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Current Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{(parseFloat(profile?.rating) || 0).toFixed(1)}/5</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{profile?.total_trips || 0}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Account Status</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-2 capitalize">
                {profile?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 justify-center"
      >
        <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition">
          Edit Profile
        </button>
        <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition">
          Change Password
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DriverProfile;
