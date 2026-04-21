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
