export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'RESULT';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Cell {
    value: number | null;
    isFixed: boolean;
    notes: Set<number>;
    isError: boolean;
}

export class Game {
    private state: GameState = 'MENU';
    private difficulty: Difficulty = 'EASY';
    private board: Cell[][] = [];
    private solution: number[][] = [];
    private mistakes: number = 0;
    private maxMistakes: number = 3;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private selectedCell: { row: number; col: number } | null = null;
    private notesMode: boolean = false;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private cellUpdateListeners: (() => void)[] = [];
    private mistakeListeners: ((mistakes: number) => void)[] = [];
    private timeListeners: ((time: number) => void)[] = [];

    constructor() {
        this.initializeEmptyBoard();
    }

    // --- Setup ---

    private initializeEmptyBoard() {
        this.board = Array(9).fill(null).map(() =>
            Array(9).fill(null).map(() => ({
                value: null,
                isFixed: false,
                notes: new Set<number>(),
                isError: false
            }))
        );
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    setDifficulty(diff: Difficulty) {
        this.difficulty = diff;
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    // --- Game Flow ---

    start() {
        this.initializeEmptyBoard();
        this.generatePuzzle();
        this.mistakes = 0;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.selectedCell = null;
        this.notesMode = false;
        this.setState('PLAYING');
        this.startTimer();
    }

    private generatePuzzle() {
        // Generate a complete solved Sudoku board
        this.generateSolvedBoard();

        // Copy solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = this.board[i][j].value!;
            }
        }

        // Remove cells based on difficulty
        const cellsToRemove = this.getCellsToRemove();
        this.removeRandomCells(cellsToRemove);
    }

    private getCellsToRemove(): number {
        switch (this.difficulty) {
            case 'EASY': return 40;
            case 'MEDIUM': return 50;
            case 'HARD': return 56;
            default: return 40;
        }
    }

    private generateSolvedBoard() {
        this.fillDiagonalBoxes();
        this.solveSudoku(0, 0);
    }

    private fillDiagonalBoxes() {
        for (let box = 0; box < 3; box++) {
            this.fillBox(box * 3, box * 3);
        }
    }

    private fillBox(row: number, col: number) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(numbers);

        let idx = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[row + i][col + j].value = numbers[idx++];
            }
        }
    }

    private shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private solveSudoku(row: number, col: number): boolean {
        if (row === 9) return true;

        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = col === 8 ? 0 : col + 1;

        if (this.board[row][col].value !== null) {
            return this.solveSudoku(nextRow, nextCol);
        }

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(numbers);

        for (const num of numbers) {
            if (this.isValidPlacement(row, col, num)) {
                this.board[row][col].value = num;

                if (this.solveSudoku(nextRow, nextCol)) {
                    return true;
                }

                this.board[row][col].value = null;
            }
        }

        return false;
    }

    private isValidPlacement(row: number, col: number, num: number): boolean {
        for (let j = 0; j < 9; j++) {
            if (j !== col && this.board[row][j].value === num) {
                return false;
            }
        }

        for (let i = 0; i < 9; i++) {
            if (i !== row && this.board[i][col].value === num) {
                return false;
            }
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const r = boxRow + i;
                const c = boxCol + j;
                if ((r !== row || c !== col) && this.board[r][c].value === num) {
                    return false;
                }
            }
        }

        return true;
    }

    private removeRandomCells(count: number) {
        const positions: { row: number; col: number }[] = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push({ row: i, col: j });
            }
        }

        this.shuffleArray(positions as any);

        for (let i = 0; i < count && i < positions.length; i++) {
            const { row, col } = positions[i];
            this.board[row][col].value = null;
            this.board[row][col].isFixed = false;
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j].value !== null) {
                    this.board[i][j].isFixed = true;
                }
            }
        }
    }

    // --- Player Actions ---

    selectCell(row: number, col: number) {
        if (this.state !== 'PLAYING') return;
        this.selectedCell = { row, col };
        this.emitCellUpdate();
    }

    enterNumber(num: number) {
        if (this.state !== 'PLAYING' || !this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const cell = this.board[row][col];

        if (cell.isFixed) return;

        if (this.notesMode) {
            if (cell.notes.has(num)) {
                cell.notes.delete(num);
            } else {
                cell.notes.add(num);
            }
        } else {
            cell.notes.clear();
            cell.value = num;

            if (num !== this.solution[row][col]) {
                cell.isError = true;
                this.mistakes++;
                this.emitMistake();

                if (this.mistakes >= this.maxMistakes) {
                    this.setState('RESULT');
                    return;
                }
            } else {
                cell.isError = false;
            }

            if (this.isPuzzleComplete()) {
                this.stopTimer();
                this.setState('RESULT');
            }
        }

        this.emitCellUpdate();
    }

    eraseCell() {
        if (this.state !== 'PLAYING' || !this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const cell = this.board[row][col];

        if (cell.isFixed) return;

        cell.value = null;
        cell.notes.clear();
        cell.isError = false;
        this.emitCellUpdate();
    }

    toggleNotesMode() {
        this.notesMode = !this.notesMode;
    }

    getNotesMode(): boolean {
        return this.notesMode;
    }

    getHint() {
        if (this.state !== 'PLAYING' || !this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const cell = this.board[row][col];

        if (cell.isFixed) return;

        cell.value = this.solution[row][col];
        cell.isFixed = true;
        cell.notes.clear();
        cell.isError = false;

        if (this.isPuzzleComplete()) {
            this.stopTimer();
            this.setState('RESULT');
        }

        this.emitCellUpdate();
    }

    private isPuzzleComplete(): boolean {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j].value === null || this.board[i][j].isError) {
                    return false;
                }
            }
        }
        return true;
    }

    pause() {
        if (this.state === 'PLAYING') {
            this.setState('PAUSED');
            this.stopTimer();
        }
    }

    resume() {
        if (this.state === 'PAUSED') {
            this.setState('PLAYING');
            this.startTime = Date.now() - this.elapsedTime;
            this.startTimer();
        }
    }

    restart() {
        this.setState('MENU');
        this.stopTimer();
    }

    // --- Timer ---

    private timerInterval: number | null = null;

    private startTimer() {
        this.stopTimer();
        this.timerInterval = window.setInterval(() => {
            if (this.state === 'PLAYING') {
                this.elapsedTime = Date.now() - this.startTime;
                this.emitTime();
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
        this.stateListeners.forEach(l => l(this.state));
    }

    getState(): GameState {
        return this.state;
    }

    getBoard(): Cell[][] {
        return this.board;
    }

    getSelectedCell(): { row: number; col: number } | null {
        return this.selectedCell;
    }

    getMistakes(): number {
        return this.mistakes;
    }

    getMaxMistakes(): number {
        return this.maxMistakes;
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

    isWin(): boolean {
        return this.state === 'RESULT' && this.mistakes < this.maxMistakes;
    }

    // --- Event Management ---

    onStateChange(listener: (state: GameState) => void) {
        this.stateListeners.push(listener);
    }

    onCellUpdate(listener: () => void) {
        this.cellUpdateListeners.push(listener);
    }

    onMistake(listener: (mistakes: number) => void) {
        this.mistakeListeners.push(listener);
    }

    onTimeUpdate(listener: (time: number) => void) {
        this.timeListeners.push(listener);
    }

    private emitCellUpdate() {
        this.cellUpdateListeners.forEach(l => l());
    }

    private emitMistake() {
        this.mistakeListeners.forEach(l => l(this.mistakes));
    }

    private emitTime() {
        this.timeListeners.forEach(l => l(this.elapsedTime));
    }
}

export const game = new Game();
