import { XiangqiGame } from "./Game";
import type { PieceType, Move, Player } from "./Game";

export class XiangqiAI {
  game: XiangqiGame;

  private searchDepth: number = 3;

  constructor(game: XiangqiGame) {
    this.game = game;
  }

  getBestMove(): Move | null {
    const moves = this.getAllValidMoves(this.game.getCurrentPlayer());
    if (moves.length === 0) return null;

    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    const alpha = -Infinity;
    const beta = Infinity;

    // Shuffle moves for randomness
    moves.sort(() => Math.random() - 0.5);

    for (const move of moves) {
      this.game.makeMove(move.from.row, move.from.col, move.to.row, move.to.col, true);
      const score = -this.minimax(this.searchDepth - 1, -beta, -alpha);
      this.game.undoLastMove();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (score > alpha) {
        // alpha = score; // Alpha update logic for root?
        // Actually root is maximizing.
      }
    }

    return bestMove;
  }

  private minimax(depth: number, alpha: number, beta: number): number {
    if (depth === 0 || this.game.isGameOver()) {
      return this.evaluate();
    }

    const moves = this.getAllValidMoves(this.game.getCurrentPlayer());
    if (moves.length === 0) {
      // No moves? strictly checkmate check?
      // The game.isGameOver should catch result.
      // But if not result yet, and no moves, it's loss.
      return -10000;
    }

    let maxScore = -Infinity;

    for (const move of moves) {
      this.game.makeMove(move.from.row, move.from.col, move.to.row, move.to.col, true);
      const score = -this.minimax(depth - 1, -beta, -alpha);
      this.game.undoLastMove();

      if (score > maxScore) {
        maxScore = score;
      }
      if (maxScore > alpha) {
        alpha = maxScore;
      }
      if (alpha >= beta) {
        break;
      }
    }

    return maxScore;
  }

  private getAllValidMoves(player: Player): Move[] {
    const moves: Move[] = [];
    const board = this.game.board;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const p = board[r][c];
        if (p && p.player === player) {
          // Try all targets
          // Optimized: get candidate moves for piece
          // But Game.ts doesn't expose "getMovesForPiece" easily without checking all board.
          // Game.ts has isValidMove.
          // Let's iterate all board? 90 squares.
          // Optimization: Use piece-specific logic similar to isValidMove checks but generating
          for (let tr = 0; tr < 10; tr++) {
            for (let tc = 0; tc < 9; tc++) {
              if (this.game.isValidMove(r, c, tr, tc)) {
                moves.push({
                  from: { row: r, col: c },
                  to: { row: tr, col: tc },
                  captured: board[tr][tc] || undefined,
                });
              }
            }
          }
        }
      }
    }
    return moves;
  }

  private evaluate(): number {
    const board = this.game.board;
    let score = 0;

    // Material weights
    const weights: Record<PieceType, number> = {
      GENERAL: 10000,
      ADVISOR: 20,
      ELEPHANT: 20,
      HORSE: 40,
      CANNON: 45,
      CHARIOT: 90,
      SOLDIER: 10,
    };

    const turnSide = this.game.getCurrentPlayer(); // Current player view

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const p = board[r][c];
        if (p) {
          let val = weights[p.type];
          // Soldier value increases across river
          if (p.type === "SOLDIER") {
            if (p.player === "RED" && r < 5) val += 10; // Red crossed river (rows 0-4)
            if (p.player === "BLACK" && r > 4) val += 10; // Black crossed river (rows 5-9)
          }

          if (p.player === turnSide) {
            score += val;
          } else {
            score -= val;
          }
        }
      }
    }

    return score;
  }
}
