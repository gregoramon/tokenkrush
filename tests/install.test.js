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

test('copySkillDir preserves symlinks (recreates them at dest)', () => {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-src-'));
  const dest = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-dest-'));
  fs.writeFileSync(path.join(src, 'real.md'), 'real content');
  fs.symlinkSync('real.md', path.join(src, 'link.md'));

  installer.copySkillDir(src, path.join(dest, 'tokenkrush'));

  const copiedLink = path.join(dest, 'tokenkrush', 'link.md');
  expect(fs.lstatSync(copiedLink).isSymbolicLink()).toBe(true);
  expect(fs.readlinkSync(copiedLink)).toBe('real.md');

  fs.rmSync(src, { recursive: true });
  fs.rmSync(dest, { recursive: true });
});

test('copySkillDir is idempotent — symlinks overwrite on reinstall', () => {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-src-'));
  const dest = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-dest-'));
  fs.writeFileSync(path.join(src, 'real.md'), 'content');
  fs.symlinkSync('real.md', path.join(src, 'link.md'));

  installer.copySkillDir(src, path.join(dest, 'tokenkrush'));
  // Second install to same destination — must not throw EEXIST on the symlink
  expect(() => installer.copySkillDir(src, path.join(dest, 'tokenkrush'))).not.toThrow();

  const copiedLink = path.join(dest, 'tokenkrush', 'link.md');
  expect(fs.lstatSync(copiedLink).isSymbolicLink()).toBe(true);

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

test('parseArgs with --target but no value flags error', () => {
  const result = installer.parseArgs(['--target']);
  expect(result.target).toBe(null);
  expect(result.targetError).toBe(true);
});

test('parseArgs with --target followed by another flag flags error (not consumed as path)', () => {
  const result = installer.parseArgs(['--target', '--all']);
  expect(result.target).toBe(null);
  expect(result.targetError).toBe(true);
  // The flag-like next token is NOT consumed as the path; parser keeps iterating and still parses --all.
  // runInstall checks targetError first and exits 1 before acting on args.all, so order doesn't matter in practice.
  expect(result.all).toBe(true);
});

test('runInstall returns 1 with error message when copySkillDir throws', () => {
  const outputs = [];
  const exitCode = installer.runInstall({
    args: { target: '/definitely-nonexistent-readonly-path-xyz', all: true, link: false, help: false },
    skillSrc: '/definitely-nonexistent-source-xyz',
    stdout: (msg) => outputs.push(msg)
  });
  expect(exitCode).toBe(1);
  expect(outputs.some(m => m.includes('Failed to install'))).toBe(true);
});

test('runInstall returns 1 when --target was given without a value', () => {
  const outputs = [];
  const exitCode = installer.runInstall({
    args: { target: null, targetError: true, all: false, link: false, help: false },
    skillSrc: '/nonexistent',
    stdout: (msg) => outputs.push(msg)
  });
  expect(exitCode).toBe(1);
  expect(outputs.some(m => m.includes('--target requires a path'))).toBe(true);
});

test('integration: install to --target copies skill dir', () => {
  const fakeSkillSrc = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-skillsrc-'));
  fs.writeFileSync(path.join(fakeSkillSrc, 'SKILL.md'), 'test skill');

  const fakeTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-target-'));

  const exitCode = installer.runInstall({
    args: { target: fakeTarget, all: true, link: false, help: false },
    skillSrc: fakeSkillSrc,
    stdout: () => {}
  });

  expect(exitCode).toBe(0);
  expect(fs.existsSync(path.join(fakeTarget, 'skills', 'tokenkrush', 'SKILL.md'))).toBe(true);
  expect(fs.readFileSync(path.join(fakeTarget, 'skills', 'tokenkrush', 'SKILL.md'), 'utf8')).toBe('test skill');

  fs.rmSync(fakeSkillSrc, { recursive: true });
  fs.rmSync(fakeTarget, { recursive: true });
});

test('integration: install with --all to detected ecosystems', () => {
  const fakeSkillSrc = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-skillsrc-'));
  fs.writeFileSync(path.join(fakeSkillSrc, 'SKILL.md'), 'test skill');

  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-home-'));
  fs.mkdirSync(path.join(fakeHome, '.claude'));

  const exitCode = installer.runInstall({
    args: { target: null, all: true, link: false, help: false },
    skillSrc: fakeSkillSrc,
    homeDir: fakeHome,
    stdout: () => {}
  });

  expect(exitCode).toBe(0);
  expect(fs.existsSync(path.join(fakeHome, '.claude', 'skills', 'tokenkrush', 'SKILL.md'))).toBe(true);

  fs.rmSync(fakeSkillSrc, { recursive: true });
  fs.rmSync(fakeHome, { recursive: true });
});
