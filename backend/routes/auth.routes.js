import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('phone').notEmpty().trim()
], authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], authController.login);

router.post('/logout', authenticate, authController.logout);

router.post('/refresh-token', authController.refreshToken);

export default router;
