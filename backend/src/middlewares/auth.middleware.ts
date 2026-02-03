import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { sendResponse } from '../utils/response';
import User from '../models/user.model';
import Session from '../models/session.model';

interface DecodedToken {
  userId: string;
  role: string;
  sessionId?: string; // Added optional sessionId
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return sendResponse(res, 401, 'Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

    // Attach user to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    // Attach session ID if present
    if (decoded.sessionId) {
        req.sessionId = decoded.sessionId;

        // Update lastActivity asynchronously
        Session.findByIdAndUpdate(decoded.sessionId, { lastActivity: new Date() }).catch(err => {
            // ignore
        });
    }

    next();
  } catch (error) {
    return sendResponse(res, 401, 'Not authorized, token failed');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(res, 403, 'Not authorized to access this route');
    }
    next();
  };
};
