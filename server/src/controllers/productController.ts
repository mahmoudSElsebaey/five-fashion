import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { paginationSchema, idParamSchema, slugParamSchema } from '../validators/common.js';
import { createProductSchema, updateProductSchema } from '../validators/commerceValidators.js';
import { slugify } from '../utils/slugify.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sort } = paginationSchema.parse(req.query);
  const isAdmin = (req as AuthRequest).user?.role === 'admin';
  const filter: Record<string, unknown> = {};

  if (!isAdmin || req.query.status !== 'all') {
    filter.status = (req.query.status as string) || 'active';
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.collection) filter.collection = req.query.collection;
  if (req.query.gender) filter.gender = req.query.gender;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.newArrival === 'true') filter.newArrival = true;
  if (req.query.bestseller === 'true') filter.bestseller = true;
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.size) filter.sizes = req.query.size;
  if (req.query.color) filter.colors = req.query.color;
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
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
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

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const slug = data.slug || slugify(data.name.en);
  const exists = await Product.findOne({ $or: [{ slug }, { sku: data.sku }] });
  if (exists) throw new AppError('Product with this slug or SKU already exists', 409);
  const product = await Product.create({ ...data, slug });
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);
  if (data.name?.en && !data.slug) {
    data.slug = slugify(data.name.en);
  }
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, message: 'Product deleted' });
});

export const updateStock = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const stock = Number(req.body.stock);
  if (!Number.isFinite(stock) || stock < 0) throw new AppError('Invalid stock value', 400);
  const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});
