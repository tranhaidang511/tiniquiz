import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    root: 'sudoku',
    base: '/sudoku/',
    plugins: [viteSingleFile()],
    build: {
        outDir: './dist',
        emptyOutDir: true,
    }
});
