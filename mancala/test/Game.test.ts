import { expect, test, describe, beforeEach } from "vitest";
import { MancalaGame } from "../Game";

describe("Mancala Game Logic", () => {
  let game: MancalaGame;

  beforeEach(() => {
    game = new MancalaGame();
    game.setPitCount(6);
    game.setInitialStones(4);
    game.start();
  });

  test("Initial board should have 4 stones in each pit and 0 in stores", () => {
    // [P1-0, P1-1, P1-2, P1-3, P1-4, P1-5, S1, P2-0, P2-1, P2-2, P2-3, P2-4, P2-5, S2]
    // Total 14 pits for 6 pits/player
    const board = game.getBoard();
    expect(board.length).toBe(14);
    for (let i = 0; i < 6; i++) {
      expect(board[i]).toBe(4); // Player 1 pits
      expect(board[7 + i]).toBe(4); // Player 2 pits
    }
    expect(board[6]).toBe(0); // Store 1
    expect(board[13]).toBe(0); // Store 2
  });

  test("Basic move and sowing", () => {
    // Player 1 moves pit 0 (4 stones)
    // Stones go to pit 1, 2, 3, 4
    game.makeMove(0);
    const board = game.getBoard();
    expect(board[0]).toBe(0);
    expect(board[1]).toBe(5);
    expect(board[2]).toBe(5);
    expect(board[3]).toBe(5);
    expect(board[4]).toBe(5);
    expect(game.getCurrentPlayer()).toBe("PLAYER2");
  });

  test("Extra turn when landing in store", () => {
    // Player 1 moves pit 2 (index 2)
    // 4 stones go to: 3, 4, 5, 6 (store)
    game.makeMove(2);
    expect(game.getBoard()[6]).toBe(1);
    expect(game.getCurrentPlayer()).toBe("PLAYER1"); // Extra turn
  });

  test("Capturing stones", () => {
    // Setup a capture scenario
    // [0, 1, 2, 3, 4, 5, S, 7, 8, 9, 10, 11, 12, S]
    // Manually set board state
    (game as any).board = [1, 0, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
    // Player 1 moves pit 0 -> lands in pit 1 (empty), opposite is pit 11 (index 7 + (6 - 1 - 1) = 11)
    // Wait, getOppositeIndex(1) for 6 pits:
    // P1 pits: 0-5. P2 pits: 7-12.
    // Opposite of 1 is 11.

    game.makeMove(0);
    expect(game.getBoard()[1]).toBe(0); // Pit 1 emptied by capture
    expect(game.getBoard()[11]).toBe(0); // Opposite pit emptied
    expect(game.getBoard()[6]).toBeGreaterThan(0); // Store should have captured stones
  });

  test("Game end detection", () => {
    // Clear all pits for P1
    const internalBoard = (game as any).board;
    for (let i = 0; i < 6; i++) internalBoard[i] = 0;

    (game as any).checkWinCondition();
    expect(game.getState()).toBe("RESULT");
  });
});
