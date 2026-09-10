import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';
import { createCouponSchema, updateCouponSchema } from '../validators/commerceValidators.js';
import { z } from 'zod';

const codeParamSchema = z.object({
  code: z.string().min(1).transform((v) => v.trim().toUpperCase()),
});

export const getCouponByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = codeParamSchema.parse(req.params);
  const coupon = await Coupon.findOne({ code, isActive: true }).lean();
  if (!coupon) throw new AppError('Coupon not found or inactive', 404);
  const now = new Date();
  if (coupon.startDate && coupon.startDate > now) throw new AppError('Coupon is not active yet', 400);
  if (coupon.expiryDate && coupon.expiryDate < now) throw new AppError('Coupon has expired', 400);
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }
  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount,
      maximumDiscount: coupon.maximumDiscount,
    },
  });
});

export const adminListCoupons = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const data = createCouponSchema.parse(req.body);
  const code = data.code.trim().toUpperCase();
  const exists = await Coupon.findOne({ code });
  if (exists) throw new AppError('Coupon code already exists', 409);
  const coupon = await Coupon.create({ ...data, code });
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const data = updateCouponSchema.parse(req.body);
  if (data.code) data.code = data.code.trim().toUpperCase();
  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.status(200).json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});
