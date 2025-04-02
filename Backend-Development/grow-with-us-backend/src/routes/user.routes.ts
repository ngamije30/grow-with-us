import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const updateProfileValidation = [
  body('name').optional().trim().notEmpty(),
  body('bio').optional().trim(),
];

// Route handlers
const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body;
    // Your register logic here
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    // Your login logic here
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const getProfile = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    // Your get profile logic here
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Add the missing updateProfile handler
const updateProfile = async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        bio: bio || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        profileImage: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile); // Fixed this line

export { router as userRouter };