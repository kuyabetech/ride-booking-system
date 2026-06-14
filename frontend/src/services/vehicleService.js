import api from './api.js';

// Vehicle Management APIs
export const addVehicle = async (vehicleData) => {
  return await api.post('/vehicles', vehicleData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getVehicles = async (status = 'all', page = 1, limit = 10) => {
  return await api.get(`/vehicles?status=${status}&page=${page}&limit=${limit}`);
};

export const assignVehicleToDriver = async (driverId, vehicleId) => {
  return await api.post('/vehicles/assign', { driverId, vehicleId });
};

export const updateVehicleMaintenance = async (vehicleId, maintenanceStatus, nextMaintenanceDate) => {
  return await api.put(`/vehicles/${vehicleId}/maintenance`, {
    maintenanceStatus,
    nextMaintenanceDate
  });
};

export const getVehicleAssignmentHistory = async (vehicleId) => {
  return await api.get(`/vehicles/${vehicleId}/assignment-history`);
};
