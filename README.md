# Personal Finance Dashboard

A read-only personal finance dashboard displaying net worth, accounts, and financial history from mocked data.

## Goal

Track net worth with a clear breakdown by category (Cash, Assets, Debts) and view historical snapshots over time.

## Getting Started

```bash
nvm use          # Node 24
pnpm install
pnpm dev         # http://localhost:3000
```

## Agent-First Development

This project is designed to be built entirely by AI agents using [Claude Code](https://claude.ai/code).

- **ATDD workflow** - Feature files first, then implementation
- **Sub-agents** - Architecture, tests, docs, and naming reviews
- **Quality gates** - Static analysis + agent feedback loops

See `CLAUDE.md` for the full development workflow.
