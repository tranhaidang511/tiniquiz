import type { GoGame, Difficulty, Player, Position } from './Game';

export class GoAI {
    private game: GoGame;

    constructor(gameInstance: GoGame) {
        this.game = gameInstance;
    }

    setDifficulty(_difficulty: Difficulty) {
        // Simple heuristic AI doesn't use search depth yet
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
                    possibleMoves.push({ row: r, col: c });
                }
            }
        }

        if (possibleMoves.length === 0) return null;

        // Shuffle moves
        possibleMoves.sort(() => Math.random() - 0.5);

        let bestMove: Position | null = null;
        let bestScore = -Infinity;

        for (const pos of possibleMoves) {
            const score = this.evaluateMove(pos.row, pos.col, player, opponent);
            if (score > bestScore) {
                bestScore = score;
                bestMove = pos;
            }
        }

        if (bestScore < -500) return null;
        return bestMove;
    }

    private evaluateMove(row: number, col: number, player: Player, opponent: Player): number {
        let score = 0;
        const neighbors = this.getNeighbors(row, col);

        neighbors.forEach(n => {
            const stone = this.game.getBoard()[n.row][n.col];
            if (stone === opponent) {
                if (this.countLiberties(n.row, n.col) === 1) {
                    score += 10;
                }
            } else if (stone === player) {
                if (this.countLiberties(n.row, n.col) === 1) {
                    score += 8;
                }
            }
        });

        const size = this.game.getBoardSize();
        const center = (size - 1) / 2;
        const dist = Math.abs(row - center) + Math.abs(col - center);
        score += (size - dist) * 0.05;

        let hasPotentialLiberties = false;
        neighbors.forEach(n => {
            const s = this.game.getBoard()[n.row][n.col];
            if (s === null) hasPotentialLiberties = true;
            if (s === player && this.countLiberties(n.row, n.col) > 1) hasPotentialLiberties = true;
            if (s === opponent && this.countLiberties(n.row, n.col) === 1) hasPotentialLiberties = true;
        });

        if (!hasPotentialLiberties) score -= 1000;
        return score;
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
