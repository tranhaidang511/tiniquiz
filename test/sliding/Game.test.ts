import { expect, test, describe, beforeEach } from "vitest";
import { Game } from '../../src/sliding/Game';

describe("Sliding Puzzle Game Logic", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.setBoardSize(3);
  });

  test("Game should set correct board size", () => {
    game.setBoardSize(4);
    expect(game.getBoardSize()).toBe(4);
  });

  test("Board should have correct length and content after starting", () => {
    game.start();
    const board = game.getBoard();
    expect(board.length).toBe(9); // 3x3
    const nullCount = board.filter((cell) => cell === null).length;
    expect(nullCount).toBe(1);
  });

  test("getValidMoves should return correct indices for the empty space", () => {
    // Mock a simple state where empty is at center (index 4 in 3x3)
    // [1, 2, 3]
    // [4, null, 6]
    // [7, 8, 5]
    // We can't easily force a state without private access,
    // but we can check the boundary conditions of the logic.

    game.start(); // Random shuffle
    const emptyIndex = game.getEmptyIndex();
    const validMoves = (game as any).getValidMoves(); // Access private for deep testing

    // Center (index 4) should have 4 moves
    // Corners (0, 2, 6, 8) should have 2 moves
    // Edges (1, 3, 5, 7) should have 3 moves

    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    let expectedCount = 4;
    if ((row === 0 || row === 2) && (col === 0 || col === 2)) expectedCount = 2;
    else if (row === 0 || row === 2 || col === 0 || col === 2) expectedCount = 3;

    expect(validMoves.length).toBe(expectedCount);
  });

  test("makeMove should update state correctly", () => {
    game.start();
    const initialMoves = game.getMoves();
    const validMoves = (game as any).getValidMoves();
    const moveToMake = validMoves[0];

    const success = game.makeMove(moveToMake);
    expect(success).toBe(true);
    expect(game.getMoves()).toBe(initialMoves + 1);
    expect(game.getEmptyIndex()).toBe(moveToMake);
  });

  test("checkWin should detect solved state", () => {
    game.start();
    // Since shuffle is random, we can't easily win.
    // Let's manually set the board to a near-win state.

    const size = 3;
    (game as any).boardSize = size;
    (game as any).board = [1, 2, 3, 4, 5, 6, 7, null, 8];
    (game as any).emptyIndex = 7;
    (game as any).state = "PLAYING";

    // Move 8 to the end to win
    game.makeMove(8);

    expect(game.getState()).toBe("WON");
  });
});
