import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    root: 'minesweeper',
    base: '/minesweeper/',
    plugins: [viteSingleFile()],
    build: {
        outDir: './dist',
        emptyOutDir: true,
    }
});
