import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedPill } from "../src/vue.js";

const items = [
  { value: "vanilla", label: "Vanilla" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue", disabled: true },
];

let wrapper;

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
});

describe("SegmentedPill Vue wrapper", () => {
  it("renders items and initializes the core controller", () => {
    wrapper = mount(SegmentedPill, {
      props: { items, modelValue: "react", animated: true },
      attrs: { "aria-label": "Framework" },
      attachTo: document.body,
    });

    expect(wrapper.findAll("button").map((button) => button.text())).toEqual(["Vanilla", "React", "Vue"]);
    expect(wrapper.attributes("aria-label")).toBe("Framework");
    expect(wrapper.classes()).toContain("is-animated");
    expect(wrapper.get('[data-value="react"]').attributes("aria-selected")).toBe("true");
    expect(wrapper.get('[data-value="vue"]').attributes()).toHaveProperty("disabled");
  });

  it("emits user changes and follows modelValue updates", async () => {
    wrapper = mount(SegmentedPill, {
      props: { items, modelValue: "vanilla" },
      attachTo: document.body,
    });

    await wrapper.get('[data-value="react"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([["react"]]);
    expect(wrapper.emitted("change")).toEqual([["react"]]);

    await wrapper.setProps({ modelValue: "react" });
    expect(wrapper.get('[data-value="react"]').attributes("aria-selected")).toBe("true");
  });

  it("cleans up the core controller on unmount", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");
    wrapper = mount(SegmentedPill, { props: { items }, attachTo: document.body });

    wrapper.unmount();
    wrapper = undefined;

    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
    removeListener.mockRestore();
  });
});
