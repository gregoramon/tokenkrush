---
name: tokenkrush
description: Compresses agent instruction markdown files (CLAUDE.md, AGENTS.md, SOUL.md, GEMINI.md, memory files) using Vercel-style pipe-delimited dense format and telegraphic prose. Reduces token count 40-60% while preserving directive clarity. TRIGGER when user asks to compress, shrink, reduce tokens, optimize, or slim down any agent instruction file. Works globally (~/.claude/CLAUDE.md) or per-project (./CLAUDE.md).
---

# tokenkrush

Compresses agent instruction markdown files. Reduces tokens while preserving every directive.

## When to use

The user asks to compress, shrink, reduce tokens, optimize, or slim down any agent instruction file. Target files include CLAUDE.md, AGENTS.md, SOUL.md, GEMINI.md, Cursor rules, memory files, and any similar markdown used as persistent AI agent context.

## Workflow — Five Phases

### Phase 1 — Discover

Glob both the current working directory and known global paths (tool home dirs) for candidate files. See `references/file-detection.md` for the exhaustive pattern list and scope rules.

- Dedupe by absolute realpath.
- Skip files under `node_modules/`, `.git/`, `dist/`, `build/`, gitignored paths, or under 500 bytes.
- If reading a global path fails with a permission error, omit it silently and note it in the Phase 2 report.

If the user supplied an explicit path (e.g., "compress /path/to/file.md"), skip discovery and operate on that file only.

### Phase 2 — Report

Show the user a table grouped by scope (GLOBAL / LOCAL) with estimated token savings. Example:

```
Found 3 files:

GLOBAL (~/.claude/, ~/.opencode/):
  [1] ~/.claude/CLAUDE.md          4.8KB  101 lines

LOCAL (./):
  [2] ./CLAUDE.md                  2.1KB   84 lines
  [3] ./AGENTS.md                  1.4KB   52 lines

Compress: [a]ll, [g]lobal, [l]ocal, or numbers (e.g., "1,3")?
```

If global files were skipped due to permissions, append:

```
Note: I can also see ~/.claude/CLAUDE.md exists but don't have permission
to read it from this directory. To include global files, either:
  - cd ~ and re-run, or
  - add ~/.claude to additionalDirectories in settings.json
```

Token-savings estimate: use chars ÷ 4 as a rough heuristic.

### Phase 3 — Plan

For each file the user selected:

1. Read the file.
2. Classify sections (see `references/compression-rules.md` §Classification).
3. Apply the per-type compression rules (§A, §B, §C, §D in compression-rules.md).
4. Run protection trip-wires (see `references/preservation.md` §Protection Trip-wires). Revert any section that trips a wire.
5. Show the user a before/after sample of ONE section so they can sanity-check the output style.

### Phase 4 — Approve

Ask the user per file: "Apply compression to `<path>`? [y/n/all]"

If they say "all", apply to every selected file without further prompts.
If they say "n", skip that file (no write).
If they say "y", write that file only.

### Phase 5 — Apply

For each approved file:
1. Use the `Edit` tool (or `Write` for complete rewrites) to overwrite the file with the compressed content.
2. After all writes, print final stats: lines, chars, estimated tokens saved per file, and total.

Example final output:

```
Compressed 2 files:
  ~/.claude/CLAUDE.md   8784 → 4838 chars  (-45%, ~986 tokens saved)
  ./AGENTS.md           1423 →  812 chars  (-43%, ~152 tokens saved)
Total: ~1138 tokens saved across 2 files.
```

## References (load on demand)

- `references/compression-rules.md` — section classification + per-type compression logic + examples
- `references/file-detection.md` — filename patterns, scope classification, discovery flow
- `references/preservation.md` — what NEVER to compress and protection trip-wires

## Example

See `examples/before-after-claude-md.md` for a complete real-world example: 187 lines → 101 lines (46% reduction), no directive lost.
