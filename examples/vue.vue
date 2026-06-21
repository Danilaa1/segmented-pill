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
