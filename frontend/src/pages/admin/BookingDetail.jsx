import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton_Full, ConfirmationDialog } from '../../components/ActionButtons';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/bookings/${bookingId}`);
      if (response.data?.success) {
        setBooking(response.data.data);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to fetch booking details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/admin/bookings/${bookingId}`);
      if (response.data?.success) {
        alert('Booking cancelled successfully');
        navigate('/admin/bookings');
      } else {
        alert('Failed to cancel booking: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to cancel booking'));
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading booking details...</div>
      </motion.div>
    );
  }

  if (error && !booking) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Bookings
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking #{booking?.booking_id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {booking?.scheduled_time ? new Date(booking.scheduled_time).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Trip Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trip Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pickup Location
                </label>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {booking?.pickup_location || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dropoff Location
                </label>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {booking?.dropoff_location || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distance
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {booking?.distance_km || 'N/A'} km
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {booking?.duration_minutes || 'N/A'} mins
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fare & Payment */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Fare & Payment</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Fare Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₦{booking?.fare_amount || 0}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-white font-semibold capitalize">
                  {booking?.payment_method || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Status
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  booking?.payment_status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  booking?.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {booking?.payment_status || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger & Driver Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Participants</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Passenger</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">{booking?.passenger_name || 'N/A'}</p>
                  <p className="text-gray-600 dark:text-gray-400">{booking?.passenger_phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Driver</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">{booking?.driver_name || 'Not assigned'}</p>
                  <p className="text-gray-600 dark:text-gray-400">{booking?.driver_phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status</h3>
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking?.status)}`}>
                {(booking?.status || 'pending').replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Booking ID</p>
                <p className="text-gray-900 dark:text-white font-semibold">{booking?.booking_id}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {booking?.scheduled_time ? new Date(booking.scheduled_time).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {booking?.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          {booking?.status !== 'cancelled' && booking?.status !== 'completed' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
              <ActionButton_Full
                onClick={() => setDeleteConfirm(true)}
                icon={TrashIcon}
                label="Cancel Booking"
                variant="danger"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        destructive
        confirmText="Cancel Booking"
        cancelText="Close"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </motion.div>
  );
};

export default BookingDetail;
