import type { GoGame, Player, Position } from './Game';

export class GoAI {
    private game: GoGame;

    constructor(gameInstance: GoGame) {
        this.game = gameInstance;
    }

    getBestMove(): Position | null {
        const player = this.game.getCurrentPlayer();
        const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';
        const size = this.game.getBoardSize();
        const board = this.game.getBoard();

        const possibleMoves: Position[] = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === null) {
                    // Basic rule check (prevent suicide/KO is handled by Game.placeStone, 
                    // but AI should avoid obviously bad moves)
                    possibleMoves.push({ row: r, col: c });
                }
            }
        }

        if (possibleMoves.length === 0) return null;

        // Shuffle moves for variety
        possibleMoves.sort(() => Math.random() - 0.5);

        let bestMove: Position | null = null;
        let bestScore = -Infinity;

        for (const pos of possibleMoves) {
            let score = this.evaluateMove(pos.row, pos.col, player, opponent);

            // Always use hard logic: avoid self-atari if it doesn't lead to a capture
            if (this.isSelfAtari(pos.row, pos.col, player, opponent)) {
                score -= 50; // Heavy penalty for putting self in atari
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = pos;
            }
        }

        // If even the best move is very bad, passing might be better (end of game)
        if (bestScore < -500) return null;
        return bestMove;
    }

    private evaluateMove(row: number, col: number, player: Player, opponent: Player): number {
        let score = 0;
        const neighbors = this.getNeighbors(row, col);
        const board = this.game.getBoard();

        neighbors.forEach(n => {
            const stone = board[n.row][n.col];
            if (stone === opponent) {
                const liberties = this.countLiberties(n.row, n.col);
                if (liberties === 1) {
                    score += 20; // High priority: captured opponent!
                } else if (liberties === 2) {
                    score += 5; // Put opponent in atari (look ahead)
                }
            } else if (stone === player) {
                const liberties = this.countLiberties(n.row, n.col);
                if (liberties === 1) {
                    score += 15; // High priority: save own group from capture
                } else if (liberties === 2) {
                    score += 3; // Strengthening own group
                }
            }
        });

        // Board position: bonus for playing near the center in early game
        const size = this.game.getBoardSize();
        const center = (size - 1) / 2;
        const dist = Math.abs(row - center) + Math.abs(col - center);
        score += (size - dist) * 0.1;

        // Connectivity/Liberties
        let hasPotentialLiberties = false;
        neighbors.forEach(n => {
            const s = board[n.row][n.col];
            if (s === null) hasPotentialLiberties = true;
            if (s === player && this.countLiberties(n.row, n.col) > 1) hasPotentialLiberties = true;
            if (s === opponent && this.countLiberties(n.row, n.col) === 1) hasPotentialLiberties = true;
        });

        if (!hasPotentialLiberties) {
            score -= 1000; // Likely suicide or immediate capture
        }

        return score;
    }

    private isSelfAtari(row: number, col: number, player: Player, opponent: Player): boolean {
        // Temporarily place stone
        const board = this.game.getBoard();
        const originalVal = board[row][col];
        board[row][col] = player;

        // Check if any opponent stones are captured (this makes self-atari okay/good)
        const neighbors = this.getNeighbors(row, col);
        let capturedOpponent = false;
        for (const n of neighbors) {
            if (board[n.row][n.col] === opponent && this.countLiberties(n.row, n.col) === 0) {
                capturedOpponent = true;
                break;
            }
        }

        // Check if the group at (row, col) has only 1 liberty now
        const liberties = this.countLiberties(row, col);

        // Revert
        board[row][col] = originalVal;

        return !capturedOpponent && liberties === 1;
    }

    private countLiberties(row: number, col: number): number {
        const board = this.game.getBoard();
        const player = board[row][col];
        if (!player) return 0;

        const visited = new Set<string>();
        const stack: Position[] = [{ row, col }];
        const libertyCoords = new Set<string>();

        while (stack.length > 0) {
            const current = stack.pop()!;
            const key = `${current.row},${current.col}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const neighbors = this.getNeighbors(current.row, current.col);
            for (const n of neighbors) {
                if (board[n.row][n.col] === null) {
                    libertyCoords.add(`${n.row},${n.col}`);
                } else if (board[n.row][n.col] === player) {
                    stack.push(n);
                }
            }
        }
        return libertyCoords.size;
    }

    private getNeighbors(row: number, col: number): Position[] {
        const neighbors: Position[] = [];
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const size = this.game.getBoardSize();
        dirs.forEach(([dr, dc]) => {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                neighbors.push({ row: nr, col: nc });
            }
        });
        return neighbors;
    }
}
