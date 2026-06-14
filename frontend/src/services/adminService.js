import api from './api.js';

export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const getAllBookings = (params) => api.get('/admin/bookings', { params });
export const deactivateUser = (userId) => api.patch(`/admin/users/${userId}/deactivate`);
export const getReports = (params) => api.get('/admin/reports', { params });
