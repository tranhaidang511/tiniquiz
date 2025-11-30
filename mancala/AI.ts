import type { Player, PitCount } from './Game';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface MoveScore {
    move: number;
    score: number;
}

export class MancalaAI {
    private difficulty: Difficulty;
    private maxDepth: number;

    constructor(difficulty: Difficulty = 'MEDIUM') {
        this.difficulty = difficulty;
        this.maxDepth = this.getMaxDepth(difficulty);
    }

    private getMaxDepth(difficulty: Difficulty): number {
        switch (difficulty) {
            case 'EASY': return 2;
            case 'MEDIUM': return 4;
            case 'HARD': return 6;
        }
    }

    setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.maxDepth = this.getMaxDepth(difficulty);
    }

    getBestMove(board: number[], pitCount: PitCount, player: Player): number {
        const validMoves = this.getValidMoves(board, pitCount, player);

        if (validMoves.length === 0) return -1;
        if (validMoves.length === 1) return validMoves[0];

        // Add randomness for easy difficulty
        if (this.difficulty === 'EASY' && Math.random() < 0.3) {
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }

        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        for (const move of validMoves) {
            const boardCopy = [...board];
            const extraTurn = this.simulateMove(boardCopy, move, pitCount, player);

            const score = this.minimax(
                boardCopy,
                pitCount,
                this.maxDepth - 1,
                -Infinity,
                Infinity,
                extraTurn ? player : this.getOpponent(player),
                player
            );

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    private minimax(
        board: number[],
        pitCount: PitCount,
        depth: number,
        alpha: number,
        beta: number,
        currentPlayer: Player,
        aiPlayer: Player
    ): number {
        // Check terminal conditions
        if (depth === 0 || this.isGameOver(board, pitCount)) {
            return this.evaluate(board, pitCount, aiPlayer);
        }

        const validMoves = this.getValidMoves(board, pitCount, currentPlayer);

        if (validMoves.length === 0) {
            return this.evaluate(board, pitCount, aiPlayer);
        }

        if (currentPlayer === aiPlayer) {
            // Maximizing player
            let maxEval = -Infinity;

            for (const move of validMoves) {
                const boardCopy = [...board];
                const extraTurn = this.simulateMove(boardCopy, move, pitCount, currentPlayer);

                const eval_ = this.minimax(
                    boardCopy,
                    pitCount,
                    depth - 1,
                    alpha,
                    beta,
                    extraTurn ? currentPlayer : this.getOpponent(currentPlayer),
                    aiPlayer
                );

                maxEval = Math.max(maxEval, eval_);
                alpha = Math.max(alpha, eval_);

                if (beta <= alpha) break; // Alpha-beta pruning
            }

            return maxEval;
        } else {
            // Minimizing player
            let minEval = Infinity;

            for (const move of validMoves) {
                const boardCopy = [...board];
                const extraTurn = this.simulateMove(boardCopy, move, pitCount, currentPlayer);

                const eval_ = this.minimax(
                    boardCopy,
                    pitCount,
                    depth - 1,
                    alpha,
                    beta,
                    extraTurn ? currentPlayer : this.getOpponent(currentPlayer),
                    aiPlayer
                );

                minEval = Math.min(minEval, eval_);
                beta = Math.min(beta, eval_);

                if (beta <= alpha) break; // Alpha-beta pruning
            }

            return minEval;
        }
    }

    private evaluate(board: number[], pitCount: PitCount, aiPlayer: Player): number {
        const player1Store = pitCount;
        const player2Store = pitCount * 2 + 1;

        const aiStore = aiPlayer === 'PLAYER1' ? player1Store : player2Store;
        const opponentStore = aiPlayer === 'PLAYER1' ? player2Store : player1Store;

        // Main score: difference in stores
        let score = (board[aiStore] - board[opponentStore]) * 10;

        // Bonus for pieces on our side (potential for more moves)
        const aiStart = aiPlayer === 'PLAYER1' ? 0 : pitCount + 1;
        const aiEnd = aiPlayer === 'PLAYER1' ? pitCount : pitCount * 2 + 1;

        let aiPieces = 0;
        for (let i = aiStart; i < aiEnd; i++) {
            aiPieces += board[i];
        }

        score += aiPieces * 0.5;

        // Bonus for pits that could land in our store (extra turn potential)
        for (let i = aiStart; i < aiEnd; i++) {
            const stones = board[i];
            if (stones > 0) {
                const landingIndex = (i + stones) % board.length;
                if (landingIndex === aiStore) {
                    score += 5; // Extra turn is valuable
                }
            }
        }

        return score;
    }

    private getValidMoves(board: number[], pitCount: PitCount, player: Player): number[] {
        const moves: number[] = [];

        if (player === 'PLAYER1') {
            for (let i = 0; i < pitCount; i++) {
                if (board[i] > 0) {
                    moves.push(i);
                }
            }
        } else {
            for (let i = pitCount + 1; i < pitCount * 2 + 1; i++) {
                if (board[i] > 0) {
                    moves.push(i);
                }
            }
        }

        return moves;
    }

    private simulateMove(board: number[], pitIndex: number, pitCount: PitCount, player: Player): boolean {
        const stones = board[pitIndex];
        board[pitIndex] = 0;

        let currentIndex = pitIndex;
        let stonesLeft = stones;
        let lastIndex = pitIndex;

        const player1Store = pitCount;
        const player2Store = pitCount * 2 + 1;
        const opponentStore = player === 'PLAYER1' ? player2Store : player1Store;

        // Sow stones
        while (stonesLeft > 0) {
            currentIndex = (currentIndex + 1) % board.length;

            // Skip opponent's store
            if (currentIndex === opponentStore) {
                continue;
            }

            board[currentIndex]++;
            stonesLeft--;
            lastIndex = currentIndex;
        }

        // Check for capture
        const myStore = player === 'PLAYER1' ? player1Store : player2Store;
        const isOnMySide = player === 'PLAYER1'
            ? lastIndex < pitCount
            : lastIndex > pitCount && lastIndex < pitCount * 2 + 1;

        if (isOnMySide && board[lastIndex] === 1 && lastIndex !== myStore) {
            const oppositeIndex = this.getOppositeIndex(lastIndex, pitCount);
            const oppositeStones = board[oppositeIndex];

            if (oppositeStones > 0) {
                board[myStore] += board[lastIndex] + oppositeStones;
                board[lastIndex] = 0;
                board[oppositeIndex] = 0;
            }
        }

        // Return true if extra turn (landed in own store)
        return lastIndex === myStore;
    }

    private getOppositeIndex(index: number, pitCount: PitCount): number {
        const player1Store = pitCount;
        const player2Store = pitCount * 2 + 1;

        if (index < pitCount) {
            return player2Store - 1 - index;
        } else {
            return player1Store - 1 - (index - pitCount - 1);
        }
    }

    private getOpponent(player: Player): Player {
        return player === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1';
    }

    private isGameOver(board: number[], pitCount: PitCount): boolean {
        const player1Stones = board.slice(0, pitCount).reduce((sum, stones) => sum + stones, 0);
        const player2Stones = board.slice(pitCount + 1, pitCount * 2 + 1).reduce((sum, stones) => sum + stones, 0);

        return player1Stones === 0 || player2Stones === 0;
    }
}
