# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (with 4GB heap limit)
npm run dev:turbo    # Start dev server with Turbopack (faster, less memory)
npm run build        # prisma generate + prisma db push + next build
npm start            # Start production server

npx prisma studio    # Open DB GUI at localhost:5555
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to DB (no migration files)
```

No test runner is configured. Lint is skipped in build (`echo 'Skipping lint'`).

To run a one-off TypeScript script (e.g. the utility scripts in the root): `npx tsx <script>.ts`

## Environment Variables

```
DATABASE_URL            # PostgreSQL (NeonDB/Supabase/local)
NEXTAUTH_URL            # e.g. http://localhost:3000
NEXTAUTH_SECRET         # Random secret
MP_ACCESS_TOKEN         # Mercado Pago access token
NEXT_PUBLIC_BASE_URL    # Public base URL
GOOGLE_CLIENT_ID        # Optional: Google OAuth
GOOGLE_CLIENT_SECRET    # Optional: Google OAuth
UPLOADTHING_SECRET      # Optional: file uploads
UPLOADTHING_APP_ID      # Optional: file uploads
```

## Architecture

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma + PostgreSQL, NextAuth v4, Mercado Pago, Firebase, UploadThing, Nodemailer, AI SDK (Google/OpenAI), Framer Motion, Radix UI, Recharts, DnD Kit.

### Route Structure

- `/` — Public landing page
- `/cursos` — Public course catalog; `/cursos/[id]` — Course detail
- `/membresias` — Pricing/subscription plans
- `/checkout` — Mercado Pago checkout flow
- `/learn/[id]` — In-app video lesson player (authenticated)
- `/dashboard/*` — Student area (protected by middleware)
- `/admin/*` — Admin area (requires `role === "ADMIN"`)
- `/business` — B2B corporate landing; `/join/[code]` — Company access code join
- `/bundles/[bundleId]` — Bundle detail page

### Key `src/` Directories

- `src/app/api/` — All API routes (Next.js Route Handlers)
- `src/components/` — UI components organized by domain (`layout/`, `cursos/`, `dashboard/`, `admin/`, `membresias/`, `auth/`, `ui/`)
- `src/lib/` — Shared utilities: `prisma.ts` (singleton client), `auth.ts` (NextAuth config), `mercadopago.ts`, `email.ts`, `telegram.ts`, `rewards.ts`, `course-reviews.ts`
- `src/constants/pricing.tsx` — `PLANS` array (Inversor Inicial / Trader de Elite / Portfolio Manager) with prices and features
- `src/middleware.ts` — Protects `/dashboard/*` (any authenticated user) and `/admin/*` (ADMIN role only)

### Data Model (Prisma)

Core entities and their relationships:
- **User** → `role` (`"ESTUDIANTE"` | `"ADMIN"`), optional `companyId`; has Purchases, Subscriptions, UserProgress, UserReward, UserCareer
- **Course** → Modules → Lessons → (Quiz, Resources, UserProgress)
- **Bundle** (memberships) → MembershipItems; linked to Subscriptions and Company
- **Purchase** — one-time course/bundle purchase; `status` tracks payment state
- **Subscription** — recurring Bundle subscription via Mercado Pago; `mercadoPagoId` is unique
- **Company** — B2B corporate accounts with `accessCode`, `maxSeats`, linked to a Bundle
- **Career** → CareerMilestones → UserCareer — learning path/roadmap feature
- **Coupon** — discount codes with PERCENTAGE/FIXED types
- **EmailLog** — tracks campaign and transactional emails sent to users
- **SalesGoal**, **Expense**, **Lead** — admin/financial tracking models

### Auth

NextAuth v4 with JWT sessions. Credentials provider (email + bcrypt) is always active; Google OAuth is conditionally appended if env vars are present. The JWT callback attaches `id`, `role`, `companyId`, `isCompanyAdmin`, `telegram`, `telegramVerified` to the token/session. There is a hardcoded emergency bypass for `admin@aurora.com` / `aurora@admin.com`.

### Payment Flow (Mercado Pago)

1. Client calls `/api/payment/create-preference` (one-time) or `/api/payment/create-subscription` (recurring)
2. MP redirects back; `/api/webhooks/mercadopago` receives IPN notifications and updates Purchase/Subscription status
3. `/api/payment/verify` and `/api/payment/status` let the client poll payment status
4. Subscription upgrades handled by `/api/payment/upgrade` + `/api/subscription/upgrade-calc`

### Cron / Scheduled Jobs

Routes under `/api/cron/` are intended to be hit by an external scheduler (Vercel Cron or similar):
- `campaign/email1`, `email2`, `email3` — drip email campaigns
- `evergreen` — evergreen email sequences
- `reminders`, `retention` — engagement emails
- `check-abandoned-users` — detects users who registered but didn't purchase
- `notify-manual-expiry` — notifies users with expiring manual subscriptions

### Utility Scripts (Root)

Standalone `.ts` files for admin operations (run with `npx tsx`): `get-expired-subs.ts`, `send-expired-emails.ts`, `pause-access.ts`, `delete-internal-users.ts`, `get-manual-users.ts`, etc. These connect to the DB directly via Prisma and are not part of the Next.js app.
