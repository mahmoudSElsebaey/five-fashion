import { z } from 'zod';
import { objectIdSchema } from './common.js';

const localized = z.object({
  en: z.string().min(1).max(200),
  ar: z.string().min(1).max(200),
});

export const createProductSchema = z.object({
  name: localized,
  slug: z.string().min(1).max(200).optional(),
  description: localized.optional(),
  category: objectIdSchema.optional(),
  collection: objectIdSchema.optional(),
  brand: z.string().default('FIVE'),
  gender: z.enum(['men', 'women', 'unisex']).default('unisex'),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  sku: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        sku: z.string().optional(),
        stock: z.number().int().min(0).default(0),
      })
    )
    .optional(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: localized,
  slug: z.string().min(1).optional(),
  description: localized.optional(),
  image: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex', 'all']).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createCollectionSchema = z.object({
  name: localized,
  slug: z.string().min(1).optional(),
  description: localized.optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export const cartItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1).default(1),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectIdSchema,
        quantity: z.number().int().min(1),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    country: z.string().min(2),
    city: z.string().min(2),
    area: z.string().optional(),
    street: z.string().min(2),
    building: z.string().optional(),
    apartment: z.string().optional(),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  }),
  paymentMethod: z.string().default('cod'),
  couponCode: z.string().optional(),
  shippingCost: z.number().min(0).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const createReviewSchema = z.object({
  productId: objectIdSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().max(2000).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(120).optional(),
  comment: z.string().max(2000).optional(),
});

export const moderateReviewSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const createCouponSchema = z.object({
  code: z.string().min(2).max(40),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional().or(z.coerce.date().optional()),
  expiryDate: z.string().datetime().optional().or(z.coerce.date().optional()),
  isActive: z.boolean().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export const createAddressSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(5),
  country: z.string().min(2),
  city: z.string().min(2),
  area: z.string().optional(),
  street: z.string().min(2),
  building: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});
