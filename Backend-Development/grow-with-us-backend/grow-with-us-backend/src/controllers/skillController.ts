import { Request, Response, NextFunction } from 'express';
import Skill, { ISkill } from '../models/Skill';

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all skills with filtering, sorting and pagination
// @route   GET /api/skills
// @access  Public
export const getSkills = async (
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
    let query = Skill.find(JSON.parse(queryStr));

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
      query = query.sort('name');
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Skill.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const skills = await query;

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
      count: skills.length,
      pagination,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: `Skill not found with id of ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: `Skill not found with id of ${req.params.id}`,
      });
      return;
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: `Skill not found with id of ${req.params.id}`,
      });
      return;
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a resource to a skill
// @route   POST /api/skills/:id/resources
// @access  Private (Admin or Mentor)
export const addSkillResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, url, type } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: `Skill not found with id of ${req.params.id}`,
      });
      return;
    }

    // Add the resource
    skill.resources = [
      ...(skill.resources || []),
      {
        title,
        url,
        type: type || 'other',
      },
    ];

    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Resource added successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a resource from a skill
// @route   DELETE /api/skills/:id/resources/:resourceId
// @access  Private (Admin)
export const removeSkillResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: `Skill not found with id of ${req.params.id}`,
      });
      return;
    }

    // Find resource by ID (_id is a MongoDB ObjectID in this case)
    if (!skill.resources) {
      res.status(404).json({
        success: false,
        message: `No resources found for this skill`,
      });
      return;
    }

    // Filter out the resource to remove
    skill.resources = skill.resources.filter(
      (resource) => resource._id!.toString() !== req.params.resourceId
    );

    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Resource removed successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};
