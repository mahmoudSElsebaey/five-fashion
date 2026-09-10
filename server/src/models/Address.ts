import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  area?: string;
  street: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  notes?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    street: { type: String, required: true, trim: true },
    building: { type: String, trim: true },
    apartment: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 500 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, isDefault: 1 });

export const Address = mongoose.model<IAddress>('Address', addressSchema);
