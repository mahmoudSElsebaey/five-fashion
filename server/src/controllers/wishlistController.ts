import { Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { objectIdSchema } from '../validators/common.js';

async function getOrCreateWishlist(userId: string) {
  let wl = await Wishlist.findOne({ user: userId });
  if (!wl) wl = await Wishlist.create({ user: userId, products: [] });
  return wl;
}

export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const wl = await getOrCreateWishlist(req.user._id.toString());
  await wl.populate({
    path: 'products',
    select: 'name slug price compareAtPrice images stock status ratings',
  });
  res.status(200).json({ success: true, data: wl });
});

export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const productId = objectIdSchema.parse(req.body.productId);
  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') throw new AppError('Product not available', 404);
  const wl = await getOrCreateWishlist(req.user._id.toString());
  if (!wl.products.some((p) => p.toString() === productId)) {
    wl.products.push(product._id);
    await wl.save();
  }
  await wl.populate({
    path: 'products',
    select: 'name slug price compareAtPrice images stock status ratings',
  });
  res.status(200).json({ success: true, data: wl });
});

export const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const productId = objectIdSchema.parse(req.params.productId);
  const wl = await getOrCreateWishlist(req.user._id.toString());
  wl.products = wl.products.filter((p) => p.toString() !== productId) as typeof wl.products;
  await wl.save();
  await wl.populate({
    path: 'products',
    select: 'name slug price compareAtPrice images stock status ratings',
  });
  res.status(200).json({ success: true, data: wl });
});

export const clearWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const wl = await getOrCreateWishlist(req.user._id.toString());
  wl.products = [];
  await wl.save();
  res.status(200).json({ success: true, data: wl });
});
