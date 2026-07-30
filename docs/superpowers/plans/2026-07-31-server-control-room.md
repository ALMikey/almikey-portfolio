# Server Control Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the portfolio into a restrained Minecraft server control-room experience with a live chapter HUD, chapter texture, and expandable project records.

**Architecture:** `index.html` supplies semantic controls and project data. `app.js` maps active sections to the visual-only HUD and controls each project record state. `styles.css` provides the responsive HUD, texture, motion, and record layout without external UI dependencies.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node `assert` contract tests.

---

### Task 1: Add Control-Room Markup

**Files:**
- Modify: `index.html`
- Test: `tests/control-room-contract.mjs`

- [ ] **Step 1: Write the failing contract test**

```js
assert.match(html, /class="system-hud" aria-hidden="true"/);
assert.match(html, /data-hud-index>00<\/span>/);
assert.match(html, /class="project-record" id="project-record-1" hidden/);
assert.match(html, /data-project-toggle aria-expanded="false" aria-controls="project-record-1"/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/control-room-contract.mjs`

Expected: `AssertionError` because the HUD and project record hooks do not exist.

- [ ] **Step 3: Add the HUD and records**

Add a visual-only `system-hud` after the module switcher. For every project card, add a `button[data-project-toggle]` and a matching hidden `.project-record` containing its role, stack, and outcome.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node tests/control-room-contract.mjs`

Expected: exit code 0.

### Task 2: Implement HUD State and Project Record Behavior

**Files:**
- Modify: `app.js`
- Modify: `tests/control-room-contract.mjs`

- [ ] **Step 1: Extend the failing contract test**

```js
assert.match(script, /const hudIndex = document\.querySelector\('\[data-hud-index\]'\)/);
assert.match(script, /hudIndex\.textContent = section\.dataset\.chapter/);
assert.match(script, /toggle\.setAttribute\('aria-expanded', String\(isExpanded\)\)/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/control-room-contract.mjs`

Expected: `AssertionError` because no HUD mapping or toggle behavior exists.

- [ ] **Step 3: Add minimal behavior**

Assign `data-chapter` and `data-label` to each section. Extend `setCurrentModule` to update the HUD. Bind each project toggle to reveal its controlled record and update `aria-expanded` and button text.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node tests/control-room-contract.mjs`

Expected: exit code 0.

### Task 3: Add Control-Room Visual Treatment

**Files:**
- Modify: `styles.css`
- Modify: `tests/control-room-contract.mjs`

- [ ] **Step 1: Extend the failing contract test**

```js
assert.match(stylesheet, /\.system-hud\s*\{[\s\S]*position:\s*fixed/s);
assert.match(stylesheet, /\.visual-section::before[\s\S]*linear-gradient/s);
assert.match(stylesheet, /\.project-record:not\(\[hidden\]\)/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/control-room-contract.mjs`

Expected: `AssertionError` because the HUD and record states have no visual rules.

- [ ] **Step 3: Add the visual rules**

Use a low-opacity repeating-linear-gradient texture on visual chapter backgrounds, style the fixed HUD as an operational readout, and animate visible project records with a constrained max-height and opacity transition. Hide the HUD at the mobile breakpoint. Add reduced-motion overrides for the new transitions.

- [ ] **Step 4: Run the full regression suite**

Run: `node tests/control-room-contract.mjs; node tests/module-hover-contract.mjs; node tests/module-switcher-contract.mjs; node tests/hero-reentry-contract.mjs; node tests/layout-contract.mjs; node --check app.js`

Expected: exit code 0.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html styles.css app.js tests/control-room-contract.mjs
git commit -m "feat: add server control room experience"
```
