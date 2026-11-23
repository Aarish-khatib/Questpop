import test from 'node:test';
import assert from 'node:assert/strict';
import { createCompletionCard } from '../src/utils/completionCard.js';

test('produces standalone SVG with the completed goal', () => {
  const svg = createCompletionCard('Build a working app');
  assert.match(svg, /<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg, /Build a working app/);
  assert.match(svg, /QUEST COMPLETE/);
});
test('escapes XML-sensitive input to prevent SVG markup injection', () => {
  const svg = createCompletionCard('<script>alert("x")</script> & done');
  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /&lt;script&gt;/);
  assert.match(svg, /&amp;/);
});
test('rejects empty or invalid goals', () => {
  assert.throws(() => createCompletionCard('  '), /required/);
  assert.throws(() => createCompletionCard(null), /required/);
});
test('limits length and renders bounded text lines', () => {
  const svg = createCompletionCard('word '.repeat(200));
  assert.ok((svg.match(/<tspan/g) || []).length <= 6);
  assert.ok(svg.length < 2500);
});
