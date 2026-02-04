import { Feedback, IFeedback } from '../models/feedback.model';
import { emailService } from './email.service';

interface CreateFeedbackParams {
  userId?: string;
  type: 'bug' | 'feature_request' | 'improvement' | 'general' | 'complaint';
  category?: string;
  title: string;
  description: string;
  rating?: number;
  email?: string;
  page?: string;
  userAgent?: string;
  screenshot?: string;
}

interface UpdateFeedbackParams {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'new' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  tags?: string[];
  adminNotes?: string;
}

class FeedbackService {
  /**
   * Create new feedback
   */
  async createFeedback(params: CreateFeedbackParams): Promise<IFeedback> {
    // Auto-prioritize based on type
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (params.type === 'bug') {
      priority = 'high';
    } else if (params.type === 'complaint') {
      priority = 'high';
    } else if (params.type === 'feature_request') {
      priority = 'medium';
    }

    const feedback = await Feedback.create({
      ...params,
      priority,
      status: 'new',
    });

    // Notify admins of critical feedback
    if (params.type === 'bug') {
      await this.notifyAdmins(feedback);
    }

    return feedback;
  }

  /**
   * Get all feedback with filters
   */
  async getFeedback(
    filters: {
      type?: string;
      status?: string;
      priority?: string;
      userId?: string;
    },
    page: number = 1,
    limit: number = 20
  ): Promise<{ feedback: IFeedback[]; total: number; pages: number }> {
    const query: any = {};

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.userId) query.userId = filters.userId;

    const [feedback, total] = await Promise.all([
      Feedback.find(query)
        .populate('userId', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(query),
    ]);

    return {
      feedback,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get feedback by ID
   */
  async getFeedbackById(id: string): Promise<IFeedback | null> {
    return Feedback.findById(id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');
  }

  /**
   * Update feedback
   */
  async updateFeedback(id: string, updates: UpdateFeedbackParams): Promise<IFeedback | null> {
    const feedback = await Feedback.findByIdAndUpdate(id, updates, { new: true });

    // Notify user if status changed to completed
    if (updates.status === 'completed' && feedback) {
      await this.notifyUserOfCompletion(feedback);
    }

    return feedback;
  }

  /**
   * Delete feedback
   */
  async deleteFeedback(id: string): Promise<boolean> {
    const result = await Feedback.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Get feedback statistics
   */
  async getStatistics(): Promise<any> {
    const [totalFeedback, byType, byStatus, byPriority, avgRating] = await Promise.all([
      Feedback.countDocuments(),

      Feedback.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]),

      Feedback.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
      ]),

      Feedback.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $project: { priority: '$_id', count: 1, _id: 0 } },
      ]),

      Feedback.aggregate([
        { $match: { rating: { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]).then((result) => result[0]?.avgRating || 0),
    ]);

    return {
      totalFeedback,
      byType,
      byStatus,
      byPriority,
      avgRating: Math.round(avgRating * 100) / 100,
    };
  }

  /**
   * Notify admins of new critical feedback
   */
  private async notifyAdmins(feedback: IFeedback): Promise<void> {
    try {
      // In a real implementation, you would fetch admin emails from the database
      // For now, this is a placeholder
      console.log(`[FEEDBACK] Critical feedback received: ${feedback.title}`);
      
      // You can implement email notification here
      // await emailService.sendEmail({
      //   to: 'admin@prompt-base.com',
      //   subject: `New ${feedback.type}: ${feedback.title}`,
      //   text: feedback.description,
      // });
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }

  /**
   * Notify user when their feedback is completed
   */
  private async notifyUserOfCompletion(feedback: IFeedback): Promise<void> {
    try {
      if (feedback.email) {
        // Implement email notification
        console.log(`[FEEDBACK] Notifying user about completed feedback: ${feedback.title}`);
      }
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }
}

export default new FeedbackService();
