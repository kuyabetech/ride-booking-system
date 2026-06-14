import api from './api.js';

export const createBooking = (data) => api.post('/bookings', data);
export const getBookings = (params) => api.get('/bookings', { params });
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) => api.put(`/bookings/${id}/cancel`, { reason });
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });
