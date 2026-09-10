import { Request, Response } from 'express';
import { Collection } from '../models/Collection.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, idParamSchema, slugParamSchema } from '../validators/common.js';
import { createCollectionSchema, updateCollectionSchema } from '../validators/commerceValidators.js';
import { slugify } from '../utils/slugify.js';

export const getCollections = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (req.query.active !== 'false') filter.isActive = true;
  if (req.query.featured === 'true') filter.featured = true;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Collection.find(filter).sort({ featured: -1, name: 1 }).skip(skip).limit(limit).lean(),
    Collection.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const getCollectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const collection = await Collection.findById(id).lean();
  if (!collection) throw new AppError('Collection not found', 404);
  res.status(200).json({ success: true, data: collection });
});

export const getCollectionBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = slugParamSchema.parse(req.params);
  const collection = await Collection.findOne({ slug, isActive: true }).lean();
  if (!collection) throw new AppError('Collection not found', 404);
  res.status(200).json({ success: true, data: collection });
});

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  const data = createCollectionSchema.parse(req.body);
  const slug = data.slug || slugify(data.name.en);
  const exists = await Collection.findOne({ slug });
  if (exists) throw new AppError('Collection slug already exists', 409);
  const collection = await Collection.create({ ...data, slug });
  res.status(201).json({ success: true, data: collection });
});

export const updateCollection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateCollectionSchema.parse(req.body);
  if (data.name?.en && !data.slug) data.slug = slugify(data.name.en);
  const collection = await Collection.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!collection) throw new AppError('Collection not found', 404);
  res.status(200).json({ success: true, data: collection });
});

export const deleteCollection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) throw new AppError('Collection not found', 404);
  res.status(200).json({ success: true, message: 'Collection deleted' });
});
