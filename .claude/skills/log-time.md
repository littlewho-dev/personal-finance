# Log Time Skill

Records time spent on work sessions with automatic summaries and cost tracking.

## Usage

```
/log-time <duration> <cost>
```

Examples:

- `/log-time 2h $5.00`
- `/log-time 45m $1.25`
- `/log-time 1h30m $3.50`

## Behavior

1. Parse the duration and cost from the command arguments
2. Read the conversation history since the last time log entry
3. Summarize the work done in 3-5 short sentences
4. Append a new entry to `docs/time-log.md`

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
- Cost is the Claude API cost for the session (from `/cost` command)
