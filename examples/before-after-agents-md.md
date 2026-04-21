# Example: AGENTS.md Compression

A representative synthetic `AGENTS.md` (the cross-tool standard used by OpenCode, Cursor, Codex, and others) compressed by tokenkrush.

## Stats

| Metric | Before | After | Δ |
|---|---|---|---|
| Lines | 80 | 32 | −60% |
| Characters | 2103 | 892 | −58% |
| Est. tokens saved | — | — | ~303 |

## Before (~2.1 KB, 80 lines)

```markdown
# Project Agent Instructions

## About This Project

This is a Next.js web application deployed on Vercel. The backend uses Supabase for database and authentication. The frontend is styled with Tailwind CSS and uses shadcn/ui components.

## Development Commands

To install dependencies, you should run:

```
bun install
```

To start the development server, you can run:

```
bun dev
```

To build the production bundle, please use:

```
bun build
```

To run the test suite, run:

```
bun test
```

## Code Style

- Use functional React components with hooks.
- Always use TypeScript for new files.
- Follow the existing file structure — see `src/components/` for component examples.
- Prefer named exports over default exports.

## Testing

- Tests are located in `tests/` or co-located with source files using the `.test.ts` suffix.
- Please make sure to run `bun test` before committing changes.
- All new features must include at least one test.

## Database Migrations

- Migrations are managed through Supabase CLI.
- NEVER run migrations directly against the production database.
- Always test migrations locally first using `supabase db reset`.

## Git Workflow

- Create a new branch for each feature using the pattern `feature/<description>`.
- Use the pattern `fix/<description>` for bug fixes.
- Commit messages should follow conventional commit format (feat:, fix:, chore:, docs:).
- Please open a pull request when the feature is ready for review.

## What NOT to Do

- Do not commit secrets or .env files to the repository.
- Do not modify the auto-generated files in `src/types/supabase.ts`.
- Do not bypass the linter with `// eslint-disable-next-line` unless absolutely necessary.
```

## After (~0.9 KB, 32 lines)

```markdown
# Project Agent Instructions

## Project
Next.js web app on Vercel | backend: Supabase (DB + auth) | style: Tailwind + shadcn/ui

## Commands
install: `bun install` | dev: `bun dev` | build: `bun build` | test: `bun test`

## Code Style
- Functional React components with hooks
- TypeScript for new files
- Follow existing structure — see `src/components/` for examples
- Named exports over default

## Testing
- Tests in `tests/` or co-located as `*.test.ts`
- Run `bun test` before committing
- New features require at least one test

## Database Migrations
- Managed via Supabase CLI
- NEVER run migrations against production directly
- Test locally first: `supabase db reset`

## Git
branches: `feature/<desc>` for features, `fix/<desc>` for fixes
commits: conventional (feat:/fix:/chore:/docs:)
PRs: open when ready for review

## What NOT to Do
- Never commit secrets or `.env` files
- Never modify `src/types/supabase.ts` (auto-generated)
- Don't bypass linter with `// eslint-disable-next-line` unless necessary
```

## What was preserved

| Item | Rule |
|---|---|
| `NEVER run migrations against production` | Emphasis (§2) |
| All four code blocks (`bun install`, etc.) | Code (§1) |
| File paths (`src/components/`, `src/types/supabase.ts`, `tests/`) | Code (§1) |
| Suffix pattern `.test.ts` | Code (§1) |

## What was compressed

- Multi-paragraph prose (each section's 2-4 sentence intro) → single descriptive line
- Sequential commands → inline pipe-separated (`install: X | dev: Y | ...`)
- Numbered bullet lists of facts → tight bullets (kept as bullets where the sequence mattered semantically, collapsed to inline where it didn't)
- Hedging phrases (`you should run`, `please make sure to`, `you can run`) → dropped
- Redundant labels (e.g., "Code Style" section no longer needs "Use..." prefix on every bullet)

Net: 58% fewer characters, every directive intact, every code example preserved verbatim.
