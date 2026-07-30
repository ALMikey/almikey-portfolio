import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(html, /<nav class="module-switcher" aria-label="模块切换">/);
for (const target of ['home', 'capabilities', 'mechanics', 'projects', 'contact']) {
  assert.match(html, new RegExp(`href="#${target}"`));
}
assert.match(script, /const moduleSwitcherLinks = document\.querySelectorAll\('\.module-switcher a'\)/);
assert.match(script, /link\.classList\.toggle\('is-current'/);
assert.match(stylesheet, /\.module-switcher \{[^}]*position: fixed/s);
assert.match(stylesheet, /@media \(max-width: 820px\)[\s\S]*\.module-switcher \{/);
