# GitHub Contact Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the misleading GitHub activity display with a GitHub contact card that opens ALMikey's profile.

**Architecture:** Keep the contact-card component model unchanged: add one semantic anchor to the existing contact grid and rely on `.contact-link` for presentation. Remove the activity-only markup and CSS, while extending the static contract test to describe the desired link and reject the obsolete implementation.

**Tech Stack:** Static HTML, CSS, Lucide UMD icons, Node.js assertion contracts.

---

### Task 1: Define the GitHub contact-card contract

**Files:**
- Modify: `tests/control-room-contract.mjs`
- Test: `tests/control-room-contract.mjs`

- [x] **Step 1: Replace the heatmap assertions with a GitHub card assertion**

```js
assert.match(html, /<a class="contact-link contact-link-github" href="https:\/\/github\.com\/ALMikey"\s+target="_blank" rel="noreferrer" aria-label="打开 ALMikey 的 GitHub 主页">[\s\S]*?<i data-lucide="github"><\/i>[\s\S]*?<span>GitHub<\/span>[\s\S]*?<b>ALMikey<\/b>/);
assert.doesNotMatch(html, /class="github-activity"/);
assert.doesNotMatch(stylesheet, /\.github-grid\s*\{/);
```

- [x] **Step 2: Run the contract to verify it fails**

Run: `node tests/control-room-contract.mjs`

Expected: assertion failure because the page still contains the activity component rather than the GitHub contact card.

### Task 2: Replace the activity display with a contact card

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/control-room-contract.mjs`

- [x] **Step 1: Delete the activity markup and add the profile link inside `.contact-grid`**

```html
<a class="contact-link contact-link-github" href="https://github.com/ALMikey"
  target="_blank" rel="noreferrer" aria-label="打开 ALMikey 的 GitHub 主页">
  <i data-lucide="github"></i><span>GitHub</span><b>ALMikey</b>
  <i class="contact-arrow" data-lucide="arrow-up-right"></i>
</a>
```

- [x] **Step 2: Delete the `.github-activity`, `.github-grid`, and `.github-cell` CSS rules**

```css
/* No GitHub activity-specific styles remain. The link inherits `.contact-link`. */
```

- [x] **Step 3: Run the focused contract to verify it passes**

Run: `node tests/control-room-contract.mjs`

Expected: process exits with code `0`.

### Task 3: Verify the static site and commit

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/control-room-contract.mjs`

- [x] **Step 1: Run all static contracts and JavaScript syntax validation**

Run: `node tests/control-room-contract.mjs; node tests/mobile-menu-contract.mjs; node tests/module-hover-contract.mjs; node tests/module-switcher-contract.mjs; node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs; node --check app.js`

Expected: all commands exit with code `0`.

- [x] **Step 2: Commit the implementation in Chinese**

```powershell
git add index.html styles.css tests/control-room-contract.mjs
git commit -m "修正 GitHub 联系卡片"
```
