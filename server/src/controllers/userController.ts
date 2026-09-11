import { Response } from 'express';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';
import { z } from 'zod';

export const adminListUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.q) {
    const q = String(req.query.q);
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const adminGetUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const user = await User.findById(id).lean();
  if (!user) throw new AppError('User not found', 404);
  const orderCount = await Order.countDocuments({ user: id });
  res.status(200).json({ success: true, data: { ...user, orderCount } });
});

const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['user', 'admin']).optional(),
  name: z.string().min(2).max(100).optional(),
});

export const adminUpdateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const data = updateUserSchema.parse(req.body);
  if (req.user && String(req.user._id) === id && data.role === 'user') {
    throw new AppError('Cannot demote your own admin account', 400);
  }
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});
