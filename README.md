# KOVA Commerce

Portfolio project: a full commerce-oriented storefront built with React, Sanity and Supabase.

KOVA is a fictional fashion brand created for this project. The goal is to demonstrate a realistic frontend architecture, CMS-driven catalog, customer authentication, persistent cart data and order modeling without tying the code to a real client.

## Stack
- React 19 + Vite
- Sanity CMS for catalog administration
- Supabase Auth + PostgreSQL for customer accounts, cart, favorites and orders
- Row Level Security (RLS) for customer-owned data
- WhatsApp checkout handoff
- Vercel-ready frontend

## Current features
- Editorial responsive home.
- Separate collection/catalog view.
- Product cards and product detail modal.
- Size, color and quantity selection.
- Persistent anonymous cart using `localStorage`.
- Email/password registration and login using Supabase Auth.
- Authenticated account drawer.
- Authenticated cart synchronization with Supabase.
- Sanity-managed products and product visibility.
- WhatsApp checkout handoff.
- Supabase schema for profiles, carts, favorites, orders and order items.
- RLS policies that isolate each customer's data.

## Architecture

```text
Customer browser
   |
   +-- React / Vite
   |      +-- UI, navigation and cart state
   |      +-- Supabase Auth session
   |      +-- Sanity catalog queries
   |
   +-- Sanity CMS
   |      +-- products
   |      +-- images
   |      +-- categories / merchandising
   |
   +-- Supabase
          +-- auth.users
          +-- profiles
          +-- cart_items
          +-- favorites
          +-- orders
          +-- order_items
```

The product catalog belongs to Sanity. Customer-owned transactional data belongs to Supabase. This keeps editorial/product content separate from authentication and relational commerce data.

## Project structure

```text
frontend/
  src/
    components/
    context/
    data/
    lib/
    pages/
    services/

sanity/
  schemaTypes/

supabase/
  migrations/
```

## Local setup

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Required variables:

```env
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-09-01
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_NUMBER=
VITE_INSTAGRAM_URL=
```

### 2. Supabase
Create a Supabase project and run the SQL migration in:

```text
supabase/migrations/001_initial_schema.sql
```

Then copy the project URL and anon key to `frontend/.env.local`.

### 3. Sanity Studio

```bash
cd sanity
npm install
npm run dev
```

Replace `REEMPLAZAR_CON_PROJECT_ID` in `sanity/sanity.config.js` with the Sanity project ID and use the same ID in the frontend environment variables.

## Security model
- Customer passwords are handled by Supabase Auth, never by the React app directly.
- The frontend only receives the Supabase anonymous public key.
- Customer tables use Row Level Security.
- Users can only read/write rows associated with their own authenticated user ID.
- Sanity remains dedicated to public catalog content and admin-managed merchandising.

## Portfolio roadmap
- Customer profile editing.
- Favorites UI and persistence.
- Order creation before WhatsApp handoff.
- Customer order history.
- Search and advanced catalog filters.
- CMS-managed category documents and ordering.
- Product stock by variant.
- Loading, error and empty-state components.
- Automated tests.
- Vercel deployment and screenshots.

## Status
Active development. This repository is being evolved as a production-style portfolio project rather than a client-specific mockup.
