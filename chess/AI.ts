import type { Piece, Player, Position } from './Game';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
    PAWN: 100,
    KNIGHT: 320,
    BISHOP: 330,
    ROOK: 500,
    QUEEN: 900,
    KING: 20000
};

// Positional bonuses for pieces (8x8 grid, from black's perspective)
const PAWN_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const KNIGHT_TABLE = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

const BISHOP_TABLE = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];

export class ChessAI {
    private static getSearchDepth(difficulty: Difficulty): number {
        switch (difficulty) {
            case 'easy': return 2;
            case 'medium': return 3;
            case 'hard': return 4;
        }
    }

    static getBestMove(
        board: (Piece | null)[][],
        player: Player,
        difficulty: Difficulty,
        getValidMoves: (piece: Piece) => Position[]
    ): { from: Position; to: Position } | null {
        const depth = this.getSearchDepth(difficulty);
        let bestMove: { from: Position; to: Position } | null = null;
        let bestScore = player === 'WHITE' ? -Infinity : Infinity;

        // Get all possible moves
        const moves = this.getAllPossibleMoves(board, player, getValidMoves);

        if (moves.length === 0) {
            return null;
        }

        // Evaluate each move
        for (const move of moves) {
            const newBoard = this.makeMove(board, move.from, move.to);
            const score = this.minimax(
                newBoard,
                depth - 1,
                -Infinity,
                Infinity,
                player === 'BLACK',
                getValidMoves
            );

            if (player === 'WHITE') {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    private static minimax(
        board: (Piece | null)[][],
        depth: number,
        alpha: number,
        beta: number,
        maximizingPlayer: boolean,
        getValidMoves: (piece: Piece) => Position[]
    ): number {
        if (depth === 0) {
            return this.evaluateBoard(board);
        }

        const currentPlayer: Player = maximizingPlayer ? 'WHITE' : 'BLACK';
        const moves = this.getAllPossibleMoves(board, currentPlayer, getValidMoves);

        if (moves.length === 0) {
            // No moves available - check if it's checkmate or stalemate
            // For simplicity, return a very high/low score
            return maximizingPlayer ? -10000 : 10000;
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const newBoard = this.makeMove(board, move.from, move.to);
                const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, false, getValidMoves);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const newBoard = this.makeMove(board, move.from, move.to);
                const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, true, getValidMoves);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            return minEval;
        }
    }

    private static evaluateBoard(board: (Piece | null)[][]): number {
        let score = 0;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const pieceValue = this.getPieceValue(piece, row, col);
                    score += piece.player === 'WHITE' ? pieceValue : -pieceValue;
                }
            }
        }

        return score;
    }

    private static getPieceValue(piece: Piece, row: number, col: number): number {
        const baseValue = PIECE_VALUES[piece.type];
        const positionalValue = this.getPositionalValue(piece, row, col);
        return baseValue + positionalValue;
    }

    private static getPositionalValue(piece: Piece, row: number, col: number): number {
        // Flip row for white pieces (tables are from black's perspective)
        const tableRow = piece.player === 'WHITE' ? 7 - row : row;

        switch (piece.type) {
            case 'PAWN':
                return PAWN_TABLE[tableRow][col];
            case 'KNIGHT':
                return KNIGHT_TABLE[tableRow][col];
            case 'BISHOP':
                return BISHOP_TABLE[tableRow][col];
            case 'ROOK':
            case 'QUEEN':
            case 'KING':
                return 0; // Simplified - no positional tables for these
            default:
                return 0;
        }
    }

    private static getAllPossibleMoves(
        board: (Piece | null)[][],
        player: Player,
        getValidMoves: (piece: Piece) => Position[]
    ): { from: Position; to: Position }[] {
        const moves: { from: Position; to: Position }[] = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.player === player) {
                    const validMoves = getValidMoves(piece);
                    for (const to of validMoves) {
                        moves.push({
                            from: { row, col },
                            to
                        });
                    }
                }
            }
        }

        return moves;
    }

    private static makeMove(
        board: (Piece | null)[][],
        from: Position,
        to: Position
    ): (Piece | null)[][] {
        // Create a deep copy of the board
        const newBoard = board.map(row => row.map(piece =>
            piece ? { ...piece } : null
        ));

        const piece = newBoard[from.row][from.col];
        if (piece) {
            newBoard[to.row][to.col] = { ...piece, row: to.row, col: to.col };
            newBoard[from.row][from.col] = null;
        }

        return newBoard;
    }
}
