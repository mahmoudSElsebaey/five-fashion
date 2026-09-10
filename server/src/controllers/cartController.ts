import { Response } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { cartItemSchema, updateCartItemSchema } from '../validators/commerceValidators.js';
import { objectIdSchema } from '../validators/common.js';

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const cart = await getOrCreateCart(req.user._id.toString());
  await cart.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock status sizes colors sku',
  });
  res.status(200).json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const body = cartItemSchema.parse(req.body);
  const product = await Product.findById(body.productId);
  if (!product || product.status !== 'active') throw new AppError('Product not available', 404);
  if (product.stock < body.quantity) throw new AppError('Insufficient stock', 400);
  if (body.size && product.sizes.length && !product.sizes.includes(body.size)) {
    throw new AppError('Invalid size for this product', 400);
  }
  if (body.color && product.colors.length && !product.colors.includes(body.color)) {
    throw new AppError('Invalid color for this product', 400);
  }

  const cart = await getOrCreateCart(req.user._id.toString());
  const existing = cart.items.find(
    (i) =>
      i.product.toString() === body.productId &&
      i.size === body.size &&
      i.color === body.color
  );
  if (existing) {
    const nextQty = existing.quantity + body.quantity;
    if (nextQty > product.stock) throw new AppError('Insufficient stock', 400);
    existing.quantity = nextQty;
  } else {
    cart.items.push({
      product: product._id,
      quantity: body.quantity,
      size: body.size,
      color: body.color,
    });
  }
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock status sizes colors sku',
  });
  res.status(200).json({ success: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const itemId = objectIdSchema.parse(req.params.itemId);
  const { quantity } = updateCartItemSchema.parse(req.body);
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);
  const item = cart.items.find((i) => String(i._id) === itemId);
  if (!item) throw new AppError('Cart item not found', 404);
  const product = await Product.findById(item.product);
  if (!product || product.status !== 'active') throw new AppError('Product not available', 404);
  if (quantity > product.stock) throw new AppError('Insufficient stock', 400);
  item.quantity = quantity;
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock status sizes colors sku',
  });
  res.status(200).json({ success: true, data: cart });
});

export const removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const itemId = objectIdSchema.parse(req.params.itemId);
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);
  const idx = cart.items.findIndex((i) => String(i._id) === itemId);
  if (idx === -1) throw new AppError('Cart item not found', 404);
  cart.items.splice(idx, 1);
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock status sizes colors sku',
  });
  res.status(200).json({ success: true, data: cart });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const cart = await getOrCreateCart(req.user._id.toString());
  cart.items = [];
  await cart.save();
  res.status(200).json({ success: true, data: cart });
});

export const mergeCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const cart = await getOrCreateCart(req.user._id.toString());
  for (const raw of items) {
    const parsed = cartItemSchema.safeParse(raw);
    if (!parsed.success) continue;
    const body = parsed.data;
    const product = await Product.findById(body.productId);
    if (!product || product.status !== 'active') continue;
    const existing = cart.items.find(
      (i) =>
        i.product.toString() === body.productId &&
        i.size === body.size &&
        i.color === body.color
    );
    const qty = Math.min(body.quantity, product.stock);
    if (qty < 1) continue;
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        size: body.size,
        color: body.color,
      });
    }
  }
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock status sizes colors sku',
  });
  res.status(200).json({ success: true, data: cart });
});
