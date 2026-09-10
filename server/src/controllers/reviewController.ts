import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = objectIdSchema.parse(req.params.productId);
  const { page, limit } = paginationSchema.parse(req.query);

  const filter = { product: productId, status: 'approved' as const };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const review = await Review.findById(id).populate('user', 'name avatar').lean();
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});
