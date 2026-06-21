import type { HTMLAttributes, ReactNode } from "react";

export interface SegmentedPillItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedPillProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items: readonly SegmentedPillItem[];
  value?: string;
  defaultValue?: string;
  animated?: boolean;
  onValueChange?: (value: string) => void;
}

export declare function SegmentedPill(props: SegmentedPillProps): ReactNode;
