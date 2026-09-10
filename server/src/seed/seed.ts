/** FIVE Fashion seed — re-runnable catalog */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import { IMG } from './images.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCT_DATA = JSON.parse(readFileSync(join(__dirname, 'products.json'), 'utf8')) as Array<{
  nameEn: string; nameAr: string; slug: string; descEn: string; descAr: string;
  category: string; collection: string; gender: 'men'|'women'|'unisex';
  price: number; compareAtPrice: number|null; sku: string; stock: number;
  sizes: string[]; colors: string[]; img: string; featured: boolean; newArrival: boolean; bestseller: boolean;
}>;

const CAT_DEFS = [
  { name: { en: 'Women Dresses', ar: 'فساتين نسائية' }, slug: 'women-dresses', gender: 'women' as const, displayOrder: 1, image: IMG.dress1 },
  { name: { en: 'Women Tops', ar: 'بلوزات وتوبات' }, slug: 'women-tops', gender: 'women' as const, displayOrder: 2, image: IMG.top1 },
  { name: { en: 'Women Outerwear', ar: 'معاطف نسائية' }, slug: 'women-outerwear', gender: 'women' as const, displayOrder: 3, image: IMG.outer1 },
  { name: { en: 'Men Shirts', ar: 'قمصان رجالية' }, slug: 'men-shirts', gender: 'men' as const, displayOrder: 4, image: IMG.shirt1 },
  { name: { en: 'Men Trousers', ar: 'بناطيل رجالية' }, slug: 'men-trousers', gender: 'men' as const, displayOrder: 5, image: IMG.trouser1 },
  { name: { en: 'Men Outerwear', ar: 'معاطف رجالية' }, slug: 'men-outerwear', gender: 'men' as const, displayOrder: 6, image: IMG.menOuter1 },
  { name: { en: 'Accessories', ar: 'إكسسوارات' }, slug: 'accessories', gender: 'unisex' as const, displayOrder: 7, image: IMG.acc1 },
  { name: { en: 'Footwear', ar: 'أحذية' }, slug: 'footwear', gender: 'unisex' as const, displayOrder: 8, image: IMG.shoe1 },
];

const COL_DEFS = [
  { name: { en: 'Essentials', ar: 'الأساسيات' }, slug: 'essentials', featured: true, image: IMG.shirt1 },
  { name: { en: 'Evening', ar: 'المساء' }, slug: 'evening', featured: true, image: IMG.dress1 },
  { name: { en: 'Street', ar: 'ستريت' }, slug: 'street', featured: true, image: IMG.shoe4 },
  { name: { en: 'Atelier', ar: 'الأتيليه' }, slug: 'atelier', featured: true, image: IMG.outer2 },
  { name: { en: 'Resort', ar: 'الريزورت' }, slug: 'resort', featured: false, image: IMG.dress5 },
];

async function main() {
  console.log('—— FIVE Fashion Seed ——');
  await mongoose.connect(config.mongodbUri);
  try {
    await Promise.all([
      Product.deleteMany({}), Category.deleteMany({}), Collection.deleteMany({}),
      Coupon.deleteMany({}), Review.deleteMany({}),
    ]);

    let customer = await User.findOne({ email: 'customer@fivefashion.com' });
    if (!(await User.findOne({ email: 'admin@fivefashion.com' }))) {
      await User.create({ name: 'FIVE Admin', email: 'admin@fivefashion.com', password: await bcrypt.hash('Admin123!', 12), role: 'admin', isActive: true });
    }
    if (!customer) {
      customer = await User.create({ name: 'Sara Ahmed', email: 'customer@fivefashion.com', password: await bcrypt.hash('Customer123!', 12), role: 'user', isActive: true });
    }

    const cats = await Category.insertMany(CAT_DEFS.map((c) => ({
      ...c, description: { en: `${c.name.en} by FIVE Fashion`, ar: c.name.ar }, isActive: true,
      seoTitle: `${c.name.en} | FIVE Fashion`, seoDescription: `Shop ${c.name.en} at FIVE Fashion.`,
    })));
    const catMap = Object.fromEntries(cats.map((c) => [c.slug, c]));

    const cols = await Collection.insertMany(COL_DEFS.map((c) => ({
      ...c, description: { en: `${c.name.en} collection`, ar: `مجموعة ${c.name.ar}` }, isActive: true,
      seoTitle: `${c.name.en} | FIVE Fashion`, seoDescription: `${c.name.en} collection by FIVE Fashion.`,
    })));
    const colMap = Object.fromEntries(cols.map((c) => [c.slug, c]));

    const products = PRODUCT_DATA.map((p) => {
      const img = IMG[p.img as keyof typeof IMG] || IMG.dress1;
      const compare = p.compareAtPrice ?? undefined;
      const discount = compare && compare > p.price ? Math.round(((compare - p.price) / compare) * 100) : undefined;
      return {
        name: { en: p.nameEn, ar: p.nameAr }, slug: p.slug,
        description: { en: p.descEn, ar: p.descAr },
        category: catMap[p.category]?._id, collection: colMap[p.collection]?._id,
        brand: 'FIVE', gender: p.gender, price: p.price, compareAtPrice: compare, discount,
        sku: p.sku, stock: p.stock, sizes: p.sizes, colors: p.colors,
        variants: p.sizes.flatMap((size) => p.colors.map((color) => ({
          size, color, sku: `${p.sku}-${size}-${color}`.replace(/\s+/g, '').slice(0, 32),
          stock: Math.max(2, Math.floor(p.stock / (p.sizes.length * p.colors.length))),
        }))),
        images: [img], featured: p.featured, newArrival: p.newArrival, bestseller: p.bestseller,
        status: 'active' as const, ratings: 0, reviewCount: 0,
        seoTitle: `${p.nameEn} | FIVE Fashion`, seoDescription: p.descEn.slice(0, 155),
      };
    });
    const inserted = await Product.insertMany(products);

    const now = new Date();
    const nextYear = new Date(now); nextYear.setFullYear(nextYear.getFullYear() + 1);
    await Coupon.insertMany([
      { code: 'FIVE10', discountType: 'percentage', discountValue: 10, minimumOrderAmount: 100, maximumDiscount: 150, usageLimit: 1000, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
      { code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minimumOrderAmount: 250, usageLimit: 500, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
      { code: 'EVENING20', discountType: 'percentage', discountValue: 20, minimumOrderAmount: 400, maximumDiscount: 300, usageLimit: 200, usedCount: 0, startDate: now, expiryDate: nextYear, isActive: true },
    ]);

    const samples = [
      { rating: 5, title: 'Exceptional quality', comment: 'Outstanding fabric and finish.' },
      { rating: 5, title: 'Perfect fit', comment: 'Precise tailoring.' },
      { rating: 4, title: 'Beautiful piece', comment: 'Looks better in person.' },
      { rating: 5, title: 'Worth it', comment: 'True luxury investment.' },
      { rating: 4, title: 'Elegant', comment: 'Exactly the FIVE aesthetic.' },
    ];
    const reviews = inserted.slice(0, 8).map((prod, i) => ({
      user: customer!._id, product: prod._id, ...samples[i % samples.length], status: 'approved' as const,
    }));
    await Review.insertMany(reviews);
    for (const r of reviews) {
      const stats = await Review.aggregate([
        { $match: { product: r.product, status: 'approved' } },
        { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (stats[0]) await Product.findByIdAndUpdate(r.product, { ratings: Math.round(stats[0].avg * 10) / 10, reviewCount: stats[0].count });
    }

    console.log('—— Seed complete ——', {
      categories: await Category.countDocuments(),
      collections: await Collection.countDocuments(),
      products: await Product.countDocuments({ status: 'active' }),
      coupons: await Coupon.countDocuments(),
      reviews: await Review.countDocuments(),
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
