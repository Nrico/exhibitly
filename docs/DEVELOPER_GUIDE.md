# Exhibitly Developer Guide

Technical documentation for the Exhibitly platform.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **Deployment**: Vercel

## Project Structure

```
exhibitly/
├── app/                    # Next.js App Router pages and API routes
│   ├── [username]/         # Dynamic public portfolio route
│   ├── admin/              # Super-admin dashboard
│   ├── auth/               # Authentication routes & actions
│   ├── dashboard/          # User dashboard (protected)
│   └── actions/            # Shared server actions
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── public/             # Public portfolio components
│   └── themes/             # Theme definitions (Cinema, Archive, WhiteCube)
├── utils/                  # Helper functions
│   └── supabase/           # Supabase client/server utilities
├── docs/                   # Documentation
└── public/                 # Static assets
```

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/exhibitly.git
    cd exhibitly
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in the values:
    ```bash
    cp .env.example .env.local
    ```
    Required keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `RESEND_API_KEY`
    - `STRIPE_SECRET_KEY`
    - `NEXT_PUBLIC_BASE_URL` (e.g., http://localhost:3000)

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Key Features Implementation

### Authentication
Uses Supabase Auth with PKCE flow.
- **Middleware**: `middleware.ts` protects `/dashboard` and `/admin` routes.
- **Callback**: `app/auth/callback/route.ts` handles the code exchange.
- **Impersonation**: Admins can set an `x-impersonate-id` cookie to view the dashboard as another user.

### Themes
Themes are implemented as separate components in `components/themes/`.
- **PortfolioLayout**: The main wrapper (`components/public/portfolio-layout.tsx`) determines which theme to render based on `settings.theme`.
- **Context**: `PortfolioContext` avoids prop drilling of profile/artwork data.

### Gallery System
- **Account Type**: Profiles have an `account_type` ('artist' or 'gallery').
- **Roster**: Galleries manage `artists` table.
- **Exhibitions**: Galleries manage `exhibitions` and `exhibition_artworks` (join table).

## Deployment

The project is optimized for deployment on **Vercel**.

1.  Connect your GitHub repository to Vercel.
2.  Add the Environment Variables in Vercel Project Settings.
3.  Deploy.

## Database Schema

See `supabase/schema.sql` for the complete schema definition, including:
- `profiles` (Users)
- `artworks` (Inventory)
- `site_settings` (Configuration)
- `subscribers` (Email list)
- `artists` & `exhibitions` (Gallery features)
