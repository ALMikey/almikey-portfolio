import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(html, /class="system-hud" aria-hidden="true"/);
assert.match(html, /data-hud-index>00<\/span>/);
assert.match(html, /class="project-record" id="project-record-1" hidden/);
assert.match(html, /data-project-toggle aria-expanded="false" aria-controls="project-record-1"/);
assert.match(script, /const hudIndex = document\.querySelector\('\[data-hud-index\]'\)/);
assert.match(script, /hudIndex\.textContent = section\.dataset\.chapter/);
assert.match(script, /toggle\.setAttribute\('aria-expanded', String\(isExpanded\)\)/);
assert.match(stylesheet, /\.system-hud\s*\{[\s\S]*position:\s*fixed/s);
assert.match(stylesheet, /\.project-record:not\(\[hidden\]\)/);
assert.doesNotMatch(stylesheet, /repeating-linear-gradient/, 'Control-room styling must not add scanline or pixel-noise textures.');

const featuredProjectRule = stylesheet.match(/\.project-card-featured\s*\{[^}]*\}/s)?.[0] ?? '';
assert.doesNotMatch(featuredProjectRule, /background\s*:/, 'The featured project card must inherit the same transparency as other project cards.');
assert.doesNotMatch(stylesheet, /\.project-card-featured:hover\s*\{/, 'The featured project card must inherit the standard hover transparency.');

const contactCardRule = stylesheet.match(/\.contact-link\s*\{[^}]*\}/s)?.[0] ?? '';
const contactCardHoverRule = stylesheet.match(/\.contact-link:hover\s*\{[^}]*\}/s)?.[0] ?? '';
assert.match(contactCardRule, /background:\s*rgba\(26, 33, 25, \.78\);/, 'Contact cards must use the project-card transparency.');
assert.match(contactCardRule, /border:\s*1px solid #40503c;/, 'Contact cards must use the project-card border.');
assert.match(contactCardHoverRule, /transform:\s*translateY\(-7px\);/, 'Contact cards must use the project-card hover lift.');
