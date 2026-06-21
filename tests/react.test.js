import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedPill } from "../src/react.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const items = [
  { value: "vanilla", label: "Vanilla" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue", disabled: true },
];

let mountedRoot;
let container;

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot.unmount());
  mountedRoot = undefined;
  container?.remove();
  container = undefined;
});

function render(props) {
  container = document.createElement("div");
  document.body.append(container);
  mountedRoot = createRoot(container);
  act(() => {
    mountedRoot.render(createElement(SegmentedPill, {
      items,
      "aria-label": "Framework",
      ...props,
    }));
  });
  return container.querySelector(".segmented-control");
}

describe("SegmentedPill React wrapper", () => {
  it("renders items and initializes the core controller", () => {
    const root = render({ value: "react", animated: true });
    const buttons = [...root.querySelectorAll("button")];

    expect(buttons.map((button) => button.textContent)).toEqual(["Vanilla", "React", "Vue"]);
    expect(root.getAttribute("aria-label")).toBe("Framework");
    expect(root.classList.contains("is-animated")).toBe(true);
    expect(root.querySelector('[data-value="react"]').getAttribute("aria-selected")).toBe("true");
    expect(root.querySelector('[data-value="vue"]').disabled).toBe(true);
  });

  it("reports user changes and follows value updates", () => {
    const onValueChange = vi.fn();
    const root = render({ value: "vanilla", onValueChange });

    act(() => root.querySelector('[data-value="react"]').click());
    expect(onValueChange).toHaveBeenCalledWith("react");

    act(() => {
      mountedRoot.render(createElement(SegmentedPill, {
        items,
        value: "react",
        onValueChange,
        "aria-label": "Framework",
      }));
    });
    expect(root.querySelector('[data-value="react"]').getAttribute("aria-selected")).toBe("true");
  });

  it("cleans up the core controller on unmount", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");
    render({ value: "vanilla" });

    act(() => mountedRoot.unmount());
    mountedRoot = undefined;

    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
    removeListener.mockRestore();
  });
});
