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

export default async function handler(req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) {
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
