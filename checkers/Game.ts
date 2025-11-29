export type Player = 'RED' | 'BLACK';
export type PieceType = 'REGULAR' | 'KING';
export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type BoardSize = 8 | 10 | 12;

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
    private selectedPiece: Piece | null = null;
    private validMoves: Move[] = [];
    private moveHistory: Move[] = [];
    private captureInProgress: boolean = false;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerInterval: number | null = null;
    private winner: Player | null = null;

    private stateChangeListeners: ((state: GameState) => void)[] = [];
    private moveListeners: ((move: Move) => void)[] = [];
    private boardUpdateListeners: (() => void)[] = [];

    constructor() {
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

    getBoardSize(): BoardSize {
        return this.boardSize;
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

        return true;
    }

    private executeMove(move: Move) {
        const piece = this.board[move.from.row][move.from.col];
        if (!piece) return;

        if (move.captures) {
            move.captures.forEach(cap => {
                this.board[cap.row][cap.col] = null;
            });
        }

        this.board[move.from.row][move.from.col] = null;
        piece.row = move.to.row;
        piece.col = move.to.col;
        this.board[move.to.row][move.to.col] = piece;

        this.moveHistory.push(move);
        this.notifyMove(move);
    }

    private checkKingPromotion(row: number, col: number) {
        const piece = this.board[row][col];
        if (!piece || piece.type === 'KING') return;

        if ((piece.player === 'RED' && row === 0) ||
            (piece.player === 'BLACK' && row === this.boardSize - 1)) {
            piece.type = 'KING';
        }
    }

    private calculateValidMoves(piece: Piece): Move[] {
        const captureMoves = this.getCaptureMoves(piece);

        if (captureMoves.length > 0) {
            return captureMoves;
        }

        // Only enforce mandatory capture if forceJump is enabled
        if (this.forceJump) {
            const allPieces = this.getAllPieces(this.currentPlayer);

            for (const p of allPieces) {
                if (p.row === piece.row && p.col === piece.col) continue;
                const otherCaptures = this.getCaptureMoves(p);
                if (otherCaptures.length > 0) {
                    return [];
                }
            }
        }

        return this.getRegularMoves(piece);
    }

    private getCaptureMoves(piece: Piece): Move[] {
        const moves: Move[] = [];
        const directions = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [dRow, dCol] of directions) {
            this.findCaptures(piece, dRow, dCol, [], moves);
        }

        return moves;
    }

    private findCaptures(
        piece: Piece,
        dRow: number,
        dCol: number,
        capturedSoFar: Position[],
        allMoves: Move[]
    ) {
        const enemyRow = piece.row + dRow;
        const enemyCol = piece.col + dCol;
        const landRow = piece.row + 2 * dRow;
        const landCol = piece.col + 2 * dCol;

        if (landRow < 0 || landRow >= this.boardSize || landCol < 0 || landCol >= this.boardSize) {
            return;
        }

        const enemyPiece = this.board[enemyRow][enemyCol];
        if (!enemyPiece || enemyPiece.player === piece.player) {
            return;
        }

        if (capturedSoFar.some(c => c.row === enemyRow && c.col === enemyCol)) {
            return;
        }

        if (this.board[landRow][landCol] !== null) {
            return;
        }

        const newCaptures = [...capturedSoFar, { row: enemyRow, col: enemyCol }];
        const move: Move = {
            from: { row: piece.row, col: piece.col },
            to: { row: landRow, col: landCol },
            captures: newCaptures
        };

        allMoves.push(move);

        const tempPiece = { ...piece, row: landRow, col: landCol };
        const jumpDirections = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        for (const [nextDRow, nextDCol] of jumpDirections) {
            this.findMultiCaptures(tempPiece, nextDRow, nextDCol, newCaptures, move, allMoves);
        }
    }

    private findMultiCaptures(
        piece: Piece,
        dRow: number,
        dCol: number,
        capturedSoFar: Position[],
        currentMove: Move,
        allMoves: Move[]
    ) {
        const enemyRow = piece.row + dRow;
        const enemyCol = piece.col + dCol;
        const landRow = piece.row + 2 * dRow;
        const landCol = piece.col + 2 * dCol;

        if (landRow < 0 || landRow >= this.boardSize || landCol < 0 || landCol >= this.boardSize) {
            return;
        }

        const enemyPiece = this.board[enemyRow][enemyCol];
        if (!enemyPiece || enemyPiece.player === piece.player) {
            return;
        }

        if (capturedSoFar.some(c => c.row === enemyRow && c.col === enemyCol)) {
            return;
        }

        if (this.board[landRow][landCol] !== null) {
            return;
        }

        const newCaptures = [...capturedSoFar, { row: enemyRow, col: enemyCol }];

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
            this.findMultiCaptures(tempPiece, nextDRow, nextDCol, newCaptures, extendedMove, allMoves);
        }
    }

    private getRegularMoves(piece: Piece): Move[] {
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
                if (this.board[newRow][newCol] === null) {
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

    private getAllPieces(player: Player): Piece[] {
        const pieces: Piece[] = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const piece = this.board[row][col];
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

export const game = new CheckersGame();
