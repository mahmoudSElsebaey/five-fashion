# FIVE Fashion

**Luxury 3D Fashion E-Commerce Platform**

Bilingual (Arabic / English), dark & light themed fashion commerce with a MERN-style stack and optional 3D product previews.

**Repository:** https://github.com/mahmoudSElsebaey/five-fashion

---

## Brand

**FIVE Fashion** — minimal luxury, immersive where it earns its place.

- AR / EN with full RTL / LTR
- Dark & light via design tokens
- Signature metallic identity

---

## Implementation status (Sections 01–15)

| Section | Focus | Status |
|---------|--------|--------|
| 01 | Design tokens, UI primitives, a11y basics | ✅ |
| 02 | API hardening (rate limit, JWT, CORS, health, errors) | ✅ |
| 03 | Auth + customer account | ✅ |
| 04 | Catalog seed, images, product fallbacks | ✅ |
| 05 | Shop URL filters + empty/error states | ✅ |
| 06 | Product detail (slug/id, related, stock) | ✅ |
| 07 | Cart, wishlist, checkout (auth-required) | ✅ |
| 08 | Customer orders from API | ✅ |
| 09 | Admin dashboard + orders moderation UX | ✅ |
| 10 | Admin catalog CRUD without `alert()` | ✅ |
| 11 | About, Collections, Privacy, Terms, 404 | ✅ |
| 12 | Product reviews + robots/sitemap | ✅ |
| 13 | ErrorBoundary, ScrollToTop, 3D isolation | ✅ |
| 14 | Support pages, Footer, Product JSON-LD | ✅ |
| 15 | Production docs, Organization JSON-LD, launch checklist | ✅ |

**Demo coupons (when seeded):** `FIVE10`, `WELCOME15`, `EVENING20`

---

## Tech stack

### Frontend (`client/`)
- React 18 + TypeScript + Vite
- Tailwind CSS + design tokens
- React Three Fiber / Drei / Three.js
- Redux Toolkit
- i18next
- React Router
- Zod (forms where used)

### Backend (`server/`)
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT access + refresh
- Zod validation
- helmet, cors, morgan, rate limiting

---

## Quick start

```bash
# API
cd server
cp .env.example .env   # set MONGODB_URI + JWT secrets
npm ci
npm run dev

# Client (new terminal)
cd client
cp .env.example .env.local   # VITE_API_URL=http://localhost:5000/api/v1
npm ci
npm run dev
```

Seed (development): see [docs/SEED.md](./docs/SEED.md).

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/DEPLOY.md](./docs/DEPLOY.md) | Deploy client + API |
| [docs/PRODUCTION_CHECKLIST.md](./docs/PRODUCTION_CHECKLIST.md) | Launch gate |
| [docs/QA_CHECKLIST.md](./docs/QA_CHECKLIST.md) | Regression smoke |
| [docs/SEED.md](./docs/SEED.md) | Database seed |

---

## Project layout

```
five-fashion/
├── client/          # Vite React SPA
├── server/          # Express API
├── docs/            # Deploy, QA, seed, production
└── vercel.json      # SPA rewrites for client
```

---

## License

Private / project-specific unless stated otherwise by the repository owner.
