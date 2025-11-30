import { MancalaAI, type Difficulty } from './AI';

export type Player = 'PLAYER1' | 'PLAYER2';
export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type GameMode = 'TWO_PLAYER' | 'VS_AI';
export type PitCount = 4 | 5 | 6 | 7 | 8;
export type { Difficulty };

export interface Move {
    player: Player;
    pitIndex: number;
    capturedStones?: number;
    extraTurn: boolean;
}

class MancalaGame {
    private pitCount: PitCount = 6;
    private initialStones: number = 4;
    private gameMode: GameMode = 'TWO_PLAYER';
    private difficulty: Difficulty = 'MEDIUM';
    private gameState: GameState = 'MENU';
    private currentPlayer: Player = 'PLAYER1';
    private board: number[] = [];
    private moveHistory: Move[] = [];
    private winner: Player | null = null;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;
    private lastMovePit: number | null = null;

    private ai: MancalaAI;
    private aiMoveListeners: (() => void)[] = [];
    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];

    constructor() {
        this.ai = new MancalaAI(this.difficulty);
        this.initializeBoard();
    }

    private initializeBoard() {
        // Board layout: [P1 pits..., P1 store, P2 pits..., P2 store]
        // For 6 pits: [0-5: P1 pits, 6: P1 store, 7-12: P2 pits, 13: P2 store]
        const totalPits = this.pitCount * 2 + 2;
        this.board = new Array(totalPits).fill(0);

        // Initialize pits with stones
        for (let i = 0; i < this.pitCount; i++) {
            this.board[i] = this.initialStones; // Player 1 pits
            this.board[i + this.pitCount + 1] = this.initialStones; // Player 2 pits
        }

        // Stores start at 0
        this.board[this.pitCount] = 0; // Player 1 store
        this.board[this.pitCount * 2 + 1] = 0; // Player 2 store
    }

    setPitCount(count: PitCount) {
        this.pitCount = count;
    }

    setInitialStones(count: number) {
        this.initialStones = count;
    }

    getInitialStones(): number {
        return this.initialStones;
    }

    setGameMode(mode: GameMode) {
        this.gameMode = mode;
    }

    setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.ai.setDifficulty(difficulty);
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    getPitCount(): PitCount {
        return this.pitCount;
    }

    getGameMode(): GameMode {
        return this.gameMode;
    }

    getLastMovePit(): number | null {
        return this.lastMovePit;
    }

    start() {
        this.initializeBoard();
        this.currentPlayer = 'PLAYER1';
        this.moveHistory = [];
        this.winner = null;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.gameState = 'PLAYING';
        this.notifyStateChange();
        this.startTimer();
    }

    restart() {
        this.stopTimer();
        this.gameState = 'MENU';
        this.notifyStateChange();
    }

    private startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = window.setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
        }, 1000);
    }

    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    isValidMove(pitIndex: number): boolean {
        if (this.gameState !== 'PLAYING') return false;

        const player1Range = pitIndex >= 0 && pitIndex < this.pitCount;
        const player2Range = pitIndex > this.pitCount && pitIndex < this.pitCount * 2 + 1;

        if (this.currentPlayer === 'PLAYER1') {
            return player1Range && this.board[pitIndex] > 0;
        } else {
            return player2Range && this.board[pitIndex] > 0;
        }
    }

    makeMove(pitIndex: number): boolean {
        if (!this.isValidMove(pitIndex)) return false;

        // Track the last move
        this.lastMovePit = pitIndex;

        const stones = this.board[pitIndex];
        this.board[pitIndex] = 0;

        let currentIndex = pitIndex;
        let stonesLeft = stones;
        let lastIndex = pitIndex;

        const player1Store = this.pitCount;
        const player2Store = this.pitCount * 2 + 1;
        const opponentStore = this.currentPlayer === 'PLAYER1' ? player2Store : player1Store;

        // Sow stones
        while (stonesLeft > 0) {
            currentIndex = (currentIndex + 1) % this.board.length;

            // Skip opponent's store
            if (currentIndex === opponentStore) {
                continue;
            }

            this.board[currentIndex]++;
            stonesLeft--;
            lastIndex = currentIndex;
        }

        let extraTurn = false;
        let capturedStones = 0;

        // Check if last stone landed in player's store
        const myStore = this.currentPlayer === 'PLAYER1' ? player1Store : player2Store;
        if (lastIndex === myStore) {
            extraTurn = true;
        } else {
            // Check for capture
            const isOnMySide = this.currentPlayer === 'PLAYER1'
                ? lastIndex < this.pitCount
                : lastIndex > this.pitCount && lastIndex < this.pitCount * 2 + 1;

            if (isOnMySide && this.board[lastIndex] === 1) {
                // Last stone landed in empty pit on my side
                const oppositeIndex = this.getOppositeIndex(lastIndex);
                const oppositeStones = this.board[oppositeIndex];

                if (oppositeStones > 0) {
                    // Capture
                    capturedStones = this.board[lastIndex] + oppositeStones;
                    this.board[myStore] += capturedStones;
                    this.board[lastIndex] = 0;
                    this.board[oppositeIndex] = 0;
                }
            }
        }

        const move: Move = {
            player: this.currentPlayer,
            pitIndex,
            capturedStones: capturedStones > 0 ? capturedStones : undefined,
            extraTurn
        };

        this.moveHistory.push(move);
        this.notifyMove(move);

        if (!extraTurn) {
            this.switchPlayer();
        }

        this.checkWinCondition();
        this.notifyBoardUpdate();

        // Trigger AI move if in VS_AI mode and it's AI's turn
        if (this.gameMode === 'VS_AI' && this.currentPlayer === 'PLAYER2' && this.gameState === 'PLAYING') {
            this.notifyAIMove();
        }

        return true;
    }

    async makeAIMove(): Promise<void> {
        if (this.gameMode !== 'VS_AI' || this.currentPlayer !== 'PLAYER2' || this.gameState !== 'PLAYING') {
            return;
        }

        // Add small delay to make AI moves feel more natural
        await new Promise(resolve => setTimeout(resolve, 1000));

        const bestMove = this.ai.getBestMove(this.getBoard(), this.pitCount, 'PLAYER2');

        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    private getOppositeIndex(index: number): number {
        const player1Store = this.pitCount;
        const player2Store = this.pitCount * 2 + 1;

        if (index < this.pitCount) {
            // Player 1 pit -> opposite Player 2 pit
            return player2Store - 1 - index;
        } else {
            // Player 2 pit -> opposite Player 1 pit
            return player1Store - 1 - (index - this.pitCount - 1);
        }
    }

    private switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1';
    }

    private checkWinCondition() {
        const player1Stones = this.board.slice(0, this.pitCount).reduce((sum, stones) => sum + stones, 0);
        const player2Stones = this.board.slice(this.pitCount + 1, this.pitCount * 2 + 1).reduce((sum, stones) => sum + stones, 0);

        if (player1Stones === 0 || player2Stones === 0) {
            // Game over - collect remaining stones
            const player1Store = this.pitCount;
            const player2Store = this.pitCount * 2 + 1;

            this.board[player1Store] += player1Stones;
            this.board[player2Store] += player2Stones;

            // Clear all pits
            for (let i = 0; i < this.pitCount; i++) {
                this.board[i] = 0;
                this.board[i + this.pitCount + 1] = 0;
            }

            // Determine winner
            if (this.board[player1Store] > this.board[player2Store]) {
                this.winner = 'PLAYER1';
            } else if (this.board[player2Store] > this.board[player1Store]) {
                this.winner = 'PLAYER2';
            } else {
                this.winner = null; // Draw
            }

            this.endGame();
        }
    }

    private endGame() {
        this.stopTimer();
        this.gameState = 'RESULT';
        this.notifyStateChange();
    }

    // Getters
    getBoard(): number[] {
        return [...this.board];
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    getState(): GameState {
        return this.gameState;
    }

    getWinner(): Player | null {
        return this.winner;
    }

    getMoves(): Move[] {
        return [...this.moveHistory];
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

    getPlayerScore(player: Player): number {
        const storeIndex = player === 'PLAYER1' ? this.pitCount : this.pitCount * 2 + 1;
        return this.board[storeIndex];
    }

    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Event listeners
    onStateChange(listener: (state: GameState) => void) {
        this.stateChangeListeners.push(listener);
    }

    onMove(listener: (move: Move) => void) {
        this.moveListeners.push(listener);
    }

    onBoardUpdate(listener: () => void) {
        this.boardUpdateListeners.push(listener);
    }

    onAIMove(listener: () => void) {
        this.aiMoveListeners.push(listener);
    }

    private notifyStateChange() {
        this.stateChangeListeners.forEach(listener => listener(this.gameState));
    }

    private notifyMove(move: Move) {
        this.moveListeners.forEach(listener => listener(move));
    }

    private notifyBoardUpdate() {
        this.boardUpdateListeners.forEach(listener => listener());
    }

    private notifyAIMove() {
        this.aiMoveListeners.forEach(listener => listener());
    }
}

export const game = new MancalaGame();
