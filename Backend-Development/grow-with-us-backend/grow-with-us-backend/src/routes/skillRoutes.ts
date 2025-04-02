import express from 'express';
import {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
  addSkillResource,
  removeSkillResource,
} from '../controllers/skillController';
import { protect, authorize } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Apply API rate limiting
router.use(apiLimiter);

// Public routes
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes (only admins can create, update, and delete skills)
router.post('/', protect, authorize('admin'), createSkill);
router.put('/:id', protect, authorize('admin'), updateSkill);
router.delete('/:id', protect, authorize('admin'), deleteSkill);

// Routes for skill resources (admins and mentors can add resources)
router.post(
  '/:id/resources',
  protect,
  authorize('admin', 'mentor'),
  addSkillResource
);
router.delete(
  '/:id/resources/:resourceId',
  protect,
  authorize('admin'),
  removeSkillResource
);

export default router;
