import { expect, test, describe, beforeEach } from "vitest";
import { CheckersGame } from "../../src/checkers/Game";

describe("Checkers Game Logic", () => {
  let game: CheckersGame;

  beforeEach(() => {
    game = new CheckersGame();
    game.setBoardSize(8);
    game.start();
  });

  test("Initial board setup should have 12 pieces per player", () => {
    const board = game.getBoard();
    let redCount = 0;
    let blackCount = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell?.player === "RED") redCount++;
        if (cell?.player === "BLACK") blackCount++;
      });
    });
    expect(redCount).toBe(12);
    expect(blackCount).toBe(12);
  });

  test("Basic diagonal move", () => {
    // Red piece at (5, 0) can move to (4, 1)
    game.selectPiece(5, 0);
    const success = game.makeMove(4, 1);
    expect(success).toBe(true);
    expect(game.getBoard()[5][0]).toBeNull();
    expect(game.getBoard()[4][1]?.player).toBe("RED");
    expect(game.getCurrentPlayer()).toBe("BLACK");
  });

  test("Mandatory jump rule", () => {
    // Setup a jump scenario
    // Red: (5, 0). Black: (4, 1).
    // Red must jump to (3, 2).
    (game as any).board[4][1] = { player: "BLACK", type: "REGULAR", row: 4, col: 1 };
    (game as any).board[3][2] = null;

    game.selectPiece(5, 0);
    const moves = game.getValidMoves();
    expect(moves.length).toBe(1);
    expect(moves[0].to.row).toBe(3);
    expect(moves[0].to.col).toBe(2);
    expect(moves[0].captures?.length).toBe(1);
  });

  test("King promotion", () => {
    // Move Red piece to row 0
    (game as any).board[1][0] = { player: "RED", type: "REGULAR", row: 1, col: 0 };
    (game as any).board[0][1] = null; // Target

    game.selectPiece(1, 0);
    game.makeMove(0, 1);

    const piece = game.getBoard()[0][1];
    expect(piece?.type).toBe("KING");
  });
});
