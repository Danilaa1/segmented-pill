import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        react: "src/react.js",
        vue: "src/vue.js",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "vue"],
      output: {
        chunkFileNames: "core-[hash].js",
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
