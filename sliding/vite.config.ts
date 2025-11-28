import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    root: 'sliding',
    base: '/sliding/',
    plugins: [viteSingleFile()],
    build: {
        outDir: './dist',
        emptyOutDir: true,
    }
});
