import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const sectionRule = stylesheet.match(/\.visual-section\s*\{[^}]*\}/s)?.[0] ?? '';

assert.doesNotMatch(
  sectionRule,
  /clip-path\s*:/,
  'visual-section must not clip itself; the mask pseudo-element must cover the full module.'
);

assert.doesNotMatch(
  sectionRule,
  /margin-top\s*:\s*-/,
  'visual-section must not overlap the previous module; each mask must retain its full height.'
);
