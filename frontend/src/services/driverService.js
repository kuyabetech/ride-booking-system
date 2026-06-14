import api from './api.js';

// Driver Profile & Ride APIs
export const getDriverProfile = () => api.get('/drivers/profile');
export const getAssignedRides = (params) => api.get('/drivers/assigned-rides', { params });
export const updateDriverLocation = (latitude, longitude) => 
  api.put('/drivers/location', { latitude, longitude });
export const updateRideStatus = (bookingId, status) => 
  api.put(`/drivers/rides/${bookingId}/status`, { status });
export const updateDriverStatus = (status) => 
  api.put('/drivers/status', { status });

// Driver Application APIs
export const submitDriverApplication = async (formData) => {
  return await api.post('/driver-applications/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getDriverApplications = async (status = 'submitted', page = 1) => {
  return await api.get(`/driver-applications/applications?status=${status}&page=${page}`);
};

export const approveDriverApplication = async (applicationId, vehicleId = null) => {
  return await api.post(`/driver-applications/applications/${applicationId}/approve`, {
    vehicleId
  });
};

export const rejectDriverApplication = async (applicationId, rejectionReason, reviewerNotes = '') => {
  return await api.post(`/driver-applications/applications/${applicationId}/reject`, {
    rejectionReason,
    reviewerNotes
  });
};

export const getDriversList = async (page = 1, limit = 10) => {
  return await api.get(`/driver-applications/list?page=${page}&limit=${limit}`);
};
