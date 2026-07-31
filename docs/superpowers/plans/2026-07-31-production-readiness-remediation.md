# Production Readiness Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution selected by the requester). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the static portfolio resilient to JavaScript and CDN failures, reduce non-critical image loading, improve keyboard feedback, and document secure deployment requirements.

**Architecture:** The page remains a dependency-light static site. JavaScript only enhances an already readable document, deferred section backgrounds are loaded after intersection, and the icon runtime is served from the same origin. Server concerns stay documented as deployment configuration requirements because this repository does not own the target server.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js contract tests, Nginx-compatible deployment guidance.

---

### Task 1: Progressive Enhancement and Local Icon Runtime

**Files:**
- Modify: `index.html:8-15,295-296`
- Modify: `styles.css:355-390`
- Create: `vendor/lucide.min.js`
- Create: `tests/production-readiness-contract.mjs`

- [ ] **Step 1: Write failing production-readiness checks**

```js
assert.match(html, /<script src="vendor\/lucide\.min\.js"><\/script>/);
assert.doesNotMatch(html, /<script src="https:\/\/unpkg\.com\//);
assert.doesNotMatch(stylesheet, /\.hero \.eyebrow,[\s\S]*?opacity:\s*0;/);
```

- [ ] **Step 2: Run the check and verify it fails because the icon script is remote and hero content is initially hidden**

Run: `node tests/production-readiness-contract.mjs`

- [ ] **Step 3: Serve the pinned Lucide runtime locally and make hero content visible without JavaScript**

```html
<script src="vendor/lucide.min.js"></script>
```

```css
.hero-active .eyebrow { animation: hero-item-enter .48s .06s both; }
```

- [ ] **Step 4: Re-run the check and verify it passes**

Run: `node tests/production-readiness-contract.mjs`

### Task 2: Deferred Backgrounds and Accessible Contact Feedback

**Files:**
- Modify: `index.html:68-261`
- Modify: `app.js:1-116,160-190`
- Modify: `styles.css:410-420,860-890`
- Modify: `tests/production-readiness-contract.mjs`

- [ ] **Step 1: Extend the failing check for deferred non-hero backgrounds and Escape focus restoration**

```js
assert.match(html, /data-background-src="assets\/novaskin-wallpaper-chillingwithdog\.jpg"/);
assert.match(script, /menuToggle\?\.focus\(\)/);
assert.match(html, /data-copy-status/);
```

- [ ] **Step 2: Run the check and verify it fails**

Run: `node tests/production-readiness-contract.mjs`

- [ ] **Step 3: Load section backgrounds through an IntersectionObserver and announce copy results**

```js
section.style.setProperty('--section-image', `url("${section.dataset.backgroundSrc}")`);
copyStatus.textContent = copied ? '联系方式已复制到剪贴板。' : '复制失败，请手动选择并复制。';
```

- [ ] **Step 4: Restore focus to the menu button after Escape closes an open mobile menu**

```js
if (event.key === 'Escape' && siteNav?.classList.contains('is-open')) {
  closeMenu(true);
}
```

- [ ] **Step 5: Re-run the check and verify it passes**

Run: `node tests/production-readiness-contract.mjs`

### Task 3: Deployment Documentation and Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add an actionable production deployment section**

Document HTTPS, HSTS, CSP, `nosniff`, referrer policy, caching by file type, immutable asset versioning, asset optimization, release verification, and rollback using the previous versioned release directory.

- [ ] **Step 2: Run all contracts and syntax checks**

Run: `node tests/*.mjs` (or each test explicitly on PowerShell), `node --check app.js`, and `git diff --check`.

- [ ] **Step 3: Review the final diff and create a Chinese commit when requested**

Run: `git diff --check` and `git status --short`.
