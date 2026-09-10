import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { z } from 'zod';

const codeParamSchema = z.object({
  code: z.string().min(1).transform((v) => v.trim().toUpperCase()),
});

export const getCouponByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = codeParamSchema.parse(req.params);
  const coupon = await Coupon.findOne({ code, isActive: true }).lean();
  if (!coupon) throw new AppError('Coupon not found or inactive', 404);

  const now = new Date();
  if (coupon.startDate && coupon.startDate > now) {
    throw new AppError('Coupon is not active yet', 400);
  }
  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new AppError('Coupon has expired', 400);
  }
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
