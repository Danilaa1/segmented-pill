import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readOptional(path) {
  const absolutePath = resolve(path);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

function readJsonOptional(path) {
  const source = readOptional(path);
  return source ? JSON.parse(source) : null;
}

const registry = readJsonOptional("registry.json");
const wrapper = readOptional("registry/segmented-pill.tsx");
const vercelConfig = readJsonOptional("vercel.json");
const packageJson = readJsonOptional("package.json");
const gitignore = readOptional(".gitignore");
const readme = readOptional("README.md");
const viteConfig = readOptional("vite.config.js");

describe("hosted shadcn registry", () => {
  it("defines one npm-backed segmented-pill UI item", () => {
    expect(registry).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "segmented-pill",
      homepage: "https://github.com/Danilaa1/segmented-pill",
      items: [
        {
          name: "segmented-pill",
          type: "registry:ui",
          title: "Segmented Pill",
          dependencies: ["segmented-pill@^0.1.3"],
          files: [
            {
              path: "registry/segmented-pill.tsx",
              type: "registry:ui",
              target: "@ui/segmented-pill.tsx",
            },
          ],
        },
      ],
    });
    expect(registry.items).toHaveLength(1);
  });

  it("keeps npm as the React implementation source", () => {
    expect(wrapper).toContain('import "segmented-pill/style.css"');
    expect(wrapper).toContain('from "segmented-pill/react"');
    expect(wrapper).toContain("SegmentedPillProps");
    expect(wrapper).not.toContain("function SegmentedPill");
  });

  it("builds static registry payloads for Vercel", () => {
    expect(packageJson.devDependencies.shadcn).toBe("4.11.0");
    expect(packageJson.scripts["registry:validate"]).toBe("shadcn registry validate");
    expect(packageJson.scripts["registry:build"]).toBe("shadcn build");
    expect(packageJson.scripts.check).toContain("npm run registry:validate");
    expect(vercelConfig).toEqual({
      $schema: "https://openapi.vercel.sh/vercel.json",
      buildCommand: "npm run registry:build",
      outputDirectory: "public",
    });
    expect(gitignore).toContain("/public/r/");
    expect(gitignore).toContain("/.vercel/");
  });

  it("keeps generated registry payloads out of the library build", () => {
    expect(viteConfig).toContain("copyPublicDir: false");
  });

  it("documents the optional hosted React install path", () => {
    expect(readme).toContain("## shadcn registry (React)");
    expect(readme).toContain(
      "npx shadcn@latest registry add @segmented-pill=https://segmented-pill.vercel.app/r/{name}.json",
    );
    expect(readme).toContain(
      "npx shadcn@latest add @segmented-pill/segmented-pill",
    );
    expect(readme).toContain("npm remains the source of updates");
  });
});
