# Contador Coletivo

A full-stack **mobile-first** webapp for groups of friends to register collective counts in real-time.

**Stack:** Astro 5 (SSR) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth + Realtime + RLS) · TanStack Query v5 · Zod · React Hook Form

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in `.env` with your Supabase project credentials (see Supabase Setup below).

### 3. Run Supabase SQL Schema

Paste the contents of `supabase/schema.sql` into the **Supabase SQL Editor** and run it.

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Card, Dialog, Progress…)
│   ├── islands/      # React interactive components (CounterCard, GroupList…)
│   └── layout/       # AppLayout, BaseLayout, AppHeader
├── lib/
│   ├── supabase.ts       # Browser Supabase client
│   ├── supabaseServer.ts # SSR Supabase client
│   ├── queries.ts        # TanStack Query hooks
│   ├── schemas.ts        # Zod validation schemas
│   └── utils.ts          # Helper utilities
├── pages/
│   ├── index.astro              # Landing page
│   ├── login.astro              # Auth page
│   ├── dashboard.astro          # User dashboard
│   └── groups/
│       ├── index.astro          # → redirect to dashboard
│       └── [groupId]/
│           ├── index.astro      # Group page (counters)
│           └── counter/[counterId].astro  # Counter detail
├── types/
│   └── supabase.ts    # Database type definitions
├── middleware.ts       # Auth protection middleware
└── styles/globals.css  # Tailwind + shadcn CSS variables
```

---

## 🗄️ Supabase Setup (Step-by-Step)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, database password, and region

### 2. Run the SQL Schema

1. In Supabase dashboard → **SQL Editor** → New query
2. Paste the entire `supabase/schema.sql` file and click **Run**

This creates tables (`profiles`, `groups`, `group_members`, `counters`, `counter_logs`), triggers, indexes, and all RLS policies.

### 3. Enable Google OAuth (optional)

1. Dashboard → **Authentication** → Providers → Google → Enable
2. Add your Google OAuth Client ID and Secret
3. Add `http://localhost:4321` to allowed redirect URLs

### 4. Get API Keys

1. Dashboard → **Project Settings** → API
2. Copy **Project URL** → `PUBLIC_SUPABASE_URL`
3. Copy **anon/public key** → `PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (**never expose to client!**)

### 5. Enable Realtime

Dashboard → **Database** → **Replication** → enable for tables: `counters`, `counter_logs`

### 6. Update `.env`

```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PUBLIC_APP_URL=http://localhost:4321
```

---

## 🔐 Security

- All database access governed by **Row Level Security (RLS)** policies
- Users can only see data for groups they're members of
- Server-side routes verify membership before rendering
- Service role key never sent to the browser

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript type checking |

---

## 📱 MVP Features

- ✅ Email/Password + Google OAuth
- ✅ Create group or join via 6-char invite code
- ✅ Create counters (name, unit, optional goal + deadline)
- ✅ Add amounts with optional notes
- ✅ Progress bar when goal is set
- ✅ Log history per counter
- ✅ Leaderboard of top contributors
- ✅ **Real-time updates** via Supabase Realtime
- ✅ Dark mode
- ✅ Mobile-first responsive design
