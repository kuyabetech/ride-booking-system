import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorize('admin'), adminController.getAdminDashboard);
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.get('/drivers', authenticate, authorize('admin'), adminController.getAllDrivers);
router.get('/vehicles', authenticate, authorize('admin'), adminController.getAllVehicles);
router.get('/bookings', authenticate, authorize('admin'), adminController.getAllBookings);
router.delete('/users/:userId', authenticate, authorize('admin'), adminController.deleteUser);
router.delete('/drivers/:driverId', authenticate, authorize('admin'), adminController.deleteDriver);
router.delete('/vehicles/:vehicleId', authenticate, authorize('admin'), adminController.deleteVehicle);
router.delete('/bookings/:bookingId', authenticate, authorize('admin'), adminController.cancelBooking);
router.patch('/users/:userId/deactivate', authenticate, authorize('admin'), adminController.deactivateUser);
router.get('/reports', authenticate, authorize('admin'), adminController.getReports);

export default router;
