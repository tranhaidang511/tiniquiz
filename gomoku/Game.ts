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
    private aiSide: Player | null = null;
    private isAIThinking: boolean = false;
    private startTime: number | null = null;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((stone: Stone) => void)[] = [];
    private boardListeners: ((board: (Player | null)[][]) => void)[] = [];
    private aiThinkingListeners: ((thinking: boolean) => void)[] = [];
    private timerUpdateListeners: ((elapsed: number) => void)[] = [];

    constructor() {
        this.ai = new GomokuAI(this.boardSize);
        this.initializeBoard();
    }

    setAISide(side: Player | null) {
        this.aiSide = side;
    }

    getAISide(): Player | null {
        return this.aiSide;
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
        this.elapsedTime = 0;
        this.setState('PLAYING');
        this.emitBoard();
        this.startTimer();

        // If AI plays BLACK (first), trigger move
        if (this.mode === 'VS_AI' && this.aiSide === 'BLACK') {
            this.makeAIMove();
        }
    }

    makeMove(row: number, col: number): boolean {
        if (this.state !== 'PLAYING') return false;
        if (this.isAIThinking) return false; // Block moves during AI turn
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return false;
        if (this.board[row][col] !== null) return false;

        // In VS_AI mode, only allow player (non-AI) to make moves
        if (this.mode === 'VS_AI' && this.currentPlayer === this.aiSide) return false;

        // Place stone
        const stone: Stone = { row, col, player: this.currentPlayer };
        this.board[row][col] = this.currentPlayer;
        this.moves.push(stone);

        // Check for win
        if (this.checkWin(row, col)) {
            this.winner = this.currentPlayer;
            this.emitMove(stone); // Emit before ending game
            this.setState('RESULT');
            return true;
        }

        // Check for draw (board full)
        if (this.moves.length === this.boardSize * this.boardSize) {
            this.emitMove(stone); // Emit before ending game
            this.setState('RESULT');
            return true;
        }

        // Switch player BEFORE emitting move so turn indicator updates correctly
        this.currentPlayer = this.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
        this.emitMove(stone); // Emit after turn switch

        // If VS_AI mode and now it's AI's turn, trigger AI move
        if (this.mode === 'VS_AI' && this.currentPlayer === this.aiSide) {
            this.makeAIMove();
        }

        return true;
    }

    private async makeAIMove() {
        // Add small delay for better UX
        this.isAIThinking = true;
        this.emitAIThinking(true);

        setTimeout(() => {
            const aiSide = this.aiSide || 'WHITE';
            const aiMove = this.ai.getBestMove(this.board, aiSide);

            if (aiMove) {
                // Place AI's stone
                const stone: Stone = { row: aiMove.row, col: aiMove.col, player: aiSide };
                this.board[aiMove.row][aiMove.col] = aiSide;
                this.moves.push(stone);

                // Check for win
                if (this.checkWin(aiMove.row, aiMove.col)) {
                    this.winner = aiSide;
                    this.emitMove(stone); // Emit before ending
                    this.setState('RESULT');
                    this.isAIThinking = false;
                    this.emitAIThinking(false);
                    return;
                }

                // Check for draw
                if (this.moves.length === this.boardSize * this.boardSize) {
                    this.emitMove(stone); // Emit before ending
                    this.setState('RESULT');
                    this.isAIThinking = false;
                    this.emitAIThinking(false);
                    return;
                }

                // Switch back to player BEFORE emitting
                this.currentPlayer = aiSide === 'BLACK' ? 'WHITE' : 'BLACK';
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
        this.stopTimer();
        this.setState('MENU');
    }

    private startTimer() {
        this.stopTimer();
        this.timerInterval = window.setInterval(() => {
            if (this.startTime) {
                this.elapsedTime = Date.now() - this.startTime;
                this.emitTimerUpdate();
            }
        }, 1000);
    }

    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // --- State Management ---

    private setState(newState: GameState) {
        this.state = newState;
        if (newState !== 'PLAYING') {
            this.stopTimer();
        }
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
        return this.mode === 'VS_AI' && this.currentPlayer === this.aiSide;
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

    onTimerUpdate(listener: (elapsed: number) => void) {
        this.timerUpdateListeners.push(listener);
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

    private emitTimerUpdate() {
        this.timerUpdateListeners.forEach(l => l(this.elapsedTime));
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

}

export const game = new Game();
