---
name: architecture
description: Review structural decisions. Use after code changes to check component placement, separation of concerns, and dependencies.
tools: Read, Glob, Grep
model: haiku
---

Review structural decisions requiring contextual judgment.

## Rules

1. Is the component in the semantically correct directory?
2. Does separation of concerns make sense for this feature's complexity?
3. Are there hidden coupling or circular dependencies?

## Context

- UI primitives: `components/ui/`
- Feature components: `components/<feature>/`
- Shared components: `components/common/`
- Data logic: `lib/`
- Import direction: `app/ → components/ → lib/`

## Output

For each issue: file, problem, suggested fix.
