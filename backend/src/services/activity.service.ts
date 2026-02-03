import Activity, { IActivity } from '../models/activity.model';
import { SocketService } from './socket.service';
import mongoose from 'mongoose';

export class ActivityService {
  static async logActivity(
    userId: string | mongoose.Types.ObjectId,
    action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'commented' | 'shared',
    entityType: 'prompt' | 'comment' | 'user',
    entityId: string | mongoose.Types.ObjectId,
    entityTitle?: string,
    details?: Record<string, any>
  ): Promise<IActivity> {
    const activity = await Activity.create({
      user: userId,
      action,
      entityType,
      entityId,
      entityTitle,
      details
    });

    const populatedActivity = await activity.populate('user', 'name avatar');

    // Broadcast via Socket
    // We emit to everyone for now, or maybe just to the specific user's room if we had user rooms?
    // For "Feed", usually we want to see what OTHERS did.
    // If we have a "Team" room or "Global" room, we emit there.
    // Let's emit to a 'global_activity' room that connected clients join, OR just emit to everyone for this demo.
    const socketService = SocketService.getInstance();
    if (socketService) {
        // Emit to all connected clients for "Team Activity"
        socketService.getIO().emit('new_activity', populatedActivity);
    }

    return populatedActivity;
  }
}
