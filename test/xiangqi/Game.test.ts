import { expect, test, describe, beforeEach } from "vitest";
import { XiangqiGame } from "../../src/xiangqi/Game";

describe("Xiangqi Game Logic", () => {
  let game: XiangqiGame;

  beforeEach(() => {
    game = new XiangqiGame();
    game.start();
  });

  test("Initial board setup should be correct", () => {
    const board = game.getBoard();
    expect(board[0][4]?.type).toBe("GENERAL");
    expect(board[0][4]?.player).toBe("BLACK");
    expect(board[9][4]?.type).toBe("GENERAL");
    expect(board[9][4]?.player).toBe("RED");
    expect(board[0][0]?.type).toBe("CHARIOT");
  });

  test("Soldier move across river", () => {
    // RED Soldier at (6, 0)
    // 1. Move forward to (5, 0)
    game.selectPiece(6, 0);
    game.makeMove(6, 0, 5, 0);
    expect(game.getBoard()[5][0]?.type).toBe("SOLDIER");

    // 2. Move across river to (4, 0)
    // Needs to be RED's turn again (normally BLACK moves)
    (game as any).turn = "RED";
    game.selectPiece(5, 0);
    game.makeMove(5, 0, 4, 0);
    expect(game.getBoard()[4][0]?.type).toBe("SOLDIER");

    // 3. Side move should now be valid
    (game as any).turn = "RED";
    game.selectPiece(4, 0);
    const success = game.makeMove(4, 0, 4, 1);
    expect(success).toBe(true);
  });

  test("Cannon move and capture", () => {
    // Red Cannon at (7, 1)
    // Red Soldier at (6, 2)
    // Let's place a black piece at (3, 1)
    (game as any).board[3][1] = { type: "CHARIOT", player: "BLACK", row: 3, col: 1 };

    game.selectPiece(7, 1);
    // Move to (7, 4) shouldn't be valid if blocked?
    // Cannon moves like chariot but captures by jumping.

    // Jumping over (6, 1) - wait, (6, 1) is empty.
    // Let's place a piece to jump over.
    (game as any).board[5][1] = { type: "SOLDIER", player: "RED", row: 5, col: 1 };

    game.selectPiece(7, 1);
    const success = game.makeMove(7, 1, 3, 1); // Jump over (5,1) to capture (3,1)
    expect(success).toBe(true);
    expect(game.getBoard()[3][1]?.player).toBe("RED");
  });
});
