import { expect, test, describe, beforeEach } from "vitest";
import { Game } from '../../src/gomoku/Game';

describe("Gomoku Game Logic", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.setBoardSize(15);
    game.start();
  });

  test("Initial board state should be empty", () => {
    const board = game.getBoard();
    expect(board.length).toBe(15);
    expect(board[0].length).toBe(15);
    board.forEach((row) => {
      row.forEach((cell) => {
        expect(cell).toBeNull();
      });
    });
  });

  test("Players should alternate turns", () => {
    expect(game.getCurrentPlayer()).toBe("BLACK");
    game.makeMove(7, 7);
    expect(game.getCurrentPlayer()).toBe("WHITE");
    game.makeMove(7, 8);
    expect(game.getCurrentPlayer()).toBe("BLACK");
  });

  test("Move validation should prevent duplicate moves", () => {
    game.makeMove(7, 7);
    const success = game.makeMove(7, 7);
    expect(success).toBe(false);
  });

  test("Horizontal win detection", () => {
    // Black moves: (7,0), (7,1), (7,2), (7,3), (7,4)
    // White moves: (8,0), (8,1), (8,2), (8,3)
    for (let i = 0; i < 4; i++) {
      game.makeMove(7, i); // Black
      game.makeMove(8, i); // White
    }
    game.makeMove(7, 4); // Black Wins

    expect(game.getState()).toBe("RESULT");
    expect(game.getWinner()).toBe("BLACK");
  });

  test("Vertical win detection", () => {
    for (let i = 0; i < 4; i++) {
      game.makeMove(i, 7); // Black
      game.makeMove(i, 8); // White
    }
    game.makeMove(4, 7); // Black Wins

    expect(game.getState()).toBe("RESULT");
    expect(game.getWinner()).toBe("BLACK");
  });

  test("Diagonal win detection (down-right)", () => {
    for (let i = 0; i < 4; i++) {
      game.makeMove(i, i); // Black
      game.makeMove(i, i + 1); // White
    }
    game.makeMove(4, 4); // Black Wins

    expect(game.getState()).toBe("RESULT");
    expect(game.getWinner()).toBe("BLACK");
  });

  test("Diagonal win detection (up-right)", () => {
    // (10,0), (9,1), (8,2), (7,3), (6,4)
    for (let i = 0; i < 4; i++) {
      game.makeMove(10 - i, i); // Black
      game.makeMove(10 - i, i + 1); // White
    }
    game.makeMove(6, 4); // Black Wins

    expect(game.getState()).toBe("RESULT");
    expect(game.getWinner()).toBe("BLACK");
  });

  test("Draw detection", () => {
    expect(game.isDraw()).toBe(false);
  });
});
