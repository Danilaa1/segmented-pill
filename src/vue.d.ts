import type { DefineComponent } from "vue";

export interface SegmentedPillItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedPillProps {
  items: readonly SegmentedPillItem[];
  modelValue?: string;
  defaultValue?: string;
  animated?: boolean;
}

export declare const SegmentedPill: DefineComponent<SegmentedPillProps>;
