# Auralis

**Luxury 3D Fashion E-Commerce Platform**

Auralis is a premium, bilingual (Arabic / English), dark & light themed fashion e-commerce experience that combines modern MERN architecture with immersive 3D interactions.

> This is not a generic store template.  
> It is designed as a high-end digital fashion brand experience for 2026.

---

## Brand

**Auralis** — An ethereal, refined, luminous fashion technology brand.

- Modern & minimal
- Luxury without excess
- Immersive yet performant
- Fully bilingual (RTL + LTR)
- Dark & Light themes powered by a centralized Design Token system

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + Design Tokens
- React Three Fiber + Drei + Three.js
- GSAP + Framer Motion
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- i18next
- React Router

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (Access + Refresh)
- Zod validation
- Cloudinary (media)

---

## Project Structure

```
auralis/
├── client/                 # Vite + React frontend
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── features/
│       ├── layouts/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── styles/         # Design Tokens live here
│       ├── utils/
│       ├── types/
│       └── i18n/
├── server/                 # Express + TypeScript backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validators/
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/mahmoudSElsebaey/auralis.git
cd auralis

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment

```bash
cp .env.example .env
# Fill in the required values
```

### Development

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

---

## Design System

The entire visual identity is controlled by a **centralized Design Token system**.

- Semantic color tokens (primary, accent, surface, muted, etc.)
- Separate values for Light & Dark themes
- Typography scale (English + Arabic)
- Spacing, radius, shadows, motion
- Single source of truth — change once, update everywhere

Tokens are defined in `client/src/styles/tokens.css` and consumed via Tailwind.

---

## Internationalization

- Full Arabic (RTL) + English (LTR) support
- Dynamic direction switching
- All user-facing strings are externalized
- Product, category, and brand content support bilingual fields

---

## 3D Strategy

3D is used intentionally:
- Hero immersive experience
- Product 3D viewer (when model is available)
- Performance budgets enforced
- Mobile-friendly fallbacks
- Respects `prefers-reduced-motion`

---

## Roadmap (High Level)

1. ✅ Discovery & Architecture
2. ✅ Brand Identity & Design System
3. ✅ Project Initialization
4. Core UI / Layout
5. Homepage
6. Product Catalog
7. Product Details + 3D Viewer
8. Authentication
9. Cart & Wishlist
10. Checkout & Orders
11. Admin / CMS
12. Advanced 3D & Motion
13. SEO / Accessibility / Performance
14. Testing & QA
15. Final Polish & Production

---

## License

Private — All rights reserved.
