import express from 'express';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { messageController } from '../controllers/message.controller';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Validation rules
const messageValidation = [
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('receiverId').isUUID().withMessage('Valid receiver ID is required'),
];

// Routes
router.get('/conversations', messageController.getConversations);

router.get('/:otherUserId', [
  param('otherUserId').isUUID().withMessage('Valid user ID is required'),
], validate, messageController.getMessages);

router.post('/', messageValidation, validate, messageController.sendMessage);

router.delete('/:messageId', [
  param('messageId').isUUID().withMessage('Valid message ID is required'),
], validate, messageController.deleteMessage);

export { router as messageRouter };