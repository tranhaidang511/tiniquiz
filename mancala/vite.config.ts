import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: "mancala",
  base: "/mancala/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../dist/mancala",
    emptyOutDir: true,
  },
});
