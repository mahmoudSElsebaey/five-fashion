# FIVE Fashion — Database Seed (SECTION 04)

Re-runnable catalog seed for local and staging environments.

> **SECTION 15:** Do not run seed against a live production database that already has real orders unless you intend to wipe catalog collections. Always rotate default admin passwords after first login in any shared environment.

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

## Catalog summary

| Entity | Count (approx.) |
|--------|-----------------|
| Categories | 8 |
| Collections | 5 (Essentials, Evening, Street, Atelier, Resort) |
| Products | 41 (all `status: active`) |
| Coupons | 3 |
| Sample reviews | 8 |

Each product gets **2–3** category-coherent image URLs from the Unsplash-based library in `src/seed/images.ts`.

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
- Image URLs are remote (Unsplash). The client `ProductImage` component falls back to a gradient if a URL fails.
- Production: prefer your own CDN / Cloudinary assets and update `images.ts` or admin product images accordingly.
