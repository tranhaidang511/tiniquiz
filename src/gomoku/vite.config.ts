import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/gomoku/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/gomoku",
    emptyOutDir: true,
  },
});
