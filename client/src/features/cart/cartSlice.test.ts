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
  price: 890,
  size: 'M',
  color: 'black',
};

describe('cartSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new item to the cart', () => {
    const state = cartReducer(undefined, addToCart(sampleItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('1');
    expect(state.items[0].quantity).toBe(1);
    expect(state.isOpen).toBe(true);
  });

  it('increments quantity when same product/size/color is added again', () => {
    let state = cartReducer(undefined, addToCart(sampleItem));
    state = cartReducer(state, addToCart({ ...sampleItem, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('treats different sizes as separate line items', () => {
    let state = cartReducer(undefined, addToCart(sampleItem));
    state = cartReducer(state, addToCart({ ...sampleItem, size: 'L' }));
    expect(state.items).toHaveLength(2);
  });

  it('removes an item by id', () => {
    let state = cartReducer(undefined, addToCart(sampleItem));
    const id = state.items[0].id;
    state = cartReducer(state, removeFromCart(id));
    expect(state.items).toHaveLength(0);
  });

  it('updates quantity and never goes below 1', () => {
    let state = cartReducer(undefined, addToCart(sampleItem));
    const id = state.items[0].id;
    state = cartReducer(state, updateQuantity({ id, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
    state = cartReducer(state, updateQuantity({ id, quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clears the cart', () => {
    let state = cartReducer(undefined, addToCart(sampleItem));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it('calculates count and subtotal correctly', () => {
    let state = cartReducer(undefined, addToCart({ ...sampleItem, quantity: 2 }));
    state = cartReducer(
      state,
      addToCart({
        productId: '2',
        nameEn: 'Coat',
        nameAr: 'معطف',
        price: 1000,
        salePrice: 800,
        quantity: 1,
      })
    );
    const root = { cart: state };
    expect(selectCartCount(root)).toBe(3);
    expect(selectCartSubtotal(root)).toBe(2580);
  });
});
