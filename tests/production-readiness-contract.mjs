import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

assert.match(
  html,
  /<script\s+src="vendor\/lucide\.min\.js"><\/script>/,
  'Lucide must load from the vendored local runtime.'
);
assert.doesNotMatch(
  html,
  /<script\b[^>]*\bsrc="https:\/\/unpkg\.com\//,
  'The page must not load executable scripts from unpkg.'
);
assert.match(
  html,
  /<link rel="icon" type="image\/png" href="assets\/almikey-nav-avatar\.png" \/>/,
  'The favicon must use the maintained navigation avatar asset.'
);
assert.ok(
  existsSync(new URL('../assets/almikey-nav-avatar.png', import.meta.url)),
  'The favicon asset must exist in the deployed file set.'
);
assert.doesNotMatch(
  stylesheet,
  /(^|\n)\.hero \.eyebrow,[\s\S]*?opacity:\s*0;/m,
  'Hero content must remain visible before JavaScript enhances it.'
);
assert.match(
  script,
  /document\.documentElement\.classList\.add\('has-js'\)/,
  'JavaScript must explicitly opt into enhanced hero animations.'
);
assert.match(
  stylesheet,
  /\.has-js \.hero \.eyebrow,[\s\S]*?opacity:\s*0;/,
  'Only JavaScript-enhanced pages may hide hero content before the animation starts.'
);

assert.match(
  html,
  /data-background-src="assets\/novaskin-wallpaper-chillingwithdog\.jpg"/,
  'Non-hero visual sections must expose their background source for deferred loading.'
);
assert.doesNotMatch(
  stylesheet,
  /--section-image:\s*url\(/,
  'Non-hero background images must not be requested from the initial stylesheet.'
);
for (const sectionName of ['capabilities', 'projects', 'mechanics', 'contact']) {
  const sectionRule = stylesheet.match(new RegExp(`\\.${sectionName}\\s*\\{[^}]*\\}`, 's'))?.[0] ?? '';
  assert.match(
    sectionRule,
    /background:\s*var\(--paper\);/,
    `${sectionName} must preserve the original light backdrop beneath its deferred image.`
  );
}
assert.match(
  script,
  /menuToggle\?\.focus\(\)/,
  'Escape must return focus to the mobile-menu trigger.'
);
assert.match(
  html,
  /data-copy-status/,
  'Contact copy results must be announced to assistive technologies.'
);
