import { Response } from 'express';
import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { page, limit } = paginationSchema.parse(req.query);
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getMyOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const order = await Order.findOne({ _id: id, user: req.user._id }).lean();
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});

export const getMyOrderByNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const orderNumber = String(req.params.orderNumber || '').toUpperCase();
  const order = await Order.findOne({ orderNumber, user: req.user._id }).lean();
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});
