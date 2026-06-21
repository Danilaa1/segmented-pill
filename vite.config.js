import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.js",
        react: "src/react.js",
        vue: "src/vue.js",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "vue"],
    },
  },
  test: {
    environment: "jsdom",
  },
});
