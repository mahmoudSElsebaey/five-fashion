import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WishlistItem = {
  productId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  brand: string;
};

type WishlistState = {
  items: WishlistItem[];
};

const load = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem('five-wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (items: WishlistItem[]) => {
  localStorage.setItem('five-wishlist', JSON.stringify(items));
};

const initialState: WishlistState = {
  items: load(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((i) => i.productId === action.payload.productId);
      if (exists) {
        state.items = state.items.filter((i) => i.productId !== action.payload.productId);
      } else {
        state.items.push(action.payload);
      }
      save(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      save(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      save(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((i) => i.productId === productId);

export default wishlistSlice.reducer;
