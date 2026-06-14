import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PencilIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton, ActionButtonGroup, ConfirmationDialog } from '../../components/ActionButtons';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState({ isOpen: false, bookingId: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/bookings');
      if (response.data.success) {
        setBookings(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = (booking.booking_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (bookingId) => {
    setCancelConfirm({ isOpen: true, bookingId });
  };

  const confirmCancel = async () => {
    try {
      setCancelLoading(true);
      const response = await api.delete(`/admin/bookings/${cancelConfirm.bookingId}`);
      if (response.data?.success) {
        setCancelConfirm({ isOpen: false, bookingId: null });
        await fetchBookings();
      } else {
        alert('Failed to cancel booking: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to cancel booking'));
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading bookings...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400">Total Bookings: {bookings.length}</p>
          </div>
          <button onClick={fetchBookings} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by booking ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={fetchBookings} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Refresh</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Route</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Distance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Fare</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">{booking.booking_id}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{booking.pickup_location?.substring(0, 15)}... → {booking.dropoff_location?.substring(0, 15)}...</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(booking.scheduled_time).toLocaleDateString()} {new Date(booking.scheduled_time).toLocaleTimeString()}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{booking.distance_km || 'N/A'} km</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">₦{booking.fare_amount || 'N/A'}</td>
                  <td className="px-6 py-3 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>{booking.status.replace('_', ' ')}</span></td>
                  <td className="px-6 py-3 text-sm">
                    <ActionButtonGroup actions={[
                      { icon: EyeIcon, label: 'View', variant: 'info', onClick: () => navigate(`/admin/bookings/${booking.id}`) },
                      { icon: PencilIcon, label: 'Edit', variant: 'warning', onClick: () => navigate(`/admin/bookings/${booking.id}`) },
                      { icon: TrashIcon, label: 'Cancel', variant: 'danger', onClick: () => handleDelete(booking.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">Showing {paginatedBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Previous</button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages || 1}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Next</button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={cancelConfirm.isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        destructive
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        loading={cancelLoading}
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirm({ isOpen: false, bookingId: null })}
      />
    </motion.div>
  );
};

export default ManageBookings;
