import { expect, test, describe, beforeEach } from "vitest";
import { ChessGame } from "../Game";

describe("Chess Game Logic", () => {
  let game: ChessGame;

  beforeEach(() => {
    game = new ChessGame();
    game.start();
  });

  test("Initial board setup should be correct", () => {
    const board = game.getBoard();
    expect(board[0][0]?.type).toBe("ROOK");
    expect(board[0][0]?.player).toBe("BLACK");
    expect(board[7][0]?.type).toBe("ROOK");
    expect(board[7][0]?.player).toBe("WHITE");
    expect(board[1][0]?.type).toBe("PAWN");
    expect(board[6][0]?.type).toBe("PAWN");
  });

  test("Valid pawn opening move", () => {
    game.selectPiece(6, 4); // White King's Pawn
    const success = game.makeMove(4, 4);
    expect(success).toBe(true);
    expect(game.getBoard()[4][4]?.type).toBe("PAWN");
    expect(game.getCurrentPlayer()).toBe("BLACK");
  });

  test("Invalid move (blocked by same player)", () => {
    game.selectPiece(7, 0); // White Rook
    const success = game.makeMove(6, 0); // Blocked by pawn
    expect(success).toBe(false);
  });

  test("Knight jump move", () => {
    game.selectPiece(7, 1); // White Knight
    const success = game.makeMove(5, 2);
    expect(success).toBe(true);
    expect(game.getBoard()[5][2]?.type).toBe("KNIGHT");
  });

  test("Capture logic", () => {
    // Manually place pieces for a capture
    (game as any).board[4][4] = { type: "PAWN", player: "WHITE", row: 4, col: 4, hasMoved: true };
    (game as any).board[3][4] = { type: "PAWN", player: "BLACK", row: 3, col: 4, hasMoved: true };

    // It's White's turn, but pawn can't capture forward.
    // Let's place it diagonally.
    (game as any).board[3][5] = { type: "PAWN", player: "BLACK", row: 3, col: 5, hasMoved: true };

    game.selectPiece(4, 4);
    const success = game.makeMove(3, 5);
    expect(success).toBe(true);
    expect(game.getBoard()[3][5]?.player).toBe("WHITE");
  });

  test("Check detection", () => {
    // Clear board and place kings + an attacking piece
    (game as any).board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    (game as any).board[0][0] = { type: "KING", player: "BLACK", row: 0, col: 0, hasMoved: false };
    (game as any).board[7][7] = { type: "KING", player: "WHITE", row: 7, col: 7, hasMoved: false };
    (game as any).board[0][7] = { type: "ROOK", player: "WHITE", row: 0, col: 7, hasMoved: true };

    expect(game.isInCheck("BLACK")).toBe(true);
    expect(game.isInCheck("WHITE")).toBe(false);
  });
});
