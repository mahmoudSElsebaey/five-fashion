/** FIVE Fashion seed — re-runnable catalog (41 products) */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import { IMG } from './images.js';

type Gender = 'men' | 'women' | 'unisex';

const CATALOG: Array<{
  cat: string; coll: string; gender: Gender; items: Array<[string, string, keyof typeof IMG]>;
}> = [
  { cat: 'women-dresses', coll: 'evening', gender: 'women', items: [
    ['Noir Column Gown', 'فستان عمودي أسود', 'dress1'],
    ['Silk Bias Slip', 'فستان سليب حرير', 'dress2'],
    ['Structured Midi', 'فستان ميدي', 'dress3'],
    ['Tulle Evening', 'فستان تول', 'dress4'],
    ['Resort Linen', 'فستان كتان', 'dress5'],
    ['Velvet Cocktail', 'فستان مخملي', 'dress1'],
  ]},
  { cat: 'women-tops', coll: 'essentials', gender: 'women', items: [
    ['Silk Blouse', 'بلوزة حرير', 'top1'],
    ['Crop Top', 'توب قصير', 'top2'],
    ['Cashmere Knit', 'توب كشمير', 'top4'],
    ['Satin Top', 'توب ساتان', 'top5'],
    ['Poplin Shirt', 'قميص بوبلين', 'top1'],
  ]},
  { cat: 'women-outerwear', coll: 'atelier', gender: 'women', items: [
    ['Wool Coat', 'معطف صوف', 'outer1'],
    ['Leather Biker', 'جاكيت جلد', 'outer3'],
    ['Trench', 'ترينش', 'outer4'],
    ['Blazer', 'بليزر', 'outer5'],
    ['Wrap Coat', 'معطف ملتف', 'outer2'],
  ]},
  { cat: 'men-shirts', coll: 'essentials', gender: 'men', items: [
    ['Oxford Shirt', 'قميص أكسفورد', 'shirt1'],
    ['Silk Shirt', 'قميص حرير', 'shirt2'],
    ['Linen Shirt', 'قميص كتان', 'shirt3'],
    ['Formal Shirt', 'قميص رسمي', 'shirt4'],
    ['Overshirt', 'قميص علوي', 'shirt5'],
  ]},
  { cat: 'men-trousers', coll: 'essentials', gender: 'men', items: [
    ['Wool Trousers', 'بنطلون صوف', 'trouser1'],
    ['Wide Trousers', 'بنطلون واسع', 'trouser2'],
    ['Chino', 'تشينو', 'trouser3'],
    ['Tuxedo Trousers', 'بنطلون توكسيدو', 'trouser4'],
    ['Resort Trousers', 'بنطلون ريزورت', 'trouser5'],
  ]},
  { cat: 'men-outerwear', coll: 'street', gender: 'men', items: [
    ['Overcoat', 'معطف', 'menOuter1'],
    ['Field Jacket', 'جاكيت ميداني', 'menOuter2'],
    ['Bomber', 'بومبر', 'menOuter3'],
    ['Cashmere Blazer', 'بليزر كشمير', 'menOuter4'],
    ['Dinner Jacket', 'جاكيت عشاء', 'menOuter5'],
  ]},
  { cat: 'accessories', coll: 'atelier', gender: 'unisex', items: [
    ['Mini Bag', 'حقيبة صغيرة', 'acc1'],
    ['Silk Scarf', 'وشاح حرير', 'acc2'],
    ['Leather Belt', 'حزام جلد', 'acc4'],
    ['Cuff Bracelet', 'سوار', 'acc3'],
    ['Cashmere Scarf', 'وشاح كشمير', 'acc5'],
  ]},
  { cat: 'footwear', coll: 'street', gender: 'unisex', items: [
    ['Sculptural Heel', 'كعب نحتي', 'shoe1'],
    ['Derby Shoe', 'ديربي', 'shoe2'],
    ['Leather Sneaker', 'سنيكرز', 'shoe3'],
    ['Chelsea Boot', 'بوت تشيلسي', 'shoe5'],
    ['Satin Pump', 'حذاء ساتان', 'shoe1'],
  ]},
];

const CAT_META: Record<string, { en: string; ar: string; order: number }> = {
  'women-dresses': { en: 'Women Dresses', ar: 'فساتين نسائية', order: 1 },
  'women-tops': { en: 'Women Tops', ar: 'بلوزات وتوبات', order: 2 },
  'women-outerwear': { en: 'Women Outerwear', ar: 'معاطف نسائية', order: 3 },
  'men-shirts': { en: 'Men Shirts', ar: 'قمصان رجالية', order: 4 },
  'men-trousers': { en: 'Men Trousers', ar: 'بناطيل رجالية', order: 5 },
  'men-outerwear': { en: 'Men Outerwear', ar: 'معاطف رجالية', order: 6 },
  accessories: { en: 'Accessories', ar: 'إكسسوارات', order: 7 },
  footwear: { en: 'Footwear', ar: 'أحذية', order: 8 },
};

const COL_META = [
  { slug: 'essentials', en: 'Essentials', ar: 'الأساسيات', featured: true, image: 'shirt1' as const },
  { slug: 'evening', en: 'Evening', ar: 'المساء', featured: true, image: 'dress1' as const },
  { slug: 'street', en: 'Street', ar: 'ستريت', featured: true, image: 'shoe4' as const },
  { slug: 'atelier', en: 'Atelier', ar: 'الأتيليه', featured: true, image: 'outer2' as const },
  { slug: 'resort', en: 'Resort', ar: 'الريزورت', featured: false, image: 'dress5' as const },
];

async function main() {
  console.log('—— FIVE Fashion Seed ——');
  await mongoose.connect(config.mongodbUri);
  try {
    await Promise.all([
      Product.deleteMany({}), Category.deleteMany({}), Collection.deleteMany({}),
      Coupon.deleteMany({}), Review.deleteMany({}),
    ]);

    if (!(await User.findOne({ email: 'admin@fivefashion.com' }))) {
      await User.create({
        name: 'FIVE Admin', email: 'admin@fivefashion.com',
        password: await bcrypt.hash('Admin123!', 12), role: 'admin', isActive: true,
      });
    }
    let customer = await User.findOne({ email: 'customer@fivefashion.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Sara Ahmed', email: 'customer@fivefashion.com',
        password: await bcrypt.hash('Customer123!', 12), role: 'user', isActive: true,
      });
    }

    const cats = await Category.insertMany(
      Object.entries(CAT_META).map(([slug, m]) => ({
        name: { en: m.en, ar: m.ar }, slug,
        description: { en: `${m.en} by FIVE Fashion`, ar: m.ar },
        gender: slug.startsWith('women') ? 'women' : slug.startsWith('men') ? 'men' : 'unisex',
        displayOrder: m.order, isActive: true,
        image: IMG[CATALOG.find((c) => c.cat === slug)?.items[0][2] || 'dress1'],
        seoTitle: `${m.en} | FIVE Fashion`, seoDescription: `Shop ${m.en} at FIVE Fashion.`,
      }))
    );
    const catMap = Object.fromEntries(cats.map((c) => [c.slug, c]));

    const cols = await Collection.insertMany(
      COL_META.map((c) => ({
        name: { en: c.en, ar: c.ar }, slug: c.slug, featured: c.featured, isActive: true,
        image: IMG[c.image], description: { en: `${c.en} collection`, ar: `مجموعة ${c.ar}` },
        seoTitle: `${c.en} | FIVE Fashion`, seoDescription: `${c.en} collection by FIVE Fashion.`,
      }))
    );
    const colMap = Object.fromEntries(cols.map((c) => [c.slug, c]));

    let n = 1;
    const docs = [];
    for (const group of CATALOG) {
      const sizes = group.cat === 'footwear' ? ['39', '40', '41', '42', '43'] : ['S', 'M', 'L', 'XL'];
      const colors = group.gender === 'men' ? ['Black', 'Navy'] : ['Black', 'Ivory'];
      for (const [en, ar, imgKey] of group.items) {
        const price = 180 + n * 18;
        const sale = n % 4 === 0;
        const stock = 20 + (n % 25);
        const sku = `FF-${String(n).padStart(3, '0')}`;
        docs.push({
          name: { en, ar },
          slug: en.toLowerCase().replace(/\s+/g, '-'),
          description: {
            en: `Premium ${en} by FIVE Fashion. Refined materials and precise construction.`,
            ar: `${ar} من FIVE Fashion — خامات راقية وتفصيل دقيق.`,
          },
          category: catMap[group.cat]?._id,
          collection: colMap[group.coll]?._id,
          brand: 'FIVE', gender: group.gender, price: sale ? price - 40 : price,
          compareAtPrice: sale ? price : undefined,
          discount: sale ? Math.round((40 / price) * 100) : undefined,
          sku, stock, sizes, colors,
          variants: sizes.flatMap((size) =>
            colors.map((color) => ({
              size, color,
              sku: `${sku}-${size}-${color}`.slice(0, 32),
              stock: Math.max(2, Math.floor(stock / (sizes.length * colors.length))),
            }))
          ),
          images: [IMG[imgKey]],
          featured: n % 7 === 0, newArrival: n % 5 === 0, bestseller: n % 6 === 0,
          status: 'active' as const, ratings: 0, reviewCount: 0,
          seoTitle: `${en} | FIVE Fashion`,
          seoDescription: `Premium ${en} by FIVE Fashion.`,
        });
        n += 1;
      }
    }
    const inserted = await Product.insertMany(docs);

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
      if (stats[0]) {
        await Product.findByIdAndUpdate(r.product, {
          ratings: Math.round(stats[0].avg * 10) / 10, reviewCount: stats[0].count,
        });
      }
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
