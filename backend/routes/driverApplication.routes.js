import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as driverAppController from '../controllers/driverApplication.controller.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/driver-applications/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Driver registration routes
router.post(
  '/apply',
  authenticate,
  upload.fields([
    { name: 'license_photo', maxCount: 1 },
    { name: 'profile_photo', maxCount: 1 },
    { name: 'medical_certificate', maxCount: 1 },
    { name: 'training_certificate', maxCount: 1 }
  ]),
  driverAppController.submitDriverApplication
);

// Admin routes
router.get(
  '/applications',
  authenticate,
  authorize('admin'),
  driverAppController.getDriverApplications
);

router.post(
  '/applications/:applicationId/approve',
  authenticate,
  authorize('admin'),
  driverAppController.approveDriver
);

router.post(
  '/applications/:applicationId/reject',
  authenticate,
  authorize('admin'),
  driverAppController.rejectDriver
);

router.get(
  '/list',
  authenticate,
  authorize('admin'),
  driverAppController.getDrivers
);

export default router;
