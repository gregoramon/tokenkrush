# Example: CLAUDE.md Compression

Real-world compression of a typical `~/.claude/CLAUDE.md` (global instructions used by Claude Code across all projects). Source: author's personal CLAUDE.md with tech stack, git workflow, behavioral principles, and an AI-models reference.

## Stats

| Metric | Before | After | Δ |
|---|---|---|---|
| Lines | 187 | 101 | −46% |
| Characters | 8784 | 4838 | −45% |
| Words | 1288 | 710 | −45% |
| Est. tokens saved | — | — | ~986 |

## What was preserved verbatim

- **Four structured principles** (Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution) — named-doctrine rule (preservation.md §4). The structure IS the instruction.
- **All model IDs and prices** — URLs/IDs rule (§6). One wrong character = broken reference.
- **Every `ALWAYS` / `NEVER` / `MUST` emphasis** — emphasis rule (§2). These words carry directive weight.
- **All code blocks and file paths** — code rule (§1).

## Representative section — before/after

The following shows how the "Tech Stack" section compressed. The underlying rules and tools are unchanged; only the padding and verbosity are gone.

### Before (24 lines, ~900 chars)

```markdown
## Tech Stack

**Frontend:**

- Next.js (primary for web apps)
- Vite + React (landing pages, smaller apps)
- Expo / React Native (mobile, recently started)
- Tailwind CSS, shadcn/ui
- Functional components with hooks; TypeScript when the project uses it

**Backend & Data:**

- Supabase (database, auth) - Always use MCP tools for Supabase operations
- Convex (preferred backend for new projects)

**Deployment & Tools:**

- Vercel (deployment)
- GitHub (version control)
- CodeRabbit (code reviews - CLI and GitHub PRs)
- Greptile (code reviews - GitHub PRs)

**Package & System Management:**

- **Bun** - Always use Bun as package manager (`bun install`, `bun add`, `bun run`)
- **Homebrew** - Use `brew install` for installing CLI tools and system packages whenever possible
```

### After (5 lines, ~360 chars)

```markdown
## Stack
frontend: Next.js (web), Vite+React (landing), Expo/RN (mobile), Tailwind, shadcn/ui | functional components + hooks | TS when project uses it
backend: Supabase (ALWAYS via MCP tools), Convex (preferred for new projects)
deploy: Vercel | vcs: GitHub | reviews: CodeRabbit (CLI + GitHub PRs), Greptile (PRs)
pkg: Bun (`bun install/add/run`) | system: Homebrew for CLI tools
```

### What changed vs what stayed

| | Action |
|---|---|
| Sub-headings (`**Frontend:**`, `**Backend & Data:**`, etc.) | Collapsed into inline prefixes (`frontend:`, `backend:`) |
| Bullet lists of facts | Joined with `|` separators |
| Redundant parentheticals ("primary for web apps", "recently started") | Shortened to essential tag (`(web)`, `(mobile)`) |
| `ALWAYS use MCP tools` emphasis | **Preserved verbatim** |
| Code-backticks (`bun install`, `brew install`) | **Preserved verbatim** |

## Representative preservation — the four principles

The "Coding Behavior" section containing the four Karpathy principles was left completely untouched by the compressor. Named doctrine with per-principle explanations IS the instruction; compressing it would weaken the directive.

Before and after are byte-identical for this section:

```markdown
## Coding Behavior

Four principles. These override defaults where they conflict.

**1. Think Before Coding** — Don't assume. Don't hide confusion.
- State assumptions explicitly before implementing.
- If multiple interpretations exist, present them — don't pick silently.
- If something is unclear, stop and ask. Name what's confusing.
- If a simpler approach exists, say so. Push back when warranted.
- Ask before making architectural changes.

... (principles 2, 3, 4 unchanged)
```

## Takeaways

- The overall file reads just as clearly to an agent after compression — no directive was lost.
- The savings come almost entirely from data-dense sections (tables, lists) and verbose prose patterns ("Always use the X for Y").
- The parts that carry behavioral weight (named principles, emphasis words, code) stayed intact.
- Net: ~45% fewer tokens loaded into every Claude Code session, with the same behavior.
