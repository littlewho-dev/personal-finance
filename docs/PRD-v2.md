# Personal Finance Dashboard v2 - Product Requirements Document

## Overview

Version 2 replaces the mocked JSON data layer with Supabase, adding user authentication, multi-tenant data isolation, and a foundation for future CRUD operations. The application remains read-only in v2; users see seeded demo data. The architecture introduces clear separation between backend (API routes), frontend logic (hooks), and presentation (components).

## Goals

- **Primary**: Multi-tenant authentication with per-user data isolation
- **Secondary**: Replace mock JSON with Supabase database as the single source of truth
- **Tertiary**: Establish modular architecture that supports future CRUD (v3) without refactoring

---

## Prerequisites

All v1 MVP features are complete before v2 work begins:

- Dashboard with net worth card and category tables
- History page with snapshot list
- Settings page with currency display
- CurrencyDisplay, i18n, and theming foundations

---

## v2 Scope

### 1. Authentication

**Supabase Auth with email/password.**

#### User Flows

- **Sign up**: Email + password registration. On success, seed demo data for the new user and redirect to dashboard.
- **Sign in**: Email + password login. Redirect to dashboard.
- **Sign out**: Clear session and redirect to sign-in page.
- **Session persistence**: Supabase handles refresh tokens. Users stay signed in across browser sessions until explicit sign-out.

#### Pages

| Route           | Access    | Description          |
| --------------- | --------- | -------------------- |
| `/auth/sign-in` | Public    | Sign-in form         |
| `/auth/sign-up` | Public    | Registration form    |
| `/`             | Protected | Dashboard (existing) |
| `/history`      | Protected | History (existing)   |
| `/settings`     | Protected | Settings (existing)  |

#### Auth Middleware

Next.js middleware protects all routes except `/auth/*`. Unauthenticated requests redirect to `/auth/sign-in`.

### 2. Database Schema

All tables include a `user_id` column referencing `auth.users(id)`. Row Level Security (RLS) policies ensure users only access their own data.

```sql
-- Accounts
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash', 'asset', 'debt')),
  subtype text not null,
  institution text,
  created_at timestamptz not null default now()
);

-- Snapshots
create table snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now()
);

-- Balances (join table: snapshot <-> account)
create table balances (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references snapshots(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  amount numeric(15,2) not null
);

-- Settings (one row per user)
create table user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency_code text not null default 'USD',
  currency_symbol text not null default '$',
  currency_locale text not null default 'en-US'
);

-- RLS policies (applied to all tables)
alter table accounts enable row level security;
create policy "Users see own accounts" on accounts
  for select using (auth.uid() = user_id);

-- Same pattern for snapshots, balances, user_settings
```

#### Migrations

Use Supabase CLI migrations (`supabase/migrations/`). Each migration is a timestamped SQL file, version-controlled in the repo.

### 3. Data Access Layer

Replace `lib/data.ts` (mock JSON reads) with Supabase queries behind the same interface.

```
src/lib/
├── supabase/
│   ├── client.ts          # Browser Supabase client (singleton)
│   ├── server.ts          # Server-side Supabase client (per-request)
│   └── types.ts           # Generated database types (supabase gen types)
├── data/
│   ├── accounts.ts        # getAccounts(userId)
│   ├── snapshots.ts       # getSnapshots(userId), getLatestSnapshot(userId)
│   ├── settings.ts        # getSettings(userId)
│   └── calculations.ts    # calculateNetWorth (pure function, no DB)
└── types.ts               # Application-level types (unchanged)
```

The data access functions are called exclusively from API routes, never from components or hooks directly.

### 4. API Routes

RESTful API routes serve as the backend layer. Each route authenticates the request, calls the data access layer, and returns JSON.

```
src/app/api/
├── accounts/
│   └── route.ts           # GET /api/accounts
├── snapshots/
│   └── route.ts           # GET /api/snapshots
├── snapshots/[id]/
│   └── route.ts           # GET /api/snapshots/:id
├── settings/
│   └── route.ts           # GET /api/settings
└── net-worth/
    └── route.ts           # GET /api/net-worth
```

#### API Response Shape

```typescript
// Success
{
  data: T;
}

// Error
{
  error: {
    message: string;
    code: string;
  }
}
```

#### Authentication in API Routes

Every API route extracts the user from the Supabase session. Unauthenticated requests return `401`. RLS provides a second layer of defense at the database level.

### 5. Frontend Hooks

React Query hooks consume the API routes and provide data to components. Hooks handle loading states, errors, and caching.

```
src/hooks/
├── use-accounts.ts        # useAccounts()
├── use-snapshots.ts       # useSnapshots(), useSnapshot(id)
├── use-settings.ts        # useSettings()
├── use-net-worth.ts       # useNetWorth()
└── use-auth.ts            # useAuth() - session, signIn, signUp, signOut
```

#### Hook Contract

```typescript
// Every data hook returns this shape
interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}
```

Components receive data via hooks and render it. They contain zero business logic and zero data fetching logic.

### 6. Component Architecture

Components become purely presentational. They accept props and render UI. No `fetch`, no Supabase client, no business logic.

**Three-layer separation:**

```
API Route (backend)          → authenticates, queries DB, returns JSON
  ↓
Hook (frontend logic)        → fetches API, manages cache/loading/error state
  ↓
Component (dumb UI)          → receives props, renders JSX
```

Existing components (`NetWorthCard`, `CategoryTable`, `SnapshotList`, `CurrencyDisplay`) remain presentational. Page components wire hooks to feature components.

### 7. Test Data Generation

#### Seed Scripts

SQL seed scripts populate a baseline dataset for development and demo purposes.

```
supabase/
├── migrations/            # Schema migrations
└── seed/
    ├── seed.sql           # Main seed entry point
    └── demo-data.sql      # Realistic demo accounts, snapshots, balances
```

Seed data is applied automatically when running `supabase db reset` and when a new user signs up (via a database function or edge function).

#### Factory Functions

TypeScript factory functions generate valid randomized data for tests.

```
src/test/
├── factories/
│   ├── account.factory.ts   # buildAccount(overrides?)
│   ├── snapshot.factory.ts  # buildSnapshot(overrides?)
│   ├── balance.factory.ts   # buildBalance(overrides?)
│   └── settings.factory.ts  # buildSettings(overrides?)
└── helpers/
    └── seed.ts              # seedTestUser() - creates user + demo data in test DB
```

Factories produce plain objects matching application types. They use `@faker-js/faker` for realistic random values. Each factory has sensible defaults that can be overridden:

```typescript
// Usage
const account = buildAccount({ type: 'debt', subtype: 'mortgage' });
const snapshot = buildSnapshot({ balances: [buildBalance({ amount: 5000 })] });
```

### 8. Local Development with Supabase

Use Supabase CLI for local development. No cloud dependency for day-to-day work.

```bash
supabase start           # Start local Supabase (Postgres, Auth, etc.)
supabase db reset        # Reset DB and apply migrations + seed data
supabase gen types       # Generate TypeScript types from schema
pnpm dev                 # Start Next.js dev server
```

#### Environment Variables

```
# .env.local (not committed)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
```

---

## File Structure (v2)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard (protected)
│   ├── auth/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── history/page.tsx            # Protected
│   ├── settings/page.tsx           # Protected
│   └── api/
│       ├── accounts/route.ts
│       ├── snapshots/route.ts
│       ├── snapshots/[id]/route.ts
│       ├── settings/route.ts
│       └── net-worth/route.ts
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── auth/                       # Auth forms (SignInForm, SignUpForm)
│   ├── dashboard/                  # NetWorthCard, CategoryTable
│   ├── history/                    # SnapshotList
│   └── common/                     # CurrencyDisplay, LoadingState, ErrorState
├── hooks/
│   ├── use-accounts.ts
│   ├── use-snapshots.ts
│   ├── use-settings.ts
│   ├── use-net-worth.ts
│   └── use-auth.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts                # Generated
│   ├── data/
│   │   ├── accounts.ts
│   │   ├── snapshots.ts
│   │   ├── settings.ts
│   │   └── calculations.ts
│   ├── types.ts                    # Application types
│   └── i18n/messages.ts
├── middleware.ts                    # Auth route protection
└── test/
    ├── factories/
    │   ├── account.factory.ts
    │   ├── snapshot.factory.ts
    │   ├── balance.factory.ts
    │   └── settings.factory.ts
    └── helpers/
        └── seed.ts

supabase/
├── config.toml
├── migrations/
│   └── 00001_initial_schema.sql
└── seed/
    ├── seed.sql
    └── demo-data.sql

features/                            # Acceptance tests (unchanged structure)
├── auth.feature
├── dashboard.feature
├── steps/
└── support/
```

---

## Migration Plan (v1 to v2)

### Phase 1: Infrastructure

1. Set up Supabase project (local + cloud)
2. Create database schema and migrations
3. Configure environment variables
4. Add `@supabase/supabase-js` and `@tanstack/react-query` dependencies

### Phase 2: Authentication

5. Implement Supabase client (browser + server)
6. Build sign-in and sign-up pages
7. Add auth middleware for route protection
8. Create `useAuth` hook
9. Write seed function to populate demo data on user signup

### Phase 3: Data Layer Swap

10. Create data access functions in `lib/data/` (replace `lib/data.ts`)
11. Build API routes
12. Create React Query hooks
13. Update page components to use hooks instead of direct data imports
14. Remove mock JSON files and old `lib/data.ts`

### Phase 4: Test Infrastructure

15. Set up factory functions with faker
16. Create test helper for seeding test users
17. Update existing acceptance tests to work with auth (login step)
18. Add auth-specific acceptance tests

---

## New Commands

```bash
# Supabase
pnpm db:start            # supabase start
pnpm db:stop             # supabase stop
pnpm db:reset            # supabase db reset (migrations + seed)
pnpm db:gen-types        # supabase gen types typescript --local > src/lib/supabase/types.ts
pnpm db:migrate          # supabase migration up

# Testing
pnpm test:e2e            # Existing (now starts Supabase first)
```

---

## Technical Decisions

| Decision      | Choice                         | Rationale                                                 |
| ------------- | ------------------------------ | --------------------------------------------------------- |
| Auth          | Supabase Auth (email/password) | Integrated with RLS, no separate auth service needed      |
| Data fetching | React Query                    | Caching, loading/error states, refetch on focus           |
| API layer     | Next.js Route Handlers         | Standard REST-like API, framework-native, easy to test    |
| DB types      | `supabase gen types`           | Auto-generated from schema, always in sync                |
| Local dev     | Supabase CLI                   | No cloud dependency, fast iteration, matches production   |
| Test data     | Seed scripts + factories       | Seeds for baseline, factories for test-specific scenarios |
| ID format     | UUID                           | Supabase default, no sequential ID leakage                |

---

## Out of Scope (v3+)

- Full CRUD (add/edit/delete accounts, snapshots, settings)
- Multi-currency support
- Data import/export (CSV, bank integrations)
- Visualizations (charts, graphs)
- Dark mode toggle
- Password reset / email verification flows
- Profile management
- Mobile app

---

## Success Criteria

v2 is complete when:

1. Users can sign up with email/password and are redirected to dashboard with demo data
2. Users can sign in and see their own data (not other users' data)
3. Users can sign out and are redirected to sign-in page
4. All existing dashboard, history, and settings functionality works against Supabase
5. RLS prevents cross-user data access
6. Local development works fully offline via Supabase CLI
7. Factory functions can generate valid test data for all entity types
8. Existing acceptance tests pass with auth integrated
9. New auth acceptance tests cover sign-up, sign-in, sign-out, and route protection
