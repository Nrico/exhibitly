# Exhibitly — Portfolio & Gallery Platform for Independent Artists

A clean portfolio system for artists who would rather make work than
manage a website. Organize your artwork once, then publish a public
artist page, share private viewing rooms, and export studio packets —
no code, no plugins, no updates.

## What this does

- **Public artist pages** (`/[username]`) and a browsable **gallery** —
  your published portfolio, no separate site to maintain.
- **Dashboard** — inventory management, exhibitions, a client/collector
  roster, drag-and-drop reordering (`@dnd-kit`) for how work is
  displayed, and a design section for customizing the public page.
- **Private viewing rooms** (`/view/[slug]`) — shareable links for
  showing work to a specific collector or curator without publishing
  it publicly.
- **Print packets** — generates PDF materials (`@react-pdf/renderer`)
  for studio visits or submissions.
- **Admin** — artwork moderation/management tools.
- Email (Resend + React Email) for notifications, Stripe for billing,
  Supabase for auth/database, S3-compatible storage for images.

## Stack

Next.js (App Router) · Supabase (auth + Postgres) · Stripe · AWS S3 ·
Resend · Tailwind

## Setup

```
npm install
npm run dev
```

Requires environment variables for Supabase, Stripe, AWS S3, and
Resend — see the `app/api/` routes and `app/auth/` for what each
integration is used for.

---
More projects at [enricolorenzo.com](https://enricolorenzo.com) · art at [enricotrujillo.com](https://enricotrujillo.com)
