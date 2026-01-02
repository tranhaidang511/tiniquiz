import { GoAI } from "./AI";

export type Player = "BLACK" | "WHITE";
export type GameState = "MENU" | "PLAYING" | "RESULT";
export type BoardSize = 9 | 13 | 19;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  player: Player;
  pos: Position | null; // null for pass
  captured: Position[];
}

export class GoGame {
  private board: (Player | null)[][] = [];
  private size: BoardSize = 19;
  private currentPlayer: Player = "BLACK";
  private gameState: GameState = "MENU";
  private history: Move[] = [];
  private boardHistory: string[] = []; // Used for Ko rule (stringified boards)
  private captures: Record<Player, number> = { BLACK: 0, WHITE: 0 };
  private passCount: number = 0;

  // AI properties
  private mode: "TWO_PLAYER" | "VS_AI" = "TWO_PLAYER";
  private aiPlayer: Player | null = null;

  // Settings
  private komi: number = 6.5;
  private handicap: number = 0;

  // Timer
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private timerInterval: number | null = null;

  // Listeners
  private stateChangeListeners: ((state: GameState) => void)[] = [];
  private moveListeners: ((move: Move) => void)[] = [];
  private boardUpdateListeners: (() => void)[] = [];
  private timerUpdateListeners: ((elapsed: number) => void)[] = [];

  constructor() {
    this.reset(19);
  }

  reset(size: BoardSize = this.size) {
    this.size = size;
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    this.currentPlayer = "BLACK";
    this.history = [];
    this.boardHistory = [this.serializeBoard()];
    this.captures = { BLACK: 0, WHITE: 0 };
    this.passCount = 0;
    this.elapsedTime = 0;
    this.stopTimer();
    this.applyHandicap();
  }

  // --- API ---

  setBoardSize(size: BoardSize) {
    this.size = size;
    this.reset(size);
  }

  getBoardSize(): BoardSize {
    return this.size;
  }

  setGameMode(mode: "TWO_PLAYER" | "VS_AI") {
    this.mode = mode;
  }
  getGameMode() {
    return this.mode;
  }

  setAISide(side: Player | null) {
    this.aiPlayer = side;
  }
  getAIPlayer() {
    return this.aiPlayer;
  }

  setHandicap(h: number) {
    this.handicap = h;
  }
  getHandicap() {
    return this.handicap;
  }

  setKomi(k: number) {
    this.komi = k;
  }
  getKomi() {
    return this.komi;
  }

  start() {
    this.reset();
    this.gameState = "PLAYING";
    this.startTimer();
    this.notifyStateChange();
    this.notifyBoardUpdate();

    if (this.mode === "VS_AI" && this.currentPlayer === this.aiPlayer) {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  restart() {
    this.gameState = "MENU";
    this.stopTimer();
    this.notifyStateChange();
  }

  // --- Core Gameplay ---

  placeStone(row: number, col: number): boolean {
    if (this.gameState !== "PLAYING") return false;
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false;
    if (this.board[row][col] !== null) return false;

    // Try placement
    const player = this.currentPlayer;
    const opponent = player === "BLACK" ? "WHITE" : "BLACK";

    // Temporarily place
    this.board[row][col] = player;

    // Find captures
    const captured = this.findCaptures(row, col, opponent);

    // Check for suicide (no liberties and no captures)
    if (captured.length === 0 && !this.hasLiberties(row, col)) {
      this.board[row][col] = null; // Revert
      return false;
    }

    // Apply captures
    captured.forEach((pos) => {
      this.board[pos.row][pos.col] = null;
    });

    // Check Ko rule
    const newBoardStr = this.serializeBoard();
    if (this.boardHistory.includes(newBoardStr)) {
      // Revert
      this.board[row][col] = null;
      captured.forEach((pos) => {
        this.board[pos.row][pos.col] = opponent;
      });
      return false;
    }

    // Move is valid
    this.captures[player] += captured.length;
    this.boardHistory.push(newBoardStr);

    const move: Move = { player, pos: { row, col }, captured };
    this.history.push(move);
    this.passCount = 0;

    this.currentPlayer = opponent;
    this.notifyMove(move);
    this.notifyBoardUpdate();

    if (this.mode === "VS_AI" && this.currentPlayer === this.aiPlayer) {
      setTimeout(() => this.makeAIMove(), 500);
    }

    return true;
  }

  pass(): boolean {
    if (this.gameState !== "PLAYING") return false;

    const player = this.currentPlayer;
    const opponent = player === "BLACK" ? "WHITE" : "BLACK";

    const move: Move = { player, pos: null, captured: [] };
    this.history.push(move);
    this.passCount++;

    this.currentPlayer = opponent;
    this.notifyMove(move);
    this.notifyBoardUpdate();

    if (this.passCount >= 2) {
      this.endGame();
    } else if (this.mode === "VS_AI" && this.currentPlayer === this.aiPlayer) {
      setTimeout(() => this.makeAIMove(), 500);
    }

    return true;
  }

  private findCaptures(row: number, col: number, opponent: Player): Position[] {
    const captured: Position[] = [];
    const neighbors = this.getNeighbors(row, col);

    neighbors.forEach((n) => {
      if (this.board[n.row][n.col] === opponent) {
        if (!this.hasLiberties(n.row, n.col)) {
          captured.push(...this.getGroup(n.row, n.col));
        }
      }
    });

    // Dedup
    return captured.filter(
      (v, i, a) => a.findIndex((t) => t.row === v.row && t.col === v.col) === i
    );
  }

  private hasLiberties(row: number, col: number): boolean {
    const player = this.board[row][col];
    if (!player) return false;

    const visited = new Set<string>();
    const stack: Position[] = [{ row, col }];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const neighbors = this.getNeighbors(current.row, current.col);
      for (const n of neighbors) {
        if (this.board[n.row][n.col] === null) return true;
        if (this.board[n.row][n.col] === player) {
          stack.push(n);
        }
      }
    }
    return false;
  }

  private getGroup(row: number, col: number): Position[] {
    const player = this.board[row][col];
    if (!player) return [];

    const group: Position[] = [];
    const visited = new Set<string>();
    const stack: Position[] = [{ row, col }];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);
      group.push(current);

      const neighbors = this.getNeighbors(current.row, current.col);
      for (const n of neighbors) {
        if (this.board[n.row][n.col] === player) {
          stack.push(n);
        }
      }
    }
    return group;
  }

  private getNeighbors(row: number, col: number): Position[] {
    const neighbors: Position[] = [];
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    dirs.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        neighbors.push({ row: nr, col: nc });
      }
    });
    return neighbors;
  }

  private serializeBoard(): string {
    return this.board
      .map((row) => row.map((p) => (p === "BLACK" ? "B" : p === "WHITE" ? "W" : ".")).join(""))
      .join("\n");
  }

  private applyHandicap() {
    if (this.handicap <= 0) return;

    const points: Record<number, Position[]> = {
      9: [
        { row: 2, col: 6 },
        { row: 6, col: 2 },
        { row: 6, col: 6 },
        { row: 2, col: 2 },
        { row: 4, col: 4 },
      ],
      13: [
        { row: 3, col: 9 },
        { row: 9, col: 3 },
        { row: 9, col: 9 },
        { row: 3, col: 3 },
        { row: 6, col: 6 },
        { row: 3, col: 6 },
        { row: 9, col: 6 },
        { row: 6, col: 3 },
        { row: 6, col: 9 },
      ],
      19: [
        { row: 3, col: 15 },
        { row: 15, col: 3 },
        { row: 15, col: 15 },
        { row: 3, col: 3 },
        { row: 9, col: 9 },
        { row: 3, col: 9 },
        { row: 15, col: 9 },
        { row: 9, col: 3 },
        { row: 9, col: 15 },
      ],
    };

    const list = points[this.size] || [];
    const count = Math.min(this.handicap, list.length);

    for (let i = 0; i < count; i++) {
      this.board[list[i].row][list[i].col] = "BLACK";
    }

    if (count > 0) {
      this.currentPlayer = "WHITE";
    }
  }

  // --- Scoring ---

  calculateScore() {
    let blackPoints = 0;
    let whitePoints = this.komi;

    const visited = new Set<string>();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const key = `${r},${c}`;
        if (visited.has(key)) continue;

        const player = this.board[r][c];
        if (player === "BLACK") {
          blackPoints++;
          visited.add(key);
        } else if (player === "WHITE") {
          whitePoints++;
          visited.add(key);
        } else {
          const { cells, boundary } = this.getTerritory(r, c);
          cells.forEach((pos) => visited.add(`${pos.row},${pos.col}`));

          if (boundary.size === 1) {
            if (boundary.has("BLACK")) blackPoints += cells.length;
            if (boundary.has("WHITE")) whitePoints += cells.length;
          }
        }
      }
    }

    return { black: blackPoints, white: whitePoints };
  }

  private getTerritory(row: number, col: number): { cells: Position[]; boundary: Set<Player> } {
    const cells: Position[] = [];
    const boundary = new Set<Player>();
    const visited = new Set<string>();
    const stack: Position[] = [{ row, col }];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);
      cells.push(current);

      const neighbors = this.getNeighbors(current.row, current.col);
      for (const n of neighbors) {
        const p = this.board[n.row][n.col];
        if (p === null) {
          stack.push(n);
        } else {
          boundary.add(p);
        }
      }
    }
    return { cells, boundary };
  }

  private endGame() {
    this.gameState = "RESULT";
    this.stopTimer();
    this.notifyStateChange();
  }

  // --- AI Integration ---

  private makeAIMove() {
    if (this.gameState !== "PLAYING" || this.currentPlayer !== this.aiPlayer) return;

    const ai = new GoAI(this);
    const bestMove = ai.getBestMove();

    if (bestMove) {
      this.placeStone(bestMove.row, bestMove.col);
    } else {
      this.pass();
    }
  }

  // --- State Access ---

  getState(): GameState {
    return this.gameState;
  }
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }
  getBoard(): (Player | null)[][] {
    return this.board;
  }
  getMoveCount(): number {
    return this.history.length;
  }
  getCaptures(): Record<Player, number> {
    return this.captures;
  }

  getLastMove(): Position | null {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].pos) {
        return this.history[i].pos;
      }
    }
    return null;
  }

  getLastAction(): Move | null {
    if (this.history.length === 0) return null;
    return this.history[this.history.length - 1];
  }

  // --- Notification Helpers ---

  private notifyStateChange() {
    this.stateChangeListeners.forEach((l) => l(this.gameState));
  }
  private notifyMove(m: Move) {
    this.moveListeners.forEach((l) => l(m));
  }
  private notifyBoardUpdate() {
    this.boardUpdateListeners.forEach((l) => l());
  }
  private notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((l) => l(this.elapsedTime));
  }

  onStateChange(l: (s: GameState) => void) {
    this.stateChangeListeners.push(l);
  }
  onMove(l: (m: Move) => void) {
    this.moveListeners.push(l);
  }
  onBoardUpdate(l: () => void) {
    this.boardUpdateListeners.push(l);
  }
  onTimerUpdate(l: (e: number) => void) {
    this.timerUpdateListeners.push(l);
  }

  // --- Timer ---

  private startTimer() {
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = window.setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.notifyTimerUpdate();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getElapsedTime(): number {
    return this.elapsedTime;
  }
}

export const game = new GoGame();
