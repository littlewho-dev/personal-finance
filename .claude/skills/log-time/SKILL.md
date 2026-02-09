---
name: log-time
description: Record work session time and cost. Use when the user wants to log time spent working.
argument-hint: <duration> <cost>
disable-model-invocation: true
---

Record a work session to `docs/time-log.md`.

## Instructions

1. Parse duration and cost from `$ARGUMENTS` (e.g., "1h $3.50")
2. Read conversation history since last time log entry
3. Summarize work done in 3-5 short sentences
4. Append entry to `docs/time-log.md`

## Entry Format

```markdown
## YYYY-MM-DD

- **Duration:** <duration>
- **Cost:** <cost>
- **Summary:** <3-5 sentence summary of work completed>
```

## Guidelines

- Focus on what was accomplished, not process details
- Use past tense ("Added", "Configured", "Fixed")
- Mention specific files or features touched
- Keep each sentence concise and factual
- Cost is the Claude API cost (from `/cost` command)
