import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendResponse } from '../utils/response';

export const checkHealth = async (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  sendResponse(res, 200, 'Health check successful', {
    uptime: process.uptime(),
    dbStatus,
    timestamp: new Date().toISOString()
  });
};
