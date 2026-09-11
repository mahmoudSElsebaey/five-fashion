# Deploy Notes — FIVE Fashion (SECTION 15)

## Client (static SPA)

1. Set `VITE_API_URL` to the production API base **including** `/api/v1`  
   Example: `https://api.example.com/api/v1`
2. `cd client && npm ci && npm run build`
3. Deploy `client/dist` (Vercel uses root `vercel.json` rewrites → `index.html`).
4. Confirm SPA fallback: deep links like `/product/slug` and `/admin` resolve.

## Server (API)

1. Copy `server/.env.example` → `.env` on the host (never commit secrets).
2. Required in production:
   - `MONGODB_URI`
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (≥32 chars, unique)
   - `CLIENT_URL` (exact frontend origin(s), comma-separated)
3. `cd server && npm ci && npm run build && npm start`  
   (or Railway / Render / Fly / your process manager)
4. Allow the server IP on the MongoDB network access list.

## Health check

```http
GET /api/v1/health
```

Expect JSON with `success: true`, `version`, `uptimeSeconds`, and Mongo status when configured.

## Seed (optional, empty DB only)

See [SEED.md](./SEED.md). Rotate the default admin password after first login.

## Post-deploy

Follow [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) then [QA_CHECKLIST.md](./QA_CHECKLIST.md).

## Security

- Never commit real `.env` files
- Rotate JWT secrets if ever exposed
- Keep admin role checks enabled (`AdminLayout` + server middleware)
- Prefer HTTPS-only cookies / tokens transport in production browsers
