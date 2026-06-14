import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, DocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getVehicles, addVehicle, assignVehicleToDriver, updateVehicleMaintenance } from '../../services/vehicleService';
import { ActionButton_Full, ConfirmationDialog } from '../../components/ActionButtons';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [actionLoading, setActionLoading] = useState({ add: false, assign: false, maintenance: false });
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: '',
    fuelType: 'petrol',
    mileage: '',
    vin: '',
    registrationDoc: null,
    insuranceDoc: null,
    vehiclePhoto: null
  });

  const [assignData, setAssignData] = useState({ driverId: '' });
  const [maintenanceData, setMaintenanceData] = useState({ status: 'maintenance', nextDate: '' });

  useEffect(() => {
    fetchVehicles();
  }, [status, page]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await getVehicles(status, page);
      if (response.data.success) {
        setVehicles(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load vehicles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      setActionLoading({ ...actionLoading, add: true });
      const fd = new FormData();
      fd.append('licensePlate', formData.licensePlate);
      fd.append('make', formData.make);
      fd.append('model', formData.model);
      fd.append('year', formData.year);
      fd.append('capacity', formData.capacity);
      fd.append('fuelType', formData.fuelType);
      fd.append('mileage', formData.mileage);
      fd.append('vin', formData.vin);
      if (formData.registrationDoc) fd.append('registration_doc', formData.registrationDoc);
      if (formData.insuranceDoc) fd.append('insurance_doc', formData.insuranceDoc);
      if (formData.vehiclePhoto) fd.append('vehicle_photo', formData.vehiclePhoto);

      const response = await addVehicle(fd);
      if (response.data?.success) {
        setShowAddModal(false);
        setFormData({
          licensePlate: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          capacity: '',
          fuelType: 'petrol',
          mileage: '',
          vin: '',
          registrationDoc: null,
          insuranceDoc: null,
          vehiclePhoto: null
        });
        await fetchVehicles();
      } else {
        alert('Failed to add vehicle: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to add vehicle'));
      console.error(err);
    } finally {
      setActionLoading({ ...actionLoading, add: false });
    }
  };

  const handleAssignVehicle = async () => {
    if (!assignData.driverId) {
      alert('Please select a driver');
      return;
    }
    try {
      setActionLoading({ ...actionLoading, assign: true });
      const response = await assignVehicleToDriver(assignData.driverId, selectedVehicle.id);
      if (response.data?.success) {
        setShowAssignModal(false);
        setAssignData({ driverId: '' });
        await fetchVehicles();
      } else {
        alert('Failed to assign vehicle: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to assign vehicle'));
      console.error(err);
    } finally {
      setActionLoading({ ...actionLoading, assign: false });
    }
  };

  const handleUpdateMaintenance = async () => {
    try {
      setActionLoading({ ...actionLoading, maintenance: true });
      const response = await updateVehicleMaintenance(selectedVehicle.id, maintenanceData.status, maintenanceData.nextDate);
      if (response.data?.success) {
        setShowMaintenanceModal(false);
        setMaintenanceData({ status: 'maintenance', nextDate: '' });
        await fetchVehicles();
      } else {
        alert('Failed to update maintenance: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to update maintenance'));
      console.error(err);
    } finally {
      setActionLoading({ ...actionLoading, maintenance: false });
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading vehicles...</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicle Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your fleet</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-4 flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Vehicle
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'active', 'maintenance', 'inactive'].map(s => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
              status === s
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No vehicles found</p>
          </div>
        ) : (
          vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {vehicle.photo_url && (
                <img src={vehicle.photo_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-lg font-semibold text-primary-600">{vehicle.license_plate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    vehicle.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vehicle.capacity} seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Type:</span>
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vehicle.mileage} km</span>
                  </div>
                  {vehicle.current_driver && (
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <span>Assigned to:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{vehicle.current_driver}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ActionButton_Full
                    onClick={() => { setSelectedVehicle(vehicle); setShowAssignModal(true); }}
                    icon={CheckIcon}
                    label="Assign"
                    variant="primary"
                    loading={actionLoading.assign && selectedVehicle?.id === vehicle.id}
                  />
                  <ActionButton_Full
                    onClick={() => { setSelectedVehicle(vehicle); setShowMaintenanceModal(true); }}
                    icon={PencilIcon}
                    label="Maintenance"
                    variant="warning"
                    loading={actionLoading.maintenance && selectedVehicle?.id === vehicle.id}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="licensePlate" placeholder="License Plate" value={formData.licensePlate} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="make" placeholder="Make" value={formData.make} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="number" name="capacity" placeholder="Capacity (seats)" value={formData.capacity} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <input type="number" name="mileage" placeholder="Mileage (km)" value={formData.mileage} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="vin" placeholder="VIN" value={formData.vin} onChange={handleInputChange} required className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Document</label>
                <input type="file" name="registrationDoc" onChange={handleFileChange} className="w-full" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Insurance Document</label>
                <input type="file" name="insuranceDoc" onChange={handleFileChange} className="w-full" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Photo</label>
                <input type="file" name="vehiclePhoto" onChange={handleFileChange} className="w-full" />
              </div>
              <div className="flex gap-3 pt-4">
                <ActionButton_Full
                  onClick={() => setShowAddModal(false)}
                  label="Cancel"
                  variant="secondary"
                  disabled={actionLoading.add}
                />
                <ActionButton_Full
                  onClick={handleAddVehicle}
                  label="Add Vehicle"
                  variant="primary"
                  loading={actionLoading.add}
                />
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Assign Vehicle Modal */}
      {showAssignModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Assign {selectedVehicle?.license_plate}
            </h2>
            <select
              value={assignData.driverId}
              onChange={(e) => setAssignData({ driverId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-6"
            >
              <option value="">Select a driver...</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <ActionButton_Full
                onClick={() => setShowAssignModal(false)}
                label="Cancel"
                variant="secondary"
                disabled={actionLoading.assign}
              />
              <ActionButton_Full
                onClick={handleAssignVehicle}
                label="Assign"
                variant="success"
                loading={actionLoading.assign}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Update Maintenance - {selectedVehicle?.license_plate}
            </h2>
            <select
              value={maintenanceData.status}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
            >
              <option value="maintenance">Under Maintenance</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="date"
              value={maintenanceData.nextDate}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, nextDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-6"
              placeholder="Next Maintenance Date"
            />
            <div className="flex gap-3">
              <ActionButton_Full
                onClick={() => setShowMaintenanceModal(false)}
                label="Cancel"
                variant="secondary"
                disabled={actionLoading.maintenance}
              />
              <ActionButton_Full
                onClick={handleUpdateMaintenance}
                label="Update"
                variant="warning"
                loading={actionLoading.maintenance}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageVehicles;
