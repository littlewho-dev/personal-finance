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

## Reducing Token Usage

Best practices to minimize API costs when working with Claude Code:

**File Operations**

- Use `limit` parameter when reading large files
- Avoid re-reading files you just wrote
- Use `Glob` and `Grep` to find specific content instead of reading entire files

**Command Output**

- Pipe verbose commands through `| tail -n 20` to limit output
- Check exit codes instead of parsing full output when possible
- Prefer quiet flags when available (e.g., `--quiet`, `-q`)

**Session Management**

- Use `/compact` frequently to reset context
- Keep sessions focused on single features
- Start fresh sessions for unrelated tasks

**Tool Selection**

- Use `haiku` model for simple exploration tasks
- Use dedicated tools (Read, Glob, Grep) instead of bash equivalents
- Batch independent operations in parallel
