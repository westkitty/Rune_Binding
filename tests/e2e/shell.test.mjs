import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('opens_case_shelf', async () => {
  const html = await readFile(new URL('../../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /Rune Binding/);
  assert.match(html, /Create case/);
  assert.match(html, /Local-only/);
  assert.doesNotMatch(html, /ancient origin verified/i);
});
