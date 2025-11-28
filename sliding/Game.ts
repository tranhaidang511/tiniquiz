export type GameState = 'MENU' | 'PLAYING' | 'WON';
export type BoardSize = 3 | 4 | 5 | 6 | 7;

export class Game {
    private state: GameState = 'MENU';
    private boardSize: BoardSize = 3;
    private board: (number | null)[] = [];
    private emptyIndex: number = 0;
    private moves: number = 0;
    private startTime: number = 0;
    private elapsedTime: number = 0;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private boardListeners: (() => void)[] = [];
    private movesListeners: ((moves: number) => void)[] = [];

    constructor() { }

    // --- Setup ---

    setBoardSize(size: BoardSize) {
        this.boardSize = size;
    }

    getBoardSize(): BoardSize {
        return this.boardSize;
    }

    // --- Game Flow ---

    start() {
        const totalTiles = this.boardSize * this.boardSize;
        this.board = [];

        // Create solved board: [1, 2, 3, ..., size*size-1, null]
        for (let i = 1; i < totalTiles; i++) {
            this.board.push(i);
        }
        this.board.push(null);
        this.emptyIndex = totalTiles - 1;

        // Shuffle the board
        this.shuffle();

        this.moves = 0;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.setState('PLAYING');
        this.emitBoardUpdate();
        this.emitMovesUpdate();
    }

    private shuffle() {
        // Perform random valid moves to ensure solvability
        const shuffleMoves = this.boardSize * this.boardSize * 50;

        for (let i = 0; i < shuffleMoves; i++) {
            const validMoves = this.getValidMoves();
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.swap(randomMove, this.emptyIndex);
            }
        }
    }

    private getValidMoves(): number[] {
        const validMoves: number[] = [];
        const row = Math.floor(this.emptyIndex / this.boardSize);
        const col = this.emptyIndex % this.boardSize;

        // Check all four directions
        const directions = [
            { dr: -1, dc: 0 }, // up
            { dr: 1, dc: 0 },  // down
            { dr: 0, dc: -1 }, // left
            { dr: 0, dc: 1 }   // right
        ];

        for (const { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < this.boardSize && newCol >= 0 && newCol < this.boardSize) {
                validMoves.push(newRow * this.boardSize + newCol);
            }
        }

        return validMoves;
    }

    private swap(index1: number, index2: number) {
        [this.board[index1], this.board[index2]] = [this.board[index2], this.board[index1]];

        if (this.board[index1] === null) {
            this.emptyIndex = index1;
        } else if (this.board[index2] === null) {
            this.emptyIndex = index2;
        }
    }

    // --- Player Actions ---

    makeMove(index: number) {
        if (this.state !== 'PLAYING') return false;

        const validMoves = this.getValidMoves();
        if (!validMoves.includes(index)) return false;

        this.swap(index, this.emptyIndex);
        this.moves++;
        this.emitBoardUpdate();
        this.emitMovesUpdate();

        if (this.checkWin()) {
            this.elapsedTime = Date.now() - this.startTime;
            this.setState('WON');
        }

        return true;
    }

    private checkWin(): boolean {
        const totalTiles = this.boardSize * this.boardSize;

        // Check if all tiles are in order: [1, 2, 3, ..., size*size-1, null]
        for (let i = 0; i < totalTiles - 1; i++) {
            if (this.board[i] !== i + 1) return false;
        }

        return this.board[totalTiles - 1] === null;
    }

    restart() {
        this.setState('MENU');
    }

    // --- Getters ---

    getState(): GameState {
        return this.state;
    }

    getBoard(): (number | null)[] {
        return [...this.board];
    }

    getMoves(): number {
        return this.moves;
    }

    getElapsedTime(): number {
        if (this.state === 'PLAYING') {
            return Date.now() - this.startTime;
        }
        return this.elapsedTime;
    }

    getEmptyIndex(): number {
        return this.emptyIndex;
    }

    // --- State Management ---

    private setState(newState: GameState) {
        this.state = newState;
        this.stateListeners.forEach(l => l(this.state));
    }

    // --- Event Management ---

    onStateChange(listener: (state: GameState) => void) {
        this.stateListeners.push(listener);
    }

    onBoardUpdate(listener: () => void) {
        this.boardListeners.push(listener);
    }

    onMovesUpdate(listener: (moves: number) => void) {
        this.movesListeners.push(listener);
    }

    private emitBoardUpdate() {
        this.boardListeners.forEach(l => l());
    }

    private emitMovesUpdate() {
        this.movesListeners.forEach(l => l(this.moves));
    }

    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

export const game = new Game();
