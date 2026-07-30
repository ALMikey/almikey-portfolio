import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(script, /const hero = document\.querySelector\('\.hero'\)/);
assert.match(script, /hero\.classList\.toggle\('hero-active', entry\.isIntersecting\)/);
assert.match(stylesheet, /\.hero\.hero-active \.eyebrow \{[^}]*animation:/s);
assert.match(stylesheet, /\.hero\.hero-active \.hero-status \{[^}]*animation:/s);
assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
