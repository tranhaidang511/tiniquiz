import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    root: 'geogame',
    base: '/geogame/',
    plugins: [viteSingleFile()],
    build: {
        outDir: '../docs/geogame',
        emptyOutDir: true,
    }
});
