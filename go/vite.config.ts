import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
    root: 'go',
    base: '/go/',
    plugins: [viteSingleFile()],
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});
