const { test, expect } = require('bun:test');
const installer = require('../bin/install.js');

test('installer module exports main', () => {
  expect(typeof installer.main).toBe('function');
});
