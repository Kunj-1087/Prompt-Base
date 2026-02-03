import { Request, Response } from 'express';
import Activity from '../models/activity.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

export const getActivities = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const skip = (page - 1) * limit;

  // Filter? "Team" vs "Me". For now, return all recent activities (assuming small team)
  // or user's activities?
  // Request said "user's activity" (/activity) and "team activity" (/activity/team).
  // Let's implement /activity (user provided param scope?)
  
  const scope = req.query.scope; // 'me' | 'team' (default team/all?)
  
  const query: any = {};
  if (scope === 'me') {
      query.user = req.user.id;
  }
  // else return all? Or maybe filter by users followed? 
  // Given no "Team" model, "All" is the closest proxy for "Team" in this MVP.
  
  const activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name avatar');

  const total = await Activity.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  sendResponse(res, 200, 'Activities retrieved', {
      data: activities,
      pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages
      }
  });
};
