import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: ".",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                minesweeper: resolve(__dirname, "minesweeper/index.html"),
                sudoku: resolve(__dirname, "sudoku/index.html"),
                sliding: resolve(__dirname, "sliding/index.html"),
                gomoku: resolve(__dirname, "gomoku/index.html"),
                mancala: resolve(__dirname, "mancala/index.html"),
                othello: resolve(__dirname, "othello/index.html"),
                checkers: resolve(__dirname, "checkers/index.html"),
                chess: resolve(__dirname, "chess/index.html"),
                xiangqi: resolve(__dirname, "xiangqi/index.html"),
                go: resolve(__dirname, "go/index.html"),
                geogame: resolve(__dirname, "geogame/index.html"),
            },
        },
    },
    server: {
        open: "/index.html",
    },
});
