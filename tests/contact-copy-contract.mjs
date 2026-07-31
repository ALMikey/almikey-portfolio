import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const expectedContacts = [
  ['QQ', '926431686'],
  ['微信', '15197483615'],
  ['GitHub', 'https://github.com/ALMikey'],
  ['邮箱', 'almikey.me2022@gmail.com'],
  ['Discord', 'ALMikey#7846'],
];

const copyTitles = html.match(/title="点击复制"/g) ?? [];
assert.equal(copyTitles.length, expectedContacts.length, 'Every contact card must expose a click-to-copy title.');

let previousIndex = -1;
for (const [label, value] of expectedContacts) {
  const button = new RegExp(`<button class="contact-link" type="button" data-copy="${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" aria-label="复制 ${label}：${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>[\\s\\S]*?<span>${label}</span>[\\s\\S]*?<b>${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</b>`);
  const match = html.match(button);
  assert.ok(match, `${label} must be a copyable contact button.`);
  assert.ok(match.index > previousIndex, `${label} must follow the requested contact order.`);
  previousIndex = match.index;
}

assert.match(script, /const copyButtons = document\.querySelectorAll\('\[data-copy\]'\)/);
assert.match(script, /navigator\.clipboard\.writeText/);
assert.match(script, /copyButton\.classList\.add\('is-copied'\)/);

const contactValueRule = stylesheet.match(/\.contact-link b\s*\{[^}]*\}/s)?.[0] ?? '';
assert.match(contactValueRule, /align-self:\s*center;/, 'Contact values must move away from the card bottom.');
assert.match(contactValueRule, /transform:\s*translateY\(-40%\);/, 'Contact values must shift upward by 40%.');
