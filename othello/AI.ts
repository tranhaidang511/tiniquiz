import type { Player, Position, Difficulty } from './Game';

export class OthelloAI {
    private game: any;
    private maxDepth: number = 4;

    // Position weight matrix - corners and edges are valuable
    private readonly positionWeights = [
        [100, -20, 10, 5, 5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [10, -2, 11, 2, 2, 11, -2, 10],
        [5, -2, 2, 2, 2, 2, -2, 5],
        [5, -2, 2, 2, 2, 2, -2, 5],
        [10, -2, 11, 2, 2, 11, -2, 10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10, 5, 5, 10, -20, 100]
    ];

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

    getBestMove(board: (Player | null)[][], aiPlayer: Player): Position | null {
        const validMoves = this.getValidMoves(board, aiPlayer);

        if (validMoves.length === 0) {
            return null;
        }

        let bestMove: Position | null = null;
        let bestScore = -Infinity;

        for (const move of validMoves) {
            const newBoard = this.simulateMove(board, move, aiPlayer);
            const score = this.minimax(
                newBoard,
                this.maxDepth - 1,
                -Infinity,
                Infinity,
                false,
                aiPlayer
            );

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    private minimax(
        board: (Player | null)[][],
        depth: number,
        alpha: number,
        beta: number,
        isMaximizing: boolean,
        aiPlayer: Player
    ): number {
        const opponent = aiPlayer === 'BLACK' ? 'WHITE' : 'BLACK';

        // Terminal conditions
        if (depth === 0) {
            return this.evaluateBoard(board, aiPlayer);
        }

        const currentPlayer = isMaximizing ? aiPlayer : opponent;
        const validMoves = this.getValidMoves(board, currentPlayer);

        // If no valid moves, switch player or end game
        if (validMoves.length === 0) {
            const opponentMoves = this.getValidMoves(board, isMaximizing ? opponent : aiPlayer);
            if (opponentMoves.length === 0) {
                // Game over - evaluate final position
                return this.evaluateBoard(board, aiPlayer) * 1000;
            }
            // Pass turn
            return this.minimax(board, depth - 1, alpha, beta, !isMaximizing, aiPlayer);
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of validMoves) {
                const newBoard = this.simulateMove(board, move, currentPlayer);
                const evaluation = this.minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of validMoves) {
                const newBoard = this.simulateMove(board, move, currentPlayer);
                const evaluation = this.minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            return minEval;
        }
    }

    private evaluateBoard(board: (Player | null)[][], aiPlayer: Player): number {
        const opponent = aiPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
        let score = 0;

        // Count pieces and apply position weights
        let aiPieces = 0;
        let opponentPieces = 0;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === aiPlayer) {
                    aiPieces++;
                    score += this.positionWeights[row][col];
                } else if (board[row][col] === opponent) {
                    opponentPieces++;
                    score -= this.positionWeights[row][col];
                }
            }
        }

        // Piece count differential (weighted less in early game)
        const totalPieces = aiPieces + opponentPieces;
        const pieceWeight = totalPieces > 48 ? 10 : 5;
        score += (aiPieces - opponentPieces) * pieceWeight;

        // Mobility - number of valid moves
        const aiMobility = this.getValidMoves(board, aiPlayer).length;
        const opponentMobility = this.getValidMoves(board, opponent).length;
        score += (aiMobility - opponentMobility) * 5;

        // Corner control (very important)
        const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
        for (const [row, col] of corners) {
            if (board[row][col] === aiPlayer) {
                score += 100;
            } else if (board[row][col] === opponent) {
                score -= 100;
            }
        }

        return score;
    }

    private getValidMoves(board: (Player | null)[][], player: Player): Position[] {
        const validMoves: Position[] = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === null) {
                    const flipped = this.getFlippedDiscs(board, row, col, player);
                    if (flipped.length > 0) {
                        validMoves.push({ row, col });
                    }
                }
            }
        }

        return validMoves;
    }

    private getFlippedDiscs(
        board: (Player | null)[][],
        row: number,
        col: number,
        player: Player
    ): Position[] {
        const flipped: Position[] = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';

        for (const [dr, dc] of directions) {
            const tempFlipped: Position[] = [];
            let r = row + dr;
            let c = col + dc;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === null) break;
                if (board[r][c] === opponent) {
                    tempFlipped.push({ row: r, col: c });
                    r += dr;
                    c += dc;
                } else if (board[r][c] === player) {
                    flipped.push(...tempFlipped);
                    break;
                } else {
                    break;
                }
            }
        }

        return flipped;
    }

    private simulateMove(
        board: (Player | null)[][],
        move: Position,
        player: Player
    ): (Player | null)[][] {
        // Deep copy the board
        const newBoard = board.map(row => [...row]);

        // Place the disc
        newBoard[move.row][move.col] = player;

        // Flip discs
        const flipped = this.getFlippedDiscs(newBoard, move.row, move.col, player);
        for (const pos of flipped) {
            newBoard[pos.row][pos.col] = player;
        }

        return newBoard;
    }
}
