import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user.routes';
import { messageRouter } from './routes/message.routes';
import { mediaRouter } from './routes/media.routes';
import { errorHandler } from './middlewares/error.middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRouter);
app.use('/api/messages', messageRouter);
app.use('/api/media', mediaRouter);

// Basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };