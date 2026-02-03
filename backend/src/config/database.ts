import mongoose from 'mongoose';
import config from './env';

const connectToDatabase = async (): Promise<void> => {
  const options = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    await mongoose.connect(config.DATABASE_URL, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.log('Retrying connection in 5 seconds...');
    
    // Retry logic
    setTimeout(connectToDatabase, 5000);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default connectToDatabase;
