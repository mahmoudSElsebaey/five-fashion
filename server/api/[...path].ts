import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { config } from '../src/config/index.js';

let connectionPromise: Promise<typeof mongoose> | null = null;

function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.mongodbUri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
    });
  }
}
