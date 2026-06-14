import api from './api.js';

export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);
export const getNotifications = (params) => api.get('/users/notifications', { params });
export const markNotificationAsRead = (id) => api.patch(`/users/notifications/${id}`);
