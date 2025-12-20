
import { XiangqiAI } from './AI';

export const Side = {
    RED: 'RED',
    BLACK: 'BLACK'
} as const;
export type Side = typeof Side[keyof typeof Side];
// Actually Chess uses 'WHITE' | 'BLACK'. Xiangqi uses Red/Black. I will use 'RED' | 'BLACK' for consistency in capitalization.

export type PieceType = 'general' | 'advisor' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';
export type GameState = 'MENU' | 'PLAYING' | 'CHECK' | 'CHECKMATE' | 'STALEMATE' | 'RESULT'; // Added RESULT/MENU

export interface Piece {
    type: PieceType;
    side: Side;
    row: number; // Added row/col to Piece to match Chess structure
    col: number;
}

export interface Position {
    row: number;
    col: number;
}

export interface Move {
    from: Position;
    to: Position;
    captured?: Piece;
}

export class XiangqiGame {
    board: (Piece | null)[][];
    turn: Side;
    gameState: GameState;
    winner: Side | null;
    history: Move[];

    // AI & Settings
    private gameMode: 'pvp' | 'pve' = 'pvp';
    private aiSide: Side | null = null;
    private aiDifficulty: number = 3;

    // Timer
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;

    // Selection
    private selectedPiece: Piece | null = null;
    private validMoves: Position[] = [];
    private lastMove: Move | null = null;

    // Events
    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];

    constructor() {
        this.board = this.createBoard();
        this.turn = 'RED';
        this.gameState = 'MENU';
        this.winner = null;
        this.history = [];
    }

    // --- API for Main.ts (Matching Chess API) ---

    start(mode: 'pvp' | 'pve' = 'pvp', aiSide: 'RED' | 'BLACK' | null = null, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        this.reset();
        this.gameMode = mode;
        this.aiSide = aiSide as Side | null; // Cast generic string to Side

        // Map difficulty string to depth
        const depthMap = { 'easy': 1, 'medium': 3, 'hard': 5 };
        this.aiDifficulty = depthMap[difficulty];

        this.gameState = 'PLAYING';
        this.startTimer();
        this.notifyStateChange();
        this.notifyBoardUpdate(); // Initial render

        // AI Move if AI is RED (starts)
        if (this.gameMode === 'pve' && this.aiSide === 'RED') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    restart() {
        this.stopTimer();
        this.gameState = 'MENU';
        this.notifyStateChange();
    }

    selectPiece(row: number, col: number): boolean {
        // If game over or menu, ignore
        if (this.gameState !== 'PLAYING' && this.gameState !== 'CHECK') return false;

        // If clicking on a valid move
        if (this.selectedPiece && this.validMoves.some(m => m.row === row && m.col === col)) {
            return this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
        }

        const piece = this.getPiece(row, col);
        // Can only select own pieces
        if (!piece || piece.side !== this.turn) {
            this.selectedPiece = null;
            this.validMoves = [];
            this.notifyBoardUpdate();
            return false;
        }

        this.selectedPiece = piece;
        // Generate valid moves
        this.validMoves = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.isValidMove(piece.row, piece.col, r, c)) {
                    this.validMoves.push({ row: r, col: c });
                }
            }
        }
        this.notifyBoardUpdate();
        return true;
    }

    // --- Core Logic ---

    createBoard(): (Piece | null)[][] {
        return Array(10).fill(null).map(() => Array(9).fill(null));
    }

    reset() {
        this.board = this.createBoard();
        this.turn = 'RED';
        this.gameState = 'MENU';
        this.winner = null;
        this.history = [];
        this.lastMove = null;
        this.selectedPiece = null;
        this.validMoves = [];
        this.setupBoard();
    }

    setupBoard() {
        const place = (r: number, c: number, type: PieceType, side: Side) => {
            this.board[r][c] = { type, side, row: r, col: c };
        };

        // Black (Top, rows 0-4)
        place(0, 0, 'chariot', 'BLACK');
        place(0, 1, 'horse', 'BLACK');
        place(0, 2, 'elephant', 'BLACK');
        place(0, 3, 'advisor', 'BLACK');
        place(0, 4, 'general', 'BLACK');
        place(0, 5, 'advisor', 'BLACK');
        place(0, 6, 'elephant', 'BLACK');
        place(0, 7, 'horse', 'BLACK');
        place(0, 8, 'chariot', 'BLACK');
        place(2, 1, 'cannon', 'BLACK');
        place(2, 7, 'cannon', 'BLACK');
        place(3, 0, 'soldier', 'BLACK');
        place(3, 2, 'soldier', 'BLACK');
        place(3, 4, 'soldier', 'BLACK');
        place(3, 6, 'soldier', 'BLACK');
        place(3, 8, 'soldier', 'BLACK');

        // Red (Bottom, rows 5-9)
        place(9, 0, 'chariot', 'RED');
        place(9, 1, 'horse', 'RED');
        place(9, 2, 'elephant', 'RED');
        place(9, 3, 'advisor', 'RED');
        place(9, 4, 'general', 'RED');
        place(9, 5, 'advisor', 'RED');
        place(9, 6, 'elephant', 'RED');
        place(9, 7, 'horse', 'RED');
        place(9, 8, 'chariot', 'RED');
        place(7, 1, 'cannon', 'RED');
        place(7, 7, 'cannon', 'RED');
        place(6, 0, 'soldier', 'RED');
        place(6, 2, 'soldier', 'RED');
        place(6, 4, 'soldier', 'RED');
        place(6, 6, 'soldier', 'RED');
        place(6, 8, 'soldier', 'RED');
    }

    getPiece(row: number, col: number): Piece | null {
        if (row < 0 || row > 9 || col < 0 || col > 8) return null;
        return this.board[row][col];
    }

    makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number, isInternal: boolean = false): boolean {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;

        const target = this.board[toRow][toCol];

        // Execute move
        this.board[toRow][toCol] = { ...piece, row: toRow, col: toCol };
        this.board[fromRow][fromCol] = null;

        const move = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: target || undefined
        };

        this.history.push(move);
        this.lastMove = move;

        if (!isInternal) {
            this.selectedPiece = null;
            this.validMoves = [];
        }

        // Switch turn
        this.turn = this.turn === 'RED' ? 'BLACK' : 'RED';

        this.updateGameState(isInternal);

        if (!isInternal) {
            this.notifyMove(move);
            this.notifyBoardUpdate();

            // AI Move
            if (this.gameMode === 'pve' && this.turn === this.aiSide && !this.isGameOver()) {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }

        return true;
    }

    // --- Validation Logic ---

    isInPalace(row: number, col: number, side: Side): boolean {
        if (col < 3 || col > 5) return false;
        if (side === 'BLACK') return row >= 0 && row <= 2;
        if (side === 'RED') return row >= 7 && row <= 9;
        return false;
    }

    hasCrossedRiver(row: number, side: Side): boolean {
        if (side === 'RED') return row < 5;
        if (side === 'BLACK') return row > 4;
        return false;
    }

    isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
        if (fromRow < 0 || fromRow > 9 || fromCol < 0 || fromCol > 8) return false;
        if (toRow < 0 || toRow > 9 || toCol < 0 || toCol > 8) return false;
        if (fromRow === toRow && fromCol === toCol) return false;

        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        if (piece.side !== this.turn) return false;

        const target = this.board[toRow][toCol];
        if (target && target.side === piece.side) return false;

        let basicMoveValid = false;
        switch (piece.type) {
            case 'general': basicMoveValid = this.validateGeneralMove(fromRow, fromCol, toRow, toCol, piece.side); break;
            case 'advisor': basicMoveValid = this.validateAdvisorMove(fromRow, fromCol, toRow, toCol, piece.side); break;
            case 'elephant': basicMoveValid = this.validateElephantMove(fromRow, fromCol, toRow, toCol, piece.side); break;
            case 'horse': basicMoveValid = this.validateHorseMove(fromRow, fromCol, toRow, toCol); break;
            case 'chariot': basicMoveValid = this.validateChariotMove(fromRow, fromCol, toRow, toCol); break;
            case 'cannon': basicMoveValid = this.validateCannonMove(fromRow, fromCol, toRow, toCol, target !== null); break;
            case 'soldier': basicMoveValid = this.validateSoldierMove(fromRow, fromCol, toRow, toCol, piece.side); break;
        }

        if (!basicMoveValid) return false;
        if (this.causesFlyingGeneral(fromRow, fromCol, toRow, toCol)) return false;
        if (this.leavesKingInCheck(fromRow, fromCol, toRow, toCol, piece.side)) return false;

        return true;
    }

    // Piece validation helpers (same range checks as before)
    validateGeneralMove(r1: number, c1: number, r2: number, c2: number, side: Side) {
        if (!this.isInPalace(r2, c2, side)) return false;
        return (Math.abs(r2 - r1) + Math.abs(c2 - c1) === 1);
    }
    validateAdvisorMove(r1: number, c1: number, r2: number, c2: number, side: Side) {
        if (!this.isInPalace(r2, c2, side)) return false;
        return (Math.abs(r2 - r1) === 1 && Math.abs(c2 - c1) === 1);
    }
    validateElephantMove(r1: number, c1: number, r2: number, c2: number, side: Side) {
        if (this.hasCrossedRiver(r2, side)) return false;
        if (Math.abs(r2 - r1) !== 2 || Math.abs(c2 - c1) !== 2) return false;
        if (this.board[(r1 + r2) / 2][(c1 + c2) / 2] !== null) return false;
        return true;
    }
    validateHorseMove(r1: number, c1: number, r2: number, c2: number) {
        const dr = Math.abs(r2 - r1);
        const dc = Math.abs(c2 - c1);
        if (!((dr === 2 && dc === 1) || (dr === 1 && dc === 2))) return false;
        if (dr === 2) return this.board[r1 + (r2 > r1 ? 1 : -1)][c1] === null;
        else return this.board[r1][c1 + (c2 > c1 ? 1 : -1)] === null;
    }
    validateChariotMove(r1: number, c1: number, r2: number, c2: number) {
        if (r1 !== r2 && c1 !== c2) return false;
        return this.countPiecesBetween(r1, c1, r2, c2) === 0;
    }
    validateCannonMove(r1: number, c1: number, r2: number, c2: number, isCapture: boolean) {
        if (r1 !== r2 && c1 !== c2) return false;
        const cnt = this.countPiecesBetween(r1, c1, r2, c2);
        return isCapture ? cnt === 1 : cnt === 0;
    }
    validateSoldierMove(r1: number, c1: number, r2: number, c2: number, side: Side) {
        const dr = r2 - r1;
        const dc = Math.abs(c2 - c1);
        const forward = side === 'RED' ? -1 : 1;
        if (this.hasCrossedRiver(r1, side)) {
            return (dr === forward && dc === 0) || (dr === 0 && dc === 1);
        } else {
            return (dr === forward && dc === 0);
        }
    }

    countPiecesBetween(r1: number, c1: number, r2: number, c2: number): number {
        let count = 0;
        if (r1 === r2) {
            const min = Math.min(c1, c2), max = Math.max(c1, c2);
            for (let c = min + 1; c < max; c++) if (this.board[r1][c] !== null) count++;
        } else {
            const min = Math.min(r1, r2), max = Math.max(r1, r2);
            for (let r = min + 1; r < max; r++) if (this.board[r][c1] !== null) count++;
        }
        return count;
    }

    findGeneral(side: Side): Position | null {
        for (let r = 0; r < 10; r++) for (let c = 0; c < 9; c++) {
            const p = this.board[r][c];
            if (p && p.type === 'general' && p.side === side) return { row: r, col: c };
        }
        return null;
    }

    causesFlyingGeneral(r1: number, c1: number, r2: number, c2: number): boolean {
        const piece = this.board[r1][c1];
        const target = this.board[r2][c2];
        this.board[r2][c2] = { ...piece!, row: r2, col: c2 };
        this.board[r1][c1] = null;

        const rGen = this.findGeneral('RED');
        const bGen = this.findGeneral('BLACK');
        let flying = false;
        if (rGen && bGen && rGen.col === bGen.col) {
            if (this.countPiecesBetween(rGen.row, rGen.col, bGen.row, bGen.col) === 0) flying = true;
        }

        this.board[r1][c1] = piece;
        this.board[r2][c2] = target;
        return flying;
    }

    leavesKingInCheck(r1: number, c1: number, r2: number, c2: number, side: Side): boolean {
        const piece = this.board[r1][c1];
        const target = this.board[r2][c2];
        this.board[r2][c2] = { ...piece!, row: r2, col: c2 };
        this.board[r1][c1] = null;

        const check = this.isChecked(side);

        this.board[r1][c1] = piece;
        this.board[r2][c2] = target;
        return check;
    }

    isChecked(side: Side): boolean {
        const genPos = this.findGeneral(side);
        if (!genPos) return true; // Captured? should not happen

        const opponent = side === 'RED' ? 'BLACK' : 'RED';
        for (let r = 0; r < 10; r++) for (let c = 0; c < 9; c++) {
            const p = this.board[r][c];
            if (p && p.side === opponent) {
                // Check if p attacks genPos
                let attacks = false;
                switch (p.type) {
                    case 'general': attacks = this.validateGeneralMove(r, c, genPos.row, genPos.col, opponent); break;
                    case 'advisor': attacks = this.validateAdvisorMove(r, c, genPos.row, genPos.col, opponent); break;
                    case 'elephant': attacks = this.validateElephantMove(r, c, genPos.row, genPos.col, opponent); break;
                    case 'horse': attacks = this.validateHorseMove(r, c, genPos.row, genPos.col); break;
                    case 'chariot': attacks = this.validateChariotMove(r, c, genPos.row, genPos.col); break;
                    case 'cannon': attacks = this.validateCannonMove(r, c, genPos.row, genPos.col, true); break;
                    case 'soldier': attacks = this.validateSoldierMove(r, c, genPos.row, genPos.col, opponent); break;
                }
                if (attacks) return true;
            }
        }
        return false;
    }

    // --- State Management ---

    updateGameState(silent: boolean = false) {
        if (this.isNoMoves(this.turn)) {
            // No moves = loss
            this.gameState = 'CHECKMATE';
            this.winner = this.turn === 'RED' ? 'BLACK' : 'RED';
            this.finalGameState = 'CHECKMATE';

            if (!silent) {
                this.stopTimer();
                setTimeout(() => {
                    this.gameState = 'RESULT';
                    this.notifyStateChange();
                }, 2000);
            }
        } else if (this.isChecked(this.turn)) {
            this.gameState = 'CHECK';
        } else {
            this.gameState = 'PLAYING';
        }

        if (!silent) {
            this.notifyStateChange();
        }
    }
    private finalGameState: 'CHECKMATE' | 'STALEMATE' | null = null; // To match Chess logic

    isNoMoves(side: Side): boolean {
        for (let r1 = 0; r1 < 10; r1++) for (let c1 = 0; c1 < 9; c1++) {
            if (this.board[r1][c1]?.side === side) {
                for (let r2 = 0; r2 < 10; r2++) for (let c2 = 0; c2 < 9; c2++) {
                    if (this.isValidMove(r1, c1, r2, c2)) return false;
                }
            }
        }
        return true;
    }

    isGameOver(): boolean {
        return this.gameState === 'CHECKMATE' || this.gameState === 'STALEMATE' || this.gameState === 'RESULT';
    }

    // --- Undo for AI ---

    undoLastMove(): boolean {
        if (this.history.length === 0) return false;
        const last = this.history.pop();
        if (!last) return false;

        const piece = this.board[last.to.row][last.to.col];
        if (piece) {
            this.board[last.from.row][last.from.col] = { ...piece, row: last.from.row, col: last.from.col };
            this.board[last.to.row][last.to.col] = last.captured ? { ...last.captured, row: last.to.row, col: last.to.col } : null;
        }

        this.turn = this.turn === 'RED' ? 'BLACK' : 'RED';
        this.gameState = 'PLAYING'; // Simplified undo state
        this.winner = null;
        return true;
    }

    private makeAIMove() {
        if (this.gameMode !== 'pve' || this.turn !== this.aiSide || this.isGameOver()) return;

        const ai = new XiangqiAI(this); // Passing 'this'
        ai.searchDepth = this.aiDifficulty;
        const bestMove = ai.getBestMove();
        if (bestMove) {
            this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
        }
    }

    // --- Helpers for AI.ts (if needed) ---
    // AI.ts uses `game.board`, `game.turn`, `game.undoLastMove`, `game.makeMove`. 
    // Those are available. 

    // --- Timers & Events ---

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.timerInterval = window.setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Event Registration
    onStateChange(cb: (s: GameState) => void) { this.stateChangeListeners.push(cb); }
    onMove(cb: (m: Move) => void) { this.moveListeners.push(cb); }
    onBoardUpdate(cb: () => void) { this.boardUpdateListeners.push(cb); }

    // Notifiers
    notifyStateChange() { this.stateChangeListeners.forEach(cb => cb(this.gameState)); }
    notifyMove(m: Move) { this.moveListeners.forEach(cb => cb(m)); }
    notifyBoardUpdate() { this.boardUpdateListeners.forEach(cb => cb()); }

    // Getters
    getState() { return this.gameState; }
    getCurrentPlayer() { return this.turn; }
    getBoard() { return this.board; }
    getElapsedTime() { return this.elapsedTime; }
    getMoveCount() { return this.history.length; }
    getWinner() { return this.winner; }
    getFinalGameState() { return this.finalGameState; }
    getLastMove() { return this.lastMove; }
    getSelectedPiece() { return this.selectedPiece; }
    getValidMovesForSelected() { return this.validMoves; }
    getAIPlayer() { return this.aiSide; } // For board flipping
}

export const game = new XiangqiGame();
