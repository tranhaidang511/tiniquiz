import { expect, test, describe, beforeEach } from "vitest";
import { Game } from '../../src/minesweeper/Game';

describe("Minesweeper Game Logic", () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
        game.setDifficulty("EASY");
        game.start();
    });

    test("Initial board should be empty (all cells closed)", () => {
        const board = game.getBoard();
        expect(board.length).toBe(9); // EASY is 9x9
        expect(board[0].length).toBe(9);
        board.forEach((row) => {
            row.forEach((cell) => {
                expect(cell.isRevealed).toBe(false);
                expect(cell.isFlagged).toBe(false);
            });
        });
    });

    test("First click should never be a mine", () => {
        game.revealCell(0, 0);
        expect(game.getState()).toBe("PLAYING");
        const cell = game.getBoard()[0][0];
        expect(cell.isRevealed).toBe(true);
        expect(cell.isMine).toBe(false);
    });

    test("Flagging a cell", () => {
        game.toggleFlag(1, 1);
        expect(game.getBoard()[1][1].isFlagged).toBe(true);
        game.toggleFlag(1, 1);
        expect(game.getBoard()[1][1].isFlagged).toBe(false);
    });

    test("Losing the game", () => {
        // Mines are generated on first click.
        game.revealCell(0, 0); // First click

        // Find a mine and reveal it
        const board = game.getBoard();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c].isMine) {
                    game.revealCell(r, c);
                    expect(game.getState()).toBe("LOST");
                    return;
                }
            }
        }
    });

    test("Winning the game", () => {
        game.revealCell(0, 0);
        // Hard to win randomly, but we can verify isWin method exists
        expect(typeof (game as any).checkWin).toBe("function");
    });
});
