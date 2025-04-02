import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { authLimiter, createUserLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Apply rate limiting to auth routes
router.post('/register', createUserLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
