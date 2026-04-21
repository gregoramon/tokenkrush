# Compression Rules

Classify each section of the input file, then apply the corresponding rule. Always check `preservation.md` first — its rules override everything here.

## Section Classification

| Type | Signal | Treatment |
|---|---|---|
| Data-dense | Markdown tables, bullet lists of facts, key:value blocks | Aggressive pipe-delimit |
| Prose / rules | Paragraphs, one-liner directives | Moderate telegraphic |
| Structured procedure | Numbered steps, named principles | **Preserve intact** (see preservation.md §3, §4) |
| Code / example | Fenced code blocks, inline backtick | **Never touch** (see preservation.md §1) |

Heuristic for distinguishing "bullet list of facts" from "prose bullet list":
- **Facts:** each bullet is 1-8 words, mostly noun phrases, no conjunctions ("and", "but", "because"), parallel structure
- **Prose:** each bullet is a full sentence or more, uses conjunctions, non-parallel structure

When in doubt, treat as prose (more conservative).

## Rule A — Data-dense → Pipe-delimit

**Markdown tables:** strip column-alignment padding, keep structure.

Before:
```
| Model             | Model ID                    | Input/1M | Output/1M |
| ----------------- | --------------------------- | -------- | --------- |
| Claude Opus 4.7   | `claude-opus-4-7`           | $5       | $25       |
```

After:
```
| Model | Model ID | Input/1M | Output/1M |
|---|---|---|---|
| Claude Opus 4.7 | `claude-opus-4-7` | $5 | $25 |
```

**Bullet lists of facts:** collapse to inline pipe-separated.

Before:
```
- Next.js (primary for web apps)
- Vite + React (landing pages, smaller apps)
- Expo / React Native (mobile)
- Tailwind CSS, shadcn/ui
```

After:
```
frontend: Next.js (web), Vite+React (landing), Expo/RN (mobile), Tailwind, shadcn/ui
```

**Key:value blocks:** one line per key-value, ` | ` separator within a line.

## Rule B — Prose → Telegraphic

Apply these substitutions in order. Stop if the result becomes ambiguous.

1. **Drop articles** (`the`, `a`, `an`) when meaning survives.
   Before: "Always use the feature branches for new features"
   After: "Always use feature branches for new features"

2. **Drop auxiliaries** (`should`, `will`, `may`, `can`) when directive is clear.
   Before: "You should use Bun for package management"
   After: "Use Bun for package management"

3. **Drop hedging** (`generally`, `typically`, `please`, `it is recommended`, `make sure to`).
   Before: "Please make sure to always run tests before committing"
   After: "Run tests before committing"

4. **Replace sequence words with arrows.**
   Before: "First run install, then run build, then test"
   After: "install → build → test"

5. **Replace alternatives with pipes.**
   Before: "Use either Biome or ESLint for linting"
   After: "lint: Biome | ESLint"

6. **Compact common phrases.**
   - "for example" → "e.g."
   - "such as" → "like" or ":" (depending on context)
   - "in order to" → "to"
   - "as well as" → "+" or ","

Stop-rule: if a sentence becomes ambiguous or ungrammatical in a way that loses meaning, revert it. The goal is "shorter but still unambiguous," not "shortest possible."

## Rule C — Structured Procedure → Preserve

See `preservation.md` §3 and §4. These sections are NOT compressed.

## Rule D — Code → Never Touch

See `preservation.md` §1.

## Headers

- Keep section headings (`##`).
- Shorten long titles conservatively: `## AI Models Reference (April 2026)` → `## Models (April 2026)`.
- Collapse `###` sub-headings into inline-prefixed lines when the section body is short (≤3 lines):

Before:
```
### Anthropic Claude
claude-opus-4-7 | $5/$25 | 1M | flagship
```

After:
```
Claude: claude-opus-4-7 | $5/$25 | 1M | flagship
```

Don't collapse `###` when the section has multiple entries or nested structure.

## Combining Rules

Typical compression pass order:
1. Find and mark all Preserve sections (see preservation.md). Skip them.
2. For each remaining section, classify via the table above.
3. Apply the per-type rule.
4. Run protection trip-wires (preservation.md). If any trip, revert that section.
5. Recompute stats (lines, chars, word count).

## Worked Example

See `examples/before-after-claude-md.md` for a complete real-world example: 187 lines → 101 lines (46% reduction), four Karpathy principles preserved verbatim, all model IDs and prices retained.
