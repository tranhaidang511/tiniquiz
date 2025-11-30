import type { Piece, Move, Player, Difficulty } from './Game';

export class CheckersAI {
    private game: any; // Using any to avoid circular dependency issues during development, but ideally should be CheckersGame
    private maxDepth: number = 4; // Depth of search

    constructor(gameInstance: any) {
        this.game = gameInstance;
    }

    setDifficulty(difficulty: Difficulty) {
        switch (difficulty) {
            case 'EASY':
                this.maxDepth = 2;
                break;
            case 'MEDIUM':
                this.maxDepth = 4;
                break;
            case 'HARD':
                this.maxDepth = 6;
                break;
        }
    }

    getBestMove(board: (Piece | null)[][], player: Player): Move | null {
        // Clone the board to avoid modifying the actual game state during simulation
        const boardClone = this.cloneBoard(board);

        // Get all valid moves for the current player
        const allMoves = this.getAllValidMoves(boardClone, player);

        if (allMoves.length === 0) return null;

        // If only one move is available (e.g. forced capture), take it immediately
        if (allMoves.length === 1) return allMoves[0];

        let bestMove: Move | null = null;
        let bestValue = -Infinity;
        const alpha = -Infinity;
        const beta = Infinity;

        for (const move of allMoves) {
            // Simulate move
            const nextBoard = this.simulateMove(boardClone, move);

            // Calculate value using Minimax
            const value = this.minimax(nextBoard, this.maxDepth - 1, alpha, beta, false, player);

            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }

        return bestMove || allMoves[0];
    }

    private minimax(
        board: (Piece | null)[][],
        depth: number,
        alpha: number,
        beta: number,
        isMaximizing: boolean,
        aiPlayer: Player
    ): number {
        const opponent = aiPlayer === 'BLACK' ? 'RED' : 'BLACK';

        // Terminal conditions
        if (depth === 0) {
            return this.evaluateBoard(board, aiPlayer);
        }

        const currentPlayer = isMaximizing ? aiPlayer : opponent;
        const validMoves = this.getAllValidMoves(board, currentPlayer);

        if (validMoves.length === 0) {
            // No moves available. If it's maximizing player's turn, they lose (bad).
            // If minimizing player's turn, they lose (good for AI).
            return isMaximizing ? -10000 : 10000;
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of validMoves) {
                const nextBoard = this.simulateMove(board, move);
                const evalScore = this.minimax(nextBoard, depth - 1, alpha, beta, false, aiPlayer);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of validMoves) {
                const nextBoard = this.simulateMove(board, move);
                const evalScore = this.minimax(nextBoard, depth - 1, alpha, beta, true, aiPlayer);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    private evaluateBoard(board: (Piece | null)[][], aiPlayer: Player): number {
        let score = 0;
        const boardSize = board.length;

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const piece = board[row][col];
                if (!piece) continue;

                let pieceValue = 0;

                // Material value
                if (piece.type === 'KING') {
                    pieceValue = 50;
                } else {
                    pieceValue = 10;

                    // Positional bonus for regular pieces (advancing is good)
                    // For BLACK (top), moving down (increasing row) is good
                    // For RED (bottom), moving up (decreasing row) is good
                    if (piece.player === 'BLACK') {
                        pieceValue += row;
                        // Bonus for being safe on edges?
                        if (col === 0 || col === boardSize - 1) pieceValue += 1;
                    } else {
                        pieceValue += (boardSize - 1 - row);
                        if (col === 0 || col === boardSize - 1) pieceValue += 1;
                    }
                }

                // Center control bonus (central 4x4 area)
                const centerStart = Math.floor(boardSize / 2) - 2;
                const centerEnd = Math.floor(boardSize / 2) + 2;
                if (row >= centerStart && row < centerEnd && col >= centerStart && col < centerEnd) {
                    pieceValue += 2;
                }

                if (piece.player === aiPlayer) {
                    score += pieceValue;
                } else {
                    score -= pieceValue;
                }
            }
        }

        return score;
    }

    private getAllValidMoves(board: (Piece | null)[][], player: Player): Move[] {
        const pieces = this.game.getAllPieces(player, board);
        const allMoves: Move[] = [];

        // First check for any captures (forced jumps)
        // We need to check if ANY piece can capture. If so, filter regular moves.
        // But game.calculateValidMoves already does this logic per piece.
        // However, across ALL pieces, if one can capture, others usually can't move regularly?
        // Standard rules: yes, if ANY capture is available, you must capture.
        // Game.ts logic: `calculateValidMoves` checks if *that piece* can capture.
        // It also checks `getAllPieces` to see if *other pieces* can capture (if forceJump is on).
        // So `calculateValidMoves` is safe to use.

        for (const piece of pieces) {
            const moves = this.game.calculateValidMoves(piece, board);
            allMoves.push(...moves);
        }

        return allMoves;
    }

    private simulateMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
        // Deep clone the board for simulation
        const newBoard = this.cloneBoard(board);

        // Execute move on the new board
        // We can reuse the game's executeMove logic but we need to be careful not to trigger side effects
        // The game.executeMove method has been refactored to accept a board

        this.game.executeMove(move, newBoard);

        // Also handle King promotion in simulation
        const piece = newBoard[move.to.row][move.to.col];
        if (piece && piece.type !== 'KING') {
            const boardSize = newBoard.length;
            if ((piece.player === 'RED' && move.to.row === 0) ||
                (piece.player === 'BLACK' && move.to.row === boardSize - 1)) {
                piece.type = 'KING';
            }
        }

        return newBoard;
    }

    private cloneBoard(board: (Piece | null)[][]): (Piece | null)[][] {
        return board.map(row => row.map(cell => {
            if (cell === null) return null;
            return { ...cell }; // Shallow copy of piece object is enough as it contains primitives
        }));
    }
}
