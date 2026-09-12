/**
 * Famous fashion brands used across the demo catalog.
 * Products cycle through this list so the storefront feels like a multi-brand atelier.
 */
export const FAMOUS_BRANDS = [
  'Gucci',
  'Prada',
  'Chanel',
  'Dior',
  'Burberry',
  'Versace',
  'Armani',
  'Ralph Lauren',
  'Calvin Klein',
  'Tommy Hilfiger',
] as const;

export type FamousBrand = (typeof FAMOUS_BRANDS)[number];

export function brandForIndex(n: number): FamousBrand {
  return FAMOUS_BRANDS[(n - 1) % FAMOUS_BRANDS.length];
}
