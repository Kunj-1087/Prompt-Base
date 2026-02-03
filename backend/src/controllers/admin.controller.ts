import { Request, Response } from 'express';
import User, { UserRole } from '../models/user.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password');

  sendResponse(res, 200, 'Users retrieved successfully', {
    count: users.length,
    users,
  });
};

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!Object.values(UserRole).includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const userToUpdate = await User.findById(userId);

  if (!userToUpdate) {
    throw new AppError('User not found', 404);
  }

  // Safety Check: If demoting an admin, ensure at least one other admin exists
  if (userToUpdate.role === UserRole.ADMIN && role !== UserRole.ADMIN) {
    const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
    if (adminCount <= 1) {
      throw new AppError('Cannot demote the last admin', 400);
    }
  }

  userToUpdate.role = role;
  await userToUpdate.save();

  sendResponse(res, 200, `User role updated to ${role}`, {
    user: {
      _id: userToUpdate._id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      role: userToUpdate.role,
    },
  });
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const userToDelete = await User.findById(userId);

  if (!userToDelete) {
    throw new AppError('User not found', 404);
  }

  // Safety Check: If deleting an admin, ensure at least one other admin exists
  if (userToDelete.role === UserRole.ADMIN) {
    const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
    if (adminCount <= 1) {
      throw new AppError('Cannot delete the last admin', 400);
    }
  }

  await userToDelete.deleteOne();

  sendResponse(res, 200, 'User deleted successfully');
};
