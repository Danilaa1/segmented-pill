export interface SegmentedControlOptions {
  value?: string;
  animated?: boolean;
  onChange?: (value: string) => void;
}

export interface SegmentedControlController {
  readonly value: string;
  set(value: string): void;
  destroy(): void;
}

export declare function segmentedControl(
  root: Element,
  options?: SegmentedControlOptions,
): SegmentedControlController;
