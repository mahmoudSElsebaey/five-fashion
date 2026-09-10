import mongoose, { Document, Schema } from 'mongoose';
import type { ILocalizedString } from './Category.js';

export interface ICollection extends Document {
  name: ILocalizedString;
  slug: string;
  description?: ILocalizedString;
  image?: string;
  isActive: boolean;
  featured: boolean;
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

const collectionSchema = new Schema<ICollection>(
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
    image: String,
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

collectionSchema.index({ slug: 1 });
collectionSchema.index({ isActive: 1, featured: 1 });

export const Collection = mongoose.model<ICollection>('Collection', collectionSchema);
