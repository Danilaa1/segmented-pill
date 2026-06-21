# Segmented Pill

Dependency-free segmented control with accessible keyboard behavior and an optional sliding pill.

![Segmented Pill showing Vanilla, React, Vue, Solid, and Svelte options](./assets/preview.svg)

## Install

```bash
npm install segmented-pill
```

## Use

Add buttons with unique `data-value` attributes:

```html
<div class="segmented-control" id="framework" aria-label="Framework">
  <button type="button" data-value="vanilla">Vanilla</button>
  <button type="button" data-value="react">React</button>
  <button type="button" data-value="vue">Vue</button>
</div>
```

Import the controller and stylesheet:

```js
import { segmentedControl } from "segmented-pill";
import "segmented-pill/style.css";

const control = segmentedControl(document.querySelector("#framework"), {
  onChange(value) {
    console.log(value);
  },
});
```

The active pill is static by default. Opt into sliding motion explicitly:

```js
const control = segmentedControl(element, {
  value: "react",
  animated: true,
  onChange(value) {
    renderExample(value);
  },
});
```

`prefers-reduced-motion: reduce` always disables the transition.

## React

```jsx
import { useState } from "react";
import { SegmentedPill } from "segmented-pill/react";
import "segmented-pill/style.css";

const items = [
  { value: "vanilla", label: "Vanilla" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
];

export function FrameworkPicker() {
  const [value, setValue] = useState("vanilla");

  return (
    <SegmentedPill
      aria-label="Framework"
      items={items}
      value={value}
      onValueChange={setValue}
      animated
    />
  );
}
```

## Vue

```vue
<script setup>
import { ref } from "vue";
import { SegmentedPill } from "segmented-pill/vue";
import "segmented-pill/style.css";

const value = ref("vanilla");
const items = [
  { value: "vanilla", label: "Vanilla" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
];
</script>

<template>
  <SegmentedPill
    v-model="value"
    aria-label="Framework"
    :items="items"
    animated
  />
</template>
```

React and Vue are optional peer dependencies. The core package remains framework-free.

## API

### `segmentedControl(element, options?)`

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `value` | `string` | First enabled item | Initial value |
| `animated` | `boolean` | `false` | Enable sliding-pill motion |
| `onChange` | `(value) => void` | — | Handle user selection |

Returns:

```js
control.value;       // Current value
control.set("vue");  // Select without calling onChange
control.destroy();   // Remove generated state and listeners
```

Invalid, duplicate, unknown, or disabled values throw clear errors.

React accepts `items`, `value`, `defaultValue`, `animated`, and `onValueChange`. Vue accepts `items`, `modelValue`/`v-model`, `defaultValue`, and `animated`, and emits both `update:modelValue` and `change`.

## Accessibility

Segmented Pill adds `tablist` and `tab` roles, keeps `aria-selected` synchronized, and uses roving `tabindex` so only one item enters the page tab order.

- Left and Right move selection and wrap.
- Home and End jump to the first or last enabled item.
- Enter and Space select the focused item.
- Disabled buttons are skipped.
- Focus remains visible with `:focus-visible`.
- Reduced-motion preferences override animation.

Keep an accessible name on the root with `aria-label` or `aria-labelledby`. When switching panels, add matching `aria-controls`, `role="tabpanel"`, and `aria-labelledby` attributes. Content visibility stays in your application so the package remains small and predictable.

## Theme

Override variables on any control:

```css
.my-control {
  --segmented-track: #e9e3db;
  --segmented-pill: #fffdf9;
  --segmented-text: #6b6259;
  --segmented-text-active: #241f1a;
  --segmented-focus: #8a5a32;
  --segmented-radius: 12px;
  --segmented-gap: 2px;
  --segmented-padding: 3px;
  --segmented-duration: 220ms;
  --segmented-easing: cubic-bezier(0.22, 1, 0.36, 1);
  --segmented-shadow: 0 1px 2px rgb(0 0 0 / 10%);
}
```

## Develop

```bash
npm install
npm test
npm run check
npx vite examples
```

MIT
