import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartCount,
  selectCartSubtotal,
} from './cartSlice';

const sampleItem = {
  productId: '1',
  nameEn: 'Silk Blazer',
  nameAr: 'بليزر حرير',
  price: 100,
  salePrice: 80,
  size: 'M',
  color: 'black',
};

describe('cartSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new item to an empty cart', () => {
    const state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 1 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('1');
    expect(state.items[0].quantity).toBe(1);
    expect(state.isOpen).toBe(true);
  });

  it('increments quantity when same product/size/color is added again', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 1 }));
    state = cartReducer(state, addToCart({ ...sampleItem, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('treats different size as a separate line item', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, size: 'M' }));
    state = cartReducer(state, addToCart({ ...sampleItem, size: 'L' }));
    expect(state.items).toHaveLength(2);
  });

  it('updates quantity', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 1 }));
    const id = state.items[0].id;
    state = cartReducer(state, updateQuantity({ id, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('does not allow quantity below 1', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 2 }));
    const id = state.items[0].id;
    state = cartReducer(state, updateQuantity({ id, quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('removes an item', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 1 }));
    const id = state.items[0].id;
    state = cartReducer(state, removeFromCart(id));
    expect(state.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 1 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it('selectCartCount sums quantities', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 2 }));
    state = cartReducer(state, addToCart({ ...sampleItem, size: 'L', quantity: 3 }));
    expect(selectCartCount({ cart: state })).toBe(5);
  });

  it('selectCartSubtotal uses salePrice when present', () => {
    const state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 2 }));
    // 80 * 2 = 160
    expect(selectCartSubtotal({ cart: state })).toBe(160);
  });
});
