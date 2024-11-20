import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    root: "src",
    build: {
      outDir: "../dist",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/background.ts"),
          popup: resolve(__dirname, "src/popup.ts"),
        },
        output: {
          entryFileNames: "[name].js",
        },
      },
    },
  };
});
