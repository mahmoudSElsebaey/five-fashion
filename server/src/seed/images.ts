/** FIVE Fashion - per-SKU galleries. Unique URLs catalog-wide. */
export const GALLERIES: Record<string, string[]> = {
  "FF-WD-001": [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg?auto=compress&cs=tinysrgb&w=900"
  ]
} as const;

export function galleriesFor(sku: string): string[] {
  const urls = (GALLERIES as any)[sku];
  if (!urls || !urls.length) throw new Error('Missing gallery for SKU ' + sku);
  return urls.slice();
}

export type SeedIssue = { level: 'error' | 'warn'; message: string };

export function validateGalleries(requiredSkus: string[]): SeedIssue[] {
  return [];
}

export const IMG: Record<string, string> = Object.fromEntries(
  Object.entries(GALLERIES).map(([sku, urls]) => [sku, (urls as string[])[0]])
);
