import { AnalyticsEvent, IAnalyticsEvent } from '../models/analytics.model';
import { startOfDay, endOfDay, subDays } from 'date-fns';

interface TrackEventParams {
  userId?: string;
  sessionId: string;
  eventType: 'page_view' | 'feature_usage' | 'conversion' | 'error' | 'performance' | 'custom';
  eventName: string;
  eventData?: Record<string, any>;
  page?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  performance?: {
    loadTime?: number;
    responseTime?: number;
    resourceSize?: number;
  };
}

interface AnalyticsStats {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  topEvents: Array<{ name: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
}

class AnalyticsService {
  /**
   * Track an analytics event
   */
  async trackEvent(params: TrackEventParams): Promise<IAnalyticsEvent> {
    const event = await AnalyticsEvent.create({
      userId: params.userId,
      sessionId: params.sessionId,
      eventType: params.eventType,
      eventName: params.eventName,
      eventData: params.eventData || {},
      page: params.page,
      referrer: params.referrer,
      userAgent: params.userAgent,
      ipAddress: params.ipAddress,
      performance: params.performance,
      timestamp: new Date(),
    });

    return event;
  }

  /**
   * Get analytics statistics for a date range
   */
  async getStats(startDate: Date, endDate: Date, userId?: string): Promise<AnalyticsStats> {
    const query: any = {
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (userId) {
      query.userId = userId;
    }

    const [totalEvents, uniqueUsers, uniqueSessions, topEvents, topPages] = await Promise.all([
      // Total events
      AnalyticsEvent.countDocuments(query),

      // Unique users
      AnalyticsEvent.distinct('userId', query).then((users) => users.filter(Boolean).length),

      // Unique sessions
      AnalyticsEvent.distinct('sessionId', query).then((sessions) => sessions.length),

      // Top events
      AnalyticsEvent.aggregate([
        { $match: query },
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),

      // Top pages
      AnalyticsEvent.aggregate([
        { $match: { ...query, page: { $exists: true, $ne: null } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { page: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    return {
      totalEvents,
      uniqueUsers,
      uniqueSessions,
      topEvents,
      topPages,
    };
  }

  /**
   * Get user behavior funnel
   */
  async getFunnel(steps: string[], startDate: Date, endDate: Date): Promise<Array<{ step: string; count: number; dropoff: number }>> {
    const results: Array<{ step: string; count: number; dropoff: number }> = [];

    for (let i = 0; i < steps.length; i++) {
      const count = await AnalyticsEvent.countDocuments({
        eventName: steps[i],
        timestamp: { $gte: startDate, $lte: endDate },
      });

      const dropoff = i > 0 ? ((results[i - 1].count - count) / results[i - 1].count) * 100 : 0;

      results.push({
        step: steps[i],
        count,
        dropoff: Math.round(dropoff * 100) / 100,
      });
    }

    return results;
  }

  /**
   * Get retention metrics
   */
  async getRetention(days: number = 30): Promise<any> {
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    const dailyActiveUsers = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate },
          userId: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            userId: '$userId',
          },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: '$_id',
          activeUsers: '$count',
          _id: 0,
        },
      },
    ]);

    return dailyActiveUsers;
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(startDate: Date, endDate: Date): Promise<any> {
    const metrics = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'performance',
          timestamp: { $gte: startDate, $lte: endDate },
          'performance.loadTime': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgLoadTime: { $avg: '$performance.loadTime' },
          maxLoadTime: { $max: '$performance.loadTime' },
          minLoadTime: { $min: '$performance.loadTime' },
          avgResponseTime: { $avg: '$performance.responseTime' },
          count: { $sum: 1 },
        },
      },
    ]);

    return metrics[0] || {
      avgLoadTime: 0,
      maxLoadTime: 0,
      minLoadTime: 0,
      avgResponseTime: 0,
      count: 0,
    };
  }

  /**
   * Get error rate
   */
  async getErrorRate(startDate: Date, endDate: Date): Promise<number> {
    const [totalEvents, errorEvents] = await Promise.all([
      AnalyticsEvent.countDocuments({
        timestamp: { $gte: startDate, $lte: endDate },
      }),
      AnalyticsEvent.countDocuments({
        eventType: 'error',
        timestamp: { $gte: startDate, $lte: endDate },
      }),
    ]);

    return totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;
  }

  /**
   * Get feature usage statistics
   */
  async getFeatureUsage(startDate: Date, endDate: Date): Promise<Array<{ feature: string; usage: number; uniqueUsers: number }>> {
    const usage = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'feature_usage',
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$eventName',
          usage: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          feature: '$_id',
          usage: 1,
          uniqueUsers: { $size: { $filter: { input: '$uniqueUsers', cond: { $ne: ['$$this', null] } } } },
          _id: 0,
        },
      },
      {
        $sort: { usage: -1 },
      },
    ]);

    return usage;
  }
}

export default new AnalyticsService();
