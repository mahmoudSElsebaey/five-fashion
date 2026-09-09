/** Demo coupon rates — keep in sync with CheckoutPage */
export const VALID_COUPONS: Record<string, number> = {
  FIVE10: 0.1,
  WELCOME15: 0.15,
};

export function getCouponRate(code: string): number | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return VALID_COUPONS[normalized] ?? null;
}

export function calculateDiscount(subtotal: number, rate: number): number {
  if (subtotal < 0 || rate < 0) return 0;
  return Math.round(subtotal * rate * 100) / 100;
}
