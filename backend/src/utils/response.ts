import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: object | null;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
  error: object | null = null
): void => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    error,
  };

  res.status(statusCode).json(response);
};
