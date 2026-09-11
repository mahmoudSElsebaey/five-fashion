import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/index.js';

/**
 * Canonical error payload for FIVE Fashion API:
 * { success: false, message: string, code?: string, errors?: unknown }
 */

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'APP_ERROR',
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      code: 'INVALID_ID',
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      code: 'MONGOOSE_VALIDATION',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongo duplicate key
  if ((err as { code?: number }).code === 11000) {
    const key = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0];
    return res.status(409).json({
      success: false,
      message: key ? `${key} already exists` : 'Duplicate key error',
      code: 'DUPLICATE_KEY',
    });
  }

  console.error('[errorHandler]', err);
  return res.status(500).json({
    success: false,
    message:
      config.isProduction ? 'Internal server error' : err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};
