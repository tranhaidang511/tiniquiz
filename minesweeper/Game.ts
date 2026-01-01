export type GameState = "MENU" | "PLAYING" | "WON" | "LOST";
export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "CUSTOM";

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTY_CONFIGS: Record<Exclude<Difficulty, "CUSTOM">, DifficultyConfig> = {
  EASY: { rows: 9, cols: 9, mines: 10 },
  MEDIUM: { rows: 16, cols: 16, mines: 40 },
  HARD: { rows: 16, cols: 30, mines: 99 },
};

export class Game {
  private state: GameState = "MENU";
  private difficulty: Difficulty = "EASY";
  private board: Cell[][] = [];
  private config: DifficultyConfig = DIFFICULTY_CONFIGS.EASY;
  private flagsPlaced: number = 0;
  private cellsRevealed: number = 0;
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private firstClick: boolean = true;

  // Event listeners
  private stateListeners: ((state: GameState) => void)[] = [];
  private timerListeners: ((time: number) => void)[] = [];
  private minesListeners: ((remaining: number) => void)[] = [];

  constructor() {
    this.initializeEmptyBoard();
  }

  // --- Setup ---

  private initializeEmptyBoard() {
    this.board = [];
    for (let row = 0; row < this.config.rows; row++) {
      const boardRow: Cell[] = [];
      for (let col = 0; col < this.config.cols; col++) {
        boardRow.push({
          row,
          col,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      this.board.push(boardRow);
    }
  }

  setDifficulty(diff: Difficulty) {
    this.difficulty = diff;
    if (diff !== "CUSTOM") {
      this.config = DIFFICULTY_CONFIGS[diff];
    }
  }

  setCustomConfig(config: DifficultyConfig) {
    // Validate constraints
    const rows = Math.max(5, Math.min(30, config.rows));
    const cols = Math.max(5, Math.min(30, config.cols));

    // Ensure max mines is not > cell count - 1 (leave at least 1 open spot)
    // Practical limit is usually much lower, but let's just ensure it's solvable-ish.
    // Let's cap at 80% density or similar?
    // Standard allows high density. Let's just ensure rows*cols > mines.
    const maxMines = rows * cols - 1;
    const mines = Math.max(1, Math.min(maxMines, config.mines));

    this.config = { rows, cols, mines };
    this.difficulty = "CUSTOM";
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getConfig(): DifficultyConfig {
    return this.config;
  }

  // --- Game Flow ---

  start() {
    if (this.difficulty !== "CUSTOM") {
      this.config = DIFFICULTY_CONFIGS[this.difficulty];
    }
    this.initializeEmptyBoard();
    this.flagsPlaced = 0;
    this.cellsRevealed = 0;
    this.firstClick = true;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.setState("PLAYING");
    this.startTimer();
    this.emitMinesUpdate();
  }

  private generateMines(excludeRow: number, excludeCol: number) {
    const positions: { row: number; col: number }[] = [];

    // Collect all positions except the first clicked cell and its neighbors
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const isExcluded = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1;
        if (!isExcluded) {
          positions.push({ row, col });
        }
      }
    }

    // Shuffle and place mines
    this.shuffleArray(positions);
    for (let i = 0; i < this.config.mines && i < positions.length; i++) {
      const { row, col } = positions[i];
      this.board[row][col].isMine = true;
    }

    // Calculate neighbor mine counts
    this.calculateNeighborMines();
  }

  private shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private calculateNeighborMines() {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (!this.board[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const newRow = row + dr;
              const newCol = col + dc;
              if (this.isValidCell(newRow, newCol) && this.board[newRow][newCol].isMine) {
                count++;
              }
            }
          }
          this.board[row][col].neighborMines = count;
        }
      }
    }
  }

  private isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.config.rows && col >= 0 && col < this.config.cols;
  }

  // --- Player Actions ---

  revealCell(row: number, col: number) {
    if (this.state !== "PLAYING") return;
    if (!this.isValidCell(row, col)) return;

    const cell = this.board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // Generate mines on first click
    if (this.firstClick) {
      this.generateMines(row, col);
      this.firstClick = false;
    }

    // Reveal the cell
    cell.isRevealed = true;
    this.cellsRevealed++;

    if (cell.isMine) {
      // Game over - reveal all mines
      this.revealAllMines();
      this.stopTimer();
      this.setState("LOST");
      return;
    }

    // If empty cell, reveal neighbors (flood fill)
    if (cell.neighborMines === 0) {
      this.revealNeighbors(row, col);
    }

    // Check for win
    this.checkWin();
  }

  private revealNeighbors(row: number, col: number) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (this.isValidCell(newRow, newCol)) {
          const neighbor = this.board[newRow][newCol];
          if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
            neighbor.isRevealed = true;
            this.cellsRevealed++;
            if (neighbor.neighborMines === 0) {
              this.revealNeighbors(newRow, newCol);
            }
          }
        }
      }
    }
  }

  private revealAllMines() {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (this.board[row][col].isMine) {
          this.board[row][col].isRevealed = true;
        }
      }
    }
  }

  toggleFlag(row: number, col: number) {
    if (this.state !== "PLAYING") return;
    if (!this.isValidCell(row, col)) return;

    const cell = this.board[row][col];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    this.flagsPlaced += cell.isFlagged ? 1 : -1;
    this.emitMinesUpdate();
  }

  private checkWin() {
    const totalCells = this.config.rows * this.config.cols;
    const nonMineCells = totalCells - this.config.mines;

    if (this.cellsRevealed === nonMineCells) {
      this.stopTimer();
      this.setState("WON");
    }
  }

  reset() {
    this.start();
  }

  restart() {
    this.setState("MENU");
    this.stopTimer();
  }

  // --- Timer ---

  private timerInterval: number | null = null;

  private startTimer() {
    this.stopTimer();
    this.timerInterval = window.setInterval(() => {
      if (this.state === "PLAYING") {
        this.elapsedTime = Date.now() - this.startTime;
        this.emitTimerUpdate();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // --- State Management ---

  private setState(newState: GameState) {
    this.state = newState;
    this.stateListeners.forEach((l) => l(this.state));
  }

  getState(): GameState {
    return this.state;
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  getElapsedTime(): number {
    return this.elapsedTime;
  }

  getRemainingMines(): number {
    return this.config.mines - this.flagsPlaced;
  }

  // --- Event Management ---

  onStateChange(listener: (state: GameState) => void) {
    this.stateListeners.push(listener);
  }

  onTimerUpdate(listener: (time: number) => void) {
    this.timerListeners.push(listener);
  }

  onMinesUpdate(listener: (remaining: number) => void) {
    this.minesListeners.push(listener);
  }

  private emitTimerUpdate() {
    this.timerListeners.forEach((l) => l(this.elapsedTime));
  }

  private emitMinesUpdate() {
    this.minesListeners.forEach((l) => l(this.getRemainingMines()));
  }
}

export const game = new Game();
