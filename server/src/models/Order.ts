import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: Types.ObjectId;
  nameEn: string;
  nameAr: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface IShippingAddressSnapshot {
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
}

export interface IOrder extends Document {
  user?: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  shippingAddress: IShippingAddressSnapshot;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    sku: String,
    size: String,
    color: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    image: String,
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    area: String,
    street: { type: String, required: true },
    building: String,
    apartment: String,
    postalCode: String,
    notes: String,
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v: IOrderItem[]) => v.length > 0, 'Order must have at least one item'],
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: String,
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, default: 'pending' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    customerEmail: String,
    customerPhone: String,
    notes: String,
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
