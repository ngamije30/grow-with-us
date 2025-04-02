import { Request, Response, NextFunction } from 'express';
import Mentorship, { IMentorship } from '../models/Mentorship';
import User from '../models/User';

// @desc    Create a new mentorship program
// @route   POST /api/mentorships
// @access  Private (Mentor or Admin)
export const createMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Set the mentor to the current user
    req.body.mentor = req.user!._id;

    // Check if the user is a mentor
    if (req.user!.role !== 'mentor' && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Only mentors or admins can create mentorship programs',
      });
      return;
    }

    const mentorship = await Mentorship.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Mentorship program created successfully',
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mentorships with filtering, sorting and pagination
// @route   GET /api/mentorships
// @access  Public
export const getMentorships = async (
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
    let query = Mentorship.find(JSON.parse(queryStr)).populate({
      path: 'mentor',
      select: 'name avatar bio experience',
    });

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
    const total = await Mentorship.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const mentorships = await query;

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
      count: mentorships.length,
      pagination,
      data: mentorships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mentorship
// @route   GET /api/mentorships/:id
// @access  Public
export const getMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mentorship = await Mentorship.findById(req.params.id).populate({
      path: 'mentor',
      select: 'name avatar bio experience',
    });

    if (!mentorship) {
      res.status(404).json({
        success: false,
        message: `Mentorship not found with id of ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mentorship
// @route   PUT /api/mentorships/:id
// @access  Private (Mentor owner or Admin)
export const updateMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      res.status(404).json({
        success: false,
        message: `Mentorship not found with id of ${req.params.id}`,
      });
      return;
    }

    // Make sure user is mentorship owner or admin
    if (
      mentorship.mentor.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: `User ${req.user!._id} is not authorized to update this mentorship`,
      });
      return;
    }

    mentorship = await Mentorship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Mentorship updated successfully',
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mentorship
// @route   DELETE /api/mentorships/:id
// @access  Private (Mentor owner or Admin)
export const deleteMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      res.status(404).json({
        success: false,
        message: `Mentorship not found with id of ${req.params.id}`,
      });
      return;
    }

    // Make sure user is mentorship owner or admin
    if (
      mentorship.mentor.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: `User ${req.user!._id} is not authorized to delete this mentorship`,
      });
      return;
    }

    await mentorship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mentorship deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in a mentorship program
// @route   POST /api/mentorships/:id/enroll
// @access  Private
export const enrollMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      res.status(404).json({
        success: false,
        message: `Mentorship not found with id of ${req.params.id}`,
      });
      return;
    }

    // Check if mentorship is open
    if (mentorship.status !== 'open') {
      res.status(400).json({
        success: false,
        message: 'This mentorship program is not open for enrollment',
      });
      return;
    }

    // Check if mentorship is at capacity
    if (mentorship.enrolled.length >= mentorship.capacity) {
      res.status(400).json({
        success: false,
        message: 'This mentorship program is already at capacity',
      });
      return;
    }

    // Check if user is already enrolled
    if (mentorship.enrolled.includes(req.user!._id)) {
      res.status(400).json({
        success: false,
        message: 'You are already enrolled in this mentorship program',
      });
      return;
    }

    // Add user to enrolled array
    mentorship.enrolled.push(req.user!._id);
    await mentorship.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in mentorship program',
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from a mentorship program
// @route   DELETE /api/mentorships/:id/enroll
// @access  Private
export const unenrollMentorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      res.status(404).json({
        success: false,
        message: `Mentorship not found with id of ${req.params.id}`,
      });
      return;
    }

    // Check if user is enrolled
    if (!mentorship.enrolled.includes(req.user!._id)) {
      res.status(400).json({
        success: false,
        message: 'You are not enrolled in this mentorship program',
      });
      return;
    }

    // Remove user from enrolled array
    mentorship.enrolled = mentorship.enrolled.filter(
      (id) => id.toString() !== req.user!._id.toString()
    );
    await mentorship.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from mentorship program',
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};
