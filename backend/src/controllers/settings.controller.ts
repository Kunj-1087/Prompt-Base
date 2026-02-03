import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import UserProfile from '../models/userProfile.model';
import Item from '../models/item.model';
import Activity from '../models/activity.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

// @desc    Update notification preferences
// @route   PATCH /api/v1/settings/notifications
// @access  Private
export const updateNotifications = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);
    
    const { email, push, frequency } = req.body;
    
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    if (!userProfile) throw new AppError('Profile not found', 404);

    if (!userProfile.preferences) {
        userProfile.preferences = new Map();
    }

    const notifications = {
        email: email !== undefined ? email : userProfile.preferences.get('notifications')?.email,
        push: push !== undefined ? push : userProfile.preferences.get('notifications')?.push,
        frequency: frequency || userProfile.preferences.get('notifications')?.frequency || 'daily'
    };

    userProfile.preferences.set('notifications', notifications);
    await userProfile.save();

    sendResponse(res, 200, 'Notification preferences updated', { notifications });
};

// @desc    Change password
// @route   PATCH /api/v1/settings/password
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password as string);
    if (!isMatch) throw new AppError('Incorrect current password', 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Ideally, invalidate all other tokens here (not implemented in this simple JWT setup without blacklist)

    sendResponse(res, 200, 'Password updated successfully');
};

// @desc    Get active sessions
// @route   GET /api/v1/settings/sessions
// @access  Private
export const getSessions = async (req: Request, res: Response) => {
    // Mocked data as we don't track sessions in DB yet
    const sessions = [
        {
            id: 'current',
            ip: req.ip,
            device: req.headers['user-agent'] || 'Unknown Device',
            lastActive: new Date(),
            isCurrent: true
        }
    ];

    sendResponse(res, 200, 'Active sessions retrieved', { sessions });
};

// @desc    Export account data
// @route   POST /api/v1/settings/export-data
// @access  Private
export const exportAccountData = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const user = await User.findById(req.user.id);
    const profile = await UserProfile.findOne({ user: req.user.id });
    const items = await Item.find({ user: req.user.id });
    const activities = await Activity.find({ user: req.user.id });

    sendResponse(res, 200, 'Account data exported', {
        user,
        profile,
        items,
        activities
    });
};

// @desc    Delete account
// @route   DELETE /api/v1/settings/account
// @access  Private
export const deleteAccount = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    // Safety check for last admin (reused from admin controller mostly)
    if (user.role === 'admin') {
         const adminCount = await User.countDocuments({ role: 'admin' });
         if (adminCount <= 1) {
             throw new AppError('Cannot delete the last admin account', 400);
         }
    }

    // Delete all related data
    await UserProfile.deleteOne({ user: user._id });
    await Item.deleteMany({ user: user._id });
    await Activity.deleteMany({ user: user._id });
    await user.deleteOne();

    sendResponse(res, 200, 'Account deleted successfully');
};
