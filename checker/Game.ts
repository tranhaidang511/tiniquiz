export type Player = 'RED' | 'BLACK';
export type PieceType = 'REGULAR' | 'KING';
export type GameState = 'MENU' | 'PLAYING' | 'RESULT';

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
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        // Place black pieces (top 3 rows)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
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

        // Place red pieces (bottom 3 rows)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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
            (piece.player === 'BLACK' && row === 7)) {
            piece.type = 'KING';
        }
    }

    private calculateValidMoves(piece: Piece): Move[] {
        console.log('calculateValidMoves for', piece.player, 'at', piece.row, piece.col);

        const captureMoves = this.getCaptureMoves(piece);
        console.log('Capture moves:', captureMoves.length);

        if (captureMoves.length > 0) {
            return captureMoves;
        }

        const allPieces = this.getAllPieces(this.currentPlayer);
        console.log('All pieces for', this.currentPlayer, ':', allPieces.length);

        for (const p of allPieces) {
            if (p.row === piece.row && p.col === piece.col) continue;
            const otherCaptures = this.getCaptureMoves(p);
            if (otherCaptures.length > 0) {
                console.log('Another piece at', p.row, p.col, 'can capture! Blocking this piece');
                return [];
            }
        }

        const regularMoves = this.getRegularMoves(piece);
        console.log('Regular moves:', regularMoves);
        return regularMoves;
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

        if (landRow < 0 || landRow > 7 || landCol < 0 || landCol > 7) {
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

        if (landRow < 0 || landRow > 7 || landCol < 0 || landCol > 7) {
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
        console.log('getRegularMoves for', piece.player, 'piece at', piece.row, piece.col);
        const moves: Move[] = [];
        const directions = piece.type === 'KING'
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'RED'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        console.log('Directions:', directions);

        for (const [dRow, dCol] of directions) {
            const newRow = piece.row + dRow;
            const newCol = piece.col + dCol;

            console.log(`Checking (${newRow}, ${newCol})`);

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const cellContent = this.board[newRow][newCol];
                console.log(`Cell at (${newRow}, ${newCol}) is:`, cellContent);

                if (cellContent === null) {
                    console.log(`Adding move to (${newRow}, ${newCol})`);
                    moves.push({
                        from: { row: piece.row, col: piece.col },
                        to: { row: newRow, col: newCol }
                    });
                }
            } else {
                console.log(`(${newRow}, ${newCol}) is out of bounds`);
            }
        }

        console.log('Total regular moves found:', moves.length);
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
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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
