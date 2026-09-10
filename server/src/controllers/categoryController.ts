import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, idParamSchema, slugParamSchema } from '../validators/common.js';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (req.query.active !== 'false') {
    filter.isActive = true;
  }
  if (req.query.gender) {
    filter.gender = req.query.gender;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Category.find(filter).sort({ displayOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const category = await Category.findById(id).lean();
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, data: category });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = slugParamSchema.parse(req.params);
  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, data: category });
});
