# FIVE Fashion

**Luxury 3D Fashion E-Commerce Platform**

FIVE is a premium, bilingual (Arabic / English), dark & light themed fashion e-commerce experience that combines modern MERN-style architecture with immersive 3D interactions.

> Not a generic store template.  
> Built as a high-end digital fashion brand experience.

**Repository:** https://github.com/mahmoudSElsebaey/five-fashion

---

## Brand

**FIVE Fashion** — luxurious, minimal, futuristic.

- Modern & minimal
- Luxury without excess
- Immersive yet performant
- Fully bilingual (RTL + LTR)
- Dark & Light themes via centralized Design Tokens
- Signature metallic “5” logo

**Primary brand name:** FIVE

---

## Features (Phases 1–15)

| Area | Status |
|------|--------|
| Design system (tokens, themes) | ✅ |
| Bilingual AR/EN + RTL/LTR | ✅ |
| Homepage + 3D hero | ✅ |
| Product catalog, filters, search, sort | ✅ |
| Product detail (variants, 3D viewer) | ✅ |
| Cart drawer + Wishlist | ✅ |
| Checkout + coupons + orders (local) | ✅ |
| Auth API (JWT register/login/refresh) | ✅ |
| Admin CMS (dashboard, products, orders) | ✅ |
| GSAP reveals + reduced-motion | ✅ |
| SEO basics + skip link + lazy routes | ✅ |
| Unit tests (cart, wishlist, coupons) | ✅ |
| Launch documentation | ✅ |

**Demo coupons:** `FIVE10` (10%), `WELCOME15` (15%), `EVENING20` (20%)

---

## Tech Stack

### Frontend (`client/`)
- React 18 + TypeScript + Vite
- Tailwind CSS + Design Tokens
- React Three Fiber + Drei + Three.js
- GSAP
- Redux Toolkit
- React Hook Form + Zod
- i18next
- React Router
- Vitest

### Backend (`server/`)
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (Access + Refresh)
- Zod validation
- bcryptjs, helmet, cors, morgan, express-rate-limit

---

## Quick start

```bash
# Server
cd server && cp .env.example .env && npm install && npm run seed && npm run dev

# Client (new terminal)
cd client && cp .env.example .env && npm install && npm run dev
```

See [docs/SEED.md](./docs/SEED.md) for seed details and demo accounts.

---

## Project Structure

```
five-fashion/
├── client/                 # Vite + React frontend
│   ├── public/             # logo, robots.txt, sitemap.xml
│   └── src/
│       ├── components/     # ui, layout, shop, product, 3d, cart, admin, seo, a11y, motion
│       ├── features/       # auth, cart, orders, wishlist
│       ├── pages/          # storefront + admin
│       └── styles/         # design tokens
├── server/                 # Express + Mongo API
│   └── src/seed/           # re-runnable catalog seed
└── docs/                   # SEED, DEPLOY, QA_CHECKLIST
```
