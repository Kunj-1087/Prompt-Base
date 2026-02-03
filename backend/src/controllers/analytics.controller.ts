import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service';
import { subDays } from 'date-fns';

/**
 * Track an analytics event
 */
export const trackEvent = async (req: Request, res: Response) => {
  try {
    const { eventType, eventName, eventData, page, referrer, performance } = req.body;
    const userId = req.user?.id?.toString();
    const sessionId = req.headers['x-session-id'] as string || `session-${Date.now()}`;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const event = await analyticsService.trackEvent({
      userId,
      sessionId,
      eventType,
      eventName,
      eventData,
      page,
      referrer,
      userAgent,
      ipAddress,
      performance,
    });

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      data: { eventId: event._id },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error tracking event',
      error: error.message,
    });
  }
};

/**
 * Get analytics statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const { days = 7, userId } = req.query;
    const endDate = new Date();
    const startDate = subDays(endDate, Number(days));

    const stats = await analyticsService.getStats(
      startDate,
      endDate,
      userId as string
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

/**
 * Get conversion funnel
 */
export const getFunnel = async (req: Request, res: Response) => {
  try {
    const { steps, days = 7 } = req.query;
    const endDate = new Date();
    const startDate = subDays(endDate, Number(days));

    if (!steps || typeof steps !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Steps parameter is required (comma-separated)',
      });
    }

    const stepArray = steps.split(',').map((s) => s.trim());
    const funnel = await analyticsService.getFunnel(stepArray, startDate, endDate);

    res.json({
      success: true,
      data: { funnel },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching funnel',
      error: error.message,
    });
  }
};

/**
 * Get retention metrics
 */
export const getRetention = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const retention = await analyticsService.getRetention(Number(days));

    res.json({
      success: true,
      data: { retention },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching retention',
      error: error.message,
    });
  }
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (req: Request, res: Response) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = subDays(endDate, Number(days));

    const metrics = await analyticsService.getPerformanceMetrics(startDate, endDate);

    res.json({
      success: true,
      data: { metrics },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance metrics',
      error: error.message,
    });
  }
};

/**
 * Get error rate
 */
export const getErrorRate = async (req: Request, res: Response) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = subDays(endDate, Number(days));

    const errorRate = await analyticsService.getErrorRate(startDate, endDate);

    res.json({
      success: true,
      data: { errorRate },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching error rate',
      error: error.message,
    });
  }
};

/**
 * Get feature usage statistics
 */
export const getFeatureUsage = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = subDays(endDate, Number(days));

    const usage = await analyticsService.getFeatureUsage(startDate, endDate);

    res.json({
      success: true,
      data: { usage },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feature usage',
      error: error.message,
    });
  }
};
