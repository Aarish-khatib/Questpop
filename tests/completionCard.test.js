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

test('strips XML-invalid control characters and normalizes multiline goals', () => {
  const svg = createCompletionCard('Ship\u0001 a\n working\tapp');
  assert.doesNotMatch(svg, /\u0001/);
  assert.match(svg, /Ship a working app/);
});
test('removes unpaired surrogates while retaining valid emoji', () => {
  const svg = createCompletionCard('Finish \uD800 project 🚀');
  assert.doesNotMatch(svg, /\uD800/);
  assert.match(svg, /🚀/);
});

test('wraps emoji-heavy goals without splitting UTF-16 surrogate pairs', () => {
  const svg = createCompletionCard('A' + '🚀'.repeat(60));
  const lines = [...svg.matchAll(/<tspan[^>]*>(.*?)<\/tspan>/g)].map((match) => match[1]);
  assert.ok(lines.length > 1);
  assert.ok(lines.every((line) => !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(line)));
  assert.equal(lines.join(''), 'A' + '🚀'.repeat(60));
});

test('keeps six lines of goal text clear of the SVG footer', () => {
  const svg = createCompletionCard('A'.repeat(140));
  const lines = [...svg.matchAll(/<tspan x="480" dy="(\d+)">/g)];
  assert.equal(lines.length, 6);
  const start = Number(svg.match(/<text x="480" y="(\d+)" text-anchor="middle" font-family="Arial,sans-serif" font-size="36"/)[1]);
  const lastBaseline = start + lines.slice(1).reduce((sum, line) => sum + Number(line[1]), 0);
  assert.ok(lastBaseline <= 445, 'goal text must end above footer');
  assert.ok(start >= 245, 'goal text must start below title');
});
