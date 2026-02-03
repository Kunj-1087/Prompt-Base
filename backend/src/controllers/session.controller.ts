import { Request, Response } from 'express';
import Session from '../models/session.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

// @desc    Get all active sessions for current user
// @route   GET /api/v1/sessions
// @access  Private
export const getSessions = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    // Current session ID should be attached to req by auth middleware if possible.
    // We'll trust the token's jti or sessionId claim.
    // For now, let's just return all. The frontend can match "current" if we return the token (masked) or ID.
    // Returning token hash/id is safer.

    const sessions = await Session.find({ user: req.user.id }).sort({ lastActivity: -1 });

    // We need to identify the *current* session. 
    // The auth middleware verifies the Access Token. 
    // Ideally the Access Token has the Session ID in it.
    // We haven't modified generateAccessToken yet. 
    // We will update auth middleware to attach sessionId to req.
    const currentSessionId = req.sessionId; 

    const formattedSessions = sessions.map(session => ({
        id: session._id,
        device: session.device || 'Unknown Device',
        browser: session.browser,
        os: session.os,
        ipAddress: session.ipAddress,
        location: session.location,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
        isCurrent: currentSessionId ? session._id.toString() === currentSessionId : false,
    }));

    sendResponse(res, 200, 'Active sessions retrieved', formattedSessions);
};

// @desc    Revoke a specific session
// @route   DELETE /api/v1/sessions/:id
// @access  Private
export const revokeSession = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);
    const { id } = req.params;

    const session = await Session.findOne({ _id: id, user: req.user.id });
    if (!session) throw new AppError('Session not found', 404);

    if (req.sessionId && session._id.toString() === req.sessionId) {
        // Revoking current session = logout
        // We allow it, but frontend should handle redirect.
    }

    await Session.deleteOne({ _id: id });

    sendResponse(res, 200, 'Session revoked');
};

// @desc    Revoke all sessions except current
// @route   DELETE /api/v1/sessions/all
// @access  Private
export const revokeAllSessions = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const currentSessionId = req.sessionId;

    if (!currentSessionId) {
        // Fallback: delete ALL
        await Session.deleteMany({ user: req.user.id });
        return sendResponse(res, 200, 'All sessions revoked. You have been logged out.');
    }

    await Session.deleteMany({ 
        user: req.user.id,
        _id: { $ne: currentSessionId }
    });

    sendResponse(res, 200, 'All other sessions revoked');
};
