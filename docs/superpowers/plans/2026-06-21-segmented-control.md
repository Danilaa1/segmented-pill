# Segmented Control Implementation Plan

> **Update:** Final public surface is React and Vue only. The Vanilla controller remains private shared implementation; root export, public core types, and Vanilla demo/docs were removed.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free, accessible segmented control package with an optional sliding pill and clear visual documentation.

**Architecture:** A small DOM controller enhances consumer-owned buttons and owns selection, keyboard navigation, and cleanup. A shipped stylesheet owns the compact appearance and indicator motion; JavaScript only measures and positions the indicator. Vite builds the library while Vitest and jsdom verify public behavior.

**Tech Stack:** JavaScript, CSS, Vite, Vitest, jsdom, npm

---

## File structure

- `src/index.js`: public controller, validation, selection, keyboard behavior, indicator positioning, cleanup.
- `src/index.d.ts`: public option and controller types.
- `src/style.css`: required visual contract and theming variables.
- `tests/index.test.js`: public DOM behavior and accessibility contract.
- `examples/index.html`: runnable browser example covering static and animated modes.
- `assets/preview.svg`: compact visual README preview.
- `README.md`: install, usage, API, accessibility, theming, and development guide.
- `src/react.js` and `src/react.d.ts`: optional React wrapper and types.
- `src/vue.js` and `src/vue.d.ts`: optional Vue wrapper and types.
- `package.json`: exports, scripts, metadata, runtime files, and dependency declarations.
- `vite.config.js`: library build configuration.
- `LICENSE`: MIT license.

### Task 1: Package foundation

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore`
- Create: `LICENSE`

- [ ] **Step 1: Add package metadata and scripts**

Create an ESM package exporting `dist/index.js`, `dist/index.d.ts`, and `style.css`. Add `test`, `check`, `build`, and `pack:check` scripts. Keep runtime dependencies empty; use Vite, Vitest, and jsdom as dev dependencies.

- [ ] **Step 2: Add build configuration**

Configure Vite library mode with `src/index.js` as the entry, ES output only, and copied type/CSS assets.

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: lockfile created with no install errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js .gitignore LICENSE
git commit -m "chore: scaffold segmented control package"
```

### Task 2: Accessible controller

**Files:**
- Create: `tests/index.test.js`
- Create: `src/index.js`
- Create: `src/index.d.ts`

- [ ] **Step 1: Write failing initialization tests**

Test the consumer API from the approved spec: first enabled fallback, explicit initial value, generated roles, `aria-selected`, roving `tabindex`, duplicate/missing value validation, and disabled-item rejection.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run`

Expected: FAIL because `src/index.js` does not exist.

- [ ] **Step 3: Implement initialization and validation**

Add `segmentedControl(root, options)` with explicit validation, generated accessibility attributes, active-state classes, and the read-only `value` getter.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run`

Expected: initialization tests pass.

- [ ] **Step 5: Write failing interaction tests**

Test click selection, callback counts, `set()` without callback, ArrowLeft/ArrowRight wrap, Home/End behavior, disabled-item skipping, focus movement, and unchanged selection no-op behavior.

- [ ] **Step 6: Verify RED**

Run: `npm test -- --run`

Expected: FAIL on unimplemented interaction behavior.

- [ ] **Step 7: Implement selection and keyboard behavior**

Use one internal `select(item, notify)` path. User input notifies; `set()` does not. Keyboard navigation selects and focuses enabled items.

- [ ] **Step 8: Verify GREEN**

Run: `npm test -- --run`

Expected: interaction tests pass.

- [ ] **Step 9: Write failing cleanup and animation tests**

Test indicator creation, animated class opt-in, reduced-motion-safe CSS hook, resize positioning hook, listener cleanup, generated-state removal, and idempotent `destroy()`.

- [ ] **Step 10: Verify RED**

Run: `npm test -- --run`

Expected: FAIL on missing indicator and cleanup behavior.

- [ ] **Step 11: Implement indicator and cleanup**

Create one `aria-hidden` indicator, position it with transforms and dimensions, observe root resizing, apply animation only through an opt-in class, and fully remove generated state on destroy.

- [ ] **Step 12: Add declarations and verify GREEN**

Define `SegmentedControlOptions`, `SegmentedControlController`, and `segmentedControl()` declarations matching runtime names exactly.

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 13: Commit**

```bash
git add src tests
git commit -m "feat: add accessible segmented control"
```

### Task 3: Visual contract

**Files:**
- Create: `src/style.css`
- Modify: `tests/index.test.js`

- [ ] **Step 1: Write failing stylesheet contract test**

Verify required selectors and reduced-motion override exist in the shipped stylesheet.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run`

Expected: FAIL because `src/style.css` does not exist.

- [ ] **Step 3: Implement compact styles**

Preserve the source component’s neutral track, white pill, soft shadow, clear focus ring, and small type. Expose documented `--segmented-*` custom properties. Use transform-only movement and suppress transitions under `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/style.css tests/index.test.js
git commit -m "feat: add segmented control styles"
```

### Task 4: Demo and visual documentation

**Files:**
- Create: `examples/index.html`
- Create: `assets/preview.svg`
- Create: `README.md`

- [ ] **Step 1: Build browser demo**

Show static default and animated opt-in controls, live selected values, disabled-item behavior, and theming without framework code.

- [ ] **Step 2: Create README preview**

Create a crisp SVG rendering of the control with Vanilla active. Keep labels and proportions faithful to the package stylesheet.

- [ ] **Step 3: Write concise README**

Document install, markup, initialization, animation opt-in, controller API, accessibility, CSS variables, and development commands. Keep examples copy-paste ready.

- [ ] **Step 4: Commit**

```bash
git add examples assets README.md
git commit -m "docs: add demo and visual usage guide"
```

### Task 5: Build and package verification

**Files:**
- Modify: `package.json` only if verification exposes package metadata issues.

- [ ] **Step 1: Run complete checks**

Run: `npm run check`

Expected: tests and build pass with no warnings.

- [ ] **Step 2: Verify publish contents**

Run: `npm run pack:check`

Expected: tarball contains README, LICENSE, preview, example, `dist/index.js`, `dist/index.d.ts`, and `style.css`; excludes tests and source-only files.

- [ ] **Step 3: Smoke-test browser demo**

Serve the package locally, open the example, verify click/keyboard/static/animated behavior, and check desktop/mobile screenshots.

- [ ] **Step 4: Confirm source repo untouched**

Run: `git -C /Users/danielbelyi/Developer/Animation-library/slot-text-landing-page status --short`

Expected: no changes created by extraction.

- [ ] **Step 5: Commit verification fixes if needed**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "chore: finalize package output"
```

### Task 6: React and Vue wrappers

**Files:**
- Create: `src/react.js`
- Create: `src/react.d.ts`
- Create: `src/vue.js`
- Create: `src/vue.d.ts`
- Create: `tests/react.test.js`
- Create: `tests/vue.test.js`
- Modify: `package.json`
- Modify: `vite.config.js`
- Modify: `README.md`

- [ ] **Step 1: Write failing wrapper tests**

Test rendered items, initial values, controlled value synchronization, user change callbacks/events, disabled items, and unmount cleanup for both wrappers.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run`

Expected: FAIL because wrapper entrypoints do not exist.

- [ ] **Step 3: Implement thin wrappers**

Render buttons from an `items` array and delegate selection, keyboard behavior, indicator motion, and cleanup to `segmentedControl()`. React exposes `value` and `onValueChange`; Vue exposes `modelValue` through `v-model`.

- [ ] **Step 4: Add wrapper types and exports**

Expose `segmented-pill/react` and `segmented-pill/vue`, keep React and Vue optional peers, and externalize both frameworks from package bundles.

- [ ] **Step 5: Verify GREEN and package contents**

Run: `npm run check && npm run pack:check`

Expected: all tests/builds pass and tarball includes core, React, Vue, type declarations, CSS, docs, preview, and examples.

- [ ] **Step 6: Commit**

```bash
git add src tests package.json package-lock.json vite.config.js README.md
git commit -m "feat: add React and Vue wrappers"
```
