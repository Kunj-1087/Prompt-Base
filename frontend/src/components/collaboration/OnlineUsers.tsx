import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; 

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface OnlineUsersProps {
  users: User[];
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground mr-2">Online:</span>
      <div className="flex -space-x-2 overflow-hidden">
        {users.map((user) => (
            <div key={user.id} title={user.name}>
                <Avatar className="inline-block border-2 border-background w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
        ))}
      </div>
    </div>
  );
};
