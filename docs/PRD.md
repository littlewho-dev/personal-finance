# Personal Finance Dashboard - Product Requirements Document

## Overview

A personal finance application providing a centralized dashboard to track net worth, accounts, and financial history through periodic balance snapshots.

## Goals

- **Primary**: Display accurate net worth with clear category breakdown
- **Secondary**: View financial history over time via snapshots
- **Tertiary**: Provide foundation for future features (data entry, imports, multi-currency, etc.)

---

## MVP Scope

### Core Features

#### 1. Net Worth Dashboard

- Display total net worth in configurable currency
- Show breakdown by category (Cash, Assets, Debts)
- Calculate: `Net Worth = Cash + Assets - Debts`

#### 2. Category Tables

Each category displays a table with:

- Account/item name
- Current balance
- Institution (optional)

**Categories & Items:**

| Category   | Items                                                                                 |
| ---------- | ------------------------------------------------------------------------------------- |
| **Cash**   | Checking accounts, Savings accounts, Deposits, Cash on hand                           |
| **Assets** | Investments (stocks/ETFs), Retirement accounts (401k/IRA), Property, Vehicles, Crypto |
| **Debts**  | Credit cards, Mortgages, Student loans, Auto loans, Personal loans                    |

#### 3. Balance Snapshots (Read-only)

- Display historical snapshots with monthly granularity
- Only show accounts with non-zero balances
- View net worth at different points in time
- Data provided via mocked JSON

#### 4. Settings Display

- Show configured currency
- Data provided via mocked JSON

---

## Technical Requirements

### Stack

- **Framework**: Next.js (latest stable, App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Data**: Mocked JSON files (read-only, no mutations)
- **Language**: TypeScript

### Architecture Principles

- **Internationalization (i18n)**: All user-facing strings externalized, ready for translation
- **Theming**: CSS variables for colors, customizable theme foundation
- **Component-driven**: Reusable UI components
- **Type-safe**: Full TypeScript coverage

### Data Model (JSON Structure)

```typescript
// Account
interface Account {
  id: string;
  name: string;
  type: 'cash' | 'asset' | 'debt';
  subtype: string; // e.g., 'checking', 'investment', 'credit_card'
  institution?: string;
}

// Snapshot
interface Snapshot {
  id: string;
  date: string; // ISO date
  balances: {
    accountId: string;
    amount: number; // positive for cash/assets, positive for debts (amount owed)
  }[];
}

// Settings
interface Settings {
  currency: {
    code: string; // e.g., 'USD', 'EUR'
    symbol: string; // e.g., '$', '€'
    locale: string; // e.g., 'en-US'
  };
}
```

---

## User Interface

### Pages

1. **Dashboard** (`/`)
   - Net worth summary card
   - Category breakdown (3 tables: Cash, Assets, Debts)
   - Shows latest snapshot data

2. **History** (`/history`)
   - List of snapshots by date
   - Select snapshot to view net worth at that point

3. **Settings** (`/settings`)
   - Display current currency configuration

### Components

- `NetWorthCard` - displays total with breakdown percentages
- `CategoryTable` - reusable table for each category
- `SnapshotList` - list of historical snapshots
- `CurrencyDisplay` - formatted currency with i18n support

---

## Out of Scope (Future Features)

The following features are intentionally excluded from MVP but should be considered in architecture:

### Data Mutations

- [ ] Add/edit/delete accounts
- [ ] Add/edit/delete snapshots
- [ ] Settings modification
- [ ] Backend/API layer
- [ ] Database persistence

### Authentication & Multi-user

- [ ] User registration/login
- [ ] Multi-user support
- [ ] Data isolation per user

### Currency

- [ ] Multi-currency accounts
- [ ] Automatic currency conversion
- [ ] Exchange rate updates

### Data Import/Export

- [ ] CSV import
- [ ] PDF parsing
- [ ] Bank integrations (Plaid, etc.)
- [ ] Data export

### Visualization

- [ ] Net worth trend charts
- [ ] Category pie charts
- [ ] Income vs expense graphs

### Advanced Features

- [ ] Budgeting
- [ ] Goals tracking
- [ ] Recurring transactions
- [ ] Notifications/alerts
- [ ] Dark mode toggle
- [ ] Mobile app

---

## Success Criteria

MVP is complete when:

1. User can view net worth with category breakdown on dashboard
2. User can view all accounts grouped by type in tables
3. User can view list of historical snapshots
4. User can select a snapshot to view net worth at that date
5. Currency formatting respects configured locale
6. All text is i18n-ready (externalized strings)
7. UI uses consistent theming via CSS variables

---

## File Structure (Proposed)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard
│   ├── history/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/
│   ├── ui/                   # shadcn components
│   ├── dashboard/
│   │   ├── net-worth-card.tsx
│   │   └── category-table.tsx
│   ├── history/
│   │   └── snapshot-list.tsx
│   └── common/
│       └── currency-display.tsx
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   ├── data.ts               # functions to read mock data
│   └── i18n/
│       └── messages.ts       # externalized strings
├── data/
│   ├── accounts.json
│   ├── snapshots.json
│   └── settings.json
└── styles/
    └── globals.css           # CSS variables for theming
```

---

## Design & Theming

### Visual Direction

Professional, clean, and trustworthy aesthetic suitable for financial data.

### Color Palette (CSS Variables)

```css
/* Primary - Deep blue (trust, professionalism) */
--primary: 220 60% 40%;
--primary-foreground: 0 0% 100%;

/* Neutral grays for backgrounds and text */
--background: 0 0% 100%;
--foreground: 220 20% 10%;
--muted: 220 15% 96%;
--muted-foreground: 220 10% 40%;

/* Semantic colors */
--success: 150 60% 40%; /* Green for positive values */
--destructive: 0 70% 50%; /* Red for debts/negative */

/* Card and borders */
--card: 0 0% 100%;
--border: 220 15% 90%;
```

### Typography

- Clean sans-serif (Inter or system fonts)
- Clear hierarchy with consistent sizing
- Monospace for currency amounts

### Layout Principles

- Generous whitespace
- Card-based sections
- Clear visual separation between categories
- Responsive grid layout
