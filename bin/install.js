#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const ECOSYSTEMS = [
  { name: 'claude-code', marker: '.claude', installSubpath: ['skills', 'tokenkrush'] },
  { name: 'openclaw', marker: path.join('.openclaw', 'workspace'), installSubpath: ['skills', 'tokenkrush'] },
  { name: 'cursor', marker: '.cursor', installSubpath: ['skills', 'tokenkrush'] },
  { name: 'gemini', marker: '.gemini', installSubpath: ['skills', 'tokenkrush'] }
];

function detectEcosystems(homeDir = os.homedir()) {
  const found = [];
  for (const eco of ECOSYSTEMS) {
    const markerPath = path.join(homeDir, eco.marker);
    if (fs.existsSync(markerPath) && fs.statSync(markerPath).isDirectory()) {
      const installPath = path.join(homeDir, eco.marker, ...eco.installSubpath);
      found.push({ name: eco.name, installPath });
    }
  }
  return found;
}

function copySkillDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copySkillDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function parseArgs(argv) {
  const result = { target: null, all: false, link: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') {
      if (i + 1 >= argv.length) {
        result.targetError = true;
      } else {
        result.target = argv[++i];
      }
    } else if (arg === '--all') {
      result.all = true;
    } else if (arg === '--link') {
      result.link = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    }
  }
  return result;
}

function printHelp(out) {
  out(`tokenkrush installer

Usage:
  npx @gregoramon/tokenkrush init [options]

Options:
  --target <path>   Install under <path>/skills/tokenkrush/ (bypasses ecosystem detection)
  --all             Install to all detected ecosystems (currently the default; reserved for future interactive mode)
  --link            Symlink instead of copying (reserved; not yet implemented)
  --help, -h        Show this help

Detected ecosystems install to:
  ~/.claude/skills/tokenkrush/               (Claude Code)
  ~/.openclaw/workspace/skills/tokenkrush/   (OpenClaw)
  ~/.cursor/skills/tokenkrush/               (Cursor)
  ~/.gemini/skills/tokenkrush/               (Gemini)
`);
}

function runInstall({ args, skillSrc, homeDir, stdout }) {
  const out = stdout || console.log;

  if (args.help) {
    printHelp(out);
    return 0;
  }

  if (args.targetError) {
    out('Error: --target requires a path argument (e.g., --target ~/.claude).');
    return 1;
  }

  const targets = [];
  if (args.target) {
    targets.push({ name: 'custom', installPath: path.join(args.target, 'skills', 'tokenkrush') });
  } else {
    const ecos = detectEcosystems(homeDir);
    if (ecos.length === 0) {
      out('No AI tool ecosystems detected. Try --target <path> or install Claude Code / OpenClaw / Cursor first.');
      return 1;
    }
    targets.push(...ecos);
  }

  for (const target of targets) {
    copySkillDir(skillSrc, target.installPath);
    out(`Installed to ${target.installPath} (${target.name})`);
  }

  out(`\nDone. Try it: "compress my CLAUDE.md"`);
  return 0;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const skillSrc = path.join(__dirname, '..', 'skills', 'tokenkrush');
  const code = runInstall({ args, skillSrc });
  process.exit(code);
}

if (require.main === module) {
  main();
}

module.exports = { main, detectEcosystems, copySkillDir, parseArgs, runInstall };
