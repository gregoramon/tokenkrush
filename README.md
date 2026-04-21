# tokenkrush

Crushes tokens in `CLAUDE.md` / `AGENTS.md` / `SOUL.md` and other AI agent instruction files. Keeps every directive intact.

Spelled with a K because I'm Austrian and we like our Ks.

## Why

Vercel's [*"AGENTS.md outperforms Skills in our agent evals"*](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) (Jan 27, 2026) showed that a compressed AGENTS.md (pipe-delimited, telegraphic prose, 40 KB → 8 KB) outperformed more sophisticated skill-retrieval systems — 100% pass rate vs 79%. The insight: agents parse dense markdown fine. Token budget spent on padding is wasted.

If you want the full argument for **fighting context bloat** in agent instruction files, read the post. tokenkrush encodes that post's conclusions as a reusable skill.

### Measured token savings

Tested on a real 187-line global CLAUDE.md (8784 chars) compressed into the current tokenkrush v1 style, with token counts measured via each provider's live API:

| Model                          | v0 verbose | v1 tokenkrush  | Δ tokens |
|--------------------------------|-----------:|---------------:|---------:|
| anthropic/claude-sonnet-4.6    |      2563  |      **1560**  | **−39.1%** |
| anthropic/claude-opus-4.7      |      3459  |      **2108**  | **−39.1%** |
| openai/gpt-5.4                 |      2250  |      **1367**  | **−39.2%** |
| google/gemini-3-flash-preview  |      2381  |      **1471**  | **−38.2%** |

**~39% token reduction, consistent across every tested tokenizer**, with zero directive loss. The four Karpathy principles, all `ALWAYS` / `NEVER` emphasis, all model IDs, and all code blocks were preserved byte-for-byte.

### Why not go more aggressive?

While we took inspiration from the Vercel blog's ultra-dense format (single-line blobs, dash-joined words, curly-brace hierarchies), our own benchmarks against current 2026 tokenizers didn't support pushing that far. A Vercel-style "v2" compression of the same file actually **lost tokens vs. v1** on every model tested:

| Model                          | v1 tokenkrush | v2 Vercel-aggressive |
|--------------------------------|--------------:|---------------------:|
| anthropic/claude-sonnet-4.6    |    −39.1%     |  −27.5%  (11.6 pp worse)  |
| anthropic/claude-opus-4.7      |    −39.1%     |  −28.7%  (10.4 pp worse)  |
| openai/gpt-5.4                 |    −39.2%     |  −30.4%  ( 8.8 pp worse)  |
| google/gemini-3-flash-preview  |    −38.2%     |  −23.7%  (14.5 pp worse)  |

**Why:** dash-joining shatters common-word tokens (e.g., `"Bun workspaces"` is 2 tokens; `"Bun-workspaces"` can be 3-4). Curly-brace hierarchies introduce unfamiliar structural tokens. The v2 version even had slightly *more* characters than v1 (4832 vs 4778), proving that character count is a misleading proxy for tokens. The Vercel post's insight about density is correct; the extreme form isn't optimal against today's tokenizers.

### A note on why this is LLM-driven, not a script

We benchmarked a regex-based deterministic compressor against the same fixtures and it capped at **7–9% token savings** — roughly 5× less than the LLM-driven approach. The gap is structural: regex can strip bold markers, collapse table padding, and merge `**Label:**`-style bullet lists, but it can't abbreviate named entities (`React Native` → `RN`), remove verbose qualifiers (`(primary for web apps)` → `(web)`), or distinguish fact lists from prose lists. Compression at 39% is a judgment task. See closed issue [#2](https://github.com/gregoramon/tokenkrush/issues/2) for the full benchmark.

See [`examples/before-after-claude-md.md`](examples/before-after-claude-md.md) for the full compression diff on a real-world global CLAUDE.md with all four Karpathy principles preserved verbatim.

## What it compresses

| Ecosystem | Files |
|---|---|
| Claude Code | `CLAUDE.md`, `.claude.md`, `.claude.local.md` |
| Cross-tool | `AGENTS.md` |
| Google | `GEMINI.md` |
| Cursor | `.cursor/rules`, `CURSOR.md` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `copilot-instructions.md` |
| OpenClaw | `SOUL.md`, `IDENTITY`, `TOOLS.md`, `AGENTS.md`, `BOOTSTRAP.md`, `BOOT.md`, `HEARTBEAT.md`, `USER` |
| Memory files | `MEMORY.md`, `memory/*.md`, `*.memory.md` |

## Install

Three paths. Pick whichever matches your tool.

### 1. Claude Code plugin marketplace

```
/plugin marketplace add gregoramon/tokenkrush
/plugin install tokenkrush
```

### 2. npx (works for any tool ecosystem)

```
npx @gregoramon/tokenkrush init
```

Detects installed AI tool directories (`~/.claude/`, `~/.openclaw/workspace/`, `~/.cursor/`, `~/.gemini/`) and installs the skill into each.

Flags:
- `--target <path>` — install under `<path>/skills/tokenkrush/` (bypasses ecosystem detection)
- `--all` — install to all detected ecosystems without prompting (currently the default)
- `--link` — reserved for symlink mode; not yet implemented
- `--help, -h` — show usage

### 3. Git clone (for customization)

```
git clone https://github.com/gregoramon/tokenkrush.git ~/some/path
ln -s ~/some/path/tokenkrush/skills/tokenkrush ~/.claude/skills/tokenkrush
```

## Use

After install, ask your AI tool to compress an agent instruction file:

> "Compress my CLAUDE.md"

The skill will:
1. **Discover** candidate files in your current directory (and optionally in global tool home dirs)
2. **Report** them grouped by scope (GLOBAL vs LOCAL)
3. **Ask** what you want to compress
4. **Sample** — show you a before/after excerpt for sanity-check
5. **Approve** — ask y/n per file
6. **Apply** — write the compressed version and report stats

## What's preserved

tokenkrush never touches:

- **Code blocks** — fenced + inline backtick
- **Emphasis** — `ALWAYS` / `NEVER` / `MUST` / `CRITICAL` / `IMPORTANT` / `REQUIRED`
- **Numbered procedures** — `1.`, `2.`, `3.` sequences where order matters
- **Named principles** — structured doctrine (e.g., four-principles frameworks) where the structure IS the teaching
- **Legal / license / compliance text**
- **URLs, email addresses, version strings, model IDs**

**Protection trip-wires** abort a compression pass that:
- Drops >70% of any prose block (likely over-compressed)
- Strips any emphasis word
- Loses numbered-list structure
- Modifies any code block

Better a less-compressed file than a broken one.

## Composition with other skills

tokenkrush does compression only. For content audits (stale model pricing, outdated URLs, duplicated-by-default-system-prompt rules), compose with [`claude-md-management:claude-md-improver`](https://github.com/anthropics/claude-plugins-official):

1. Run `claude-md-improver` first → fixes stale facts, removes redundancy
2. Run `tokenkrush` second → compresses what remains

## Scope — global vs local

tokenkrush is CWD-first:

- `cd ~` and invoke → compresses global files like `~/.claude/CLAUDE.md`
- `cd ~/projects/foo` and invoke → compresses that project's local files

**Weekly-sweep workflow:** `cd` into each project and ask the skill to compress. When you're in `~`, it sees global files; when you're in a project, it sees only that project's files. Natural isolation, no flags needed.

**Power users** can add `~/.claude/` (and similar tool home dirs) to `additionalDirectories` in Claude Code's `settings.json` to see global files from any CWD.

## Performance note (v0.1)

v0.1 is entirely LLM-driven: Claude reasons about each section of each file and applies compression rules in its reasoning loop. This is slow — especially with extended thinking enabled or flagship models. A 3-file compression can take several minutes.

Tips to speed it up:
- Use Sonnet (or Haiku) instead of Opus: `/model claude-sonnet-4-6`
- Disable extended thinking for this task (use `/think` to toggle, or adjust settings)

We explored a deterministic regex-based compressor as a fast alternative and measured it at only 7–9% token savings (vs 39% for LLM-driven). Compression at this level is fundamentally a judgment task, not a regex task. See closed issue [#2](https://github.com/gregoramon/tokenkrush/issues/2) for the full benchmark and reasoning.

## Development

```
git clone https://github.com/gregoramon/tokenkrush.git
cd tokenkrush
bun test          # runs the installer test suite (17 tests)
```

## License

MIT. See [LICENSE](LICENSE).

## Status

v0.1 — initial release. Feedback welcome via [GitHub issues](https://github.com/gregoramon/tokenkrush/issues).
