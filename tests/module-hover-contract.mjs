import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const hoverRules = stylesheet.match(/@media \(hover: hover\) \{[\s\S]*?\n\}/)?.[0] ?? '';

assert.match(hoverRules, /\.hero:hover \.hero-shade\s*\{/);
assert.match(hoverRules, /\.visual-section:hover::after\s*\{/);
assert.match(hoverRules, /opacity:\s*\.58;/, 'module hover must noticeably brighten the full-module overlay.');
assert.match(hoverRules, /inset 0 0 100px rgba\(166, 230, 92, \.12\)/, 'module hover must provide a visible inner glow.');
assert.match(hoverRules, /transform:\s*translateY\(-6px\);/, 'module hover must lift its content noticeably.');
