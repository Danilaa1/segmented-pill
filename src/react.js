import { createElement, useLayoutEffect, useRef } from "react";

import { segmentedControl } from "./index.js";

export function SegmentedPill({
  items,
  value,
  defaultValue,
  animated = false,
  onValueChange,
  className = "",
  ...attributes
}) {
  const rootRef = useRef(null);
  const controlRef = useRef(null);
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const itemSignature = JSON.stringify(
    items.map((item) => [item.value, Boolean(item.disabled)]),
  );

  useLayoutEffect(() => {
    const control = segmentedControl(rootRef.current, {
      value: value ?? defaultValue,
      animated,
      onChange(nextValue) {
        onValueChangeRef.current?.(nextValue);
      },
    });
    controlRef.current = control;

    return () => {
      control.destroy();
      controlRef.current = null;
    };
  }, [itemSignature, animated, defaultValue]);

  useLayoutEffect(() => {
    const control = controlRef.current;
    if (value !== undefined && control && control.value !== value) {
      control.set(value);
    }
  }, [value, itemSignature, animated]);

  const classes = ["segmented-control", className].filter(Boolean).join(" ");

  return createElement(
    "div",
    { ...attributes, className: classes, ref: rootRef },
    items.map((item) => createElement(
      "button",
      {
        key: item.value,
        type: "button",
        "data-value": item.value,
        disabled: item.disabled,
      },
      item.label,
    )),
  );
}
