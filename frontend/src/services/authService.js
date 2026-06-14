import api from './api.js';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const logoutUser = () => api.post('/auth/logout');
export const refreshToken = (token) => api.post('/auth/refresh-token', { refreshToken: token });
