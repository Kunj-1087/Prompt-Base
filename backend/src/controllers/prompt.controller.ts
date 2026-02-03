import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Prompt from '../models/prompt.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

import { ActivityService } from '../services/activity.service';

// @desc    Create new prompt
// @route   POST /api/v1/prompts
// @access  Private
export const createPrompt = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const prompt = await Prompt.create({
    ...req.body,
    user: req.user.id
  });

  await ActivityService.logActivity(
    req.user.id,
    'created',
    'prompt',
    prompt._id,
    prompt.title
  );

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

  // Determine action (updated vs status_changed)
  if (req.body.status && req.body.status !== (prompt as any)._original?.status) { // Need to track original if possible, but Mongoose findOneAndUpdate does that. Here we loaded first. 
     // We can't easily check previous state here unless we cloned it.
     // For simplicity, just log 'updated'. Or if status is unique...
     // Since we mutate `prompt` above, we lost old val.
     // Let's iterate updates above and check? Or just log 'updated' for now.
  }
  
  await ActivityService.logActivity(
    req.user.id,
    'updated',
    'prompt',
    prompt._id,
    prompt.title,
    { updates: Object.keys(req.body) }
  );

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

  await ActivityService.logActivity(
      req.user.id,
      'deleted',
      'prompt',
      prompt._id,
      prompt.title
  );

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

// @desc    Search prompts (Advanced with Facets)
// @route   GET /api/v1/prompts/search?q=query&filter[status]=active
// @access  Private
export const searchPrompts = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  
  const { q } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const skip = (page - 1) * limit;

  const matchStage: any = {
      user: new mongoose.Types.ObjectId(req.user.id),
      isDeleted: false
  };

  // Text Search
  if (q) {
      matchStage.$text = { $search: q as string };
  }

  // Dynamic Filters (expecting filter[key]=value)
  const filters = req.query.filter as Record<string, any>;
  if (filters) {
      if (filters.status) matchStage.status = filters.status;
      if (filters.priority) matchStage.priority = filters.priority;
      if (filters.tags) {
           // Handle single tag or array, assuming comma separated if string in query, 
           // but if passed as filter[tags][]=x it might be array. 
           // Let's assume comma separated string for simplicity in query param structure or array.
           const tags = Array.isArray(filters.tags) ? filters.tags : (filters.tags as string).split(',');
           matchStage.tags = { $in: tags };
      }
      // Add date range example: filter[date][start]=...
  }

  // Sorting
  const { sort, order } = req.query;
  let sortStage: any = { score: { $meta: 'textScore' }, createdAt: -1 }; // Default sort
  
  if (sort) {
      const sortOrder = order === 'asc' ? 1 : -1;
      const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];
      const sortField = allowedSortFields.includes(sort as string) ? (sort as string) : 'createdAt';
      
      // If explicit sort, we prioritize it over text score, or keep text score as secondary?
      // Usually explicit sort overrides.
      sortStage = { [sortField]: sortOrder };
  } else if (!q) {
      // If no query, default sort by createdAt
      sortStage = { createdAt: -1 };
  }

  const pipeline = [
      { $match: matchStage },
      {
          $facet: {
              results: [
                  { $sort: sortStage },
                  { $skip: skip },
                  { $limit: limit }
              ],
              totalCount: [
                  { $count: 'count' }
              ],
              // Facets
              statusCounts: [
                  { $group: { _id: '$status', count: { $sum: 1 } } }
              ],
              priorityCounts: [
                  { $group: { _id: '$priority', count: { $sum: 1 } } }
              ],
              // Tags facet might be expensive on large datasets with many tags, use with caution
              tagsCounts: [
                  { $unwind: '$tags' },
                  { $group: { _id: '$tags', count: { $sum: 1 } } },
                  { $sort: { count: -1 } },
                  { $limit: 20 } // Top 20 tags
              ]
          }
      }
  ];

  const [result] = await Prompt.aggregate(pipeline as mongoose.PipelineStage[]);

  const prompts = result.results;
  const total = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Format facets
  const facets = {
      status: result.statusCounts.map((f: any) => ({ label: f._id, count: f.count })),
      priority: result.priorityCounts.map((f: any) => ({ label: f._id, count: f.count })),
      tags: result.tagsCounts.map((f: any) => ({ label: f._id, count: f.count }))
  };

  sendResponse(res, 200, 'Search results retrieved successfully', {
      data: prompts,
      meta: {
          facets
      },
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
