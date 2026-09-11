/**
 * SECTION 04 — Catalog image library (Unsplash, fashion-focused)
 * Keys map to seed products. Prefer category-coherent secondary angles.
 */
const IMG = {
  // —— Women dresses ——
  dress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80',
  dress2: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80',
  dress3: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80',
  dress4: 'https://images.unsplash.com/photo-1515372039744-b8f0229b61fd?w=900&q=80',
  dress5: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80',
  // —— Women tops ——
  top1: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80',
  top2: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=900&q=80',
  top3: 'https://images.unsplash.com/photo-1551489186-cf872a0f9f64?w=900&q=80',
  top4: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80',
  top5: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80',
  // —— Women outerwear ——
  outer1: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=900&q=80',
  outer2: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=80',
  outer3: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80',
  outer4: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80',
  outer5: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&q=80',
  // —— Men shirts ——
  shirt1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b81?w=900&q=80',
  shirt2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80',
  shirt3: 'https://images.unsplash.com/photo-1620012253295-c15cc4eaa953?w=900&q=80',
  shirt4: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80',
  shirt5: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80',
  // —— Men trousers ——
  trouser1: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80',
  trouser2: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80',
  trouser3: 'https://images.unsplash.com/photo-1506629082955-511b1aa78283?w=900&q=80',
  trouser4: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80',
  trouser5: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80',
  // —— Men outerwear ——
  menOuter1: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80',
  menOuter2: 'https://images.unsplash.com/photo-1495107334309-fcf795611c8c?w=900&q=80',
  menOuter3: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900&q=80',
  menOuter4: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=900&q=80',
  menOuter5: 'https://images.unsplash.com/photo-1544923246-77307dd654cd?w=900&q=80',
  // —— Accessories ——
  acc1: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80',
  acc2: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80',
  acc3: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
  acc4: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80',
  acc5: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&q=80',
  // —— Footwear ——
  shoe1: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80',
  shoe2: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80',
  shoe3: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80',
  shoe4: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80',
  shoe5: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80',
  // —— Detail / alternate angles ——
  detail1: 'https://images.unsplash.com/photo-1550639525-69b3c2d4e2d4?w=900&q=80',
  detail2: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=900&q=80',
  detail3: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=80',
  detail4: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
  detail5: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
} as const;

export type ImgKey = keyof typeof IMG;

/** Category-aware secondary keys for multi-angle product galleries */
const SECONDARIES: Record<string, ImgKey[]> = {
  'women-dresses': ['dress1', 'dress2', 'dress3', 'dress4', 'dress5', 'detail1', 'detail2'],
  'women-tops': ['top1', 'top2', 'top3', 'top4', 'top5', 'detail3', 'detail4'],
  'women-outerwear': ['outer1', 'outer2', 'outer3', 'outer4', 'outer5', 'detail2', 'detail5'],
  'men-shirts': ['shirt1', 'shirt2', 'shirt3', 'shirt4', 'shirt5', 'detail3', 'detail4'],
  'men-trousers': ['trouser1', 'trouser2', 'trouser3', 'trouser4', 'trouser5', 'detail5', 'detail1'],
  'men-outerwear': ['menOuter1', 'menOuter2', 'menOuter3', 'menOuter4', 'menOuter5', 'detail5', 'outer4'],
  accessories: ['acc1', 'acc2', 'acc3', 'acc4', 'acc5', 'detail4', 'detail2'],
  footwear: ['shoe1', 'shoe2', 'shoe3', 'shoe4', 'shoe5', 'detail1', 'detail3'],
};

/**
 * Build 2–3 unique image URLs for a product: primary + category-related alternates.
 */
export function productImages(cat: string, primary: ImgKey, salt = 0): string[] {
  const pool = SECONDARIES[cat] || (Object.keys(IMG) as ImgKey[]);
  const urls: string[] = [IMG[primary]];
  const candidates = pool.filter((k) => k !== primary);
  for (let i = 0; i < candidates.length && urls.length < 3; i++) {
    const key = candidates[(i + salt) % candidates.length];
    const url = IMG[key];
    if (url && !urls.includes(url)) urls.push(url);
  }
  // last resort fill
  if (urls.length < 2) {
    for (const k of Object.keys(IMG) as ImgKey[]) {
      if (!urls.includes(IMG[k])) {
        urls.push(IMG[k]);
        if (urls.length >= 3) break;
      }
    }
  }
  return urls;
}

export { IMG };
export default IMG;
