import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as driverController from '../controllers/driver.controller.js';

const router = express.Router();

router.get('/profile', authenticate, authorize('driver'), driverController.getDriverProfile);
router.get('/assigned-rides', authenticate, authorize('driver'), driverController.getAssignedRides);
router.put('/location', authenticate, authorize('driver'), driverController.updateDriverLocation);
router.put('/rides/:bookingId/status', authenticate, authorize('driver'), driverController.updateRideStatus);
router.put('/status', authenticate, authorize('driver'), driverController.updateDriverStatus);

export default router;
