/** FIVE Fashion — professional demo seed with expanded catalog. */
import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import { IMG, productImages } from './images.js';
import { CATALOG, CAT_META, COL_META } from './catalog.js';

const COLORS: Record<string, string[]> = {
  women: ['Black', 'Ivory', 'Camel', 'Burgundy'],
  men: ['Black', 'Navy', 'Stone', 'Olive'],
  kids: ['Navy', 'Ivory', 'Pink', 'Sage'],
  active: ['Black', 'Charcoal', 'Cobalt', 'Mint'],
  accessories: ['Black', 'Cognac', 'Ivory', 'Gold'],
  footwear: ['Black', 'White', 'Taupe', 'Burgundy'],
};

const SIZES: Record<string, string[]> = {
  clothing: ['S', 'M', 'L', 'XL', 'XXL'],
  kids: ['4Y', '6Y', '8Y', '10Y', '12Y', '14Y'],
  active: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['39', '40', '41', '42', '43', '44'],
  accessories: ['OS'],
};

function slugifyName(en: string, n: number): string {
  return `${en.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}-${String(n).padStart(3, '0')}`;
}

function sizeSet(cat: string, coll: string): string[] {
  if (cat === 'footwear') return SIZES.footwear;
  if (cat === 'accessories' || cat === 'bags' || cat === 'socks' || cat === 'caps-hats') return SIZES.accessories;
  if (cat === 'kids-clothing' || cat === 'kids-sportswear') return SIZES.kids;
  if (coll === 'active' || cat === 'football-wear') return SIZES.active;
  return SIZES.clothing;
}

function colorSet(cat: string, coll: string, gender: 'men' | 'women' | 'unisex'): string[] {
  if (cat === 'kids-clothing' || cat === 'kids-sportswear') return COLORS.kids;
  if (coll === 'active' || cat === 'football-wear' || cat === 'men-sportswear') return COLORS.active;
  if (cat === 'accessories' || cat === 'bags' || cat === 'socks' || cat === 'caps-hats') return COLORS.accessories;
  if (cat === 'footwear') return COLORS.footwear;
  return gender === 'women' ? COLORS.women : COLORS.men;
}

async function main() {
  const expectedProducts = CATALOG.reduce((total, group) => total + group.items.length, 0);
  console.log(`—— FIVE Fashion Seed — ${expectedProducts} products / ${CATALOG.length} categories ——`);
  await mongoose.connect(config.mongodbUri);

  try {
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
    ]);

    const cats = await Category.insertMany(Object.entries(CAT_META).map(([slug, meta]) => {
      const group = CATALOG.find((entry) => entry.cat === slug);
      const allGenderCategories = ['kids-clothing', 'sportswear', 'men-sportswear', 'kids-sportswear', 'football-wear', 'accessories', 'footwear', 'bags', 'socks', 'caps-hats', 'complete-sets', 'suits', 'wedding-dresses'];
      return {
        name: { en: meta.en, ar: meta.ar },
        slug,
        description: { en: `${meta.en} curated by FIVE Fashion.`, ar: `${meta.ar} المختارة بعناية من FIVE Fashion.` },
        gender: allGenderCategories.includes(slug) ? 'all' : group?.gender === 'women' ? 'women' : 'men',
        displayOrder: meta.order,
        isActive: true,
        image: group ? IMG[group.imageKeys[0]] : IMG.dress1,
        seoTitle: `${meta.en} | FIVE Fashion`,
        seoDescription: `Shop ${meta.en} at FIVE Fashion.`,
      };
    }));
    const catMap = Object.fromEntries(cats.map((category) => [category.slug, category]));

    const cols = await Collection.insertMany(COL_META.map((collection) => ({
      name: { en: collection.en, ar: collection.ar },
      slug: collection.slug,
      featured: collection.featured,
      isActive: true,
      image: IMG[collection.image],
      description: { en: collection.descEn, ar: collection.descAr },
      seoTitle: `${collection.en} | FIVE Fashion`,
      seoDescription: collection.descEn,
    })));
    const colMap = Object.fromEntries(cols.map((collection) => [collection.slug, collection]));

    const docs = [];
    let n = 1;
    for (const group of CATALOG) {
      if (group.items.length < 10) throw new Error(`Category ${group.cat} must contain at least 10 products`);

      for (const [en, ar] of group.items) {
        const sizes = sizeSet(group.cat, group.coll);
        const colors = colorSet(group.cat, group.coll, group.gender);
        const basePrice = 249 + ((n * 37) % 900);
        const sale = n % 5 === 0;
        const compareAtPrice = sale ? basePrice + 120 : undefined;
        const price = sale ? basePrice - 120 : basePrice;
        const stock = 12 + (n % 36);
        const sku = `FIVE-${String(n).padStart(4, '0')}`;
        const primary = group.imageKeys[(n - 1) % group.imageKeys.length];

        docs.push({
          name: { en, ar },
          slug: slugifyName(en, n),
          description: { en: `${en} from FIVE Fashion. Designed with a refined silhouette, versatile styling, and premium everyday appeal.`, ar: `${ar} من FIVE Fashion بقصة أنيقة وتنسيق عملي وخامات مختارة بعناية.` },
          category: catMap[group.cat]?._id,
          collectionRef: colMap[group.coll]?._id,
          brand: 'FIVE',
          gender: group.gender,
          price,
          compareAtPrice,
          discount: sale ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : undefined,
          sku,
          stock,
          sizes,
          colors,
          variants: sizes.flatMap((size) => colors.map((color) => ({
            size,
            color,
            sku: `${sku}-${size}-${color}`.slice(0, 32),
            stock: Math.max(1, Math.floor(stock / (sizes.length * colors.length))),
          }))),
          images: productImages(group.cat, primary, n, en),
          featured: n % 9 === 0,
          newArrival: n % 4 === 0,
          bestseller: n % 7 === 0,
          status: 'active' as const,
          ratings: 0,
          reviewCount: 0,
          seoTitle: `${en} | FIVE Fashion`,
          seoDescription: `Shop ${en} by FIVE Fashion online.`,
        });
        n += 1;
      }
    }

    if (docs.length !== expectedProducts) throw new Error(`Expected ${expectedProducts} products, generated ${docs.length}`);
    const inserted = await Product.insertMany(docs);

    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    await Coupon.insertMany([
      { code: 'FIVE10', discountType: 'percentage', discountValue: 10, minimumOrderAmount: 100, maximumDiscount: 150, usageLimit: 1000, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
      { code: 'WELCOME15', discountType: 'percentage', discountValue: 15, minimumOrderAmount: 150, maximumDiscount: 200, usageLimit: 500, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
      { code: 'EVENING20', discountType: 'percentage', discountValue: 20, minimumOrderAmount: 400, maximumDiscount: 300, usageLimit: 200, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
    ]);

    const customer = await User.findOne({ role: 'user', isActive: true });
    if (customer) {
      const samples = [
        { rating: 5, title: 'Exceptional quality', comment: 'Outstanding fabric and finish.' },
        { rating: 5, title: 'Perfect fit', comment: 'Precise tailoring.' },
        { rating: 4, title: 'Beautiful piece', comment: 'Looks better in person.' },
        { rating: 5, title: 'Worth it', comment: 'True FIVE quality.' },
        { rating: 4, title: 'Elegant', comment: 'Exactly the FIVE aesthetic.' },
      ];
      const reviews = inserted.slice(0, 12).map((product, i) => ({ user: customer._id, product: product._id, ...samples[i % samples.length], status: 'approved' as const }));
      await Review.insertMany(reviews);
      for (const review of reviews) {
        const stats = await Review.aggregate([
          { $match: { product: review.product, status: 'approved' } },
          { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (stats[0]) await Product.findByIdAndUpdate(review.product, { ratings: Math.round(stats[0].avg * 10) / 10, reviewCount: stats[0].count });
      }
    }

    const categoryCounts = await Promise.all(Object.keys(CAT_META).map(async (slug) => ({ slug, count: await Product.countDocuments({ category: catMap[slug]?._id, status: 'active' }) })));
    console.log('—— Seed complete ——', {
      categories: await Category.countDocuments(),
      collections: await Collection.countDocuments(),
      products: await Product.countDocuments({ status: 'active' }),
      productsPerCategory: categoryCounts,
      coupons: await Coupon.countDocuments(),
      reviews: await Review.countDocuments(),
      galleries: '4 images minimum per product',
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
