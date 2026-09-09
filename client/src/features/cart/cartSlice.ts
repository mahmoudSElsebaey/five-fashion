import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  id: string;
  productId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

const load = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('five-cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (items: CartItem[]) => {
  localStorage.setItem('five-cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: load(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }>) => {
      const payload = action.payload;
      const existing = state.items.find(
        (i) => i.productId === payload.productId && i.size === payload.size && i.color === payload.color
      );
      if (existing) {
        existing.quantity += payload.quantity ?? 1;
      } else {
        state.items.push({
          ...payload,
          id: `${payload.productId}-${payload.size || 'os'}-${payload.color || 'def'}-${Date.now()}`,
          quantity: payload.quantity ?? 1,
        });
      }
      save(state.items);
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      save(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        save(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      save(state.items);
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart, toggleCart } = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0);
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;
export default cartSlice.reducer;
