export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type Player = 'BLACK' | 'WHITE';
export type GameMode = 'TWO_PLAYER' | 'VS_AI'; // For future expansion

export interface Stone {
    row: number;
    col: number;
    player: Player;
}

export interface Position {
    row: number;
    col: number;
}

export class Game {
    private state: GameState = 'MENU';
    private mode: GameMode = 'TWO_PLAYER';
    private boardSize: number = 15; // Configurable: 15 or 19
    private board: (Player | null)[][] = [];
    private currentPlayer: Player = 'BLACK';
    private moves: Stone[] = [];
    private winner: Player | null = null;
    private winningLine: Position[] | null = null;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((stone: Stone) => void)[] = [];
    private boardListeners: ((board: (Player | null)[][]) => void)[] = [];

    constructor() {
        this.initializeBoard();
    }

    // --- Setup ---

    private initializeBoard() {
        this.board = Array(this.boardSize).fill(null).map(() =>
            Array(this.boardSize).fill(null)
        );
    }

    setBoardSize(size: number) {
        if (size !== 15 && size !== 19) {
            throw new Error('Board size must be 15 or 19');
        }
        this.boardSize = size;
        this.initializeBoard();
    }

    getBoardSize(): number {
        return this.boardSize;
    }

    setGameMode(mode: GameMode) {
        this.mode = mode;
    }

    getGameMode(): GameMode {
        return this.mode;
    }

    // --- Game Flow ---

    start() {
        this.board = [];
        this.initializeBoard();
        this.currentPlayer = 'BLACK';
        this.moves = [];
        this.winner = null;
        this.winningLine = null;
        this.setState('PLAYING');
        this.emitBoard();
    }

    makeMove(row: number, col: number): boolean {
        if (this.state !== 'PLAYING') return false;
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return false;
        if (this.board[row][col] !== null) return false;

        // Place stone
        const stone: Stone = { row, col, player: this.currentPlayer };
        this.board[row][col] = this.currentPlayer;
        this.moves.push(stone);
        this.emitMove(stone);

        // Check for win
        if (this.checkWin(row, col)) {
            this.winner = this.currentPlayer;
            this.setState('RESULT');
            return true;
        }

        // Check for draw (board full)
        if (this.moves.length === this.boardSize * this.boardSize) {
            this.setState('RESULT');
            return true;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
        return true;
    }

    private checkWin(row: number, col: number): boolean {
        const player = this.board[row][col];
        if (!player) return false;

        const directions = [
            { dr: 0, dc: 1 },  // Horizontal
            { dr: 1, dc: 0 },  // Vertical
            { dr: 1, dc: 1 },  // Diagonal \
            { dr: 1, dc: -1 }  // Diagonal /
        ];

        for (const { dr, dc } of directions) {
            const line = this.getLine(row, col, dr, dc, player);
            if (line.length >= 5) {
                this.winningLine = line;
                return true;
            }
        }

        return false;
    }

    private getLine(row: number, col: number, dr: number, dc: number, player: Player): Position[] {
        const line: Position[] = [{ row, col }];

        // Check in positive direction
        for (let i = 1; i < 5; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) break;
            if (this.board[r][c] !== player) break;
            line.push({ row: r, col: c });
        }

        // Check in negative direction
        for (let i = 1; i < 5; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) break;
            if (this.board[r][c] !== player) break;
            line.unshift({ row: r, col: c });
        }

        return line;
    }

    restart() {
        this.setState('MENU');
    }

    // --- State Management ---

    private setState(newState: GameState) {
        this.state = newState;
        this.stateListeners.forEach(l => l(this.state));
    }

    getState(): GameState {
        return this.state;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    getWinner(): Player | null {
        return this.winner;
    }

    getWinningLine(): Position[] | null {
        return this.winningLine;
    }

    getBoard(): (Player | null)[][] {
        return this.board;
    }

    getMoves(): Stone[] {
        return [...this.moves];
    }

    isDraw(): boolean {
        return this.state === 'RESULT' && this.winner === null;
    }

    // --- Event Management ---

    onStateChange(listener: (state: GameState) => void) {
        this.stateListeners.push(listener);
    }

    onMove(listener: (stone: Stone) => void) {
        this.moveListeners.push(listener);
    }

    onBoardChange(listener: (board: (Player | null)[][]) => void) {
        this.boardListeners.push(listener);
    }

    private emitMove(stone: Stone) {
        this.moveListeners.forEach(l => l(stone));
    }

    private emitBoard() {
        this.boardListeners.forEach(l => l(this.board));
    }
}

export const game = new Game();
