import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/minesweeper/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/minesweeper",
    emptyOutDir: true,
  },
});
