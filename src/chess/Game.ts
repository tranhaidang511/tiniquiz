import { ChessAI } from "./AI";

export type Player = "WHITE" | "BLACK";
export type PieceType = "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING";
export type GameState = "MENU" | "PLAYING" | "CHECK" | "CHECKMATE" | "STALEMATE" | "RESULT";
export type GameMode = "TWO_PLAYER" | "VS_AI";

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
  special?: "CASTLING" | "EN_PASSANT" | "PROMOTION";
  castlingSide?: "KINGSIDE" | "QUEENSIDE";
}

export class ChessGame {
  private board: (Piece | null)[][] = [];
  private currentPlayer: Player = "WHITE";
  private gameState: GameState = "MENU";
  private selectedPiece: Piece | null = null;
  private validMoves: Position[] = [];
  private moveHistory: Move[] = [];
  private capturedPieces: Piece[] = [];
  private enPassantTarget: Position | null = null;
  private lastMove: Move | null = null;
  private pendingPromotion: { row: number; col: number; move: Move } | null = null;
  private finalGameState: "CHECKMATE" | "STALEMATE" | null = null;

  // AI properties
  private gameMode: GameMode = "TWO_PLAYER";
  private aiPlayer: Player | null = null;

  // Timer
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private timerInterval: number | null = null;

  // Event listeners
  private stateChangeListeners: ((state: GameState) => void)[] = [];
  private moveListeners: ((move: Move) => void)[] = [];
  private timerUpdateListeners: ((elapsed: number) => void)[] = [];
  private promotionListeners: ((row: number, col: number) => void)[] = [];
  private boardUpdateListeners: (() => void)[] = [];

  constructor() {
    this.initializeBoard();
  }

  initializeBoard() {
    // Create 8x8 board
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Setup pieces in standard chess starting position
    const backRow: PieceType[] = [
      "ROOK",
      "KNIGHT",
      "BISHOP",
      "QUEEN",
      "KING",
      "BISHOP",
      "KNIGHT",
      "ROOK",
    ];

    // Black pieces (top)
    for (let col = 0; col < 8; col++) {
      this.board[0][col] = { type: backRow[col], player: "BLACK", row: 0, col, hasMoved: false };
      this.board[1][col] = { type: "PAWN", player: "BLACK", row: 1, col, hasMoved: false };
    }

    // White pieces (bottom)
    for (let col = 0; col < 8; col++) {
      this.board[6][col] = { type: "PAWN", player: "WHITE", row: 6, col, hasMoved: false };
      this.board[7][col] = { type: backRow[col], player: "WHITE", row: 7, col, hasMoved: false };
    }
  }

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
  }

  setAISide(side: Player | null) {
    this.aiPlayer = side;
  }

  start() {
    this.initializeBoard();
    this.currentPlayer = "WHITE";
    this.gameState = "PLAYING";
    this.selectedPiece = null;
    this.validMoves = [];
    this.moveHistory = [];
    this.capturedPieces = [];
    this.enPassantTarget = null;
    this.lastMove = null;
    this.finalGameState = null;

    this.startTimer();
    this.notifyStateChange();
    this.notifyBoardUpdate();

    // If AI plays first (as White), make AI move
    if (this.gameMode === "VS_AI" && this.aiPlayer === "WHITE") {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  restart() {
    this.stopTimer();
    this.gameState = "MENU";
    this.notifyStateChange();
  }

  startTimer() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.timerInterval = window.setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.notifyTimerUpdate();
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
    if (this.selectedPiece && this.validMoves.some((m) => m.row === row && m.col === col)) {
      return this.makeMove(row, col);
    }

    // Can only select own pieces
    if (
      !piece ||
      piece.player !== this.currentPlayer ||
      (this.gameState !== "PLAYING" && this.gameState !== "CHECK")
    ) {
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
    if (!this.validMoves.some((m) => m.row === toRow && m.col === toCol)) {
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
    if (
      this.selectedPiece.type === "PAWN" &&
      this.enPassantTarget &&
      toRow === this.enPassantTarget.row &&
      toCol === this.enPassantTarget.col
    ) {
      const capturedRow = this.currentPlayer === "WHITE" ? toRow + 1 : toRow - 1;
      const capturedPawn = this.board[capturedRow][toCol];
      if (capturedPawn) {
        move.captured = capturedPawn;
        move.special = "EN_PASSANT";
        this.capturedPieces.push(capturedPawn);
        this.board[capturedRow][toCol] = null;
      }
    }

    // Handle castling
    if (this.selectedPiece.type === "KING" && Math.abs(toCol - from.col) === 2) {
      move.special = "CASTLING";
      const isKingside = toCol > from.col;
      move.castlingSide = isKingside ? "KINGSIDE" : "QUEENSIDE";

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
    this.executeMove(move, this.board);

    // Check for pawn promotion (only on the real board)
    if (move.special === "PROMOTION") {
      this.pendingPromotion = { row: toRow, col: toCol, move };
      this.notifyPromotion(toRow, toCol);
      return true;
    }

    this.lastMove = move;
    this.moveHistory.push(move);
    this.selectedPiece = null;
    this.validMoves = [];

    // Update en passant target for the next turn
    this.enPassantTarget = null;
    if (this.board[toRow][toCol]?.type === "PAWN" && Math.abs(toRow - from.row) === 2) {
      this.enPassantTarget = {
        row: this.currentPlayer === "WHITE" ? toRow + 1 : toRow - 1,
        col: toCol,
      };
    }

    // Switch player
    this.currentPlayer = this.currentPlayer === "WHITE" ? "BLACK" : "WHITE";

    // Check game state
    this.checkGameState();

    this.notifyMove(move);
    this.notifyBoardUpdate();

    // Trigger AI move if in VS_AI mode and it's AI's turn
    if (
      this.gameMode === "VS_AI" &&
      this.aiPlayer === this.currentPlayer &&
      (this.gameState === "PLAYING" || this.gameState === "CHECK")
    ) {
      setTimeout(() => this.makeAIMove(), 500);
    }

    return true;
  }

  executeMove(move: Move, board: (Piece | null)[][] = this.board) {
    const piece = board[move.from.row][move.from.col];
    if (!piece) return;

    const toRow = move.to.row;
    const toCol = move.to.col;

    // Handle en passant capture
    if (piece.type === "PAWN" && !board[toRow][toCol] && move.to.col !== move.from.col) {
      const capturedRow = piece.player === "WHITE" ? toRow + 1 : toRow - 1;
      board[capturedRow][toCol] = null;
      move.special = "EN_PASSANT";
    }

    // Handle castling
    if (piece.type === "KING" && Math.abs(toCol - move.from.col) === 2) {
      move.special = "CASTLING";
      const isKingside = toCol > move.from.col;
      move.castlingSide = isKingside ? "KINGSIDE" : "QUEENSIDE";

      // Move the rook
      const rookCol = isKingside ? 7 : 0;
      const newRookCol = isKingside ? toCol - 1 : toCol + 1;
      const rook = board[toRow][rookCol];
      if (rook) {
        board[toRow][newRookCol] = rook;
        board[toRow][rookCol] = null;
        rook.col = newRookCol;
        rook.row = toRow;
        rook.hasMoved = true;
      }
    }

    // Check for promotion (mark it, but caller handles the actual choice for the real board)
    if (piece.type === "PAWN" && (toRow === 0 || toRow === 7)) {
      move.special = "PROMOTION";
    }

    // Standard move/capture
    board[toRow][toCol] = piece;
    board[move.from.row][move.from.col] = null;
    piece.row = toRow;
    piece.col = toCol;
    piece.hasMoved = true;
  }

  getValidMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    let moves: Position[] = [];

    switch (piece.type) {
      case "PAWN":
        moves = this.getPawnMoves(piece, board);
        break;
      case "ROOK":
        moves = this.getRookMoves(piece, board);
        break;
      case "KNIGHT":
        moves = this.getKnightMoves(piece, board);
        break;
      case "BISHOP":
        moves = this.getBishopMoves(piece, board);
        break;
      case "QUEEN":
        moves = this.getQueenMoves(piece, board);
        break;
      case "KING":
        moves = this.getKingMoves(piece, board);
        break;
    }

    // Filter out moves that would leave king in check
    moves = moves.filter((move) => !this.wouldBeInCheck(piece, move, board));

    return moves;
  }

  getPawnMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    const moves: Position[] = [];
    const direction = piece.player === "WHITE" ? -1 : 1;
    const startRow = piece.player === "WHITE" ? 6 : 1;

    // Forward move
    const newRow = piece.row + direction;
    if (this.isInBounds(newRow, piece.col) && !board[newRow][piece.col]) {
      moves.push({ row: newRow, col: piece.col });

      // Double move from starting position
      if (piece.row === startRow) {
        const doubleRow = piece.row + 2 * direction;
        if (!board[doubleRow][piece.col]) {
          moves.push({ row: doubleRow, col: piece.col });
        }
      }
    }

    // Diagonal captures
    for (const colOffset of [-1, 1]) {
      const newCol = piece.col + colOffset;
      if (this.isInBounds(newRow, newCol)) {
        const target = board[newRow][newCol];
        if (target && target.player !== piece.player) {
          moves.push({ row: newRow, col: newCol });
        }

        // En passant (only on real board unless we pass state for it)
        if (
          board === this.board &&
          this.enPassantTarget &&
          newRow === this.enPassantTarget.row &&
          newCol === this.enPassantTarget.col
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  getRookMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    return this.getLinearMoves(
      piece,
      [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ],
      board
    );
  }

  getKnightMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    const moves: Position[] = [];
    const offsets = [
      { row: -2, col: -1 },
      { row: -2, col: 1 },
      { row: -1, col: -2 },
      { row: -1, col: 2 },
      { row: 1, col: -2 },
      { row: 1, col: 2 },
      { row: 2, col: -1 },
      { row: 2, col: 1 },
    ];

    for (const offset of offsets) {
      const newRow = piece.row + offset.row;
      const newCol = piece.col + offset.col;

      if (this.isInBounds(newRow, newCol)) {
        const target = board[newRow][newCol];
        if (!target || target.player !== piece.player) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  getBishopMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    return this.getLinearMoves(
      piece,
      [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ],
      board
    );
  }

  getQueenMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    return this.getLinearMoves(
      piece,
      [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ],
      board
    );
  }

  getKingMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    const moves: Position[] = [];

    // Normal king moves
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) continue;

        const newRow = piece.row + rowOffset;
        const newCol = piece.col + colOffset;

        if (this.isInBounds(newRow, newCol)) {
          const target = board[newRow][newCol];
          if (!target || target.player !== piece.player) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
    }

    // Castling (only on the real board or if we simulate state properly)
    if (board === this.board && !piece.hasMoved && !this.isInCheck(piece.player, board)) {
      // Kingside castling
      const kingsideRook = board[piece.row][7];
      if (kingsideRook && !kingsideRook.hasMoved && !board[piece.row][5] && !board[piece.row][6]) {
        // Check if squares king moves through are not under attack
        if (
          !this.isSquareUnderAttack(piece.row, 5, piece.player, board) &&
          !this.isSquareUnderAttack(piece.row, 6, piece.player, board)
        ) {
          moves.push({ row: piece.row, col: 6 });
        }
      }

      // Queenside castling
      const queensideRook = board[piece.row][0];
      if (
        queensideRook &&
        !queensideRook.hasMoved &&
        !board[piece.row][1] &&
        !board[piece.row][2] &&
        !board[piece.row][3]
      ) {
        // Check if squares king moves through are not under attack
        if (
          !this.isSquareUnderAttack(piece.row, 2, piece.player, board) &&
          !this.isSquareUnderAttack(piece.row, 3, piece.player, board)
        ) {
          moves.push({ row: piece.row, col: 2 });
        }
      }
    }

    return moves;
  }

  getLinearMoves(
    piece: Piece,
    directions: Position[],
    board: (Piece | null)[][] = this.board
  ): Position[] {
    const moves: Position[] = [];

    for (const dir of directions) {
      let newRow = piece.row + dir.row;
      let newCol = piece.col + dir.col;

      while (this.isInBounds(newRow, newCol)) {
        const target = board[newRow][newCol];

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

  wouldBeInCheck(piece: Piece, move: Position, board: (Piece | null)[][] = this.board): boolean {
    // Handle castling special case for wouldBeInCheck
    if (piece.type === "KING" && Math.abs(move.col - piece.col) === 2) {
      // kingMoves logic already checks if intermediate squares are under attack
      // so we just need to check the final position
    }

    // Simulate the move
    const originalRow = piece.row;
    const originalCol = piece.col;
    const targetPiece = board[move.row][move.col];

    board[move.row][move.col] = piece;
    board[originalRow][originalCol] = null;
    piece.row = move.row;
    piece.col = move.col;

    const inCheck = this.isInCheck(piece.player, board);

    // Undo the simulation
    board[originalRow][originalCol] = piece;
    board[move.row][move.col] = targetPiece;
    piece.row = originalRow;
    piece.col = originalCol;

    return inCheck;
  }

  isInCheck(player: Player, board: (Piece | null)[][] = this.board): boolean {
    // Find the king
    let kingPos: Position | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "KING" && piece.player === player) {
          kingPos = { row, col };
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false;

    return this.isSquareUnderAttack(kingPos.row, kingPos.col, player, board);
  }

  isSquareUnderAttack(
    row: number,
    col: number,
    player: Player,
    board: (Piece | null)[][] = this.board
  ): boolean {
    const opponent = player === "WHITE" ? "BLACK" : "WHITE";

    // Check all opponent pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.player === opponent) {
          const moves = this.getPieceMoves(piece, board);
          if (moves.some((m) => m.row === row && m.col === col)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getPieceMoves(piece: Piece, board: (Piece | null)[][] = this.board): Position[] {
    switch (piece.type) {
      case "PAWN":
        return this.getPawnAttackMoves(piece);
      case "ROOK":
        return this.getRookMoves(piece, board);
      case "KNIGHT":
        return this.getKnightMoves(piece, board);
      case "BISHOP":
        return this.getBishopMoves(piece, board);
      case "QUEEN":
        return this.getQueenMoves(piece, board);
      case "KING":
        return this.getKingAttackMoves(piece);
      default:
        return [];
    }
  }

  getPawnAttackMoves(piece: Piece): Position[] {
    const moves: Position[] = [];
    const direction = piece.player === "WHITE" ? -1 : 1;
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

  checkGameState(board: (Piece | null)[][] = this.board) {
    if (this.isInCheck(this.currentPlayer, board)) {
      if (this.hasNoLegalMoves(this.currentPlayer, board)) {
        if (board === this.board) {
          this.gameState = "CHECKMATE";
          this.finalGameState = "CHECKMATE";
          this.stopTimer();
          setTimeout(() => {
            this.gameState = "RESULT";
            this.notifyStateChange();
          }, 2000);
        }
      } else {
        if (board === this.board) {
          this.gameState = "CHECK";
        }
      }
    } else if (this.hasNoLegalMoves(this.currentPlayer, board)) {
      if (board === this.board) {
        this.gameState = "STALEMATE";
        this.finalGameState = "STALEMATE";
        this.stopTimer();
        setTimeout(() => {
          this.gameState = "RESULT";
          this.notifyStateChange();
        }, 2000);
      }
    } else {
      if (board === this.board) {
        this.gameState = "PLAYING";
      }
    }

    if (board === this.board) {
      this.notifyStateChange();
    }
  }

  hasNoLegalMoves(player: Player, board: (Piece | null)[][] = this.board): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          const moves = this.getValidMoves(piece, board);
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
  getGameMode(): GameMode {
    return this.gameMode;
  }

  getAIPlayer(): Player | null {
    return this.aiPlayer;
  }

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
    if (this.finalGameState === "CHECKMATE") {
      return this.currentPlayer === "WHITE" ? "BLACK" : "WHITE";
    }
    return null;
  }

  getFinalGameState(): "CHECKMATE" | "STALEMATE" | null {
    return this.finalGameState;
  }

  getPendingPromotion(): { row: number; col: number; move: Move } | null {
    return this.pendingPromotion;
  }

  promotePawn(pieceType: "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN") {
    if (!this.pendingPromotion) return;

    const { row, col, move } = this.pendingPromotion;
    const piece = this.board[row][col];
    if (piece && piece.type === "PAWN") {
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
    this.currentPlayer = this.currentPlayer === "WHITE" ? "BLACK" : "WHITE";
    this.checkGameState();
    this.notifyMove(move);
    this.notifyBoardUpdate();

    // Trigger AI move if in VS_AI mode and it's AI's turn
    if (
      this.gameMode === "VS_AI" &&
      this.aiPlayer === this.currentPlayer &&
      (this.gameState === "PLAYING" || this.gameState === "CHECK")
    ) {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  private makeAIMove() {
    if (
      (this.gameState !== "PLAYING" && this.gameState !== "CHECK") ||
      this.gameMode !== "VS_AI" ||
      this.aiPlayer !== this.currentPlayer
    ) {
      return;
    }

    const ai = new ChessAI(this);

    const bestMove = ai.getBestMove(this.board, this.currentPlayer);

    if (bestMove) {
      // Use selectPiece to properly select and then make the move
      this.selectPiece(bestMove.from.row, bestMove.from.col);
      this.makeMove(bestMove.to.row, bestMove.to.col);
    } else {
      console.error("No valid move found for AI!");
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

  onTimerUpdate(listener: (elapsed: number) => void) {
    this.timerUpdateListeners.push(listener);
  }

  private notifyStateChange() {
    this.stateChangeListeners.forEach((listener) => listener(this.gameState));
  }

  private notifyMove(move: Move) {
    this.moveListeners.forEach((listener) => listener(move));
  }

  private notifyBoardUpdate() {
    this.boardUpdateListeners.forEach((listener) => listener());
  }

  private notifyPromotion(row: number, col: number) {
    this.promotionListeners.forEach((listener) => listener(row, col));
  }

  private notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((listener) => listener(this.elapsedTime));
  }
}

// Create singleton instance
export const game = new ChessGame();
