import express from 'express';
import {
  createMentorship,
  getMentorships,
  getMentorship,
  updateMentorship,
  deleteMentorship,
  enrollMentorship,
  unenrollMentorship,
} from '../controllers/mentorshipController';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { protect, authorize } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Message handlers
const getConversations = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    // Your conversation logic here
    res.json({ message: "Get conversations endpoint" });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

const getMessages = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { otherUserId } = req.params;
    // Your messages logic here
    res.json({ message: "Get messages endpoint" });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

const sendMessage = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { content, receiverId } = req.body;
    // Your send message logic here
    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

const deleteMessage = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { messageId } = req.params;
    // Your delete message logic here
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
};
// Validation rules
const messageValidation = [
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
];


// Apply API rate limiting
router.use(apiLimiter);

// Public routes
router.get('/', getMentorships);
router.get('/:id', getMentorship);

// Protected routes (only mentors and admins can create mentorships)
router.post('/', protect, authorize('mentor', 'admin'), createMentorship);

// Protected routes (only owner or admin can update and delete)
router.put('/:id', protect, updateMentorship);
router.delete('/:id', protect, deleteMentorship);

// Routes
router.get('/conversations', getConversations);

router.get('/:otherUserId', [
  param('otherUserId').notEmpty().withMessage('User ID is required'),
], validate, getMessages);

router.post('/', messageValidation, validate, sendMessage);

router.delete('/:messageId', [
  param('messageId').notEmpty().withMessage('Message ID is required'),
], validate, deleteMessage);

export { router as messageRouter };

export default router;
