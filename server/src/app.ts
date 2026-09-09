import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = config.port;

// Security & parsing
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FIVE Fashion API is running',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

// Connect DB and start
const start = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`FIVE Fashion server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;
