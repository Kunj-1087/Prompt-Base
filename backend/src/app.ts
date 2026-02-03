import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import v1Router from './routes/v1';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', v1Router);


import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
