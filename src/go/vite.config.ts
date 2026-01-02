import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/go/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/go",
    emptyOutDir: true,
  },
});
