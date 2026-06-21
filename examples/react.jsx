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
