import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.get('/notifications', authenticate, userController.getUserNotifications);
router.patch('/notifications/:id', authenticate, userController.markNotificationAsRead);

export default router;
