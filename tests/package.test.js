import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const readme = readFileSync(resolve("README.md"), "utf8");

describe("public package surface", () => {
  it("exposes React and Vue without a public Vanilla entry", () => {
    expect(packageJson.main).toBeUndefined();
    expect(packageJson.types).toBeUndefined();
    expect(packageJson.exports["."]).toBeUndefined();
    expect(Object.keys(packageJson.exports)).toEqual([
      "./react",
      "./vue",
      "./style.css",
    ]);
    expect(packageJson.files).not.toContain("examples");
    expect(packageJson.keywords).not.toContain("vanilla-js");
  });

  it("documents only the React and Vue APIs", () => {
    expect(readme).toContain('from "segmented-pill/react"');
    expect(readme).toContain('from "segmented-pill/vue"');
    expect(readme).not.toContain("Vanilla");
    expect(readme).not.toContain("segmentedControl(");
  });

  it("shows focused project badges without unpublished npm claims", () => {
    expect(readme).toContain("img.shields.io/badge/React");
    expect(readme).toContain("img.shields.io/badge/Vue");
    expect(readme).toContain("img.shields.io/badge/Accessible");
    expect(readme).toContain("img.shields.io/badge/License-MIT");
    expect(readme).not.toContain("npm/v/segmented-pill");
  });

  it("keeps font installation optional and shows arbitrary content switching", () => {
    expect(readme).toContain("npm install segmented-pill");
    expect(readme).toContain("pnpm add segmented-pill");
    expect(readme).toContain("bun add segmented-pill");
    expect(readme).not.toContain("npm install segmented-pill @fontsource-variable/geist");
    expect(readme).toContain('value === "overview"');
    expect(readme).toContain("v-if=\"value === 'overview'\"");
  });
});
