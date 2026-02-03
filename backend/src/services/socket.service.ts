import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

export class SocketService {
  private io: Server;
  private static instance: SocketService;

  constructor(io: Server) {
    this.io = io;
    SocketService.instance = this;
    this.initialize();
  }

  public static getInstance(): SocketService {
      return SocketService.instance;
  }

  public getIO(): Server {
      return this.io;
  }

  private initialize() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('join_room', (data: { promptId: string; user: User }) => {
        const { promptId, user } = data;
        
        // Join the room
        socket.join(promptId);
        
        // Store user data on socket instance for disconnect handling
        socket.data.user = user;
        socket.data.room = promptId;

        // Broadcast to room that user joined
        this.io.to(promptId).emit('user_joined', user);

        // Send current list of users in room
        const clients = this.io.sockets.adapter.rooms.get(promptId);
        if (clients) {
            const users: User[] = [];
            clients.forEach((clientId) => {
                const clientSocket = this.io.sockets.sockets.get(clientId);
                if (clientSocket && clientSocket.data.user) {
                    users.push(clientSocket.data.user);
                }
            });
            // Emit to ONLY the user who joined? Or everyone? 
            // Usually everyone to ensure sync, or just sender.
            // Let's emit 'users_online' to everyone to be safe/simple
            this.io.to(promptId).emit('users_online', users);
        }
      });

      socket.on('leave_room', (promptId: string) => {
          this.handleLeave(socket, promptId);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        if (socket.data.room) {
            this.handleLeave(socket, socket.data.room);
        }
      });
    });
  }

  private handleLeave(socket: Socket, room: string) {
      socket.leave(room);
      if (socket.data.user) {
          this.io.to(room).emit('user_left', socket.data.user.id);
          
          // Update online users list
          const clients = this.io.sockets.adapter.rooms.get(room);
          const users: User[] = [];
          if (clients) {
              clients.forEach((clientId) => {
                  const clientSocket = this.io.sockets.sockets.get(clientId);
                  if (clientSocket && clientSocket.data.user) {
                      users.push(clientSocket.data.user);
                  }
              });
          }
          this.io.to(room).emit('users_online', users);
      }
      socket.data.room = null;
  }
}
