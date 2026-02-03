import dotenv from 'dotenv';
import app from './app';
import connectToDatabase from './config/database';

dotenv.config();

const startServer = async () => {
  await connectToDatabase();
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

