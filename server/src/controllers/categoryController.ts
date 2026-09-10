import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, idParamSchema, slugParamSchema } from '../validators/common.js';
import { createCategorySchema, updateCategorySchema } from '../validators/commerceValidators.js';
import { slugify } from '../utils/slugify.js';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (req.query.active !== 'false') filter.isActive = true;
  if (req.query.gender) filter.gender = req.query.gender;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Category.find(filter).sort({ displayOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
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

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);
  const slug = data.slug || slugify(data.name.en);
  const exists = await Category.findOne({ slug });
  if (exists) throw new AppError('Category slug already exists', 409);
  const category = await Category.create({ ...data, slug });
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateCategorySchema.parse(req.body);
  if (data.name?.en && !data.slug) data.slug = slugify(data.name.en);
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, message: 'Category deleted' });
});
