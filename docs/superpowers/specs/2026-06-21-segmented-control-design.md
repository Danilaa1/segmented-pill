# Segmented Control Design

## Goal

Extract the segmented tab UI from the slot-text landing page into a standalone, dependency-free package under `~/Developer/segmented-control`. Preserve the source landing page unchanged.

## Scope

The package provides only the segmented control. It does not manage code panels, application content, sounds, or framework wrappers.

Included:

- Vanilla JavaScript controller
- Required CSS and documented custom properties
- Static active pill by default
- Optional sliding-pill animation
- Accessible keyboard and focus behavior
- Type declarations
- Automated behavior and accessibility tests
- README with a preview image and copy-paste examples
- Small browser demo

## Public API

```js
import { segmentedControl } from "segmented-control";
import "segmented-control/style.css";

const control = segmentedControl(element, {
  value: "vanilla",
  animated: true,
  onChange(value) {
    console.log(value);
  },
});

control.set("vue");
control.destroy();
```

`segmentedControl(element, options)` enhances buttons inside one root element. Each button declares its value with `data-value`.

Options:

- `value?: string` sets the initial active item. The first enabled item is used when omitted.
- `animated?: boolean` enables sliding movement. Default: `false`.
- `onChange?: (value: string) => void` runs after a user selects a new value.

Controller:

- `value` returns the current value.
- `set(value)` selects an enabled item and updates accessibility state. Programmatic changes do not call `onChange`.
- `destroy()` removes listeners and generated accessibility attributes/classes.

Invalid roots, duplicate values, missing values, and unknown values passed to `set()` throw clear errors. Disabled buttons cannot be selected.

## Markup

```html
<div class="segmented-control" aria-label="Framework">
  <button type="button" data-value="vanilla">Vanilla</button>
  <button type="button" data-value="react">React</button>
  <button type="button" data-value="vue">Vue</button>
</div>
```

The controller adds `role="tablist"` to the root and `role="tab"`, `aria-selected`, and roving `tabindex` values to items. Existing accessible names remain consumer-owned because the controller cannot infer a useful group label.

## Interaction and accessibility

- Click selects an enabled item and calls `onChange` once.
- Left/Right arrows move focus and selection, wrapping at both ends.
- Home/End select the first/last enabled item.
- Enter/Space select the focused item when focus was moved independently by the browser or script.
- Disabled items are skipped and retain native `disabled` behavior.
- Exactly one enabled item has `tabindex="0"`; all others use `-1`.
- Selection updates `aria-selected` synchronously.
- Focus remains visible through `:focus-visible` styles.
- Sliding is suppressed when `prefers-reduced-motion: reduce` is active, even when `animated: true`.
- Without JavaScript, buttons remain visible and usable as ordinary buttons.

## Visual behavior

The current compact neutral styling is preserved: rounded gray track, white active pill, dark active text, restrained shadow, and small typography.

The pill always remains visible. With `animated: false`, it moves instantly. With `animated: true`, it transitions between item bounds. CSS custom properties expose colors, radius, spacing, shadow, and timing without expanding the JavaScript API.

Implementation uses a dedicated indicator element instead of CSS anchor positioning. This keeps behavior consistent across current browsers and makes animation state explicit. Item measurement occurs on selection and resize only.

## Package structure

```text
segmented-control/
  src/index.js          controller and validation
  src/style.css         component styles and custom properties
  tests/index.test.js   behavior and accessibility tests
  examples/index.html   browser demo
  assets/preview.svg    README preview
  README.md
  LICENSE
  package.json
```

The npm package exports the JavaScript entry, type declarations, and stylesheet. Core runtime has no dependencies.

## Testing and release checks

Tests cover initialization, click selection, keyboard navigation, wrapping, disabled items, programmatic selection, callback behavior, cleanup, generated ARIA state, and reduced-motion-compatible class behavior.

Release verification runs:

- unit tests
- type check
- production build
- package tarball dry run
- browser demo smoke check

## Documentation

README starts with the rendered component preview, then shows installation, minimal markup, minimal JavaScript, animation opt-in, API reference, accessibility behavior, theming variables, and local development commands. Examples remain short enough to copy without editing unrelated application code.
