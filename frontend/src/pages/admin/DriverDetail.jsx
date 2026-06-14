import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton_Full, ConfirmationDialog } from '../../components/ActionButtons';

const DriverDetail = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/drivers/${driverId}`);
      if (response.data?.success) {
        setDriver(response.data.data);
        setFormData(response.data.data);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to fetch driver details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load driver details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await api.put(`/admin/drivers/${driverId}`, formData);
      if (response.data?.success) {
        setDriver(response.data.data);
        setIsEditing(false);
        alert('Driver updated successfully');
      } else {
        alert('Failed to update driver: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to update driver'));
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/admin/drivers/${driverId}`);
      if (response.data?.success) {
        alert('Driver deleted successfully');
        navigate('/admin/drivers');
      } else {
        alert('Failed to delete driver: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to delete driver'));
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading driver details...</div>
      </motion.div>
    );
  }

  if (error && !driver) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin/drivers')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Drivers
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/drivers')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {driver?.first_name} {driver?.last_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{driver?.email}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Info */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Driver Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={formData.license_number || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.driver_status || formData.status || 'available'}
                onChange={(e) => setFormData({ ...formData, driver_status: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <ActionButton_Full
                onClick={() => {
                  setFormData(driver);
                  setIsEditing(false);
                }}
                label="Cancel"
                variant="secondary"
                disabled={saveLoading}
              />
              <ActionButton_Full
                onClick={handleSave}
                label="Save Changes"
                variant="success"
                loading={saveLoading}
              />
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{driver?.total_trips || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Rating</p>
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(parseFloat(driver?.rating) || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Driver ID</p>
                <p className="text-gray-900 dark:text-white font-semibold">{driver?.driver_id || driver?.id}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {driver?.created_at ? new Date(driver.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
            <ActionButton_Full
              onClick={() => setDeleteConfirm(true)}
              icon={TrashIcon}
              label="Delete Driver"
              variant="danger"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        destructive
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </motion.div>
  );
};

export default DriverDetail;
