# FIVE Fashion — Database Seed

Re-runnable catalog seed for local and staging environments.

> Do not run seed against a live production database that already has real orders unless you intend to wipe catalog collections. Always rotate default admin passwords after first login in any shared environment.

## Requirements

- MongoDB reachable via `MONGODB_URI` in `server/.env`
- Server dependencies installed (`cd server && npm install`)

## Run

```bash
cd server
cp .env.example .env   # if needed
npm run seed
```

The script **clears** products, categories, collections, coupons, and reviews, then inserts a fresh catalog. Demo users are upserted (passwords reset to the values below).

The seed **validates before insert**: unique SKUs/slugs, 3–5 images per product, no shared image URLs across products, bilingual copy, category/collection refs, and sale-price consistency.

## Catalog summary

| Entity | Count |
|--------|--------|
| Categories | 11 |
| Collections | 5 (Essentials, Evening, Street, Atelier, Resort) |
| Products | 47 (all `status: active`) |
| Product images | 188 (exactly 4 unique URLs per product) |
| Coupons | 3 |
| Sample reviews | up to 12 |

### Categories

Women Dresses, Women Tops, Women Bottoms, Women Outerwear, Men Shirts, Men Knitwear, Men Trousers, Men Outerwear, Bags, Accessories, Footwear.

### Images

Each product has its own 4-image gallery (Unsplash + Pexels). URLs are unique catalog-wide. Collection covers reuse a product hero (intentional).

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@fivefashion.com` | `Admin123!` |
| Customer | `customer@fivefashion.com` | `Customer123!` |

## Demo coupons

| Code | Type | Value | Min order |
|------|------|-------|-----------|
| `FIVE10` | percentage | 10% | 100 |
| `WELCOME15` | percentage | 15% | 150 |
| `EVENING20` | percentage | 20% | 400 |

## Notes

- Do **not** rely on `client/src/data/mockProducts.ts` — it is deprecated; the shop reads the API only.
- Image URLs are remote. The client `ProductImage` component falls back to a gradient if a URL fails.
- Production: prefer your own CDN / Cloudinary assets and update `src/seed/images.ts` or admin product images accordingly.
