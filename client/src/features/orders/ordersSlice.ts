import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderItem = {
  productId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode: string;
  };
  shippingMethod: string;
  couponCode?: string;
  createdAt: string;
};

type OrdersState = {
  orders: Order[];
  lastOrderId: string | null;
};

const load = (): Order[] => {
  try {
    const raw = localStorage.getItem('five-orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (orders: Order[]) => {
  localStorage.setItem('five-orders', JSON.stringify(orders));
};

const initialState: OrdersState = {
  orders: load(),
  lastOrderId: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.lastOrderId = action.payload.id;
      save(state.orders);
    },
    clearLastOrder: (state) => {
      state.lastOrderId = null;
    },
  },
});

export const { addOrder, clearLastOrder } = ordersSlice.actions;
export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export const selectLastOrderId = (state: { orders: OrdersState }) => state.orders.lastOrderId;
export const selectOrderById = (id: string) => (state: { orders: OrdersState }) =>
  state.orders.orders.find((o) => o.id === id);

export default ordersSlice.reducer;
