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

function main() {
  const ecos = detectEcosystems();
  if (ecos.length === 0) {
    console.log('No AI tool ecosystems detected (~/.claude, ~/.openclaw/workspace, ~/.cursor, ~/.gemini).');
    process.exit(1);
  }
  console.log(`Detected ${ecos.length} ecosystem(s):`);
  for (const eco of ecos) {
    console.log(`  - ${eco.name} → ${eco.installPath}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, detectEcosystems };
