import { describe, it, expect } from 'vitest';
import { getCouponRate, calculateDiscount } from './coupons';

describe('coupons', () => {
  it('returns rate for FIVE10', () => {
    expect(getCouponRate('FIVE10')).toBe(0.1);
    expect(getCouponRate('five10')).toBe(0.1);
  });

  it('returns rate for WELCOME15', () => {
    expect(getCouponRate('WELCOME15')).toBe(0.15);
  });

  it('returns null for invalid code', () => {
    expect(getCouponRate('INVALID')).toBeNull();
    expect(getCouponRate('')).toBeNull();
  });

  it('calculates discount correctly', () => {
    expect(calculateDiscount(100, 0.1)).toBe(10);
    expect(calculateDiscount(200, 0.15)).toBe(30);
  });

  it('guards negative inputs', () => {
    expect(calculateDiscount(-10, 0.1)).toBe(0);
    expect(calculateDiscount(100, -0.1)).toBe(0);
  });
});
