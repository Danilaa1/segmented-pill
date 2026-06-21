import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { segmentedControl } from "../src/index.js";

function render(markup = `
  <button type="button" data-value="vanilla">Vanilla</button>
  <button type="button" data-value="react">React</button>
  <button type="button" data-value="vue">Vue</button>
`) {
  document.body.innerHTML = `<div class="segmented-control" aria-label="Framework">${markup}</div>`;
  return document.querySelector(".segmented-control");
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("segmentedControl initialization", () => {
  it("selects the first enabled item and creates accessible tab state", () => {
    const root = render();
    const control = segmentedControl(root);
    const items = [...root.querySelectorAll("button")];

    expect(control.value).toBe("vanilla");
    expect(root.getAttribute("role")).toBe("tablist");
    expect(items.map((item) => item.getAttribute("role"))).toEqual(["tab", "tab", "tab"]);
    expect(items.map((item) => item.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
    expect(items.map((item) => item.tabIndex)).toEqual([0, -1, -1]);
    expect(items[0].classList.contains("is-active")).toBe(true);
  });

  it("uses an explicit initial value", () => {
    const root = render();
    const control = segmentedControl(root, { value: "vue" });

    expect(control.value).toBe("vue");
    expect(root.querySelector('[data-value="vue"]').getAttribute("aria-selected")).toBe("true");
  });

  it("skips disabled items when choosing the fallback", () => {
    const root = render(`
      <button type="button" data-value="vanilla" disabled>Vanilla</button>
      <button type="button" data-value="react">React</button>
    `);

    expect(segmentedControl(root).value).toBe("react");
  });

  it.each([
    [null, "root must be an Element"],
    ["empty root", "at least one button"],
    ["missing value", "data-value"],
    ["duplicate value", "unique"],
    ["all disabled", "enabled button"],
    ["unknown initial value", 'Unknown segmented control value "missing"'],
    ["disabled initial value", 'Cannot select disabled value "vanilla"'],
  ])("rejects %s", (caseName, message) => {
    let root;
    let options;

    if (caseName === "empty root") root = render("");
    if (caseName === "missing value") root = render('<button type="button">Vanilla</button>');
    if (caseName === "duplicate value") {
      root = render(`
        <button type="button" data-value="same">One</button>
        <button type="button" data-value="same">Two</button>
      `);
    }
    if (caseName === "all disabled") {
      root = render('<button type="button" data-value="vanilla" disabled>Vanilla</button>');
    }
    if (caseName === "unknown initial value") {
      root = render();
      options = { value: "missing" };
    }
    if (caseName === "disabled initial value") {
      root = render(`
        <button type="button" data-value="vanilla" disabled>Vanilla</button>
        <button type="button" data-value="react">React</button>
      `);
      options = { value: "vanilla" };
    }

    expect(() => segmentedControl(root, options)).toThrow(message);
  });
});

describe("segmentedControl interactions", () => {
  it("selects clicked items and notifies only when the value changes", () => {
    const root = render();
    const changes = [];
    const control = segmentedControl(root, { onChange: (value) => changes.push(value) });
    const react = root.querySelector('[data-value="react"]');

    react.click();
    react.click();

    expect(control.value).toBe("react");
    expect(changes).toEqual(["react"]);
    expect(react.getAttribute("aria-selected")).toBe("true");
  });

  it("sets a value programmatically without notifying", () => {
    const root = render();
    const changes = [];
    const control = segmentedControl(root, { onChange: (value) => changes.push(value) });

    control.set("vue");

    expect(control.value).toBe("vue");
    expect(changes).toEqual([]);
  });

  it("moves, selects, focuses, and wraps with arrow keys", () => {
    const root = render();
    const control = segmentedControl(root);
    const vanilla = root.querySelector('[data-value="vanilla"]');
    const vue = root.querySelector('[data-value="vue"]');

    vanilla.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(control.value).toBe("vue");
    expect(document.activeElement).toBe(vue);

    vue.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(control.value).toBe("vanilla");
    expect(document.activeElement).toBe(vanilla);
  });

  it("uses Home and End and skips disabled items", () => {
    const root = render(`
      <button type="button" data-value="vanilla">Vanilla</button>
      <button type="button" data-value="react" disabled>React</button>
      <button type="button" data-value="vue">Vue</button>
    `);
    const control = segmentedControl(root);
    const vanilla = root.querySelector('[data-value="vanilla"]');
    const vue = root.querySelector('[data-value="vue"]');

    vanilla.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(control.value).toBe("vue");

    vue.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(control.value).toBe("vanilla");

    vanilla.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(control.value).toBe("vue");
  });

  it("selects a separately focused item with Enter or Space", () => {
    const root = render();
    const control = segmentedControl(root);
    const react = root.querySelector('[data-value="react"]');
    const vue = root.querySelector('[data-value="vue"]');

    react.focus();
    react.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(control.value).toBe("react");

    vue.focus();
    vue.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(control.value).toBe("vue");
  });

  it("rejects unknown and disabled programmatic values", () => {
    const root = render(`
      <button type="button" data-value="vanilla">Vanilla</button>
      <button type="button" data-value="react" disabled>React</button>
    `);
    const control = segmentedControl(root);

    expect(() => control.set("missing")).toThrow('Unknown segmented control value "missing"');
    expect(() => control.set("react")).toThrow('Cannot select disabled value "react"');
  });
});

describe("segmentedControl indicator and cleanup", () => {
  it("creates a static pill by default and opts into animation", () => {
    const staticRoot = render();
    segmentedControl(staticRoot);

    expect(staticRoot.querySelector(".segmented-control__indicator").getAttribute("aria-hidden")).toBe("true");
    expect(staticRoot.classList.contains("is-animated")).toBe(false);

    const animatedRoot = render();
    segmentedControl(animatedRoot, { animated: true });

    expect(animatedRoot.classList.contains("is-animated")).toBe(true);
  });

  it("positions the pill from the active item bounds and updates after selection", () => {
    const root = render();
    const vanilla = root.querySelector('[data-value="vanilla"]');
    const vue = root.querySelector('[data-value="vue"]');
    root.getBoundingClientRect = () => ({ left: 10, top: 20 });
    vanilla.getBoundingClientRect = () => ({ left: 12, top: 22, width: 70, height: 30 });
    vue.getBoundingClientRect = () => ({ left: 170, top: 22, width: 52, height: 30 });

    segmentedControl(root);
    const indicator = root.querySelector(".segmented-control__indicator");
    expect(indicator.style.transform).toBe("translate3d(2px, 2px, 0)");
    expect(indicator.style.width).toBe("70px");

    vue.click();
    expect(indicator.style.transform).toBe("translate3d(160px, 2px, 0)");
    expect(indicator.style.width).toBe("52px");
  });

  it("updates pill position on window resize when ResizeObserver is unavailable", () => {
    const root = render();
    const vanilla = root.querySelector('[data-value="vanilla"]');
    let left = 12;
    root.getBoundingClientRect = () => ({ left: 10, top: 20 });
    vanilla.getBoundingClientRect = () => ({ left, top: 22, width: 70, height: 30 });

    segmentedControl(root);
    const indicator = root.querySelector(".segmented-control__indicator");
    left = 42;
    window.dispatchEvent(new Event("resize"));

    expect(indicator.style.transform).toBe("translate3d(32px, 2px, 0)");
  });

  it("removes generated state and listeners on destroy", () => {
    const root = render();
    const react = root.querySelector('[data-value="react"]');
    const control = segmentedControl(root, { animated: true });

    control.destroy();
    control.destroy();
    react.click();

    expect(control.value).toBe("vanilla");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.classList.contains("is-animated")).toBe(false);
    expect(root.querySelector(".segmented-control__indicator")).toBeNull();
    expect([...root.querySelectorAll("button")].every((item) => {
      return !item.hasAttribute("role")
        && !item.hasAttribute("aria-selected")
        && !item.hasAttribute("tabindex")
        && !item.classList.contains("is-active");
    })).toBe(true);
  });

  it("adds a restrained squash while an animated pill moves", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const root = render();
    segmentedControl(root, { animated: true });
    const indicator = root.querySelector(".segmented-control__indicator");
    const cancel = vi.fn();
    indicator.animate = vi.fn(() => ({ cancel }));

    root.querySelector('[data-value="react"]').click();
    root.querySelector('[data-value="vue"]').click();

    expect(indicator.animate).toHaveBeenCalledWith(
      [
        { scale: "1 1" },
        { scale: "1.07 0.93", offset: 0.55 },
        { scale: "1 1" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      },
    );
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("does not squash when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const root = render();
    segmentedControl(root, { animated: true });
    const indicator = root.querySelector(".segmented-control__indicator");
    indicator.animate = vi.fn();

    root.querySelector('[data-value="react"]').click();

    expect(indicator.animate).not.toHaveBeenCalled();
  });
});

describe("segmented control stylesheet", () => {
  it("ships the component, indicator, focus, animation, and reduced-motion contract", () => {
    const stylesheetPath = resolve("src/style.css");
    expect(existsSync(stylesheetPath)).toBe(true);
    const css = readFileSync(stylesheetPath, "utf8");

    expect(css).toContain(".segmented-control");
    expect(css).toContain(".segmented-control__indicator");
    expect(css).toContain(":focus-visible");
    expect(css).toContain(".segmented-control.is-animated");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toContain("transition: all");
  });

  it("preserves the compact landing-page geometry", () => {
    const css = readFileSync(resolve("src/style.css"), "utf8");

    expect(css).toContain("--segmented-radius: 8px");
    expect(css).toContain("--segmented-padding: 2px");
    expect(css).toContain("font-size: 11.5px");
    expect(css).toContain("padding: 5px 10px");
    expect(css).not.toContain("min-height: 40px");
  });

  it("uses an overridable Geist-first stack with tight tracking", () => {
    const css = readFileSync(resolve("src/style.css"), "utf8");

    expect(css).toContain('--segmented-font-family: "Geist", "Geist Variable", ui-sans-serif, system-ui');
    expect(css).toContain("font-family: var(--segmented-font-family)");
    expect(css).toContain("letter-spacing: -0.02em");
  });
});
