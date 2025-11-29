import { CheckersAI } from './AI.ts';

export type Player = 'RED' | 'BLACK';
export type PieceType = 'REGULAR' | 'KING';
export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type BoardSize = 8 | 10 | 12;
export type GameMode = 'TWO_PLAYER' | 'VS_AI';

export interface Piece {
    player: Player;
    type: PieceType;
    row: number;
    col: number;
}

export interface Move {
    from: { row: number; col: number };
    to: { row: number; col: number };
    captures?: { row: number; col: number }[];
}

export interface Position {
    row: number;
    col: number;
}

class CheckersGame {
    private boardSize: BoardSize = 8;
    private forceJump: boolean = true;
    private board: (Piece | null)[][] = [];
    private currentPlayer: Player = 'RED';
    private gameState: GameState = 'MENU';
    private gameMode: GameMode = 'TWO_PLAYER';
    private selectedPiece: Piece | null = null;
    private validMoves: Move[] = [];
    private moveHistory: Move[] = [];
    private captureInProgress: boolean = false;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;
    private winner: Player | null = null;
    private ai: CheckersAI;
    private isAIThinking: boolean = false;

    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];
    private aiThinkingListeners: ((thinking: boolean) => void)[] = [];

    constructor() {
        this.ai = new CheckersAI(this);
        this.initializeBoard();
    }

    private initializeBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));

        // Determine number of rows based on board size
        // 8x8: 3 rows, 10x10: 4 rows, 12x12: 5 rows
        const pieceRows = this.boardSize === 8 ? 3 : this.boardSize === 10 ? 4 : 5;

        // Place black pieces (top rows)
        for (let row = 0; row < pieceRows; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = {
                        player: 'BLACK',
                        type: 'REGULAR',
                        row,
                        col
                    };
                }
            }
        }

        // Place red pieces (bottom rows)
        for (let row = this.boardSize - pieceRows; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = {
                        player: 'RED',
                        type: 'REGULAR',
                        row,
                        col
                    };
                }
            }
        }
    }

    setBoardSize(size: BoardSize) {
        this.boardSize = size;
    }

    setForceJump(enabled: boolean) {
        this.forceJump = enabled;
    }

    setGameMode(mode: GameMode) {
        this.gameMode = mode;
    }

    getForceJump(): boolean {
        return this.forceJump;
    }

    getBoardSize(): BoardSize {
        return this.boardSize;
    }

    getGameMode(): GameMode {
        return this.gameMode;
    }

    start() {
        this.initializeBoard();
        this.currentPlayer = 'RED';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.captureInProgress = false;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.winner = null;
        this.isAIThinking = false;

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

    selectPiece(row: number, col: number): boolean {
        if (this.gameState !== 'PLAYING') return false;
        if (this.isAIThinking) return false;

        // In VS_AI mode, only allow RED (Player) to select pieces
        if (this.gameMode === 'VS_AI' && this.currentPlayer !== 'RED') return false;

        const piece = this.board[row][col];

        if (!piece || piece.player !== this.currentPlayer) {
            return false;
        }

        if (this.captureInProgress && this.selectedPiece) {
            if (this.selectedPiece.row !== row || this.selectedPiece.col !== col) {
                return false;
            }
        }

        this.selectedPiece = piece;
        this.validMoves = this.calculateValidMoves(piece);
        this.notifyBoardUpdate();
        return true;
    }

    makeMove(toRow: number, toCol: number): boolean {
        if (!this.selectedPiece || this.gameState !== 'PLAYING') {
            return false;
        }
        if (this.isAIThinking) return false;

        const move = this.validMoves.find(m =>
            m.to.row === toRow && m.to.col === toCol
        );

        if (!move) {
            return false;
        }

        this.executeMove(move);
        this.checkKingPromotion(toRow, toCol);

        if (move.captures && move.captures.length > 0) {
            const piece = this.board[toRow][toCol];
            if (piece) {
                const moreCaptures = this.getCaptureMoves(piece);
                if (moreCaptures.length > 0) {
                    this.captureInProgress = true;
                    this.selectedPiece = piece;
                    this.validMoves = moreCaptures;
                    this.notifyBoardUpdate();
                    return true;
                }
            }
        }

        this.captureInProgress = false;
        this.selectedPiece = null;
        this.validMoves = [];
        this.switchPlayer();
        this.checkWinCondition();
        this.notifyBoardUpdate();

        // Trigger AI move if applicable
        if (this.gameState === 'PLAYING' && this.gameMode === 'VS_AI' && this.currentPlayer === 'BLACK') {
            this.makeAIMove();
        }

        return true;
    }

    private async makeAIMove() {
        this.isAIThinking = true;
        this.notifyAIThinking(true);

        // Small delay for UX
        setTimeout(() => {
            const move = this.ai.getBestMove(this.board, 'BLACK');

            if (move) {
                this.executeAIMoveSequence(move);
            } else {
                // AI has no moves, it loses (should be handled by checkWinCondition, but just in case)
                this.endGame('RED');
                this.isAIThinking = false;
                this.notifyAIThinking(false);
            }
        }, 500);
    }

    private executeAIMoveSequence(move: Move) {
        // Execute the move
        this.executeMove(move);
        this.checkKingPromotion(move.to.row, move.to.col);

        // Check for multi-captures
        if (move.captures && move.captures.length > 0) {
            const piece = this.board[move.to.row][move.to.col];
            if (piece) {
                const moreCaptures = this.getCaptureMoves(piece);
                if (moreCaptures.length > 0) {
                    // AI must continue capturing
                    // For simplicity in this version, we'll just pick the first available capture
                    // A better AI would look ahead for the best multi-capture path
                    // But getBestMove should ideally return the full sequence or we just greedily take next capture

                    // Recursive call with delay to show the jump
                    setTimeout(() => {
                        // We need to find which move corresponds to the best continuation
                        // For now, let's just pick the first one or ask AI again?
                        // Asking AI again is safer but might be overkill. 
                        // Let's just pick the first one for now as mandatory capture rule usually implies any capture is fine, 
                        // though strategy differs.
                        // Actually, let's ask AI for the best move from this specific state where it MUST capture with this piece
                        const nextMove = this.ai.getBestMove(this.board, 'BLACK');
                        if (nextMove) {
                            this.executeAIMoveSequence(nextMove);
                        } else {
                            this.finishAITurn();
                        }
                    }, 300);
                    return;
                }
            }
        }

        this.finishAITurn();
    }

    private finishAITurn() {
        this.switchPlayer();
        this.checkWinCondition();
        this.notifyBoardUpdate();
        this.isAIThinking = false;
        this.notifyAIThinking(false);
    }

    // Made public for AI to use
    public executeMove(move: Move, board: (Piece | null)[][] = this.board) {
        const piece = board[move.from.row][move.from.col];
        if (!piece) return;

        if (move.captures) {
            move.captures.forEach(cap => {
                board[cap.row][cap.col] = null;
            });
        }

        board[move.from.row][move.from.col] = null;

        // Update piece position if it's the main board
        if (board === this.board) {
            piece.row = move.to.row;
            piece.col = move.to.col;
            this.moveHistory.push(move);
            this.notifyMove(move);
        } else {
            // For simulation, we need to clone the piece effectively or handle it differently
            // Since we are modifying the board array directly, we just move the reference
            // But we shouldn't mutate the original piece object if we are simulating?
            // Actually, in simulation we clone the board, so the pieces are also cloned (shallow or deep)
            // We need to be careful about deep cloning the board for AI
        }

        board[move.to.row][move.to.col] = piece;
    }

    private checkKingPromotion(row: number, col: number) {
        const piece = this.board[row][col];
        if (!piece || piece.type === 'KING') return;

        if ((piece.player === 'RED' && row === 0) ||
            (piece.player === 'BLACK' && row === this.boardSize - 1)) {
            piece.type = 'KING';
        }
    }

    // Public for AI
    public calculateValidMoves(piece: Piece, board: (Piece | null)[][] = this.board): Move[] {
        const captureMoves = this.getCaptureMoves(piece, board);

        if (captureMoves.length > 0) {
            return captureMoves;
        }

        // Only enforce mandatory capture if forceJump is enabled
        if (this.forceJump) {
            const allPieces = this.getAllPieces(piece.player, board);

            for (const p of allPieces) {
                if (p.row === piece.row && p.col === piece.col) continue;
                const otherCaptures = this.getCaptureMoves(p, board);
                if (otherCaptures.length > 0) {
                    return [];
                }
            }
        }

        return this.getRegularMoves(piece, board);
    }

    // Public for AI
    public getCaptureMoves(piece: Piece, board: (Piece | null)[][] = this.board): Move[] {
        const moves: Move[] = [];
        const directions = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [dRow, dCol] of directions) {
            this.findCaptures(piece, dRow, dCol, [], moves, board);
        }

        return moves;
    }

    private findCaptures(
        piece: Piece,
        dRow: number,
        dCol: number,
        capturedSoFar: Position[],
        allMoves: Move[],
        board: (Piece | null)[][]
    ) {
        const enemyRow = piece.row + dRow;
        const enemyCol = piece.col + dCol;
        const landRow = piece.row + 2 * dRow;
        const landCol = piece.col + 2 * dCol;

        if (landRow < 0 || landRow >= this.boardSize || landCol < 0 || landCol >= this.boardSize) {
            return;
        }

        const enemyPiece = board[enemyRow][enemyCol];
        if (!enemyPiece || enemyPiece.player === piece.player) {
            return;
        }

        if (capturedSoFar.some(c => c.row === enemyRow && c.col === enemyCol)) {
            return;
        }

        if (board[landRow][landCol] !== null) {
            return;
        }

        const newCaptures = [...capturedSoFar, { row: enemyRow, col: enemyCol }];
        const move: Move = {
            from: { row: piece.row, col: piece.col }, // Keep original start
            to: { row: landRow, col: landCol },
            captures: newCaptures
        };

        // If this is a new path or extends an existing one
        // Note: This logic simplifies multi-jumps. 
        // We add the move. If we find further jumps, we'll add those AS WELL (or instead?)
        // Standard checkers rules: you must complete the jump sequence.
        // So we should only add the "terminal" states of jump sequences?
        // Or add all valid intermediate states? Usually you must complete the jump.
        // But for UI it's often step-by-step.
        // For AI, we want the full move.
        // Let's stick to the current logic: add this move. Then check for extensions.
        // If extensions exist, we might remove this one if "max capture" is required?
        // For now, let's just add all valid steps.

        // Actually, for AI we need the full sequence as one move or handle it step-by-step.
        // My UI handles step-by-step (captureInProgress).
        // So for AI, getBestMove should probably return the immediate next step.

        allMoves.push(move);

        const tempPiece = { ...piece, row: landRow, col: landCol };
        const jumpDirections = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [nextDRow, nextDCol] of jumpDirections) {
            this.findMultiCaptures(tempPiece, nextDRow, nextDCol, newCaptures, move, allMoves, board);
        }
    }

    private findMultiCaptures(
        piece: Piece,
        dRow: number,
        dCol: number,
        capturedSoFar: Position[],
        currentMove: Move,
        allMoves: Move[],
        board: (Piece | null)[][]
    ) {
        const enemyRow = piece.row + dRow;
        const enemyCol = piece.col + dCol;
        const landRow = piece.row + 2 * dRow;
        const landCol = piece.col + 2 * dCol;

        if (landRow < 0 || landRow >= this.boardSize || landCol < 0 || landCol >= this.boardSize) {
            return;
        }

        const enemyPiece = board[enemyRow][enemyCol];
        if (!enemyPiece || enemyPiece.player === piece.player) {
            return;
        }

        if (capturedSoFar.some(c => c.row === enemyRow && c.col === enemyCol)) {
            return;
        }

        if (board[landRow][landCol] !== null) {
            return;
        }

        const newCaptures = [...capturedSoFar, { row: enemyRow, col: enemyCol }];

        // If we found a longer sequence, remove the shorter prefix from valid moves
        // This enforces "maximize jump" locally if we want, but usually we just allow the user to keep jumping.
        // For AI, we want to know it CAN jump further.
        const index = allMoves.indexOf(currentMove);
        if (index > -1) {
            allMoves.splice(index, 1);
        }

        const extendedMove: Move = {
            from: currentMove.from,
            to: { row: landRow, col: landCol },
            captures: newCaptures
        };

        allMoves.push(extendedMove);

        const tempPiece = { ...piece, row: landRow, col: landCol };
        const jumpDirections = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [nextDRow, nextDCol] of jumpDirections) {
            this.findMultiCaptures(tempPiece, nextDRow, nextDCol, newCaptures, extendedMove, allMoves, board);
        }
    }

    // Public for AI
    public getRegularMoves(piece: Piece, board: (Piece | null)[][] = this.board): Move[] {
        const moves: Move[] = [];
        const directions = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [dRow, dCol] of directions) {
            const newRow = piece.row + dRow;
            const newCol = piece.col + dCol;

            if (newRow >= 0 && newRow < this.boardSize && newCol >= 0 && newCol < this.boardSize) {
                if (board[newRow][newCol] === null) {
                    moves.push({
                        from: { row: piece.row, col: piece.col },
                        to: { row: newRow, col: newCol }
                    });
                }
            }
        }

        return moves;
    }

    private switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'RED' ? 'BLACK' : 'RED';
    }

    private checkWinCondition() {
        const redPieces = this.getAllPieces('RED');
        const blackPieces = this.getAllPieces('BLACK');

        if (redPieces.length === 0) {
            this.endGame('BLACK');
        } else if (blackPieces.length === 0) {
            this.endGame('RED');
        } else {
            const hasValidMoves = this.currentPlayerHasMoves();
            if (!hasValidMoves) {
                const winner = this.currentPlayer === 'RED' ? 'BLACK' : 'RED';
                this.endGame(winner);
            }
        }
    }

    private currentPlayerHasMoves(): boolean {
        const pieces = this.getAllPieces(this.currentPlayer);
        for (const piece of pieces) {
            const moves = this.calculateValidMoves(piece);
            if (moves.length > 0) {
                return true;
            }
        }
        return false;
    }

    // Public for AI
    public getAllPieces(player: Player, board: (Piece | null)[][] = this.board): Piece[] {
        const pieces: Piece[] = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const piece = board[row][col];
                if (piece && piece.player === player) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    private endGame(winner: Player) {
        this.stopTimer();
        this.gameState = 'RESULT';
        this.winner = winner;
        this.notifyStateChange();
    }

    // Public getters
    getBoard(): (Piece | null)[][] {
        return this.board;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    getState(): GameState {
        return this.gameState;
    }

    getSelectedPiece(): Piece | null {
        return this.selectedPiece;
    }

    getValidMoves(): Move[] {
        return this.validMoves;
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

    onAIThinking(listener: (thinking: boolean) => void) {
        this.aiThinkingListeners.push(listener);
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

    private notifyAIThinking(thinking: boolean) {
        this.aiThinkingListeners.forEach(listener => listener(thinking));
    }
}

export const game = new CheckersGame();
