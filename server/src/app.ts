import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();
const PORT = config.port;
const startedAt = new Date();

app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.get('/api/v1/health', (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStatus =
    mongoState === 1 ? 'connected' : mongoState === 2 ? 'connecting' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'FIVE Fashion API is running',
    version: config.apiVersion,
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt.getTime()) / 1000),
    mongo: mongoStatus,
  });
});

app.use('/api/v1', apiLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(
        `FIVE Fashion server running on port ${PORT} [${config.nodeEnv}] v${config.apiVersion}`
      );
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Vercel imports the Express app as a serverless function and manages the HTTP server.
if (!process.env.VERCEL) {
  start();
}

export default app;
