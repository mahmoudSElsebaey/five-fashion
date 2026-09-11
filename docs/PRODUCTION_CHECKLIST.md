# FIVE Fashion — Production Checklist (SECTION 15)

Use this after deploy, before announcing launch.

## Environment

- [ ] `NODE_ENV=production` on API host
- [ ] `MONGODB_URI` points to production cluster (Atlas or equivalent)
- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are unique, ≥32 chars, not placeholders
- [ ] `CLIENT_URL` lists every live frontend origin (comma-separated if multiple)
- [ ] `VITE_API_URL` on the client build is the public API base including `/api/v1`
- [ ] No `.env` files committed; secrets only in the host secret store

## Network & security

- [ ] HTTPS on frontend and API
- [ ] CORS succeeds from the live frontend origin only
- [ ] `GET /api/v1/health` returns `success: true` with version/uptime
- [ ] Rate limits active on `/api/v1` (auth routes stricter)
- [ ] Admin routes require `role=admin` (non-admin redirected)

## Data

- [ ] Seed run once in production if empty (`docs/SEED.md`)
- [ ] Admin user login works (`docs/SEED.md` credentials rotated after first login)
- [ ] Coupons intended for launch are active (`WELCOME15`, etc.)
- [ ] Product images load from allowed hosts (or fallback gradient)

## Frontend smoke

- [ ] Home, Shop, PDP, Collections, About load
- [ ] Register → Login → Profile → Orders
- [ ] Add to cart → Checkout (auth) → Confirmation → Orders list
- [ ] AR/EN toggle + RTL/LTR
- [ ] Dark/Light theme persists
- [ ] Admin dashboard opens for admin only
- [ ] Support pages: Contact, Shipping, Returns, FAQ, Privacy, Terms
- [ ] 404 for unknown paths
- [ ] Mobile nav + Escape close

## SEO

- [ ] `/robots.txt` and `/sitemap.xml` reachable
- [ ] Sitemap domain matches production host (not example.com)
- [ ] Product pages expose JSON-LD (`Product`)
- [ ] Home exposes Organization JSON-LD

## Monitoring

- [ ] Uptime check hits `/api/v1/health`
- [ ] Error logs reviewed after first 24h traffic
- [ ] Full pass of [QA_CHECKLIST.md](./QA_CHECKLIST.md)

## Explicit non-goals (current release)

- Live payment gateway charging cards (COD / offline flow only unless a provider is wired)
- Marketing email ESP (newsletter acknowledges interest only)
- Real-time chat
