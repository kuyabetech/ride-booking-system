import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as vehicleController from '../controllers/vehicle.controller.js';
import multer from 'multer';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vehicles/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// All vehicle routes require admin authorization
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'registration_doc', maxCount: 1 },
    { name: 'insurance_doc', maxCount: 1 },
    { name: 'vehicle_photo', maxCount: 1 }
  ]),
  vehicleController.addVehicle
);

router.get(
  '/',
  authenticate,
  authorize('admin'),
  vehicleController.getVehicles
);

router.post(
  '/assign',
  authenticate,
  authorize('admin'),
  vehicleController.assignVehicleToDriver
);

router.put(
  '/:vehicleId/maintenance',
  authenticate,
  authorize('admin'),
  vehicleController.updateVehicleMaintenance
);

router.get(
  '/:vehicleId/assignment-history',
  authenticate,
  authorize('admin'),
  vehicleController.getVehicleAssignmentHistory
);

export default router;
