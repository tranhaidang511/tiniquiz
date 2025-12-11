import { countries } from './data/countries';
import type { Country } from './data/countries';
import { provinces, provinceCountries } from './data/provinces';
import type { Province } from './data/provinces';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';

class GeogameLocalization extends Localization {
    getCountryName(code: string): string {
        // @ts-ignore
        const data = this.locales[this.currentLang].countries[code];
        return data ? data.name : code;
    }

    getCapital(code: string): string {
        // @ts-ignore
        const data = this.locales[this.currentLang].countries[code];
        return data ? data.capital : "Unknown";
    }

    getProvinceName(code: string): string {
        // @ts-ignore
        const data = this.locales[this.currentLang].provinces[code];
        return data ? data.name : code;
    }

    getProvinceCapital(code: string): string {
        // @ts-ignore
        const data = this.locales[this.currentLang].provinces[code];
        return data ? data.capital : "Unknown";
    }

    getRegionName(key: string): string {
        // @ts-ignore
        const regionName = this.locales[this.currentLang].regions[key];
        return regionName || key;
    }
}

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
export const localization = new GeogameLocalization({ en, ja, vi }, savedLang || 'en');

export type GameState = 'MENU' | 'PLAYING' | 'RESULT';
export type GameMode = 'CAPITALS' | 'FLAGS' | 'PROVINCES';

export interface Question {
    target: Country | Province;
    choices: (Country | Province)[]; // 4 choices including target
    flagUrl?: string;
    isProvince?: boolean;
}

export class Game {
    private state: GameState = 'MENU';
    private mode: GameMode = 'CAPITALS';
    private currentRegion: string = 'allWorld';
    private filteredCountries: Country[] = [];
    private currentQuestionIndex: number = 0;
    private score: number = 0;
    private questions: Question[] = [];
    private startTime: number | null = null;
    private endTime: number | null = null;
    private currentCountryFilter: string | null = null; // For states mode
    private filteredProvinces: Province[] = [];

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

    setFilter(type: 'allWorld' | 'continent' | 'region', value?: string) {
        if (type === 'allWorld') {
            this.currentRegion = 'allWorld';
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

    getProvinceCountries(): string[] {
        return provinceCountries;
    }

    setCountryFilter(countryCode: string | null) {
        this.currentCountryFilter = countryCode;
        if (countryCode) {
            this.filteredProvinces = provinces.filter(s => s.parentCountry === countryCode);
        } else {
            this.filteredProvinces = [...provinces];
        }
    }

    getCountryFilter(): string | null {
        return this.currentCountryFilter;
    }


    // --- Game Flow ---

    start(questionCount: number = 5) {
        const pool = this.mode === 'PROVINCES' ? this.filteredProvinces : this.filteredCountries;

        if (pool.length < questionCount) {
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

        if (this.mode === 'PROVINCES') {
            const pool = [...this.filteredProvinces];

            // Shuffle pool
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }

            // Pick top N or max available
            const finalCount = Math.min(count, pool.length);
            for (let i = 0; i < finalCount; i++) {
                const target = pool[i];
                const choices = this.generateProvinceChoices(target);
                const question: Question = { target, choices, isProvince: true };
                this.questions.push(question);
            }
        } else {
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
                const question: Question = { target, choices, isProvince: false };

                if (this.mode === 'FLAGS') {
                    question.flagUrl = `https://flagcdn.com/w320/${target.code.toLowerCase()}.png`;
                }

                this.questions.push(question);
            }
        }
    }

    private generateChoices(target: Country): Country[] {
        const choices: Country[] = [target];
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

    private generateProvinceChoices(target: Province): Province[] {
        const choices: Province[] = [target];
        const distractors = this.filteredProvinces.filter(p => p.code !== target.code);

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

    submitAnswer(choice: Country | Province): boolean {
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
        return end - this.startTime; // milliseconds
    }

}

export const game = new Game();
