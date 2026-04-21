const { test, expect } = require('bun:test');
const installer = require('../bin/install.js');

test('installer module exports main', () => {
  expect(typeof installer.main).toBe('function');
});

const path = require('path');
const os = require('os');
const fs = require('fs');

test('detectEcosystems returns empty when no tool dirs exist', () => {
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-home-'));
  const result = installer.detectEcosystems(fakeHome);
  expect(result).toEqual([]);
  fs.rmSync(fakeHome, { recursive: true });
});

test('detectEcosystems finds Claude Code when ~/.claude exists', () => {
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-home-'));
  fs.mkdirSync(path.join(fakeHome, '.claude'));
  const result = installer.detectEcosystems(fakeHome);
  expect(result).toEqual([
    { name: 'claude-code', installPath: path.join(fakeHome, '.claude', 'skills', 'tokenkrush') }
  ]);
  fs.rmSync(fakeHome, { recursive: true });
});

test('detectEcosystems finds OpenClaw when ~/.openclaw/workspace exists', () => {
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-home-'));
  fs.mkdirSync(path.join(fakeHome, '.openclaw', 'workspace'), { recursive: true });
  const result = installer.detectEcosystems(fakeHome);
  expect(result).toEqual([
    { name: 'openclaw', installPath: path.join(fakeHome, '.openclaw', 'workspace', 'skills', 'tokenkrush') }
  ]);
  fs.rmSync(fakeHome, { recursive: true });
});

test('detectEcosystems finds multiple ecosystems', () => {
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-home-'));
  fs.mkdirSync(path.join(fakeHome, '.claude'));
  fs.mkdirSync(path.join(fakeHome, '.openclaw', 'workspace'), { recursive: true });
  const result = installer.detectEcosystems(fakeHome);
  expect(result).toHaveLength(2);
  expect(result.map(r => r.name).sort()).toEqual(['claude-code', 'openclaw']);
  fs.rmSync(fakeHome, { recursive: true });
});

test('copySkillDir copies skill directory recursively', () => {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-src-'));
  const dest = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-dest-'));
  fs.mkdirSync(path.join(src, 'references'));
  fs.writeFileSync(path.join(src, 'SKILL.md'), 'skill body');
  fs.writeFileSync(path.join(src, 'references', 'a.md'), 'ref a');

  installer.copySkillDir(src, path.join(dest, 'tokenkrush'));

  expect(fs.readFileSync(path.join(dest, 'tokenkrush', 'SKILL.md'), 'utf8')).toBe('skill body');
  expect(fs.readFileSync(path.join(dest, 'tokenkrush', 'references', 'a.md'), 'utf8')).toBe('ref a');

  fs.rmSync(src, { recursive: true });
  fs.rmSync(dest, { recursive: true });
});

test('copySkillDir creates parent directories if missing', () => {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-src-'));
  const destBase = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-dest-'));
  fs.writeFileSync(path.join(src, 'SKILL.md'), 'hello');

  const deepDest = path.join(destBase, 'deep', 'nested', 'tokenkrush');
  installer.copySkillDir(src, deepDest);

  expect(fs.readFileSync(path.join(deepDest, 'SKILL.md'), 'utf8')).toBe('hello');

  fs.rmSync(src, { recursive: true });
  fs.rmSync(destBase, { recursive: true });
});

test('parseArgs with no flags returns defaults', () => {
  expect(installer.parseArgs([])).toEqual({
    target: null, all: false, link: false, help: false
  });
});

test('parseArgs with --target <path>', () => {
  expect(installer.parseArgs(['--target', '/custom/path'])).toEqual({
    target: '/custom/path', all: false, link: false, help: false
  });
});

test('parseArgs with --all', () => {
  expect(installer.parseArgs(['--all'])).toEqual({
    target: null, all: true, link: false, help: false
  });
});

test('parseArgs with --link', () => {
  expect(installer.parseArgs(['--link'])).toEqual({
    target: null, all: false, link: true, help: false
  });
});

test('parseArgs with --help', () => {
  expect(installer.parseArgs(['--help'])).toEqual({
    target: null, all: false, link: false, help: true
  });
});

test('parseArgs with combined flags', () => {
  expect(installer.parseArgs(['--all', '--link'])).toEqual({
    target: null, all: true, link: true, help: false
  });
});
