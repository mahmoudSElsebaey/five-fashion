import mongoose, { Document, Schema, Types } from 'mongoose';
import type { ILocalizedString } from './Category.js';

export interface IProductVariant {
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
}

export interface IProduct extends Document {
  name: ILocalizedString;
  slug: string;
  description?: ILocalizedString;
  category?: Types.ObjectId;
  collection?: Types.ObjectId;
  brand: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  compareAtPrice?: number;
  discount?: number;
  sku: string;
  stock: number;
  sizes: string[];
  colors: string[];
  variants: IProductVariant[];
  images: string[];
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  status: 'draft' | 'active' | 'archived';
  ratings: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const localizedSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const variantSchema = new Schema(
  {
    size: String,
    color: String,
    sku: String,
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: localizedSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: localizedSchema,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
    brand: { type: String, default: 'FIVE', trim: true },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    sku: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    variants: [variantSchema],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1, featured: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ collection: 1, status: 1 });
productSchema.index({ gender: 1, status: 1 });
productSchema.index({ newArrival: 1, status: 1 });
productSchema.index({ bestseller: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'name.en': 'text', 'name.ar': 'text', brand: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
