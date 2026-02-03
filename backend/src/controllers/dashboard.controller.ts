import { Request, Response } from 'express';
import Item from '../models/item.model';
import Activity from '../models/activity.model';
import {sendResponse} from '../utils/response';
import { AppError } from '../utils/AppError';

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: Request, res: Response) => {
  if (!req.user) {
      throw new AppError('User not authenticated check failed', 401); 
  }
  const userId = req.user.id;

  const totalItems = await Item.countDocuments({ user: userId });
  const activeItems = await Item.countDocuments({ user: userId, status: 'active' });
  const recentActivityCount = await Activity.countDocuments({ 
    user: userId, 
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
  });

  // Calculate generic completion rate or other metric if applicable
  // For now, let's say "Profile Completion" based on profile fields (mocked or real)
  // We'll stick to Item-based stats for now.
  const completionRate = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;

  sendResponse(res, 200, 'Dashboard stats retrieved', {
    totalItems,
    activeItems,
    recentActivityCount,
    completionRate
  });
};

// @desc    Get recent activity
// @route   GET /api/v1/dashboard/activity
// @access  Private
export const getRecentActivity = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated check failed', 401);
  }
  const userId = req.user.id;
  const limit = parseInt(req.query.limit as string) || 5;

  const activities = await Activity.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  sendResponse(res, 200, 'Recent activity retrieved', {
    activities
  });
};

// @desc    Get full dashboard summary (stats + recent activity)
// @route   GET /api/v1/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated check failed', 401);
  }
  const userId = req.user.id;

  const [stats, activities] = await Promise.all([
    (async () => {
      const totalItems = await Item.countDocuments({ user: userId });
      const activeItems = await Item.countDocuments({ user: userId, status: 'active' });
      const recentActivityCount = await Activity.countDocuments({ 
          user: userId, 
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
      });
      const completionRate = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;
      return { totalItems, activeItems, recentActivityCount, completionRate };
    })(),
    Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(5)
  ]);

  sendResponse(res, 200, 'Dashboard summary retrieved', {
    stats,
    activities
  });
};
