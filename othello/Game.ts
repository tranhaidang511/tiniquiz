import { OthelloAI } from './AI';

export type Player = 'BLACK' | 'WHITE';
export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type GameMode = 'TWO_PLAYER' | 'VS_AI';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Position {
    row: number;
    col: number;
}

export interface Move {
    position: Position;
    player: Player;
    flipped: Position[];
}

class OthelloGame {
    private boardSize: number = 8;
    private board: (Player | null)[][] = [];
    private currentPlayer: Player = 'BLACK';
    private gameState: GameState = 'MENU';
    private gameMode: GameMode = 'TWO_PLAYER';
    private difficulty: Difficulty = 'MEDIUM';
    private moveHistory: Move[] = [];
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;
    private winner: Player | null = null;
    private ai: OthelloAI;

    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];

    constructor() {
        this.ai = new OthelloAI();
        this.initializeBoard();
    }

    private initializeBoard() {
        this.board = Array(this.boardSize).fill(null).map(() =>
            Array(this.boardSize).fill(null)
        );

        // Set up initial 4 pieces in the center
        const mid = this.boardSize / 2;
        this.board[mid - 1][mid - 1] = 'WHITE';
        this.board[mid - 1][mid] = 'BLACK';
        this.board[mid][mid - 1] = 'BLACK';
        this.board[mid][mid] = 'WHITE';
    }

    setGameMode(mode: GameMode) {
        this.gameMode = mode;
    }

    setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.ai.setDifficulty(difficulty);
    }

    getGameMode(): GameMode {
        return this.gameMode;
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    start() {
        this.initializeBoard();
        this.currentPlayer = 'BLACK';
        this.moveHistory = [];
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.winner = null;
        this.gameState = 'PLAYING';
        this.notifyStateChange();
        this.startTimer();
        this.notifyBoardUpdate();
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

    makeMove(row: number, col: number): boolean {
        if (this.gameState !== 'PLAYING') return false;
        if (this.board[row][col] !== null) return false;

        const flipped = this.getFlippedDiscs(row, col, this.currentPlayer);
        if (flipped.length === 0) return false;

        // Place disc
        this.board[row][col] = this.currentPlayer;

        // Flip discs
        flipped.forEach(pos => {
            this.board[pos.row][pos.col] = this.currentPlayer;
        });

        const move: Move = {
            position: { row, col },
            player: this.currentPlayer,
            flipped
        };
        this.moveHistory.push(move);

        // Switch player
        this.switchPlayer();

        // Check if next player has valid moves
        if (!this.hasValidMoves(this.currentPlayer)) {
            // Switch back
            this.switchPlayer();

            // Check if current player has valid moves
            if (!this.hasValidMoves(this.currentPlayer)) {
                // Game over
                this.endGame();
            }
        }

        this.notifyMove(move);
        this.notifyBoardUpdate();

        // Trigger AI move if applicable
        this.makeAIMove();

        return true;
    }

    makeAIMove(): void {
        if (this.gameState !== 'PLAYING') return;
        if (this.gameMode !== 'VS_AI') return;
        if (this.currentPlayer !== 'WHITE') return; // AI is always WHITE

        const aiMove = this.ai.getBestMove(this.board, 'WHITE');

        if (aiMove) {
            // Add slight delay for better UX
            setTimeout(() => {
                this.makeMove(aiMove.row, aiMove.col);
            }, 500);
        }
    }

    private getFlippedDiscs(row: number, col: number, player: Player): Position[] {
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

            // Check if next cell is opponent's disc
            while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
                if (this.board[r][c] === null) break;
                if (this.board[r][c] === opponent) {
                    tempFlipped.push({ row: r, col: c });
                    r += dr;
                    c += dc;
                } else if (this.board[r][c] === player) {
                    // Found our disc, add all flipped discs
                    flipped.push(...tempFlipped);
                    break;
                } else {
                    break;
                }
            }
        }

        return flipped;
    }

    getValidMoves(player: Player): Position[] {
        const validMoves: Position[] = [];

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    const flipped = this.getFlippedDiscs(row, col, player);
                    if (flipped.length > 0) {
                        validMoves.push({ row, col });
                    }
                }
            }
        }

        return validMoves;
    }

    private hasValidMoves(player: Player): boolean {
        return this.getValidMoves(player).length > 0;
    }

    private switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
    }

    private endGame() {
        this.stopTimer();

        // Count discs
        let blackCount = 0;
        let whiteCount = 0;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'BLACK') blackCount++;
                else if (this.board[row][col] === 'WHITE') whiteCount++;
            }
        }

        if (blackCount > whiteCount) {
            this.winner = 'BLACK';
        } else if (whiteCount > blackCount) {
            this.winner = 'WHITE';
        }
        // If equal, winner remains null (draw)

        this.gameState = 'RESULT';
        this.notifyStateChange();
    }

    getDiscCount(player: Player): number {
        let count = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === player) count++;
            }
        }
        return count;
    }

    // Public getters
    getBoard(): (Player | null)[][] {
        return this.board;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    getState(): GameState {
        return this.gameState;
    }

    getMoves(): Move[] {
        return this.moveHistory;
    }

    getWinner(): Player | null {
        return this.winner;
    }

    getElapsedTime(): number {
        return this.elapsedTime;
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

    private notifyStateChange() {
        this.stateChangeListeners.forEach(listener => listener(this.gameState));
    }

    private notifyMove(move: Move) {
        this.moveListeners.forEach(listener => listener(move));
    }

    private notifyBoardUpdate() {
        this.boardUpdateListeners.forEach(listener => listener());
    }
}

export const game = new OthelloGame();
