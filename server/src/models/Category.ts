import mongoose, { Document, Schema } from 'mongoose';

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface ICategory extends Document {
  name: ILocalizedString;
  slug: string;
  description?: ILocalizedString;
  image?: string;
  gender?: 'men' | 'women' | 'unisex' | 'all';
  isActive: boolean;
  displayOrder: number;
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

const categorySchema = new Schema<ICategory>(
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
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'all'],
      default: 'all',
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

categorySchema.index({ isActive: 1, displayOrder: 1 });
categorySchema.index({ gender: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
