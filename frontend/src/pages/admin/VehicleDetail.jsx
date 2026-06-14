import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton_Full, ConfirmationDialog } from '../../components/ActionButtons';

const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/vehicles/${vehicleId}`);
      if (response.data?.success) {
        setVehicle(response.data.data);
        setFormData(response.data.data);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to fetch vehicle details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await api.put(`/admin/vehicles/${vehicleId}`, formData);
      if (response.data?.success) {
        setVehicle(response.data.data);
        setIsEditing(false);
        alert('Vehicle updated successfully');
      } else {
        alert('Failed to update vehicle: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to update vehicle'));
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/admin/vehicles/${vehicleId}`);
      if (response.data?.success) {
        alert('Vehicle deleted successfully');
        navigate('/admin/vehicles');
      } else {
        alert('Failed to delete vehicle: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to delete vehicle'));
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading vehicle details...</div>
      </motion.div>
    );
  }

  if (error && !vehicle) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin/vehicles')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Vehicles
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/vehicles')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {vehicle?.make} {vehicle?.model}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{vehicle?.plate_number}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Info */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vehicle Information</h2>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={formData.make || ''}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  value={formData.plate_number || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity (Seats)
                </label>
                <input
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fuel Type
                </label>
                <select
                  value={formData.fuel_type || ''}
                  onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <option value="">Select fuel type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mileage
              </label>
              <input
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                  isEditing ? '' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <option value="active">Active</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <ActionButton_Full
                onClick={() => {
                  setFormData(vehicle);
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
          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">VIN</p>
                <p className="text-gray-900 dark:text-white font-semibold">{vehicle?.vin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Insurance Expiry</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {vehicle?.insurance_expiry ? new Date(vehicle.insurance_expiry).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {vehicle?.created_at ? new Date(vehicle.created_at).toLocaleDateString() : 'N/A'}
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
              label="Delete Vehicle"
              variant="danger"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
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

export default VehicleDetail;
