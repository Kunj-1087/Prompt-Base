import jwt from 'jsonwebtoken';
import config from '../config/env';
import { Types } from 'mongoose';

interface TokenPayload {
  userId: string | Types.ObjectId;
  role: string;
}

export const generateAccessToken = (userId: string | Types.ObjectId, role: string, sessionId?: string | Types.ObjectId): string => {
  return jwt.sign({ userId, role, sessionId }, config.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
