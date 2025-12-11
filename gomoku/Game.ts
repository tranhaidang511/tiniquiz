import { GomokuAI } from './AI';

export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type Player = 'BLACK' | 'WHITE';
export type GameMode = 'TWO_PLAYER' | 'VS_AI';

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
    private ai: GomokuAI;
    private isAIThinking: boolean = false;
    private startTime: number | null = null;
    private endTime: number | null = null;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((stone: Stone) => void)[] = [];
    private boardListeners: ((board: (Player | null)[][]) => void)[] = [];
    private aiThinkingListeners: ((thinking: boolean) => void)[] = [];

    constructor() {
        this.ai = new GomokuAI(this.boardSize);
        this.initializeBoard();
    }

    // --- Setup ---

    private initializeBoard() {
        this.board = Array(this.boardSize).fill(null).map(() =>
            Array(this.boardSize).fill(null)
        );
    }

    setBoardSize(size: number) {
        if (size !== 9 && size !== 15 && size !== 19) {
            throw new Error('Board size must be 9, 15 or 19');
        }
        this.boardSize = size;
        this.ai.setBoardSize(size);
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
        this.startTime = Date.now();
        this.endTime = null;
        this.setState('PLAYING');
        this.emitBoard();
    }

    makeMove(row: number, col: number): boolean {
        if (this.state !== 'PLAYING') return false;
        if (this.isAIThinking) return false; // Block moves during AI turn
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return false;
        if (this.board[row][col] !== null) return false;

        // In VS_AI mode, only allow player (BLACK) to make moves via this method
        if (this.mode === 'VS_AI' && this.currentPlayer !== 'BLACK') return false;

        // Place stone
        const stone: Stone = { row, col, player: this.currentPlayer };
        this.board[row][col] = this.currentPlayer;
        this.moves.push(stone);

        // Check for win
        if (this.checkWin(row, col)) {
            this.winner = this.currentPlayer;
            this.endTime = Date.now();
            this.emitMove(stone); // Emit before ending game
            this.setState('RESULT');
            return true;
        }

        // Check for draw (board full)
        if (this.moves.length === this.boardSize * this.boardSize) {
            this.endTime = Date.now();
            this.emitMove(stone); // Emit before ending game
            this.setState('RESULT');
            return true;
        }

        // Switch player BEFORE emitting move so turn indicator updates correctly
        this.currentPlayer = this.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
        this.emitMove(stone); // Emit after turn switch

        // If VS_AI mode and now it's AI's turn, trigger AI move
        if (this.mode === 'VS_AI' && this.currentPlayer === 'WHITE') {
            this.makeAIMove();
        }

        return true;
    }

    private async makeAIMove() {
        // Add small delay for better UX
        this.isAIThinking = true;
        this.emitAIThinking(true);

        setTimeout(() => {
            const aiMove = this.ai.getBestMove(this.board, 'WHITE');

            if (aiMove) {
                // Place AI's stone
                const stone: Stone = { row: aiMove.row, col: aiMove.col, player: 'WHITE' };
                this.board[aiMove.row][aiMove.col] = 'WHITE';
                this.moves.push(stone);

                // Check for win
                if (this.checkWin(aiMove.row, aiMove.col)) {
                    this.winner = 'WHITE';
                    this.endTime = Date.now();
                    this.emitMove(stone); // Emit before ending
                    this.setState('RESULT');
                    this.isAIThinking = false;
                    this.emitAIThinking(false);
                    return;
                }

                // Check for draw
                if (this.moves.length === this.boardSize * this.boardSize) {
                    this.endTime = Date.now();
                    this.emitMove(stone); // Emit before ending
                    this.setState('RESULT');
                    this.isAIThinking = false;
                    this.emitAIThinking(false);
                    return;
                }

                // Switch back to player BEFORE emitting
                this.currentPlayer = 'BLACK';
                this.emitMove(stone); // Emit after turn switch
            }

            this.isAIThinking = false;
            this.emitAIThinking(false);
        }, 500); // 500ms delay
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

    isAITurn(): boolean {
        return this.mode === 'VS_AI' && this.currentPlayer === 'WHITE';
    }

    getAIThinking(): boolean {
        return this.isAIThinking;
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

    onAIThinking(listener: (thinking: boolean) => void) {
        this.aiThinkingListeners.push(listener);
    }

    private emitMove(stone: Stone) {
        this.moveListeners.forEach(l => l(stone));
    }

    private emitBoard() {
        this.boardListeners.forEach(l => l(this.board));
    }

    private emitAIThinking(thinking: boolean) {
        this.aiThinkingListeners.forEach(l => l(thinking));
    }

    getElapsedTime(): number {
        if (!this.startTime) return 0;
        const end = this.endTime || Date.now();
        return end - this.startTime; // milliseconds
    }

}

export const game = new Game();
