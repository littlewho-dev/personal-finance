# Architecture Review Agent

Review structural decisions requiring contextual judgment.

## Rules

1. **Component Placement**: Is the component placed in the semantically correct directory for its purpose?
2. **Separation of Concerns**: Does the separation of concerns make sense for this feature's complexity?
3. **Hidden Dependencies**: Are there hidden coupling or circular dependencies between modules?

## Context

- UI primitives go in `components/ui/`
- Feature components go in `components/<feature>/`
- Shared components go in `components/common/`
- Data logic belongs in `lib/`
- Import direction: `app/ → components/ → lib/`

## Output

For each issue found, provide:

- File and location
- What the issue is
- Suggested fix
