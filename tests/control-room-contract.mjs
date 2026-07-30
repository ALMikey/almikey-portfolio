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
