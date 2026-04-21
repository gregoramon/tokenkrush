# Preservation Rules

These things MUST NOT be compressed. If a compression pass would modify any of them, revert that section and leave it intact.

## 1. Code blocks (fenced + inline)

Never touch:
- Fenced blocks: triple-backtick blocks of any language
- Inline backtick code: `like this`
- Commands, file paths, config snippets

Rationale: code is literal. One missing character breaks it.

## 2. Emphasis words

Preserve these when they appear in prose:
- `ALWAYS`, `NEVER`, `MUST`, `MUST NOT`, `CRITICAL`, `IMPORTANT`, `REQUIRED`

Rationale: these words carry directive weight. Dropping them weakens the instruction.

## 3. Numbered procedures

Never flatten:
- Explicit numbered steps (`1.`, `2.`, `3.`)
- Ordered `<ol>` lists in markdown
- Step-by-step workflows where sequence matters

Rationale: compression into inline lists destroys the "do A before B" signal.

## 4. Named principles / doctrine

Preserve structure when a section has:
- Named principles with explanations (e.g., "Think Before Coding — ...")
- Acronyms with expansions (e.g., "SOLID: Single responsibility ...")
- Any framework where the structure IS the teaching

Example: the four-principles Karpathy pattern (Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution). Compressing these into pipe-delimited form weakens them.

## 5. Legal / compliance language

Never touch:
- License text
- Copyright notices
- Attribution clauses
- Compliance statements

Rationale: legal wording has specific meaning and liability implications.

## 6. URLs and IDs

Preserve exactly:
- HTTP/HTTPS URLs
- Email addresses
- Version strings (e.g., `v1.2.3`)
- Model IDs (e.g., `claude-opus-4-7`, `gpt-5.4-mini`)

Rationale: one wrong character = broken reference.

## Protection Trip-wires

If a compression pass produces a result that:
- Drops >70% of word count on any single block
- Removes any word from the emphasis list (§2)
- Loses numbered-list structure from §3
- Modifies any code block from §1

…then revert that block and warn the user. Better a less-compressed file than a broken one.
