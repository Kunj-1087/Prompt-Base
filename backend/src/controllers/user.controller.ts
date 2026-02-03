import { Request, Response } from 'express';
import User from '../models/user.model';
import UserProfile from '../models/userProfile.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const profile = await UserProfile.findOne({ user: userId });

  sendResponse(res, 200, 'User profile retrieved', {
    user,
    profile,
  });
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, bio, phone, location, dateOfBirth, socialLinks, avatarUrl, preferences } = req.body;

  // Update User
  const user = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update Profile (upsert)
  const profile = await UserProfile.findOneAndUpdate(
    { user: userId },
    { bio, phone, location, dateOfBirth, socialLinks, avatarUrl, preferences },
    { new: true, upsert: true, runValidators: true }
  );

  sendResponse(res, 200, 'User profile updated', {
    user,
    profile,
  });
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { avatarUrl } = req.body;

  if (!avatarUrl) {
    throw new AppError('Please provide an avatar URL', 400);
  }

  const profile = await UserProfile.findOneAndUpdate(
    { user: userId },
    { avatarUrl },
    { new: true, upsert: true, runValidators: true }
  );

  sendResponse(res, 200, 'Avatar updated successfully', {
    profile,
  });
};
