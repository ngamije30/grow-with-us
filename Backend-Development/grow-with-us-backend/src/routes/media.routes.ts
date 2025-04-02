import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { mediaController } from '../controllers/media.controller';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Define route handlers directly
router.get('/conversations', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

router.get('/:otherUserId', [
  param('otherUserId').notEmpty().withMessage('User ID is required'),
  validate
], async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { otherUserId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { AND: [{ senderId: userId }, { receiverId: otherUserId }] },
          { AND: [{ senderId: otherUserId }, { receiverId: userId }] }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.post('/', [
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  validate
], async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { content, receiverId } = req.body;
    
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

router.delete('/:messageId', [
  param('messageId').notEmpty().withMessage('Message ID is required'),
  validate
], async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { messageId } = req.params;
    
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await prisma.message.delete({
      where: { id: messageId }
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

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


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and documents
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// All media routes require authentication
router.use(authMiddleware);

// Routes
router.post('/upload', 
  upload.single('file'), 
  mediaController.uploadMedia
);

router.post('/upload/multiple', 
  upload.array('files', 5), // Max 5 files
  mediaController.uploadMultipleMedia
);

router.get('/', mediaController.getUserMedia);

router.get('/:mediaId', [
  param('mediaId').isUUID(),
], validate, mediaController.getMediaById);

router.delete('/:mediaId', [
  param('mediaId').isUUID(),
], validate, mediaController.deleteMedia);

router.get('/conversations', getConversations);

router.get('/:otherUserId', [
  param('otherUserId').notEmpty().withMessage('User ID is required'),
], validate, getMessages);

router.post('/', messageValidation, validate, sendMessage);

router.delete('/:messageId', [
  param('messageId').notEmpty().withMessage('Message ID is required'),
], validate, deleteMessage);

// Media sharing routes
router.post('/:mediaId/share', [
  param('mediaId').isUUID(),
], validate, mediaController.shareMedia);

router.get('/shared/with-me', mediaController.getSharedMedia);

// Media analytics
router.get('/:mediaId/analytics', [
  param('mediaId').isUUID(),
], validate, mediaController.getMediaAnalytics);

export { router as mediaRouter };