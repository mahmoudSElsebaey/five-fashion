import { describe, it, expect, beforeEach } from 'vitest';
import wishlistReducer, {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistCount,
  selectIsInWishlist,
} from './wishlistSlice';

const item = {
  productId: '1',
  nameEn: 'Silk Blazer',
  nameAr: 'بليزر حرير',
  price: 100,
  brand: 'FIVE',
};

describe('wishlistSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds an item when not present', () => {
    const state = wishlistReducer(undefined, toggleWishlist(item));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('1');
  });

  it('removes an item when toggled again', () => {
    let state = wishlistReducer(undefined, toggleWishlist(item));
    state = wishlistReducer(state, toggleWishlist(item));
    expect(state.items).toHaveLength(0);
  });

  it('removeFromWishlist removes by productId', () => {
    let state = wishlistReducer(undefined, toggleWishlist(item));
    state = wishlistReducer(state, removeFromWishlist('1'));
    expect(state.items).toHaveLength(0);
  });

  it('clearWishlist empties the list', () => {
    let state = wishlistReducer(undefined, toggleWishlist(item));
    state = wishlistReducer(state, clearWishlist());
    expect(state.items).toHaveLength(0);
  });

  it('selectWishlistCount returns length', () => {
    const state = wishlistReducer(undefined, toggleWishlist(item));
    expect(selectWishlistCount({ wishlist: state })).toBe(1);
  });

  it('selectIsInWishlist returns true when present', () => {
    const state = wishlistReducer(undefined, toggleWishlist(item));
    expect(selectIsInWishlist('1')({ wishlist: state })).toBe(true);
    expect(selectIsInWishlist('99')({ wishlist: state })).toBe(false);
  });
});
