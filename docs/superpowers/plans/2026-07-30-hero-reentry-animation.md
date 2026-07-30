# Hero Reentry Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero animate on initial load and replay when the user scrolls back to the top.

**Architecture:** Use the existing `IntersectionObserver` pattern to toggle one `hero-active` state on the hero section. CSS owns animation timing through scoped child selectors and `animation-delay`; JavaScript only manages state and honors the existing reduced-motion guard.

**Tech Stack:** Static HTML, CSS animations, browser `IntersectionObserver`, Node standard-library contract tests.

---

### Task 1: Add A Hero Animation Contract Test

**Files:**
- Create: `tests/hero-reentry-contract.mjs`
- Test: `tests/hero-reentry-contract.mjs`

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const stylesheet = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(script, /const hero = document\.querySelector\('\.hero'\)/);
assert.match(script, /hero\.classList\.toggle\('hero-active', entry\.isIntersecting\)/);
assert.match(stylesheet, /\.hero\.hero-active \.eyebrow \{[^}]*animation:/s);
assert.match(stylesheet, /\.hero\.hero-active \.hero-status \{[^}]*animation:/s);
assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/hero-reentry-contract.mjs`

Expected: failure because no `hero` observer or `hero-active` animation rules exist.

- [ ] **Step 3: Implement the minimal hero state observer and animation rules**

Add to `app.js` after the existing `moduleTargets` declaration:

```js
const hero = document.querySelector('.hero');
```

Add this observer before the module observer:

```js
if (!reduceMotion && hero && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      hero.classList.toggle('hero-active', entry.isIntersecting);
    });
  }, { threshold: 0.45 });
  heroObserver.observe(hero);
} else {
  hero?.classList.add('hero-active');
}
```

Add scoped animation rules to `styles.css`:

```css
.hero-content { position: relative; z-index: 1; padding-top: 58px; }
.hero .eyebrow,
.hero h1,
.hero-lead,
.hero-copy,
.hero-actions,
.hero-status { opacity: 0; }
.hero.hero-active .eyebrow { animation: hero-item-enter .48s .06s both; }
.hero.hero-active h1 { animation: hero-item-enter .58s .14s both; }
.hero.hero-active .hero-lead { animation: hero-item-enter .52s .25s both; }
.hero.hero-active .hero-copy { animation: hero-item-enter .55s .33s both; }
.hero.hero-active .hero-actions { animation: hero-item-enter .52s .42s both; }
.hero.hero-active .hero-status { animation: hero-item-enter .52s .5s both; }
@keyframes hero-item-enter {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Add to the reduced-motion media query:

```css
.hero .eyebrow,
.hero h1,
.hero-lead,
.hero-copy,
.hero-actions,
.hero-status { opacity: 1; transform: none; }
```

- [ ] **Step 4: Run the new and existing tests**

Run: `node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs; node --check app.js`

Expected: all commands exit with code `0`.

- [ ] **Step 5: Commit the implementation**

```bash
git add app.js styles.css tests/hero-reentry-contract.mjs
git commit -m "feat: replay hero animation on reentry"
```

### Task 2: Verify In The Local Preview

**Files:**
- Modify: none
- Test: `tests/hero-reentry-contract.mjs`, `tests/layout-contract.mjs`

- [ ] **Step 1: Start the static server**

Run: `python -m http.server 4173`

Expected: the site is reachable at `http://127.0.0.1:4173/`.

- [ ] **Step 2: Verify the HTTP response and animation contract**

Run: `Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173/' | Select-Object -ExpandProperty StatusCode; node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs`

Expected: HTTP status `200` and both contract tests exit with code `0`.

- [ ] **Step 3: Manually validate behavior**

Open the local preview, scroll below the hero, then return to the top.

Expected: the hero content replays once per reentry; reduced-motion users see all hero content without animation.
