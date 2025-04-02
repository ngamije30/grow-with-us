import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';

// Route imports
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import mentorshipRoutes from './routes/mentorshipRoutes';
import skillRoutes from './routes/skillRoutes';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/skills', skillRoutes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Grow with Us API',
    version: '1.0.0',
  });
});

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
