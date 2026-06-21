import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import { segmentedControl } from "./index.js";

export const SegmentedPill = defineComponent({
  name: "SegmentedPill",
  inheritAttrs: false,
  props: {
    items: { type: Array, required: true },
    modelValue: String,
    defaultValue: String,
    animated: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { attrs, emit }) {
    const root = ref(null);
    let control;

    function initialize() {
      control?.destroy();
      control = segmentedControl(root.value, {
        value: props.modelValue ?? props.defaultValue,
        animated: props.animated,
        onChange(value) {
          emit("update:modelValue", value);
          emit("change", value);
        },
      });
    }

    onMounted(initialize);
    onBeforeUnmount(() => control?.destroy());

    watch(() => props.modelValue, (value) => {
      if (value !== undefined && control && control.value !== value) {
        control.set(value);
      }
    });

    watch([() => props.items, () => props.animated], async () => {
      await nextTick();
      initialize();
    }, { deep: true });

    return () => h(
      "div",
      {
        ...attrs,
        ref: root,
        class: ["segmented-control", attrs.class],
      },
      props.items.map((item) => h(
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
  },
});
