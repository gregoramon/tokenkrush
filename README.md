# tokenkrush

Crushes tokens in `CLAUDE.md` / `AGENTS.md` / `SOUL.md` and other AI agent instruction files. Keeps every directive intact.

Spelled with a K because I'm Austrian and we like our Ks.

## Why

Vercel's [*"AGENTS.md outperforms Skills in our agent evals"*](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) (Jan 27, 2026) showed that a compressed AGENTS.md (pipe-delimited, telegraphic prose, 40 KB → 8 KB) outperformed more sophisticated skill-retrieval systems — 100% pass rate vs 79%. The insight: agents parse dense markdown fine. Token budget spent on padding is wasted.

If you want the full argument for **fighting context bloat** in agent instruction files, read the post. tokenkrush encodes that post's conclusions as a reusable skill. Typical result: **40–60% token reduction, zero directive loss.**

See [`examples/before-after-claude-md.md`](examples/before-after-claude-md.md) for a real 45% reduction on a global CLAUDE.md with all four Karpathy principles preserved verbatim.

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
