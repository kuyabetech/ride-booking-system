import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PencilIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton, ActionButtonGroup, ConfirmationDialog } from '../../components/ActionButtons';

const ManageVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, vehicleId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = (vehicle.plate_number || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (vehicle.model || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (vehicleId) => {
    setDeleteConfirm({ isOpen: true, vehicleId });
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/admin/vehicles/${deleteConfirm.vehicleId}`);
      if (response.data?.success) {
        setDeleteConfirm({ isOpen: false, vehicleId: null });
        await fetchVehicles();
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

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading vehicles...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Vehicles</h1>
        <p className="text-gray-600 dark:text-gray-400">Total Vehicles: {vehicles.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by plate or model..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={fetchVehicles} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Refresh</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Plate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Model</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Year</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Insurance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">{vehicle.plate_number}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{vehicle.year}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{vehicle.capacity} seats</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(vehicle.insurance_expiry).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>{vehicle.status}</span></td>
                  <td className="px-6 py-3 text-sm">
                    <ActionButtonGroup actions={[
                      { icon: EyeIcon, label: 'View', variant: 'info', onClick: () => navigate(`/admin/vehicles/${vehicle.id}`) },
                      { icon: PencilIcon, label: 'Edit', variant: 'warning', onClick: () => navigate(`/admin/vehicles/${vehicle.id}`) },
                      { icon: TrashIcon, label: 'Remove', variant: 'danger', onClick: () => handleDelete(vehicle.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">Showing {paginatedVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Previous</button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages || 1}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Next</button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Remove Vehicle"
        message="Are you sure you want to remove this vehicle? This action cannot be undone."
        destructive
        confirmText="Remove"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, vehicleId: null })}
      />
    </motion.div>
  );
};

export default ManageVehicles;
