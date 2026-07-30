import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const mobileNavigation = stylesheet.match(/@media \(max-width: 820px\) \{[\s\S]*?\.site-nav \{[^}]*\}/)?.[0] ?? '';

assert.match(mobileNavigation, /opacity:\s*0;/, 'The closed mobile navigation must be visually hidden without removing its transition state.');
assert.match(mobileNavigation, /transform:\s*translateY\(-12px\);/, 'The closed mobile navigation must begin above its final position.');
assert.match(mobileNavigation, /transition:[^;]*opacity/, 'The mobile navigation must animate when it opens and closes.');
assert.match(stylesheet, /\.site-nav\.is-open>a\s*\{[\s\S]*animation:\s*mobile-nav-item-enter/s, 'Opened mobile navigation links must enter with a short animation.');
assert.match(stylesheet, /@keyframes mobile-nav-item-enter/, 'The mobile navigation must define its entry animation.');
