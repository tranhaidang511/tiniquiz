import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/checkers/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/checkers",
    emptyOutDir: true,
  },
});
