import { UserRole } from '../models/user.model';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | Types.ObjectId;
        role: string;
      };
      sessionId?: string;
    }
  }
}
