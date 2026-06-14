import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as bookingController from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.patch('/:id/status', authenticate, bookingController.updateBookingStatus);
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
