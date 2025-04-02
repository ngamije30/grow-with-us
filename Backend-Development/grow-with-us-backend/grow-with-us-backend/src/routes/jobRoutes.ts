import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController';
import { protect, authorize } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Apply API rate limiting
router.use(apiLimiter);

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes (only admin and mentors can create jobs)
router.post('/', protect, authorize('admin', 'mentor'), createJob);

// Protected routes (only admin or owner can update and delete)
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
