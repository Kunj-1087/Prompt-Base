import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { sendResponse } from '../utils/response';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error: any) {
    if (error.errors) {
        // Format Zod errors
        const errorMessages = error.errors.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message
        }));
        return sendResponse(res, 400, 'Validation Error', errorMessages);
    }
    return sendResponse(res, 400, 'Validation failed');
  }
};
