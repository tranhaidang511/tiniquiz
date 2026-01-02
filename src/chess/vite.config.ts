import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/chess/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/chess",
    emptyOutDir: true,
  },
});
