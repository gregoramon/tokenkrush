# File Detection & Scope

## Filename Patterns

Group by ecosystem. Match any file with these exact names or glob patterns.

**Claude Code:**
- `CLAUDE.md`
- `.claude.md`
- `.claude.local.md`

**Cross-tool standard:**
- `AGENTS.md`

**Google:**
- `GEMINI.md`

**Cursor:**
- `.cursor/rules`
- `.cursor/rules/*.md`
- `CURSOR.md`

**Windsurf:**
- `.windsurfrules`
- `.windsurf/rules.md`

**GitHub Copilot:**
- `copilot-instructions.md`
- `.github/copilot-instructions.md`

**OpenClaw:**
- `SOUL.md`, `IDENTITY`, `TOOLS.md`, `AGENTS.md` (reused), `BOOTSTRAP.md`, `BOOT.md`, `HEARTBEAT.md`, `USER`

**Memory files (any ecosystem):**
- `MEMORY.md`
- `memory/*.md`
- `*.memory.md`

## Scope Classification

Every discovered file is tagged GLOBAL, LOCAL, or USER:

- **GLOBAL** — absolute path starts with a tool home dir: `~/.claude/`, `~/.openclaw/`, `~/.cursor/`, `~/.gemini/`, `~/.windsurf/`
- **LOCAL** — path under CWD, not under a tool home dir
- **USER** — explicitly passed by the user (e.g., `tokenkrush /path/to/file.md`); bypasses discovery

## Discovery Flow

1. **Glob LOCAL patterns** under CWD. Top-level + known subdirs only: `.cursor/`, `.github/`, `memory/`, `.windsurf/`. Do NOT recurse arbitrarily deep — avoids `node_modules/` etc.
2. **Glob GLOBAL patterns** under the tool home dirs listed above.
3. **Dedupe by absolute realpath.** Resolves symlinks and prevents the "CWD is `~`" double-count (where `~/.claude/CLAUDE.md` shows up as both GLOBAL and LOCAL).
4. **Skip:**
   - Files under `node_modules/`, `.git/`, `dist/`, `build/`
   - Files matched by `.gitignore` in CWD
   - Files smaller than 500 bytes (not worth compressing)
5. **Permission errors:** if reading a path fails with permission denied, remember the path for the report's "Note" line (see Permission Handling below).

## Permission Handling

Some Claude Code sessions run in permission-restricted mode — the agent can only read files under CWD. In that case, attempting to read `~/.claude/CLAUDE.md` from `~/projects/foo` will fail.

**Behavior:**
- Always attempt both local and global globs.
- If a global path errors out, silently omit it from the found-files list.
- At the end, if any global paths were omitted, show the user a single "Note" explaining why and how to enable them.

Example output when permission-restricted:

```text
Found 2 files (LOCAL):
  [1] ./CLAUDE.md          2.1KB   84 lines
  [2] ./AGENTS.md          1.4KB   52 lines

Note: I can also see ~/.claude/CLAUDE.md exists but don't have permission
to read it from this directory. To include global files, either:
  - cd ~ and re-run, or
  - add ~/.claude to additionalDirectories in settings.json
```

## Scope Prompt

After discovery, show the user a table grouped by scope and ask what to compress:

```text
Found 3 files:

GLOBAL (~/.claude/, ~/.openclaw/):
  [1] ~/.claude/CLAUDE.md          4.8KB  101 lines

LOCAL (./):
  [2] ./CLAUDE.md                  2.1KB   84 lines
  [3] ./AGENTS.md                  1.4KB   52 lines

Compress: [a]ll, [g]lobal, [l]ocal, or numbers (e.g., "1,3")?
```
