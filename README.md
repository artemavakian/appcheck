# AppCheck

**Check Your App Before Apple Does**

AppCheck analyzes your App Store submission and flags potential rejection risks before you wait days for review.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (database + auth)
- **Stripe Checkout** (payments)
- **Tesseract.js** (OCR for screenshot analysis)
- **Framer Motion** (animations)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema in your Supabase SQL editor:

```bash
# The schema file is at:
src/lib/supabase/schema.sql
```

3. Enable Apple OAuth in Supabase Auth settings (or use email OTP for development)

### 4. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up a webhook endpoint pointing to `/api/webhooks/stripe` listening for `checkout.session.completed`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development Auth

For development without Apple OAuth, use the email OTP endpoint:

```bash
POST /api/auth/login
{ "email": "your@email.com" }
```

This sends a magic link to your email via Supabase.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── dashboard/page.tsx          # User dashboard
│   ├── check/page.tsx              # 9-step analysis wizard
│   ├── report/[id]/page.tsx        # Report results page
│   ├── auth/callback/route.ts      # OAuth callback
│   └── api/
│       ├── analyze/route.ts        # Analysis endpoint
│       ├── reports/route.ts        # List reports
│       ├── reports/[id]/route.ts   # Single report
│       ├── checkout/route.ts       # Stripe checkout
│       ├── webhooks/stripe/route.ts# Stripe webhook
│       └── auth/login/route.ts     # Dev email login
├── components/
│   ├── Navbar.tsx                  # Landing page nav
│   ├── DashboardNav.tsx            # Dashboard nav
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── FileUpload.tsx
│       ├── LoadingSpinner.tsx
│       ├── ProgressBar.tsx
│       └── StepIndicator.tsx
├── lib/
│   ├── types.ts                    # TypeScript types
│   ├── risk-engine.ts              # Rule-based scoring
│   ├── ocr.ts                      # Tesseract.js OCR
│   ├── stripe.ts                   # Stripe client
│   └── supabase/
│       ├── client.ts               # Browser client
│       ├── server.ts               # Server client
│       ├── middleware.ts            # Auth middleware
│       └── schema.sql              # Database schema
└── middleware.ts                    # Route protection
```

## Pricing

- 1 scan credit free on signup
- $7 for 1 scan
- $25 for 5 scans
- $45 for 15 scans
