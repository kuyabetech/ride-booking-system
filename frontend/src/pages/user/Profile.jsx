import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Regular User</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <EnvelopeIcon className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <PhoneIcon className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="text-gray-900 dark:text-white font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Phone</span>
              <span className="text-gray-900 dark:text-white font-semibold">{formData.phone}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 dark:text-gray-400">Account Type</span>
              <span className="text-gray-900 dark:text-white font-semibold">Regular User</span>
            </div>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Member Since</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2">Jan 2024</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loyalty Points</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">450 pts</p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
