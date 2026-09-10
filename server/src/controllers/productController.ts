import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, idParamSchema, slugParamSchema } from '../validators/common.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sort } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = { status: 'active' };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.collection) filter.collection = req.query.collection;
  if (req.query.gender) filter.gender = req.query.gender;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.newArrival === 'true') filter.newArrival = true;
  if (req.query.bestseller === 'true') filter.bestseller = true;
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) (filter.price as Record<string, number>).$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) (filter.price as Record<string, number>).$lte = Number(req.query.maxPrice);
  }
  if (req.query.q) {
    filter.$text = { $search: String(req.query.q) };
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { ratings: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('collection', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .populate('collection', 'name slug')
    .lean();
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = slugParamSchema.parse(req.params);
  const product = await Product.findOne({ slug, status: 'active' })
    .populate('category', 'name slug')
    .populate('collection', 'name slug')
    .lean();
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});
