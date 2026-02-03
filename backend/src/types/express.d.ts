import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string | Types.ObjectId;
      role: string;
    };
    sessionId?: string;
  }
}

export {};
