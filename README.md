# FIVE Fashion

**Luxury 3D Fashion E-Commerce Platform**

FIVE is a premium, bilingual (Arabic / English), dark & light themed fashion e-commerce experience that combines modern MERN-style architecture with immersive 3D interactions.

> Not a generic store template.  
> Built as a high-end digital fashion brand experience.

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

## Features (Current)

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

**Demo coupons:** `FIVE10` (10%), `WELCOME15` (15%)

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
- bcryptjs

---

## Project Structure

```
five-fashion/
├── client/                 # Vite + React frontend
│   ├── public/             # logo, robots.txt, sitemap.xml
│   └── src/
│       ├── components/     # ui, layout, shop, product, 3d, cart, admin, seo, a11y, motion
│       ├── features/       # auth, cart, wishlist, orders
│       ├── pages/          # storefront + admin
│       ├── layouts/
│       ├── hooks/
│       ├── store/
│       ├── styles/         # Design Tokens
│       ├── i18n/
│       ├── data/           # mock products
│       └── utils/
├── server/                 # Express + TypeScript API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── validators/
├── docs/
│   └── QA_CHECKLIST.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) for auth API
- npm or pnpm

### 1. Clone

```bash
git clone https://github.com/mahmoudSElsebaey/five-fashion.git
cd five-fashion
```

### 2. Server

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT secrets
npm install
npm run dev
```

API default: `http://localhost:5000`  
Health: `GET /api/v1/health`

### 3. Client

```bash
cd client
cp .env.example .env
# Optional: VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev
```

App default: `http://localhost:5173`

### 4. Tests

```bash
cd client
npm test
```

### 5. Production build (client)

```bash
cd client
npm run build
npm run preview
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API port | `5000` |
| `CLIENT_URL` | CORS origin | `http://localhost:5173` |
| `MONGODB_URI` | Mongo connection | `mongodb://localhost:27017/five-fashion` |
| `JWT_ACCESS_SECRET` | Access token secret | long random string |
| `JWT_REFRESH_SECRET` | Refresh token secret | long random string |
| `JWT_ACCESS_EXPIRES_IN` | Access TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh TTL | `7d` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `http://localhost:5000/api/v1` |

---

## Main Routes

### Storefront
- `/` — Home
- `/shop` — Catalog
- `/product/:id` — Product detail
- `/wishlist` — Wishlist
- `/checkout` — Checkout
- `/order-confirmation/:id` — Order confirmation
- `/orders` — Order history
- `/login` · `/register` · `/profile`

### Admin (requires login)
- `/admin` — Dashboard
- `/admin/products` — Products
- `/admin/orders` — Orders

---

## Design System

All UI consumes **semantic Design Tokens** (CSS variables) defined in `client/src/styles/tokens.css`.

- Light / Dark via `data-theme`
- Do not hardcode brand colors in components
- Motion tokens and reduced-motion are respected in 3D and GSAP

---

## QA

See [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) for a full pre-release checklist (brand, i18n, cart, checkout, auth, admin, a11y, SEO).

---

## Known Limitations (Phase scope)

- Product images are gradient placeholders (no real media pipeline yet)
- Cart, wishlist, and orders persist in **localStorage** on the client
- Checkout payment is **demo-ready only** (no real gateway charge)
- Product 3D viewer uses a stylized geometry until real GLTF models are supplied
- Admin product “Add” is reserved for a future CRUD + upload flow
- Sitemap/robots use a placeholder domain — replace before production

---

## Scripts Summary

| Location | Command | Purpose |
|----------|---------|---------|
| `client` | `npm run dev` | Vite dev server |
| `client` | `npm run build` | Production build |
| `client` | `npm test` | Vitest unit tests |
| `server` | `npm run dev` | Express + tsx/watch |
| `server` | `npm run build` | Compile TypeScript |

---

## License

Private — all rights reserved © FIVE Fashion

---

Built as a production-oriented foundation for a luxury 3D fashion brand experience.
