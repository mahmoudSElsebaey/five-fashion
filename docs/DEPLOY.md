# Deploy Notes — FIVE Fashion

## Client (static)

1. Set `VITE_API_URL` to your production API.
2. `cd client && npm ci && npm run build`
3. Deploy `client/dist` to Vercel, Netlify, Cloudflare Pages, or any static host.
4. Configure SPA fallback so all routes serve `index.html`.

## Server (API)

1. Copy `server/.env.example` → `.env` and set strong JWT secrets + `MONGODB_URI` (Atlas recommended).
2. Set `CLIENT_URL` to the production frontend origin (CORS).
3. `cd server && npm ci && npm run build && npm start` (or use a process manager / Railway / Render / Fly).
4. Ensure MongoDB network access allows the server IP.

## Post-deploy checklist

- [ ] Replace domain in `client/public/robots.txt` and `sitemap.xml`
- [ ] Verify `/api/v1/health`
- [ ] Verify CORS from the live frontend
- [ ] Run through [QA_CHECKLIST.md](./QA_CHECKLIST.md)
- [ ] Confirm HTTPS only in production

## Security reminders

- Never commit real `.env` files
- Rotate JWT secrets if exposed
- Restrict admin access by role when enabling strict mode in `AdminLayout`
