import dotenv from 'dotenv';
import app from './app';
import connectToDatabase from './config/database';

dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import { SocketService } from './services/socket.service';

const startServer = async () => {
  await connectToDatabase();
  
  const PORT = process.env.PORT || 5000;
  
  const server = http.createServer(app);
  
  const io = new Server(server, {
      cors: {
          origin: process.env.CLIENT_URL || "http://localhost:5173",
          methods: ["GET", "POST"],
          credentials: true
      }
  });

  // Initialize Socket Service
  new SocketService(io);
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

