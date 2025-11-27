import { countries } from './data';
import type { Country } from './data';
import { localization } from './Localization';

export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type GameMode = 'CAPITALS' | 'FLAGS';

export interface Question {
    target: Country;
    choices: Country[]; // 4 choices including target
    flagUrl?: string;
}

export class Game {
    private state: GameState = 'MENU';
    private mode: GameMode = 'CAPITALS';
    private currentRegion: string = 'all';
    private filteredCountries: Country[] = [];
    private currentQuestionIndex: number = 0;
    private score: number = 0;
    private questions: Question[] = [];
    private startTime: number | null = null;
    private endTime: number | null = null;

    // Event listeners
    private stateListeners: ((state: GameState) => void)[] = [];
    private questionListeners: ((q: Question, index: number, total: number) => void)[] = [];

    constructor() {
        this.filteredCountries = [...countries];
    }

    // --- Setup ---

    getRegions(): string[] {
        return Array.from(new Set(countries.flatMap(c => c.regions))).sort();
    }

    getContinents(): string[] {
        return Array.from(new Set(countries.map(c => c.continent))).sort();
    }

    setFilter(type: 'all' | 'continent' | 'region', value?: string) {
        if (type === 'all') {
            this.currentRegion = 'all';
            this.filteredCountries = [...countries];
        } else if (type === 'continent' && value) {
            this.currentRegion = value;
            this.filteredCountries = countries.filter(c => c.continent === value);
        } else if (type === 'region' && value) {
            this.currentRegion = value;
            this.filteredCountries = countries.filter(c => c.regions.includes(value));
        }
    }

    getRegion(): string {
        return this.currentRegion;
    }

    setGameMode(mode: GameMode) {
        this.mode = mode;
    }

    getGameMode(): GameMode {
        return this.mode;
    }

    // --- Game Flow ---

    start(questionCount: number = 5) {
        if (this.filteredCountries.length < questionCount) {
            alert(localization.getUIText('notEnoughCountries'));
            return;
        }
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
        this.endTime = null;
        this.generateQuestions(questionCount);
        this.setState('PLAYING');
        this.emitQuestion();
    }

    private generateQuestions(count: number) {
        this.questions = [];
        const pool = [...this.filteredCountries];

        // Shuffle pool
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Pick top N or max available
        const finalCount = Math.min(count, pool.length);
        for (let i = 0; i < finalCount; i++) {
            const target = pool[i];
            const choices = this.generateChoices(target);
            const question: Question = { target, choices };

            if (this.mode === 'FLAGS') {
                question.flagUrl = `https://flagcdn.com/w320/${target.code.toLowerCase()}.png`;
            }

            this.questions.push(question);
        }
    }

    private generateChoices(target: Country): Country[] {
        const choices = [target];
        const distractors = this.filteredCountries.filter(c => c.code !== target.code);

        // Shuffle distractors
        for (let i = distractors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
        }

        // Pick 3
        for (let i = 0; i < 3 && i < distractors.length; i++) {
            choices.push(distractors[i]);
        }

        // Shuffle choices so target isn't always first
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return choices;
    }

    submitAnswer(choice: Country): boolean {
        const currentQ = this.questions[this.currentQuestionIndex];
        const isCorrect = choice.code === currentQ.target.code;

        if (isCorrect) {
            this.score++;
        }

        return isCorrect;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endTime = Date.now();
            this.setState('RESULT');
        } else {
            this.emitQuestion();
        }
    }

    restart() {
        this.setState('MENU');
    }

    // --- State Management ---

    private setState(newState: GameState) {
        this.state = newState;
        this.stateListeners.forEach(l => l(this.state));
    }

    onStateChange(listener: (state: GameState) => void) {
        this.stateListeners.push(listener);
    }

    onQuestionChange(listener: (q: Question, index: number, total: number) => void) {
        this.questionListeners.push(listener);
    }

    private emitQuestion() {
        if (this.state === 'PLAYING' && this.questions[this.currentQuestionIndex]) {
            this.questionListeners.forEach(l => l(this.questions[this.currentQuestionIndex], this.currentQuestionIndex + 1, this.questions.length));
        }
    }

    getScore(): { score: number; total: number } {
        return { score: this.score, total: this.questions.length };
    }

    getElapsedTime(): number {
        if (!this.startTime) return 0;
        const end = this.endTime || Date.now();
        return Math.floor((end - this.startTime) / 1000); // seconds
    }

    formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

export const game = new Game();
