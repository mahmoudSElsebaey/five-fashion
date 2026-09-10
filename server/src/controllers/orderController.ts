import { Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Cart } from '../models/Cart.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema, objectIdSchema } from '../validators/common.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/commerceValidators.js';

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FF-${ts}-${rnd}`;
}

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const { page, limit } = paginationSchema.parse(req.query);
  const skip = (page - 1) * limit;
  const filter = { user: req.user._id };
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const getMyOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const order = await Order.findOne({ _id: id, user: req.user._id }).lean();
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});

export const getMyOrderByNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const orderNumber = String(req.params.orderNumber || '').toUpperCase();
  const order = await Order.findOne({ orderNumber, user: req.user._id }).lean();
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const body = createOrderSchema.parse(req.body);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderItems = [];
    let subtotal = 0;

    for (const line of body.items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: line.productId,
          status: 'active',
          stock: { $gte: line.quantity },
        },
        { $inc: { stock: -line.quantity } },
        { new: true, session }
      );
      if (!product) {
        throw new AppError(`Product unavailable or insufficient stock: ${line.productId}`, 400);
      }
      if (line.size && product.sizes.length && !product.sizes.includes(line.size)) {
        throw new AppError('Invalid size', 400);
      }
      if (line.color && product.colors.length && !product.colors.includes(line.color)) {
        throw new AppError('Invalid color', 400);
      }
      const unitPrice = product.price;
      subtotal += unitPrice * line.quantity;
      orderItems.push({
        product: product._id,
        nameEn: product.name.en,
        nameAr: product.name.ar,
        sku: product.sku,
        size: line.size,
        color: line.color,
        quantity: line.quantity,
        unitPrice,
        image: product.images?.[0],
      });
    }

    let discount = 0;
    let couponCode: string | undefined;
    if (body.couponCode) {
      const code = body.couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code, isActive: true }).session(session);
      if (!coupon) throw new AppError('Invalid coupon', 400);
      const now = new Date();
      if (coupon.startDate && coupon.startDate > now) throw new AppError('Coupon not active yet', 400);
      if (coupon.expiryDate && coupon.expiryDate < now) throw new AppError('Coupon expired', 400);
      if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError('Coupon usage limit reached', 400);
      }
      if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) {
        throw new AppError('Order does not meet coupon minimum', 400);
      }
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maximumDiscount != null) discount = Math.min(discount, coupon.maximumDiscount);
      } else {
        discount = coupon.discountValue;
      }
      discount = Math.min(discount, subtotal);
      coupon.usedCount += 1;
      await coupon.save({ session });
      couponCode = coupon.code;
    }

    const shippingCost = body.shippingCost ?? 0;
    const total = Math.max(0, subtotal - discount + shippingCost);

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          orderNumber: generateOrderNumber(),
          items: orderItems,
          subtotal,
          discount,
          shippingCost,
          total,
          couponCode,
          shippingAddress: body.shippingAddress,
          paymentMethod: body.paymentMethod || 'cod',
          paymentStatus: 'pending',
          status: 'pending',
          customerEmail: body.customerEmail || req.user.email,
          customerPhone: body.customerPhone || body.shippingAddress.phone,
          notes: body.notes,
        },
      ],
      { session }
    );

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const cancelMyOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const order = await Order.findOne({ _id: id, user: req.user._id });
  if (!order) throw new AppError('Order not found', 404);
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled', 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
    }
    order.status = 'cancelled';
    await order.save({ session });
    await session.commitTransaction();
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const adminListOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email').lean(),
    Order.countDocuments(filter),
  ]);
  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  });
});

export const adminGetOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const order = await Order.findById(id).populate('user', 'name email').lean();
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});

export const adminUpdateOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const data = updateOrderStatusSchema.parse(req.body);
  const order = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!order) throw new AppError('Order not found', 404);
  res.status(200).json({ success: true, data: order });
});
