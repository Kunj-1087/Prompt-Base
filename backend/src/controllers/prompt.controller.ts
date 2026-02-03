import { Request, Response } from 'express';
import Prompt from '../models/prompt.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

// @desc    Create new prompt
// @route   POST /api/v1/prompts
// @access  Private
export const createPrompt = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const prompt = await Prompt.create({
    ...req.body,
    user: req.user.id
  });

  sendResponse(res, 201, 'Prompt created successfully', prompt);
};

// @desc    Get all prompts (with filters & pagination)
// @route   GET /api/v1/prompts
// @access  Private
export const getPrompts = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const { status, priority, search, tags, page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
  
  const query: any = { 
      user: req.user.id,
      isDeleted: false 
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (search) {
      query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
      ];
  }

  if (tags) {
      const tagsArray = (tags as string).split(',');
      query.tags = { $in: tagsArray };
  }

  // Pagination Params
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  const sortOrder = order === 'asc' ? 1 : -1;
  const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];
  let sortField = (sort as string) || 'createdAt';
  
  if (!allowedSortFields.includes(sortField)) {
      sortField = 'createdAt';
  }

  const [prompts, total] = await Promise.all([
      Prompt.find(query)
          .sort({ [sortField]: sortOrder })
          .skip(skip)
          .limit(limitNum),
      Prompt.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  sendResponse(res, 200, 'Prompts retrieved successfully', {
      data: prompts,
      pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
      }
  });
};

// @desc    Get single prompt
// @route   GET /api/v1/prompts/:id
// @access  Private
export const getPromptById = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { id } = req.params;

  const prompt = await Prompt.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!prompt) {
    throw new AppError('Prompt not found', 404);
  }

  sendResponse(res, 200, 'Prompt retrieved successfully', prompt);
};

// @desc    Update prompt
// @route   PATCH /api/v1/prompts/:id
// @access  Private
export const updatePrompt = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { id } = req.params;

  const prompt = await Prompt.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!prompt) {
    throw new AppError('Prompt not found', 404);
  }

  // Prevent updating non-editable fields if necessary (like user)
  // Mongoose findOneAndUpdate with restricted keys is safer, or explicit set
  
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'tags', 'metadata'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
      // Optionally strict check, or just ignore extra fields. 
      // For now we trust req.body filters or use Object.assign for allowed keys
  }

  allowedUpdates.forEach((update) => {
      if (req.body[update] !== undefined) {
          (prompt as any)[update] = req.body[update];
      }
  });

  await prompt.save();

  sendResponse(res, 200, 'Prompt updated successfully', prompt);
};

// @desc    Delete prompt (soft)
// @route   DELETE /api/v1/prompts/:id
// @access  Private
export const deletePrompt = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { id } = req.params;

  const prompt = await Prompt.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!prompt) {
    throw new AppError('Prompt not found', 404);
  }

  prompt.isDeleted = true;
  await prompt.save();

  sendResponse(res, 200, 'Prompt deleted successfully');
};

// @desc    Restore prompt
// @route   POST /api/v1/prompts/:id/restore
// @access  Private
export const restorePrompt = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { id } = req.params;

  const prompt = await Prompt.findOne({ _id: id, user: req.user.id, isDeleted: true });

  if (!prompt) {
    throw new AppError('Prompt not found or not deleted', 404);
  }

  prompt.isDeleted = false;
  await prompt.save();

  sendResponse(res, 200, 'Prompt restored successfully', prompt);
};

// @desc    Search prompts (Full Text)
// @route   GET /api/v1/prompts/search?q=query
// @access  Private
export const searchPrompts = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  
  const { q } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const skip = (page - 1) * limit;

  if (!q) {
      throw new AppError('Query parameter "q" is required', 400);
  }

  // Text search query
  const query: any = {
      user: req.user.id,
      isDeleted: false,
      $text: { $search: q as string }
  };

  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;

  const { sort, order } = req.query;
  let sortOptions: any = { score: { $meta: 'textScore' } };

  if (sort) {
      const sortOrder = order === 'asc' ? 1 : -1;
      const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];
      const sortField = allowedSortFields.includes(sort as string) ? (sort as string) : 'createdAt';
      sortOptions = { [sortField]: sortOrder };
  }

  const [prompts, total] = await Promise.all([
      Prompt.find(query)
          .sort(sortOptions) // Sort by relevance default, or override
          .skip(skip)
          .limit(limit),
      Prompt.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);

  sendResponse(res, 200, 'Search results retrieved successfully', {
      data: prompts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
  });
};

// @desc    Get search suggestions (Autocomplete)
// @route   GET /api/v1/prompts/suggestions?q=query
// @access  Private
export const getSuggestions = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);
    
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length < 2) {
        return sendResponse(res, 200, 'Suggestions', []);
    }

    // Suggestions based on Title (Regex)
    const suggestions = await Prompt.find({
        user: req.user.id,
        isDeleted: false,
        title: { $regex: new RegExp(q, 'i') }
    })
    .select('title')
    .limit(5);

    sendResponse(res, 200, 'Suggestions retrieved', suggestions.map(p => p.title));
};
