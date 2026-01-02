import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/othello/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/othello",
    emptyOutDir: true,
  },
});
