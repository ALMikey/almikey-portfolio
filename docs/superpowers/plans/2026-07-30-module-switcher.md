# Module Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a right-side desktop module switcher and a bottom mobile module navigator that tracks the active full-screen section.

**Architecture:** Add one semantic anchor navigation to the document and one `id` to the hero. Use a dedicated `IntersectionObserver` with a visibility map to set `is-current` on exactly one navigation link; CSS switches the same navigation from a vertical rail to a safe-area-aware horizontal mobile bar.

**Tech Stack:** Static HTML, CSS media queries, browser `IntersectionObserver`, Node standard-library contract tests.

---

### Task 1: Add A Module Switcher Contract Test

**Files:**
- Create: `tests/module-switcher-contract.mjs`
- Test: `tests/module-switcher-contract.mjs`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/module-switcher-contract.mjs`

Expected: failure because the semantic navigation, its observer, and responsive styles do not exist.

- [ ] **Step 3: Implement the switcher markup, state observer, and responsive styles**

In `index.html`, set the hero section id and add the navigation after the header:

```html
<section class="hero" id="home" aria-labelledby="hero-title">
```

```html
<nav class="module-switcher" aria-label="模块切换">
  <a class="is-current" href="#home"><span>00</span><b>首页</b></a>
  <a href="#capabilities"><span>01</span><b>能力</b></a>
  <a href="#mechanics"><span>02</span><b>技术</b></a>
  <a href="#projects"><span>03</span><b>项目</b></a>
  <a href="#contact"><span>04</span><b>联系</b></a>
</nav>
```

In `app.js`, add the link collection and observer after `moduleTargets`:

```js
const moduleSwitcherLinks = document.querySelectorAll('.module-switcher a');
const switcherSections = document.querySelectorAll('main > section[id]');
const switcherVisibility = new Map();

const setCurrentModule = (id) => {
  moduleSwitcherLinks.forEach((link) => {
    link.classList.toggle('is-current', link.hash === `#${id}`);
  });
};

if ('IntersectionObserver' in window) {
  const switcherObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => switcherVisibility.set(entry.target.id, entry));
    const current = [...switcherVisibility.values()]
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
    if (current) setCurrentModule(current.target.id);
  }, { rootMargin: '-30% 0px -30% 0px', threshold: [0, .25, .5, .75] });
  switcherSections.forEach((section) => switcherObserver.observe(section));
}
```

In `styles.css`, add these desktop and mobile rules:

```css
.module-switcher { position: fixed; top: 50%; right: 26px; z-index: 12; display: grid; gap: 9px; transform: translateY(-50%); }
.module-switcher a { min-width: 92px; min-height: 34px; display: flex; align-items: center; gap: 9px; padding: 0 10px; color: rgba(255,255,255,.5); border-left: 2px solid rgba(255,255,255,.24); font: 500 10px var(--mono); transition: color .2s ease, border-color .2s ease, transform .2s ease; }
.module-switcher b { font: 600 11px var(--sans); }
.module-switcher a:hover, .module-switcher a:focus-visible, .module-switcher a.is-current { color: #fff; border-color: var(--green); transform: translateX(-5px); }
.module-switcher a:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
@media (max-width: 820px) {
  .module-switcher { top: auto; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; padding: 7px 8px calc(7px + env(safe-area-inset-bottom)); transform: none; background: rgba(10,15,9,.92); border-top: 1px solid rgba(255,255,255,.2); }
  .module-switcher a { min-width: 0; min-height: 40px; justify-content: center; padding: 0 3px; border-left: 0; border-bottom: 2px solid transparent; font-size: 0; }
  .module-switcher a span { display: none; }
  .module-switcher b { font-size: 10px; }
  .module-switcher a:hover, .module-switcher a:focus-visible, .module-switcher a.is-current { border-color: var(--green); transform: none; }
  .contact { padding-bottom: calc(138px + env(safe-area-inset-bottom)); }
}
```

- [ ] **Step 4: Run the new and existing tests**

Run: `node tests/module-switcher-contract.mjs; node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs; node --check app.js`

Expected: all commands exit with code `0`.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html app.js styles.css tests/module-switcher-contract.mjs
git commit -m "feat: add responsive module switcher"
```

### Task 2: Verify The Local Preview

**Files:**
- Modify: none
- Test: `tests/module-switcher-contract.mjs`, `tests/hero-reentry-contract.mjs`, `tests/layout-contract.mjs`

- [ ] **Step 1: Check the locally served page and critical resources**

Run: `Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173/' | Select-Object -ExpandProperty StatusCode; node tests/module-switcher-contract.mjs; node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs; node --check app.js`

Expected: HTTP status `200` and every Node command exits with code `0`.

- [ ] **Step 2: Manually validate both responsive layouts**

Open the local preview at desktop width and a viewport at or below `820px`.

Expected: the desktop rail appears on the right; the mobile bar appears at the bottom; clicking each link reaches the matching module; exactly one link uses `is-current` while scrolling.
