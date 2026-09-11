/**
 * @deprecated SECTION 01 — Do NOT import in production pages/components.
 * Catalog data comes from the API (productsApi) and server seed.
 * Kept only for reference / offline experiments.
 */
export type Product = {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex';
  colors: string[];
  sizes: string[];
  isNew: boolean;
  isSale: boolean;
  occasion?: string;
  rating: number;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    nameEn: 'Silk Tailored Blazer',
    nameAr: 'بليزر حرير مفصّل',
    price: 890,
    category: 'outerwear',
    brand: 'FIVE',
    gender: 'women',
    colors: ['black', 'ivory'],
    sizes: ['XS', 'S', 'M', 'L'],
    isNew: true,
    isSale: false,
    occasion: 'work',
    rating: 4.8,
  },
  {
    id: '2',
    nameEn: 'Structured Wool Coat',
    nameAr: 'معطف صوف هيكلي',
    price: 1240,
    category: 'outerwear',
    brand: 'FIVE',
    gender: 'women',
    colors: ['camel', 'charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isSale: false,
    occasion: 'everyday',
    rating: 4.9,
  },
  {
    id: '3',
    nameEn: 'Fluid Silk Dress',
    nameAr: 'فستان حرير انسيابي',
    price: 980,
    salePrice: 720,
    category: 'dresses',
    brand: 'FIVE',
    gender: 'women',
    colors: ['champagne', 'black'],
    sizes: ['XS', 'S', 'M'],
    isNew: false,
    isSale: true,
    occasion: 'evening',
    rating: 4.7,
  },
  {
    id: '4',
    nameEn: 'Tailored Trousers',
    nameAr: 'بنطلون مفصّل',
    price: 480,
    category: 'bottoms',
    brand: 'FIVE',
    gender: 'unisex',
    colors: ['black', 'navy', 'stone'],
    sizes: ['28', '30', '32', '34'],
    isNew: false,
    isSale: false,
    occasion: 'work',
    rating: 4.6,
  },
];
