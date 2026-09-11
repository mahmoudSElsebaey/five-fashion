export type LocalizedName = { en: string; ar: string };

export type ApiProduct = {
  _id: string;
  name: LocalizedName;
  slug: string;
  description?: LocalizedName;
  category?: { _id?: string; name?: LocalizedName; slug?: string } | string;
  collection?: { _id?: string; name?: LocalizedName; slug?: string } | string;
  collectionRef?: { _id?: string; name?: LocalizedName; slug?: string } | string;
  brand: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  compareAtPrice?: number;
  discount?: number;
  sku: string;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  status?: string;
  ratings?: number;
  reviewCount?: number;
  modelUrl?: string | null;
};

/** UI-friendly product shape used by existing components */
export type UiProduct = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex';
  colors: string[];
  sizes: string[];
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount?: number;
  slug?: string;
  stock?: number;
  images?: string[];
  sku?: string;
  modelUrl?: string | null;
};

export function mapApiProduct(p: ApiProduct): UiProduct {
  const sale =
    p.compareAtPrice && p.compareAtPrice > p.price ? p.price : undefined;
  const price = sale ? p.compareAtPrice! : p.price;
  return {
    id: p._id,
    nameEn: p.name?.en || '',
    nameAr: p.name?.ar || '',
    descriptionEn: p.description?.en || '',
    descriptionAr: p.description?.ar || '',
    price: sale ? price : p.price,
    salePrice: sale,
    category:
      typeof p.category === 'object' && p.category?.slug
        ? p.category.slug
        : typeof p.category === 'string'
          ? p.category
          : '',
    brand: p.brand || 'FIVE',
    gender: p.gender || 'unisex',
    colors: p.colors || [],
    sizes: p.sizes || [],
    isNew: Boolean(p.newArrival),
    isSale: Boolean(sale),
    rating: p.ratings || 0,
    reviewCount: p.reviewCount || 0,
    slug: p.slug,
    stock: p.stock,
    images: p.images,
    sku: p.sku,
    modelUrl: p.modelUrl || null,
  };
}
