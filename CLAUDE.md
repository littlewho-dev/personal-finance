# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal finance dashboard MVP - a read-only Next.js application displaying net worth, accounts, and financial history from mocked JSON data. See `docs/PRD.md` for full requirements.

## Development Workflow (ATDD - Required)

**All features must follow this workflow strictly:**

### Phase 1: Planning

1. Understand the feature requirements
2. Verify alignment with `docs/PRD.md` scope
3. Identify the single most important user journey

### Phase 2: Acceptance Test

4. Write **one** high-level Gherkin scenario in `features/` capturing the core user journey
5. Keep it focused - one scenario per feature, additional scenarios only for critical edge cases

### Phase 3: Implementation

6. Implement step definitions in `features/steps/`
7. Write implementation code in small increments
8. Run acceptance test frequently - stop when it passes

### Phase 4: Quality Checks

9. Run auto-fix first: `pnpm format` (Prettier) and `pnpm lint --fix` (ESLint)
10. Run static checks: `pnpm check-all`
11. Fix any remaining issues manually
12. Run agent reviews (apply rules from `.claude/agents/`)
13. Fix issues from agent feedback

### Phase 5: Iterate (Max 3 Passes)

14. Repeat quality checks → fix cycle
15. **Maximum 3 iterations** to avoid infinite loops
16. If issues persist after 3 passes → **stop and ask human for guidance**

```
┌─────────────┐
│  Planning   │
└──────┬──────┘
       ▼
┌─────────────┐
│  Write AT   │  (one acceptance test)
└──────┬──────┘
       ▼
┌─────────────┐
│ Implement   │◄──┐
└──────┬──────┘   │ (small increments until AT passes)
       ▼          │
   AT passes? ────┘ No
       │ Yes
       ▼
┌─────────────┐
│  Auto-fix   │  (pnpm format, pnpm lint --fix)
└──────┬──────┘
       ▼
┌─────────────┐
│Static Checks│◄──┐
└──────┬──────┘   │
       ▼          │
┌─────────────┐   │
│Agent Reviews│   │ (max 3 iterations)
└──────┬──────┘   │
       ▼          │
   All pass? ─────┘ No (& iteration < 3)
       │ Yes
       ▼
┌─────────────┐    No (& iteration ≥ 3)
│    Done     │    ──────► Ask Human
└─────────────┘
```

**No implementation code should be written without a corresponding feature file.**

## Environment Setup

Before working on this project, always run:

```bash
nvm use
```

This loads the correct Node.js version (24) from `.nvmrc`.

## Commands

**Package manager: pnpm** (do not use npm or yarn)

```bash
# Development
pnpm dev                 # Start dev server (localhost:3000)
pnpm build               # Production build
pnpm start               # Start production server

# Testing
pnpm test:e2e            # Run all Playwright acceptance tests
pnpm test:e2e --grep "feature name"  # Run specific feature

# Static Analysis
pnpm lint                # ESLint
pnpm format              # Prettier format
pnpm format:check        # Prettier check (CI)
pnpm type-check          # TypeScript (tsc --noEmit)
pnpm spell-check         # cspell
pnpm find-unused         # knip (dead code detection)

# Run all checks (same as CI)
pnpm check-all           # lint + format:check + type-check + spell-check + find-unused
```

## Architecture

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── dashboard/       # Dashboard-specific components
│   ├── history/         # History page components
│   └── common/          # Shared components (CurrencyDisplay)
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── data.ts          # Mock data loading functions
│   └── i18n/messages.ts # Externalized UI strings
└── data/                # Mock JSON files (accounts, snapshots, settings)

features/                # Gherkin .feature files
├── steps/               # Step definitions
└── support/             # Playwright-bdd setup

.claude/
├── agents/              # Sub-agents (architecture, tests, docs, naming)
└── skills/              # Custom skills (log-time)

docs/
├── PRD.md               # Product requirements
└── time-log.md          # Time tracking entries
```

## Key Patterns

- **i18n-ready**: All UI strings in `lib/i18n/messages.ts`, never hardcoded
- **Theming**: Colors via CSS variables in `globals.css`
- **Data flow**: Components read from `lib/data.ts` which loads mock JSON
- **Currency formatting**: Use `CurrencyDisplay` component with locale from settings

## CI/CD

**GitHub Actions Pipeline (PRs):**

Stage 1 - Static Analysis (parallel):

- `lint` - ESLint
- `format:check` - Prettier
- `type-check` - TypeScript
- `spell-check` - cspell
- `find-unused` - knip

Stage 2 - Tests:

- `test:e2e` - Playwright acceptance tests

**Pre-commit Hooks (Husky):**

- lint-staged (ESLint + Prettier on staged files)
- type-check (TypeScript)
- spell-check (cspell)
- find-unused (knip)
- commitlint validates commit message format

**Never use `--no-verify`** - always fix failing checks instead of bypassing them.

**Agent Reviews:**

Claude Code sub-agents in `.claude/agents/` run during the quality check phase:

- `architecture` - Structure and dependencies
- `tests` - ATDD compliance
- `docs` - Documentation and i18n
- `naming` - Domain terminology

**CD**: Auto-deploy to Vercel staging on merge to main

**Branch strategy**: Trunk-based (main + short-lived feature branches)

## Commit Message Convention

Enforced via commitlint. Format:

```
<type>(<scope>): <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

Examples:

- `feat(dashboard): add net worth card component`
- `fix(history): correct date formatting in snapshot list`
- `test(dashboard): add category table acceptance tests`
- `ci: add spell-check to pipeline`

## Time Tracking

Use the `/log-time` skill to record work sessions.

**Usage:** `/log-time 1h $3.50`

**Time log format:**

```markdown
## 2024-01-15

- **Duration:** 2h
- **Cost:** $3.50
- **Summary:** Set up Next.js project with Tailwind and shadcn/ui. Configured ESLint, Prettier, and Husky pre-commit hooks. Created initial project structure following PRD architecture.
```

## Tech Stack

- **Node.js**: 24 (via nvm, see `.nvmrc`)
- **Package manager**: pnpm
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Playwright + playwright-bdd for acceptance tests
- ESLint + Prettier for code quality
- Husky + lint-staged + commitlint for git hooks
- knip for dead code detection
- cspell for spell checking
