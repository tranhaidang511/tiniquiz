import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/sliding/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/sliding",
    emptyOutDir: true,
  },
});
