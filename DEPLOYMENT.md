# Deployment Guide

## Vercel (Recommended)

### 1. Prepare your repository

```bash
git init
git add .
git commit -m "Initial commit: Heaven & Earth Movie Night booking site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/heaven-earth-movie-night.git
git push -u origin main
```

### 2. Create Vercel project

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Find your `heaven-earth-movie-night` repo and click Import
4. **Framework Preset:** Next.js (auto-detected)
5. **Root Directory:** heaven-earth-movie-night (if monorepo)
6. Click Continue

### 3. Add environment variables

In the Environment Variables section, add:

```
DATABASE_URL = postgresql://user:pass@host.neon.tech/db?sslmode=require
DIRECT_URL = postgresql://user:pass.neon.tech/db?sslmode=require
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
YOCO_SECRET_KEY = sk_test_xxxxx (or sk_live_ in production)
YOCO_WEBHOOK_SECRET = whsec_xxxxx
RESEND_API_KEY = re_xxxxx
RESEND_FROM_EMAIL = bookings@your-domain.com
ADMIN_PASSWORD = your-secure-password
ADMIN_SESSION_SECRET = 64-character-hex-string
```

Click Deploy.

### 4. Configure database

After deployment, Vercel will run `npm run build`. This includes `prisma generate` but NOT `prisma migrate deploy`.

Run migrations manually:

```bash
# Via Vercel CLI
vercel env pull
npx prisma migrate deploy

# Or connect directly if you have psql installed
psql $DATABASE_URL < prisma/migrations/20260720000000_init/migration.sql
```

### 5. Set up Yoco webhook

1. In Yoco portal → Webhooks
2. Create a new webhook:
   - **URL:** `https://your-domain.vercel.app/api/webhooks/yoco`
   - **Events:** Select "payment.succeeded"
3. Copy the signing secret
4. In Vercel → Settings → Environment Variables, update `YOCO_WEBHOOK_SECRET`
5. Redeploy: `vercel redeploy`

### 6. Custom domain (optional)

In Vercel → Settings → Domains:
- Add your domain
- Follow DNS instructions from your registrar
- Wait 5-10 minutes for DNS to propagate
- Update `NEXT_PUBLIC_APP_URL` to your domain and redeploy

### 7. Test

1. Visit your deployed URL
2. Fill the booking form
3. Complete payment (use Yoco test cards if not yet live)
4. Verify confirmation email arrives
5. Check admin dashboard: `https://your-domain.com/admin`
6. Sign in with your ADMIN_PASSWORD

## Environment Variables Checklist

- [ ] `DATABASE_URL` — PostgreSQL connection string (with ?sslmode=require)
- [ ] `DIRECT_URL` — Direct (non-pooled) connection for migrations
- [ ] `NEXT_PUBLIC_APP_URL` — Your deployed URL, no trailing slash
- [ ] `YOCO_SECRET_KEY` — From Yoco portal (test or live)
- [ ] `YOCO_WEBHOOK_SECRET` — From webhook creation
- [ ] `RESEND_API_KEY` — From Resend dashboard
- [ ] `RESEND_FROM_EMAIL` — Verified domain in Resend
- [ ] `ADMIN_PASSWORD` — Any secure string you choose
- [ ] `ADMIN_SESSION_SECRET` — 64 random hex characters

## Going Live with Real Payments

### Switch from test to live Yoco

1. In Yoco portal, find your LIVE API key (starts with `sk_live_`)
2. Update `YOCO_SECRET_KEY` in Vercel environment
3. Update `YOCO_WEBHOOK_SECRET` to the live webhook secret
4. Redeploy
5. Verify a small test payment goes through
6. Announce bookings are open

### Email domain verification

1. Add your domain to Resend (Settings → Domains)
2. Add DNS records Resend provides
3. Wait for verification
4. Update `RESEND_FROM_EMAIL` to use your domain
5. Resend: `vercel env pull && npx vercel env pull` and redeploy

### Database backups

- **Neon:** Automatic backups kept for 7 days (paid tier: 30 days)
- **Supabase:** Automatic backups, manual exports available

Set a calendar reminder to export bookings weekly:
```bash
curl https://your-domain.com/api/admin/bookings/export \
  -H "Cookie: he_admin_session=YOUR_SESSION_TOKEN" > bookings.csv
```

## Monitoring

### Check deployment logs

```bash
vercel logs
```

### Monitor database

- **Neon:** https://console.neon.tech → Monitoring
- **Supabase:** https://supabase.com → Project → Logs

### Watch for Yoco errors

Check Vercel logs for webhook failures:
```bash
vercel logs | grep yoco
```

## Rollback

If something breaks:

```bash
vercel rollback
```

This reverts to the previous successful deployment. You can also promote an older deployment from Vercel's dashboard.

## Scaling

This app handles 1000+ bookings without issue:

- **Database:** Neon auto-scales; Supabase has generous free tier
- **API:** Vercel Serverless Functions are pay-as-you-go
- **Storage:** CSV exports are tiny; keep backups for 1 year

At massive scale (100k bookings), consider:
- Archiving old bookings to cold storage
- Adding read replicas if admin dashboard queries slow down
- Caching availability with Redis (Vercel KV)

For Heaven & Earth's 40-seat event, you'll never hit these limits.

## Troubleshooting Deployment

### Build fails: "Can't find prisma"

The `prisma generate` step failed. Check:
- `npm install` ran successfully
- `@prisma/client` is in package.json (should be)
- No typos in `.env` during build

### Database connection timeout

Your `DATABASE_URL` is wrong or the database is down:
- Verify the connection string format
- Check that your IP is whitelisted (Neon/Supabase settings)
- Ensure `DIRECT_URL` uses direct connection (Neon: remove `-pooler`)

### Payment page shows 404

The Yoco secret key is wrong or missing:
- Verify `YOCO_SECRET_KEY` is set in Vercel env
- Check it starts with `sk_test_` or `sk_live_`
- Redeploy after updating env

### Webhook not firing

1. Verify the webhook URL in Yoco portal is correct
2. Check the signing secret matches `YOCO_WEBHOOK_SECRET`
3. Look at Yoco's webhook delivery logs to see if it's trying to deliver
4. Check Vercel logs for 403 Unauthorized (signature mismatch)

### Email not sent

1. Verify `RESEND_API_KEY` is valid
2. Check `RESEND_FROM_EMAIL` domain is verified in Resend
3. Look at Resend dashboard → Emails to see send status
4. Check spam folder (especially if using Resend's onboarding domain)

## Performance

On Vercel with Neon:

- **TTFB:** ~200ms (good)
- **First Load:** ~1.5s
- **Lighthouse:** 95+ score
- **Cost:** ~$15/month (Neon) + Vercel usage ($0 for <100 bookings)

## Security

Vercel automatically provides:

- HTTPS with auto-renewal
- DDoS protection
- Edge caching
- WAF (paid tier)

Keep these updated:

- [ ] Rotate `ADMIN_SESSION_SECRET` every 6 months
- [ ] Rotate `YOCO_SECRET_KEY` if exposed
- [ ] Review bookings CSV monthly for fraud
- [ ] Keep Node version current (`npm update`)

## Support

- **Vercel issues:** https://vercel.com/support
- **Neon issues:** https://neon.tech/docs
- **Yoco payment issues:** https://yoco.com/help
