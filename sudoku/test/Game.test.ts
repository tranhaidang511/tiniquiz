import { expect, test, describe, beforeEach } from "vitest";
import { Game } from "../Game";

describe("Sudoku Game Logic", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  test("Initial board should be empty", () => {
    const board = game.getBoard();
    expect(board.length).toBe(9);
    expect(board[0].length).toBe(9);
    board.forEach((row) => {
      row.forEach((cell) => {
        expect(cell.value).toBeNull();
      });
    });
  });

  test("Difficulty should change number of removed cells", () => {
    game.setDifficulty("BEGINNER");
    const countBeginner = (game as any).getCellsToRemove();

    game.setDifficulty("EXPERT");
    const countExpert = (game as any).getCellsToRemove();

    expect(countExpert).toBeGreaterThan(countBeginner);
  });

  test("isValidPlacement should correctly identify conflicts", () => {
    // Force a simple board state
    (game as any).initializeEmptyBoard();
    (game as any).board[0][0].value = 5;

    // Row conflict
    expect((game as any).isValidPlacement(0, 5, 5)).toBe(false);
    // Column conflict
    expect((game as any).isValidPlacement(5, 0, 5)).toBe(false);
    // Box conflict (0,0 is in first 3x3 box)
    expect((game as any).isValidPlacement(1, 1, 5)).toBe(false);

    // Valid placement
    expect((game as any).isValidPlacement(5, 5, 5)).toBe(true);
  });

  test("Mistake tracking", () => {
    game.start(); // Generates a puzzle
    const initialMistakes = game.getMistakes();

    // Find a cell that is not fixed and try to enter a wrong number
    const board = game.getBoard();
    const solution = (game as any).solution;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isFixed) {
          const correctValue = solution[r][c];
          const wrongValue = correctValue === 9 ? 1 : correctValue + 1;

          game.selectCell(r, c);
          game.enterNumber(wrongValue);

          expect(game.getMistakes()).toBe(initialMistakes + 1);
          return;
        }
      }
    }
  });

  test("Hint logic", () => {
    game.start();
    const initialHints = game.getHintsUsed();
    const board = game.getBoard();

    // Find a non-fixed cell
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isFixed) {
          game.selectCell(r, c);
          game.getHint();
          expect(game.getHintsUsed()).toBe(initialHints + 1);
          return;
        }
      }
    }
  });
});
