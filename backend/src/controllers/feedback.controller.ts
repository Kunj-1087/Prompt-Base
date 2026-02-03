import { Request, Response } from 'express';
import feedbackService from '../services/feedback.service';

/**
 * Create new feedback
 */
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { type, category, title, description, rating, email, screenshot } = req.body;
    const userId = req.user?.id?.toString();
    const page = req.headers.referer;
    const userAgent = req.headers['user-agent'];

    const feedback = await feedbackService.createFeedback({
      userId,
      type,
      category,
      title,
      description,
      rating,
      email,
      page,
      userAgent,
      screenshot,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { feedback },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};

/**
 * Get all feedback (Admin only)
 */
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { type, status, priority, page = 1, limit = 20 } = req.query;

    const result = await feedbackService.getFeedback(
      {
        type: type as string,
        status: status as string,
        priority: priority as string,
      },
      Number(page),
      Number(limit)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};

/**
 * Get user's own feedback
 */
export const getMyFeedback = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id?.toString();
    const { page = 1, limit = 20 } = req.query;

    const result = await feedbackService.getFeedback(
      { userId },
      Number(page),
      Number(limit)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const feedback = await feedbackService.getFeedbackById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      data: { feedback },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};

/**
 * Update feedback (Admin only)
 */
export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { priority, status, assignedTo, tags, adminNotes } = req.body;

    const feedback = await feedbackService.updateFeedback(id, {
      priority,
      status,
      assignedTo,
      tags,
      adminNotes,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: { feedback },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating feedback',
      error: error.message,
    });
  }
};

/**
 * Delete feedback (Admin only)
 */
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await feedbackService.deleteFeedback(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback',
      error: error.message,
    });
  }
};

/**
 * Get feedback statistics (Admin only)
 */
export const getFeedbackStats = async (req: Request, res: Response) => {
  try {
    const stats = await feedbackService.getStatistics();

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
