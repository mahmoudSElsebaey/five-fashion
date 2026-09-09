import { describe, it, expect, beforeEach } from 'vitest';
import ordersReducer, {
  addOrder,
  selectOrders,
  selectOrderById,
} from './ordersSlice';
import type { Order } from './ordersSlice';

const sampleOrder: Order = {
  id: 'ORD-TEST1',
  items: [
    {
      productId: '1',
      nameEn: 'Silk Blazer',
      nameAr: 'بليزر',
      price: 890,
      quantity: 1,
    },
  ],
  subtotal: 890,
  shipping: 15,
  discount: 0,
  total: 905,
  status: 'confirmed',
  customer: { name: 'Test User', email: 'test@example.com', phone: '123' },
  address: {
    line1: '123 St',
    city: 'Cairo',
    country: 'EG',
    postalCode: '11511',
  },
  shippingMethod: 'standard',
  createdAt: new Date().toISOString(),
};

describe('ordersSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds an order to the beginning of the list', () => {
    const state = ordersReducer(undefined, addOrder(sampleOrder));
    expect(state.orders).toHaveLength(1);
    expect(state.orders[0].id).toBe('ORD-TEST1');
    expect(state.lastOrderId).toBe('ORD-TEST1');
  });

  it('keeps newest orders first', () => {
    let state = ordersReducer(undefined, addOrder(sampleOrder));
    state = ordersReducer(
      state,
      addOrder({ ...sampleOrder, id: 'ORD-TEST2', total: 500 })
    );
    expect(state.orders[0].id).toBe('ORD-TEST2');
    expect(state.orders).toHaveLength(2);
  });

  it('selectOrderById finds the order', () => {
    const state = ordersReducer(undefined, addOrder(sampleOrder));
    const root = { orders: state };
    expect(selectOrderById('ORD-TEST1')(root)?.total).toBe(905);
    expect(selectOrderById('MISSING')(root)).toBeUndefined();
    expect(selectOrders(root)).toHaveLength(1);
  });
});
