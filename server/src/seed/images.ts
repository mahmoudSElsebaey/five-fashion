/** FIVE Fashion - per-SKU galleries. Unique URLs catalog-wide. */
import { GALLERIES_PART1 } from './galleries-part1.js';
import { GALLERIES_PART2 } from './galleries-part2.js';

export const GALLERIES: Record<string, string[]> = {
  ...GALLERIES_PART1,
  ...GALLERIES_PART2,
};

export function galleriesFor(sku: string): string[] {
  const urls = GALLERIES[sku];
  if (!urls || !urls.length) throw new Error('Missing gallery for SKU ' + sku);
  return urls.slice();
}

export type SeedIssue = { level: 'error' | 'warn'; message: string };

export function validateGalleries(requiredSkus: string[]): SeedIssue[] {
  const issues: SeedIssue[] = [];
  const seen = new Map<string, string>();
  for (const sku of requiredSkus) {
    const urls = GALLERIES[sku];
    if (!urls) {
      issues.push({ level: 'error', message: 'No gallery defined for ' + sku });
      continue;
    }
    if (urls.length < 3 || urls.length > 5) {
      issues.push({ level: 'error', message: sku + ' has ' + urls.length + ' images (need 3-5)' });
    }
    const local = new Set<string>();
    for (const url of urls) {
      if (!url || !url.startsWith('https://')) {
        issues.push({ level: 'error', message: sku + ' has invalid image URL' });
        continue;
      }
      if (local.has(url)) issues.push({ level: 'error', message: sku + ' repeats an image internally' });
      local.add(url);
      const owner = seen.get(url);
      if (owner && owner !== sku) {
        issues.push({ level: 'error', message: 'Duplicate image shared by ' + owner + ' and ' + sku });
      } else {
        seen.set(url, sku);
      }
    }
  }
  return issues;
}

export const IMG: Record<string, string> = Object.fromEntries(
  Object.entries(GALLERIES).map(([sku, urls]) => [sku, urls[0]])
);
