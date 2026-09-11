# FIVE Fashion — QA Checklist

Use this checklist before each release. Mark items as pass/fail.

## 1. Brand & Theme
- [ ] Logo and brand name show as **FIVE** / **FIVE Fashion**
- [ ] Dark / Light theme toggle works and persists
- [ ] No leftover old brand names (e.g. Auralis)

## 2. Localization
- [ ] Language toggle switches Arabic ↔ English
- [ ] `dir="rtl"` applies in Arabic; `dir="ltr"` in English
- [ ] Key pages (Home, Shop, Product, Cart, Checkout) show translated strings

## 3. Navigation & Layout
- [ ] Header links work (Home, Shop, Collections, About)
- [ ] Mobile menu opens/closes
- [ ] Footer links render without layout break
- [ ] Skip to content link is focusable with keyboard

## 4. Catalog & Product
- [ ] Shop page lists products
- [ ] Filters (category, gender, new, sale) update results
- [ ] Search filters products
- [ ] Sort changes order
- [ ] Product detail shows size/color selectors
- [ ] Product images load (or show gradient fallback)
- [ ] 3D viewer loads (or falls back gracefully)

## 5. Cart & Wishlist
- [ ] Add to cart from product page (requires size when sizes exist)
- [ ] Cart drawer opens, quantity update, remove work
- [ ] Subtotal updates correctly
- [ ] Wishlist add/remove and Wishlist page work
- [ ] Counts in header update

## 6. Checkout & Orders
- [ ] Empty cart redirects/blocks checkout appropriately
- [ ] Checkout form validates required fields
- [ ] Coupons: `FIVE10` (10%), `WELCOME15` (15%), `EVENING20` (20%)
- [ ] Place order clears cart and shows confirmation
- [ ] Orders page lists placed orders

## 7. Auth
- [ ] Register / Login forms validate
- [ ] Protected routes redirect to login when logged out
- [ ] Profile shows user info; logout works
- [ ] Admin (`/admin`) requires authentication

## 8. Admin
- [ ] Dashboard shows stats
- [ ] Products table lists API/seed products
- [ ] Orders table lists orders

## 9. Performance & a11y (smoke)
- [ ] Initial load shows spinner for lazy routes
- [ ] No obvious console errors on main flows
- [ ] Focus outlines visible on interactive controls
- [ ] `prefers-reduced-motion` stops float/auto-rotate when enabled

## 10. Support pages
- [ ] Footer links: Contact, Shipping, Returns, FAQ, Privacy, Terms
- [ ] Newsletter form validates email and shows honest confirmation (no fake API)
- [ ] FAQ answers render in AR and EN

## 11. SEO smoke
- [ ] Product pages inject Product JSON-LD
- [ ] Document title changes per page (where PageMeta is used)
- [ ] `/robots.txt` and `/sitemap.xml` are reachable in production build

---

**Notes for testers**  
- Authenticated cart/wishlist sync with API when available; guest uses localStorage.  
- Payment is not charged (demo readiness only).  
- Replace example domain in sitemap/robots before production.
