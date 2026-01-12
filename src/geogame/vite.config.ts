import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: ".",
  base: "/geogame/",
  plugins: [viteSingleFile()],
  build: {
    outDir: "../../dist/geogame",
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
  },
});
