import { ChessAI, type Difficulty } from './AI';

export type Player = 'WHITE' | 'BLACK';
export type PieceType = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';
export type GameState = 'MENU' | 'PLAYING' | 'CHECK' | 'CHECKMATE' | 'STALEMATE' | 'RESULT';

export interface Position {
    row: number;
    col: number;
}

export interface Piece {
    type: PieceType;
    player: Player;
    row: number;
    col: number;
    hasMoved: boolean;
}

export interface Move {
    from: Position;
    to: Position;
    captured?: Piece;
    special?: 'castling' | 'en-passant' | 'promotion';
    castlingSide?: 'kingside' | 'queenside';
}

class ChessGame {
    private board: (Piece | null)[][] = [];
    private currentPlayer: Player = 'WHITE';
    private gameState: GameState = 'MENU';
    private selectedPiece: Piece | null = null;
    private validMoves: Position[] = [];
    private moveHistory: Move[] = [];
    private capturedPieces: Piece[] = [];
    private enPassantTarget: Position | null = null;
    private lastMove: Move | null = null;
    private pendingPromotion: { row: number; col: number; move: Move } | null = null;
    private finalGameState: 'CHECKMATE' | 'STALEMATE' | null = null;

    // AI properties
    private gameMode: 'pvp' | 'pve' = 'pvp';
    private aiPlayer: Player | null = null;
    private aiDifficulty: Difficulty = 'medium';

    // Timer
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;

    // Event listeners
    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private promotionListeners: ((row: number, col: number) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];

    constructor() {
        this.initializeBoard();
    }

    initializeBoard() {
        // Create 8x8 board
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        // Setup pieces in standard chess starting position
        const backRow: PieceType[] = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];

        // Black pieces (top)
        for (let col = 0; col < 8; col++) {
            this.board[0][col] = { type: backRow[col], player: 'BLACK', row: 0, col, hasMoved: false };
            this.board[1][col] = { type: 'PAWN', player: 'BLACK', row: 1, col, hasMoved: false };
        }

        // White pieces (bottom)
        for (let col = 0; col < 8; col++) {
            this.board[6][col] = { type: 'PAWN', player: 'WHITE', row: 6, col, hasMoved: false };
            this.board[7][col] = { type: backRow[col], player: 'WHITE', row: 7, col, hasMoved: false };
        }
    }

    start(mode: 'pvp' | 'pve' = 'pvp', aiSide: Player | null = null, difficulty: Difficulty = 'medium') {
        this.initializeBoard();
        this.currentPlayer = 'WHITE';
        this.gameState = 'PLAYING';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.capturedPieces = [];
        this.enPassantTarget = null;
        this.lastMove = null;
        this.finalGameState = null;

        // Set game mode and AI properties
        this.gameMode = mode;
        this.aiPlayer = mode === 'pve' ? aiSide : null;
        this.aiDifficulty = difficulty;

        this.startTimer();
        this.notifyStateChange();
        this.notifyBoardUpdate();

        // If AI plays first (as White), make AI move
        if (this.gameMode === 'pve' && this.aiPlayer === 'WHITE') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    restart() {
        this.stopTimer();
        this.gameState = 'MENU';
        this.notifyStateChange();
    }

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.timerInterval = window.setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    selectPiece(row: number, col: number): boolean {
        const piece = this.board[row][col];

        // If clicking on a valid move square, make the move
        if (this.selectedPiece && this.validMoves.some(m => m.row === row && m.col === col)) {
            return this.makeMove(row, col);
        }

        // Can only select own pieces
        if (!piece || piece.player !== this.currentPlayer || (this.gameState !== 'PLAYING' && this.gameState !== 'CHECK')) {
            this.selectedPiece = null;
            this.validMoves = [];
            this.notifyBoardUpdate();
            return false;
        }

        this.selectedPiece = piece;
        this.validMoves = this.getValidMoves(piece);
        this.notifyBoardUpdate();
        return true;
    }

    makeMove(toRow: number, toCol: number): boolean {
        if (!this.selectedPiece) return false;

        const from = { row: this.selectedPiece.row, col: this.selectedPiece.col };
        const to = { row: toRow, col: toCol };

        // Check if move is valid
        if (!this.validMoves.some(m => m.row === toRow && m.col === toCol)) {
            return false;
        }

        const move: Move = { from, to };
        const targetPiece = this.board[toRow][toCol];

        // Handle capture
        if (targetPiece) {
            move.captured = targetPiece;
            this.capturedPieces.push(targetPiece);
        }

        // Handle en passant
        if (this.selectedPiece.type === 'PAWN' && this.enPassantTarget &&
            toRow === this.enPassantTarget.row && toCol === this.enPassantTarget.col) {
            const capturedRow = this.currentPlayer === 'WHITE' ? toRow + 1 : toRow - 1;
            const capturedPawn = this.board[capturedRow][toCol];
            if (capturedPawn) {
                move.captured = capturedPawn;
                move.special = 'en-passant';
                this.capturedPieces.push(capturedPawn);
                this.board[capturedRow][toCol] = null;
            }
        }

        // Handle castling
        if (this.selectedPiece.type === 'KING' && Math.abs(toCol - from.col) === 2) {
            move.special = 'castling';
            const isKingside = toCol > from.col;
            move.castlingSide = isKingside ? 'kingside' : 'queenside';

            // Move the rook
            const rookCol = isKingside ? 7 : 0;
            const newRookCol = isKingside ? toCol - 1 : toCol + 1;
            const rook = this.board[toRow][rookCol];
            if (rook) {
                this.board[toRow][newRookCol] = rook;
                this.board[toRow][rookCol] = null;
                rook.col = newRookCol;
                rook.hasMoved = true;
            }
        }

        // Execute the move
        this.board[toRow][toCol] = this.selectedPiece;
        this.board[from.row][from.col] = null;
        this.selectedPiece.row = toRow;
        this.selectedPiece.col = toCol;
        this.selectedPiece.hasMoved = true;

        // Check for pawn promotion
        if (this.selectedPiece.type === 'PAWN' && (toRow === 0 || toRow === 7)) {
            move.special = 'promotion';
            // Store pending promotion and wait for user choice
            this.pendingPromotion = { row: toRow, col: toCol, move };
            this.notifyPromotion(toRow, toCol);
            return true; // Don't complete the turn yet
        }

        // Update en passant target
        this.enPassantTarget = null;
        if (this.selectedPiece.type === 'PAWN' && Math.abs(toRow - from.row) === 2) {
            this.enPassantTarget = {
                row: this.currentPlayer === 'WHITE' ? toRow + 1 : toRow - 1,
                col: toCol
            };
        }

        this.lastMove = move;
        this.moveHistory.push(move);
        this.selectedPiece = null;
        this.validMoves = [];

        // Switch player
        this.currentPlayer = this.currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE';

        // Check game state
        this.checkGameState();

        this.notifyMove(move);
        this.notifyBoardUpdate();

        // Trigger AI move if in PvE mode and it's AI's turn
        if (this.gameMode === 'pve' && this.aiPlayer === this.currentPlayer && 
            (this.gameState === 'PLAYING' || this.gameState === 'CHECK')) {
            setTimeout(() => this.makeAIMove(), 500);
        }

        return true;
    }

    getValidMoves(piece: Piece): Position[] {
        let moves: Position[] = [];

        switch (piece.type) {
            case 'PAWN':
                moves = this.getPawnMoves(piece);
                break;
            case 'ROOK':
                moves = this.getRookMoves(piece);
                break;
            case 'KNIGHT':
                moves = this.getKnightMoves(piece);
                break;
            case 'BISHOP':
                moves = this.getBishopMoves(piece);
                break;
            case 'QUEEN':
                moves = this.getQueenMoves(piece);
                break;
            case 'KING':
                moves = this.getKingMoves(piece);
                break;
        }

        // Filter out moves that would leave king in check
        moves = moves.filter(move => !this.wouldBeInCheck(piece, move));

        return moves;
    }

    getPawnMoves(piece: Piece): Position[] {
        const moves: Position[] = [];
        const direction = piece.player === 'WHITE' ? -1 : 1;
        const startRow = piece.player === 'WHITE' ? 6 : 1;

        // Forward move
        const newRow = piece.row + direction;
        if (this.isInBounds(newRow, piece.col) && !this.board[newRow][piece.col]) {
            moves.push({ row: newRow, col: piece.col });

            // Double move from starting position
            if (piece.row === startRow) {
                const doubleRow = piece.row + 2 * direction;
                if (!this.board[doubleRow][piece.col]) {
                    moves.push({ row: doubleRow, col: piece.col });
                }
            }
        }

        // Diagonal captures
        for (const colOffset of [-1, 1]) {
            const newCol = piece.col + colOffset;
            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (target && target.player !== piece.player) {
                    moves.push({ row: newRow, col: newCol });
                }

                // En passant
                if (this.enPassantTarget &&
                    newRow === this.enPassantTarget.row &&
                    newCol === this.enPassantTarget.col) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getRookMoves(piece: Piece): Position[] {
        return this.getLinearMoves(piece, [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ]);
    }

    getKnightMoves(piece: Piece): Position[] {
        const moves: Position[] = [];
        const offsets = [
            { row: -2, col: -1 }, { row: -2, col: 1 },
            { row: -1, col: -2 }, { row: -1, col: 2 },
            { row: 1, col: -2 }, { row: 1, col: 2 },
            { row: 2, col: -1 }, { row: 2, col: 1 }
        ];

        for (const offset of offsets) {
            const newRow = piece.row + offset.row;
            const newCol = piece.col + offset.col;

            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.player !== piece.player) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getBishopMoves(piece: Piece): Position[] {
        return this.getLinearMoves(piece, [
            { row: -1, col: -1 },
            { row: -1, col: 1 },
            { row: 1, col: -1 },
            { row: 1, col: 1 }
        ]);
    }

    getQueenMoves(piece: Piece): Position[] {
        return this.getLinearMoves(piece, [
            { row: -1, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: -1 }, { row: 0, col: 1 },
            { row: -1, col: -1 }, { row: -1, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 1 }
        ]);
    }

    getKingMoves(piece: Piece): Position[] {
        const moves: Position[] = [];

        // Normal king moves
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) continue;

                const newRow = piece.row + rowOffset;
                const newCol = piece.col + colOffset;

                if (this.isInBounds(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (!target || target.player !== piece.player) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }

        // Castling
        if (!piece.hasMoved && !this.isInCheck(piece.player)) {
            // Kingside castling
            const kingsideRook = this.board[piece.row][7];
            if (kingsideRook && !kingsideRook.hasMoved &&
                !this.board[piece.row][5] && !this.board[piece.row][6]) {
                // Check if squares king moves through are not under attack
                if (!this.isSquareUnderAttack(piece.row, 5, piece.player) &&
                    !this.isSquareUnderAttack(piece.row, 6, piece.player)) {
                    moves.push({ row: piece.row, col: 6 });
                }
            }

            // Queenside castling
            const queensideRook = this.board[piece.row][0];
            if (queensideRook && !queensideRook.hasMoved &&
                !this.board[piece.row][1] && !this.board[piece.row][2] && !this.board[piece.row][3]) {
                // Check if squares king moves through are not under attack
                if (!this.isSquareUnderAttack(piece.row, 2, piece.player) &&
                    !this.isSquareUnderAttack(piece.row, 3, piece.player)) {
                    moves.push({ row: piece.row, col: 2 });
                }
            }
        }

        return moves;
    }

    getLinearMoves(piece: Piece, directions: Position[]): Position[] {
        const moves: Position[] = [];

        for (const dir of directions) {
            let newRow = piece.row + dir.row;
            let newCol = piece.col + dir.col;

            while (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];

                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.player !== piece.player) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }

                newRow += dir.row;
                newCol += dir.col;
            }
        }

        return moves;
    }

    wouldBeInCheck(piece: Piece, move: Position): boolean {
        // Simulate the move
        const originalRow = piece.row;
        const originalCol = piece.col;
        const targetPiece = this.board[move.row][move.col];

        this.board[move.row][move.col] = piece;
        this.board[originalRow][originalCol] = null;
        piece.row = move.row;
        piece.col = move.col;

        const inCheck = this.isInCheck(piece.player);

        // Undo the move
        this.board[originalRow][originalCol] = piece;
        this.board[move.row][move.col] = targetPiece;
        piece.row = originalRow;
        piece.col = originalCol;

        return inCheck;
    }

    isInCheck(player: Player): boolean {
        // Find the king
        let kingPos: Position | null = null;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'KING' && piece.player === player) {
                    kingPos = { row, col };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        return this.isSquareUnderAttack(kingPos.row, kingPos.col, player);
    }

    isSquareUnderAttack(row: number, col: number, player: Player): boolean {
        const opponent = player === 'WHITE' ? 'BLACK' : 'WHITE';

        // Check all opponent pieces
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.player === opponent) {
                    const moves = this.getPieceMoves(piece);
                    if (moves.some(m => m.row === row && m.col === col)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getPieceMoves(piece: Piece): Position[] {
        switch (piece.type) {
            case 'PAWN':
                return this.getPawnAttackMoves(piece);
            case 'ROOK':
                return this.getRookMoves(piece);
            case 'KNIGHT':
                return this.getKnightMoves(piece);
            case 'BISHOP':
                return this.getBishopMoves(piece);
            case 'QUEEN':
                return this.getQueenMoves(piece);
            case 'KING':
                return this.getKingAttackMoves(piece);
            default:
                return [];
        }
    }

    getPawnAttackMoves(piece: Piece): Position[] {
        const moves: Position[] = [];
        const direction = piece.player === 'WHITE' ? -1 : 1;
        const newRow = piece.row + direction;

        for (const colOffset of [-1, 1]) {
            const newCol = piece.col + colOffset;
            if (this.isInBounds(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        }

        return moves;
    }

    getKingAttackMoves(piece: Piece): Position[] {
        const moves: Position[] = [];

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) continue;

                const newRow = piece.row + rowOffset;
                const newCol = piece.col + colOffset;

                if (this.isInBounds(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    checkGameState() {
        if (this.isInCheck(this.currentPlayer)) {
            if (this.hasNoLegalMoves(this.currentPlayer)) {
                this.gameState = 'CHECKMATE';
                this.finalGameState = 'CHECKMATE';
                this.stopTimer();
                setTimeout(() => {
                    this.gameState = 'RESULT';
                    this.notifyStateChange();
                }, 2000);
            } else {
                this.gameState = 'CHECK';
            }
        } else if (this.hasNoLegalMoves(this.currentPlayer)) {
            this.gameState = 'STALEMATE';
            this.finalGameState = 'STALEMATE';
            this.stopTimer();
            setTimeout(() => {
                this.gameState = 'RESULT';
                this.notifyStateChange();
            }, 2000);
        } else {
            this.gameState = 'PLAYING';
        }

        this.notifyStateChange();
    }

    hasNoLegalMoves(player: Player): boolean {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.player === player) {
                    const moves = this.getValidMoves(piece);
                    if (moves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    isInBounds(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    // Getters
    getBoard(): (Piece | null)[][] {
        return this.board;
    }

    getState(): GameState {
        return this.gameState;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    getSelectedPiece(): Piece | null {
        return this.selectedPiece;
    }

    getValidMovesForSelected(): Position[] {
        return this.validMoves;
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

    getMoveCount(): number {
        return this.moveHistory.length;
    }

    getLastMove(): Move | null {
        return this.lastMove;
    }

    getWinner(): Player | null {
        if (this.finalGameState === 'CHECKMATE') {
            return this.currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE';
        }
        return null;
    }

    getFinalGameState(): 'CHECKMATE' | 'STALEMATE' | null {
        return this.finalGameState;
    }

    getPendingPromotion(): { row: number; col: number; move: Move } | null {
        return this.pendingPromotion;
    }

    promotePawn(pieceType: 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN') {
        if (!this.pendingPromotion) return;

        const { row, col, move } = this.pendingPromotion;
        const piece = this.board[row][col];
        if (piece && piece.type === 'PAWN') {
            piece.type = pieceType;
        }

        // Complete the move
        this.enPassantTarget = null; // No en passant after promotion
        this.lastMove = move;
        this.moveHistory.push(move);
        this.selectedPiece = null;
        this.validMoves = [];

        // Clear promotion state
        this.pendingPromotion = null;

        // Continue with turn completion
        this.currentPlayer = this.currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE';
        this.checkGameState();
        this.notifyMove(move);
        this.notifyBoardUpdate();

        // Trigger AI move if in PvE mode and it's AI's turn
        if (this.gameMode === 'pve' && this.aiPlayer === this.currentPlayer && 
            (this.gameState === 'PLAYING' || this.gameState === 'CHECK')) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    private makeAIMove() {
        if ((this.gameState !== 'PLAYING' && this.gameState !== 'CHECK') || 
            this.gameMode !== 'pve' || this.aiPlayer !== this.currentPlayer) {
            return;
        }

        const bestMove = ChessAI.getBestMove(
            this.board,
            this.currentPlayer,
            this.aiDifficulty,
            (piece) => this.getValidMoves(piece)
        );

        if (bestMove) {
            // Select the piece
            const piece = this.board[bestMove.from.row][bestMove.from.col];
            if (piece && piece.player === this.currentPlayer) {
                this.selectedPiece = piece;
                this.validMoves = this.getValidMoves(piece);

                // Make the move
                this.makeMove(bestMove.to.row, bestMove.to.col);
            }
        }
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

    onPromotion(listener: (row: number, col: number) => void) {
        this.promotionListeners.push(listener);
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

    private notifyPromotion(row: number, col: number) {
        this.promotionListeners.forEach(listener => listener(row, col));
    }
}

// Create singleton instance
export const game = new ChessGame();
