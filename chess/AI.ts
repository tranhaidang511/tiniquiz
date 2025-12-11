import type { Piece, Player, Position } from './Game';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
    PAWN: 100,
    KNIGHT: 320,
    BISHOP: 330,
    ROOK: 500,
    QUEEN: 900,
    KING: 20000
};

// Positional bonuses for pieces (8x8 grid, from black's perspective)
const PAWN_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
const KNIGHT_TABLE = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];
const BISHOP_TABLE = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];
const KING_TABLE = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
];
const KING_ENDGAME_TABLE = [
    [-50, -40, -30, -20, -20, -30, -40, -50],
    [-30, -20, -10, 0, 0, -10, -20, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -30, 0, 0, 0, 0, -30, -30],
    [-50, -30, -30, -30, -30, -30, -30, -50]
];
const ROOK_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
];
const QUEEN_TABLE = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
];

export class ChessAI {
    private static getSearchDepth(difficulty: Difficulty): number {
        switch (difficulty) {
            case 'easy': return 2;
            case 'medium': return 4;
            case 'hard': return 5;
        }
    }

    static getBestMove(
        board: (Piece | null)[][],
        player: Player,
        difficulty: Difficulty,
        getValidMoves: (piece: Piece) => Position[]
    ): { from: Position; to: Position } | null {
        const depth = this.getSearchDepth(difficulty);
        let bestMove: { from: Position; to: Position } | null = null;
        let bestScore = player === 'WHITE' ? -Infinity : Infinity;

        // Get all possible moves
        const moves = this.getAllPossibleMoves(board, player, getValidMoves);

        if (moves.length === 0) {
            return null;
        }

        // Evaluate each move
        for (const move of moves) {
            const newBoard = this.makeMove(board, move.from, move.to);
            const score = this.minimax(
                newBoard,
                depth - 1,
                -Infinity,
                Infinity,
                player === 'BLACK',
                getValidMoves
            );

            if (player === 'WHITE') {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    private static minimax(
        board: (Piece | null)[][],
        depth: number,
        alpha: number,
        beta: number,
        maximizingPlayer: boolean,
        getValidMoves: (piece: Piece) => Position[]
    ): number {
        if (depth === 0) {
            return this.evaluateBoard(board, getValidMoves);
        }

        const currentPlayer: Player = maximizingPlayer ? 'WHITE' : 'BLACK';
        const moves = this.getAllPossibleMoves(board, currentPlayer, getValidMoves);

        if (moves.length === 0) {
            // No moves available - check if it's checkmate or stalemate
            // For simplicity, return a very high/low score
            return maximizingPlayer ? -10000 : 10000;
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const newBoard = this.makeMove(board, move.from, move.to);
                const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, false, getValidMoves);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const newBoard = this.makeMove(board, move.from, move.to);
                const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, true, getValidMoves);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            return minEval;
        }
    }

    private static evaluateBoard(board: (Piece | null)[][], getValidMoves?: (piece: Piece) => Position[]): number {
        let score = 0;
        const isEndgamePhase = this.isEndgame(board);
        
        // Material and positional evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const baseValue = PIECE_VALUES[piece.type];
                    const positionalValue = this.getPositionalValue(piece, row, col, isEndgamePhase);
                    const pieceValue = baseValue + positionalValue;
                    score += piece.player === 'WHITE' ? pieceValue : -pieceValue;
                }
            }
        }
        
        // King safety (important in middlegame)
        if (!isEndgamePhase) {
            score += this.evaluateKingSafety(board, 'WHITE') * 2;
            score -= this.evaluateKingSafety(board, 'BLACK') * 2;
        }
        
        // Mobility (if getValidMoves provided)
        if (getValidMoves) {
            score += this.evaluateMobility(board, 'WHITE', getValidMoves) * 5;
            score -= this.evaluateMobility(board, 'BLACK', getValidMoves) * 5;
        }
        
        // Center control
        score += this.evaluateCenterControl(board);
        
        // Pawn structure
        score += this.evaluatePawnStructure(board);
        
        return score;
    }

    private static getPositionalValue(piece: Piece, row: number, col: number, isEndgame: boolean): number {
        // Flip row for white pieces (tables are from black's perspective)
        const tableRow = piece.player === 'WHITE' ? 7 - row : row;
        switch (piece.type) {
            case 'PAWN':
                return PAWN_TABLE[tableRow][col];
            case 'KNIGHT':
                return KNIGHT_TABLE[tableRow][col];
            case 'BISHOP':
                return BISHOP_TABLE[tableRow][col];
            case 'ROOK':
                return ROOK_TABLE[tableRow][col];
            case 'QUEEN':
                return QUEEN_TABLE[tableRow][col];
            case 'KING':
                return isEndgame ? KING_ENDGAME_TABLE[tableRow][col] : KING_TABLE[tableRow][col];
            default:
                return 0;
        }
    }

    private static isEndgame(board: (Piece | null)[][]): boolean {
        // Endgame if queens are off or very few pieces remain
        let queens = 0;
        let minorPieces = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    if (piece.type === 'QUEEN') queens++;
                    if (piece.type === 'KNIGHT' || piece.type === 'BISHOP') minorPieces++;
                }
            }
        }
        
        return queens === 0 || (queens === 2 && minorPieces <= 2);
    }
    private static evaluateKingSafety(board: (Piece | null)[][], player: Player): number {
        let safety = 0;
        
        // Find king position
        let kingRow = -1, kingCol = -1;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'KING' && piece.player === player) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }
        
        if (kingRow === -1) return 0;
        
        // Check pawn shield (for non-endgame)
        const isWhite = player === 'WHITE';
        const shieldRow = isWhite ? kingRow - 1 : kingRow + 1;
        
        if (shieldRow >= 0 && shieldRow < 8) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const col = kingCol + colOffset;
                if (col >= 0 && col < 8) {
                    const piece = board[shieldRow][col];
                    if (piece && piece.type === 'PAWN' && piece.player === player) {
                        safety += 10; // Bonus for pawn shield
                    }
                }
            }
        }
        
        // Penalty for king on open files
        let piecesOnKingFile = 0;
        for (let row = 0; row < 8; row++) {
            if (board[row][kingCol]) piecesOnKingFile++;
        }
        if (piecesOnKingFile <= 2) {
            safety -= 15; // Penalty for exposed king
        }
        
        // Bonus for castled position (king on g-file or c-file)
        if (kingCol === 6 || kingCol === 2) {
            safety += 25;
        }
        
        return safety;
    }
    private static evaluateMobility(board: (Piece | null)[][], player: Player, getValidMoves: (piece: Piece) => Position[]): number {
        let mobility = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.player === player) {
                    const moves = getValidMoves(piece);
                    mobility += moves.length;
                }
            }
        }
        
        return mobility;
    }
    private static evaluateCenterControl(board: (Piece | null)[][]): number {
        let score = 0;
        const centerSquares = [
            { row: 3, col: 3 }, { row: 3, col: 4 },
            { row: 4, col: 3 }, { row: 4, col: 4 }
        ];
        
        for (const square of centerSquares) {
            const piece = board[square.row][square.col];
            if (piece) {
                const value = piece.type === 'PAWN' ? 20 : 10;
                score += piece.player === 'WHITE' ? value : -value;
            }
        }
        
        // Extended center
        const extendedCenter = [
            { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 },
            { row: 3, col: 2 }, { row: 3, col: 5 },
            { row: 4, col: 2 }, { row: 4, col: 5 },
            { row: 5, col: 2 }, { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }
        ];
        
        for (const square of extendedCenter) {
            const piece = board[square.row][square.col];
            if (piece && piece.type === 'PAWN') {
                score += piece.player === 'WHITE' ? 5 : -5;
            }
        }
        
        return score;
    }
    private static evaluatePawnStructure(board: (Piece | null)[][]): number {
        let score = 0;
        
        for (let col = 0; col < 8; col++) {
            let whitePawns = 0;
            let blackPawns = 0;
            
            for (let row = 0; row < 8; row++) {
                const piece = board[row][col];
                if (piece && piece.type === 'PAWN') {
                    if (piece.player === 'WHITE') whitePawns++;
                    else blackPawns++;
                }
            }
            
            // Penalty for doubled pawns
            if (whitePawns > 1) score -= (whitePawns - 1) * 15;
            if (blackPawns > 1) score += (blackPawns - 1) * 15;
        }
        
        // Check for passed pawns
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'PAWN') {
                    if (this.isPassedPawn(board, row, col, piece.player)) {
                        const bonus = piece.player === 'WHITE' ? (7 - row) * 10 : row * 10;
                        score += piece.player === 'WHITE' ? bonus : -bonus;
                    }
                }
            }
        }
        
        return score;
    }
    private static isPassedPawn(board: (Piece | null)[][], row: number, col: number, player: Player): boolean {
        const direction = player === 'WHITE' ? -1 : 1;
        const startRow = player === 'WHITE' ? row - 1 : row + 1;
        const endRow = player === 'WHITE' ? 0 : 7;
        
        // Check if there are enemy pawns blocking this pawn's path
        for (let r = startRow; player === 'WHITE' ? r >= endRow : r <= endRow; r += direction) {
            if (r < 0 || r >= 8) break;
            
            for (let c = col - 1; c <= col + 1; c++) {
                if (c < 0 || c >= 8) continue;
                
                const piece = board[r][c];
                if (piece && piece.type === 'PAWN' && piece.player !== player) {
                    return false;
                }
            }
        }
        
        return true;
    }

    private static getAllPossibleMoves(
        board: (Piece | null)[][],
        player: Player,
        getValidMoves: (piece: Piece) => Position[]
    ): { from: Position; to: Position }[] {
        const moves: { from: Position; to: Position }[] = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.player === player) {
                    const validMoves = getValidMoves(piece);
                    for (const to of validMoves) {
                        moves.push({
                            from: { row, col },
                            to
                        });
                    }
                }
            }
        }

        return moves;
    }

    private static makeMove(
        board: (Piece | null)[][],
        from: Position,
        to: Position
    ): (Piece | null)[][] {
        // Create a deep copy of the board
        const newBoard = board.map(row => row.map(piece =>
            piece ? { ...piece } : null
        ));

        const piece = newBoard[from.row][from.col];
        if (piece) {
            newBoard[to.row][to.col] = { ...piece, row: to.row, col: to.col };
            newBoard[from.row][from.col] = null;
        }

        return newBoard;
    }
}
