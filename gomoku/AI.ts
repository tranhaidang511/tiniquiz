import type { Player, Position } from './Game';

export class GomokuAI {
    private boardSize: number;

    constructor(boardSize: number = 15) {
        this.boardSize = boardSize;
    }

    setBoardSize(size: number) {
        this.boardSize = size;
    }

    /**
     * Main entry point - get the best move for the AI
     */
    getBestMove(board: (Player | null)[][], aiPlayer: Player): Position | null {
        const opponent: Player = aiPlayer === 'BLACK' ? 'WHITE' : 'BLACK';

        // 1. Check if AI can win in this move
        const winningMove = this.findWinningMove(board, aiPlayer);
        if (winningMove) return winningMove;

        // 2. Check if need to block opponent's winning move
        const blockingMove = this.findWinningMove(board, opponent);
        if (blockingMove) return blockingMove;

        // 3. Find best strategic move
        return this.findBestStrategicMove(board, aiPlayer, opponent);
    }

    /**
     * Find a move that creates 5 in a row for the given player
     */
    private findWinningMove(board: (Player | null)[][], player: Player): Position | null {
        const validMoves = this.getValidMoves(board);

        for (const move of validMoves) {
            if (this.wouldWin(board, move.row, move.col, player)) {
                return move;
            }
        }

        return null;
    }

    /**
     * Check if placing a stone at this position would create 5 in a row
     */
    private wouldWin(board: (Player | null)[][], row: number, col: number, player: Player): boolean {
        // Temporarily place the stone
        board[row][col] = player;

        const directions = [
            { dr: 0, dc: 1 },  // Horizontal
            { dr: 1, dc: 0 },  // Vertical
            { dr: 1, dc: 1 },  // Diagonal \
            { dr: 1, dc: -1 }  // Diagonal /
        ];

        let wins = false;
        for (const { dr, dc } of directions) {
            const count = this.countInLine(board, row, col, dr, dc, player);
            if (count >= 5) {
                wins = true;
                break;
            }
        }

        // Remove the temporary stone
        board[row][col] = null;

        return wins;
    }

    /**
     * Count consecutive stones in a line (both directions)
     */
    private countInLine(board: (Player | null)[][], row: number, col: number, dr: number, dc: number, player: Player): number {
        let count = 1; // Count the current position

        // Check in positive direction
        for (let i = 1; i < 5; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) break;
            if (board[r][c] !== player) break;
            count++;
        }

        // Check in negative direction
        for (let i = 1; i < 5; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) break;
            if (board[r][c] !== player) break;
            count++;
        }

        return count;
    }

    /**
     * Find the best strategic move based on pattern evaluation
     */
    private findBestStrategicMove(board: (Player | null)[][], aiPlayer: Player, opponent: Player): Position | null {
        const validMoves = this.getValidMoves(board);

        if (validMoves.length === 0) return null;

        // If board is empty, play in the center
        if (validMoves.length === this.boardSize * this.boardSize) {
            const center = Math.floor(this.boardSize / 2);
            return { row: center, col: center };
        }

        // Evaluate all valid moves and pick the best one
        let bestScore = -Infinity;
        let bestMove: Position | null = null;

        for (const move of validMoves) {
            const score = this.evaluatePosition(board, move.row, move.col, aiPlayer, opponent);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Evaluate a position's strategic value
     */
    private evaluatePosition(board: (Player | null)[][], row: number, col: number, aiPlayer: Player, opponent: Player): number {
        let score = 0;

        // Temporarily place AI stone
        board[row][col] = aiPlayer;
        score += this.evaluatePatterns(board, row, col, aiPlayer) * 1.2; // Offensive weight
        board[row][col] = null;

        // Temporarily place opponent stone to see defensive value
        board[row][col] = opponent;
        score += this.evaluatePatterns(board, row, col, opponent); // Defensive weight
        board[row][col] = null;

        // Prefer center positions slightly
        const centerDistance = Math.abs(row - this.boardSize / 2) + Math.abs(col - this.boardSize / 2);
        score += (this.boardSize - centerDistance) * 0.1;

        return score;
    }

    /**
     * Evaluate patterns around a position
     */
    private evaluatePatterns(board: (Player | null)[][], row: number, col: number, player: Player): number {
        let score = 0;

        const directions = [
            { dr: 0, dc: 1 },  // Horizontal
            { dr: 1, dc: 0 },  // Vertical
            { dr: 1, dc: 1 },  // Diagonal \
            { dr: 1, dc: -1 }  // Diagonal /
        ];

        for (const { dr, dc } of directions) {
            const pattern = this.getPattern(board, row, col, dr, dc, player);
            score += this.scorePattern(pattern);
        }

        return score;
    }

    /**
     * Get pattern in a specific direction
     */
    private getPattern(board: (Player | null)[][], row: number, col: number, dr: number, dc: number, player: Player): string {
        let pattern = '';

        // Check 4 positions in negative direction
        for (let i = -4; i <= 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) {
                pattern += 'X'; // Out of bounds
            } else if (board[r][c] === player) {
                pattern += 'O'; // AI's stone
            } else if (board[r][c] === null) {
                pattern += '-'; // Empty
            } else {
                pattern += 'X'; // Opponent's stone
            }
        }

        return pattern;
    }

    /**
     * Score a pattern based on strategic value
     */
    private scorePattern(pattern: string): number {
        // Five in a row (already handled but just in case)
        if (pattern.includes('OOOOO')) return 100000;

        // Open four: -OOOO-
        if (pattern.includes('-OOOO-')) return 10000;

        // Four with one end open: -OOOO or OOOO-
        if (pattern.includes('-OOOO') || pattern.includes('OOOO-')) return 1000;

        // Open three: -OOO-
        if (pattern.includes('-OOO-')) return 500;
        if (pattern.includes('--OOO-') || pattern.includes('-OOO--')) return 400;

        // Three with one end open
        if (pattern.includes('-OOO') || pattern.includes('OOO-')) return 100;

        // Open two: -OO-
        if (pattern.includes('-OO-')) return 50;
        if (pattern.includes('--OO-') || pattern.includes('-OO--')) return 40;

        // Two with one end open
        if (pattern.includes('-OO') || pattern.includes('OO-')) return 10;

        // Single stone with space
        if (pattern.includes('-O-')) return 1;

        return 0;
    }

    /**
     * Get all valid (empty) positions on the board
     * Optimized to only check positions near existing stones
     */
    private getValidMoves(board: (Player | null)[][]): Position[] {
        const validMoves: Position[] = [];
        const hasStones = board.some(row => row.some(cell => cell !== null));

        if (!hasStones) {
            // If empty board, return all positions
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    validMoves.push({ row, col });
                }
            }
            return validMoves;
        }

        // Only consider positions within 2 squares of existing stones
        const consideredPositions = new Set<string>();
        const range = 2;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] !== null) {
                    // Add nearby empty positions
                    for (let dr = -range; dr <= range; dr++) {
                        for (let dc = -range; dc <= range; dc++) {
                            const newRow = row + dr;
                            const newCol = col + dc;

                            if (newRow >= 0 && newRow < this.boardSize &&
                                newCol >= 0 && newCol < this.boardSize &&
                                board[newRow][newCol] === null) {
                                const key = `${newRow},${newCol}`;
                                consideredPositions.add(key);
                            }
                        }
                    }
                }
            }
        }

        // Convert set back to Position array
        consideredPositions.forEach(key => {
            const [row, col] = key.split(',').map(Number);
            validMoves.push({ row, col });
        });

        return validMoves;
    }
}
