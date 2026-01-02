import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                minesweeper: resolve(__dirname, "src/minesweeper/index.html"),
                sudoku: resolve(__dirname, "src/sudoku/index.html"),
                sliding: resolve(__dirname, "src/sliding/index.html"),
                gomoku: resolve(__dirname, "src/gomoku/index.html"),
                mancala: resolve(__dirname, "src/mancala/index.html"),
                othello: resolve(__dirname, "src/othello/index.html"),
                checkers: resolve(__dirname, "src/checkers/index.html"),
                chess: resolve(__dirname, "src/chess/index.html"),
                xiangqi: resolve(__dirname, "src/xiangqi/index.html"),
                go: resolve(__dirname, "src/go/index.html"),
                geogame: resolve(__dirname, "src/geogame/index.html"),
            },
        },
    },
    server: {
        open: "/index.html",
    },
});
