import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';
import {
  createReviewSchema,
  updateReviewSchema,
  moderateReviewSchema,
} from '../validators/commerceValidators.js';

async function recalculateProductRatings(productId: string) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;
  await Product.findByIdAndUpdate(productId, {
    ratings: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = objectIdSchema.parse(req.params.productId);
  const { page, limit } = paginationSchema.parse(req.query);
  const filter = { product: productId, status: 'approved' as const };
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const review = await Review.findById(id).populate('user', 'name avatar').lean();
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const body = createReviewSchema.parse(req.body);
  const product = await Product.findById(body.productId);
  if (!product || product.status !== 'active') throw new AppError('Product not found', 404);
  const existing = await Review.findOne({ user: req.user._id, product: body.productId });
  if (existing) throw new AppError('You already reviewed this product', 409);
  const review = await Review.create({
    user: req.user._id,
    product: body.productId,
    rating: body.rating,
    title: body.title,
    comment: body.comment,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: review });
});

export const updateMyReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const body = updateReviewSchema.parse(req.body);
  const review = await Review.findOne({ _id: id, user: req.user._id });
  if (!review) throw new AppError('Review not found', 404);
  Object.assign(review, body);
  review.status = 'pending';
  await review.save();
  res.status(200).json({ success: true, data: review });
});

export const deleteMyReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const review = await Review.findOneAndDelete({ _id: id, user: req.user._id });
  if (!review) throw new AppError('Review not found', 404);
  if (review.status === 'approved') {
    await recalculateProductRatings(review.product.toString());
  }
  res.status(200).json({ success: true, message: 'Review deleted' });
});

export const adminModerateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const { status } = moderateReviewSchema.parse(req.body);
  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  if (!review) throw new AppError('Review not found', 404);
  await recalculateProductRatings(review.product.toString());
  res.status(200).json({ success: true, data: review });
});

export const adminDeleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new AppError('Review not found', 404);
  await recalculateProductRatings(review.product.toString());
  res.status(200).json({ success: true, message: 'Review deleted' });
});

export const adminListReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.product) filter.product = req.query.product;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('product', 'name slug')
      .lean(),
    Review.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});
