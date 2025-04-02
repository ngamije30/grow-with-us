import { Request, Response, NextFunction } from 'express';
import Job, { IJob } from '../models/Job';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin or Mentor)
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Set the posted by to the current user
    req.body.postedBy = req.user!._id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with filtering, sorting and pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string and operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resources
    let query = Job.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const jobs = await query;

    // Pagination result
    const pagination: any = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin or owner)
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`,
      });
      return;
    }

    // Make sure user is job owner or admin
    if (
      job.postedBy.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: `User ${req.user!._id} is not authorized to update this job`,
      });
      return;
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin or owner)
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`,
      });
      return;
    }

    // Make sure user is job owner or admin
    if (
      job.postedBy.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: `User ${req.user!._id} is not authorized to delete this job`,
      });
      return;
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
