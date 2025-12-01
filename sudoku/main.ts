import './style.css';
import { game } from './Game';
import type { GameState, Difficulty } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import { Consent } from '../common/Consent';

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi }, savedLang || 'en');

// --- UI Templates ---

const renderApp = () => {
    setupEventListeners();
    updateTexts();

    // Set active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
    });

    // Load saved setup
    loadSetup();
};

// --- Setup Persistence ---

const saveSetup = () => {
    const activeDiffBtn = document.querySelector('.diff-btn.active') as HTMLElement;
    if (activeDiffBtn) {
        const difficulty = activeDiffBtn.dataset.diff as Difficulty;
        localStorage.setItem('sudoku_setup', JSON.stringify({ difficulty }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('sudoku_setup');
        if (saved) {
            const { difficulty } = JSON.parse(saved);
            // Set active difficulty button
            document.querySelectorAll('.diff-btn').forEach(btn => {
                const btnDiff = (btn as HTMLElement).dataset.diff;
                if (btnDiff === difficulty) {
                    btn.classList.add('active');
                    game.setDifficulty(difficulty);
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    } catch (e) {
        console.error('Failed to load Sudoku setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
    document.getElementById('label-difficulty')!.textContent = localization.getUIText('difficulty');

    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach((btn, i) => {
        const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert'];
        btn.textContent = localization.getUIText(difficulties[i]);
    });

    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-mistakes')!.textContent = localization.getUIText('mistakes');
    document.getElementById('label-hints')!.textContent = localization.getUIText('hints');
    document.getElementById('erase-btn')!.textContent = localization.getUIText('erase');
    document.getElementById('notes-btn')!.textContent = localization.getUIText('notes');
    document.getElementById('hint-btn')!.textContent = localization.getUIText('hint');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('totalTime');
    document.getElementById('label-final-mistakes')!.textContent = localization.getUIText('mistakes');
    document.getElementById('label-final-hints')!.textContent = localization.getUIText('hints');
    document.getElementById('play-again-btn')!.textContent = localization.getUIText('playAgain');

    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-mistakes')!.textContent = localization.getUIText('mistakes');
    document.getElementById('th-hints')!.textContent = localization.getUIText('hints');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');
};

// --- Event Listeners ---

const setupEventListeners = () => {
    // Home button
    document.getElementById('home-btn')?.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = (e.target as HTMLElement).dataset.lang as Language;
            localization.setLanguage(lang);

            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');
        });
    });

    // Difficulty selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const diff = target.dataset.diff as Difficulty;

            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setDifficulty(diff);
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();
        game.start();
    });

    // Number pad
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const num = parseInt((e.target as HTMLElement).dataset.num || '0');
            game.enterNumber(num);
        });
    });

    // Erase
    document.getElementById('erase-btn')?.addEventListener('click', () => {
        game.eraseCell();
    });

    // Notes mode
    document.getElementById('notes-btn')?.addEventListener('click', () => {
        game.toggleNotesMode();
        const btn = document.getElementById('notes-btn');
        if (btn) {
            btn.classList.toggle('active', game.getNotesMode());
        }
    });

    // Hint
    document.getElementById('hint-btn')?.addEventListener('click', () => {
        game.getHint();
    });

    // New game
    document.getElementById('new-game-btn')?.addEventListener('click', () => {
        game.restart();
    });

    // Play again
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
        game.restart();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (game.getState() !== 'PLAYING') return;

        if (e.key >= '1' && e.key <= '9') {
            game.enterNumber(parseInt(e.key));
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            game.eraseCell();
        }
    });
};

// --- Board Rendering ---

const renderGrid = () => {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;

    grid.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'sudoku-cell';
            cellDiv.dataset.row = row.toString();
            cellDiv.dataset.col = col.toString();

            cellDiv.addEventListener('click', () => {
                game.selectCell(row, col);
            });

            grid.appendChild(cellDiv);
        }
    }
};

const updateGrid = () => {
    const board = game.getBoard();
    const selectedCell = game.getSelectedCell();
    const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : null;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
            if (!cellDiv) continue;

            const cell = board[row][col];

            // Reset classes
            cellDiv.className = 'sudoku-cell';

            // Add state classes
            if (cell.isFixed) cellDiv.classList.add('fixed');
            if (cell.isError) cellDiv.classList.add('error');
            if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
                cellDiv.classList.add('selected');
            }
            if (selectedValue && cell.value === selectedValue) {
                cellDiv.classList.add('same-number');
            }

            // Display value or notes
            if (cell.value) {
                cellDiv.textContent = cell.value.toString();
            } else if (cell.notes.size > 0) {
                cellDiv.innerHTML = '<div class="cell-notes"></div>';
                const notesDiv = cellDiv.querySelector('.cell-notes');
                if (notesDiv) {
                    for (let n = 1; n <= 9; n++) {
                        const noteSpan = document.createElement('span');
                        noteSpan.textContent = cell.notes.has(n) ? n.toString() : '';
                        notesDiv.appendChild(noteSpan);
                    }
                }
            } else {
                cellDiv.textContent = '';
            }
        }
    }
};

const updateGameInfo = () => {
    const time = game.getElapsedTime();
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    const mistakes = game.getMistakes();
    const maxMistakes = game.getMaxMistakes();
    const mistakesDisplay = document.getElementById('mistakes-display');
    if (mistakesDisplay) {
        mistakesDisplay.textContent = `${mistakes}/${maxMistakes}`;
    }

    const hintsUsed = game.getHintsUsed();
    const maxHints = game.getMaxHints();
    const hintsDisplay = document.getElementById('hints-display');
    if (hintsDisplay) {
        hintsDisplay.textContent = `${hintsUsed}/${maxHints}`;
    }

    // Disable hint button if limit reached
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        if (hintsUsed >= maxHints) {
            hintBtn.classList.add('disabled');
            hintBtn.setAttribute('disabled', 'true');
        } else {
            hintBtn.classList.remove('disabled');
            hintBtn.removeAttribute('disabled');
        }
    }
};

// --- View Management ---

const showView = (viewId: string) => {
    ['menu-view', 'game-view', 'result-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === viewId) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });
};

// --- Game Event Handlers ---

interface HighScore {
    time: number;
    date: number | string;
    mistakes: number;
    hintsUsed: number;
}

let currentGameState: GameState = 'MENU';

game.onStateChange((state: GameState) => {
    currentGameState = state;
    if (state === 'MENU') {
        showView('menu-view');
    }
    if (state === 'PLAYING') {
        showView('game-view');
        renderGrid();
        updateGrid();
        updateGameInfo();
    }
    if (state === 'RESULT') {
        showView('result-view');
        saveHighScore();
        displayResult();
    }
});

game.onCellUpdate(() => {
    updateGrid();
});

game.onMistake(() => {
    updateGameInfo();
});

game.onTimeUpdate(() => {
    updateGameInfo();
});

const saveHighScore = () => {
    // Only save if the player won
    if (!game.isWin()) return;

    const difficulty = game.getDifficulty();
    const time = game.getElapsedTime();
    const mistakes = game.getMistakes();
    const hintsUsed = game.getHintsUsed();
    const date = Date.now();

    const newScore: HighScore = { time, mistakes, hintsUsed, date };
    const key = `sudoku_highscores_${difficulty}`;

    try {
        const existing = localStorage.getItem(key);
        let scores: HighScore[] = existing ? JSON.parse(existing) : [];

        scores.push(newScore);

        // Sort: Fewer hints first, then faster time, then fewer mistakes
        scores.sort((a, b) => {
            if (a.hintsUsed !== b.hintsUsed) {
                return a.hintsUsed - b.hintsUsed;
            }
            if (a.time !== b.time) {
                return a.time - b.time;
            }
            return a.mistakes - b.mistakes;
        });

        // Keep top 5
        scores = scores.slice(0, 5);

        localStorage.setItem(key, JSON.stringify(scores));
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
};

const getHighScores = (): HighScore[] => {
    const difficulty = game.getDifficulty();
    const key = `sudoku_highscores_${difficulty}`;
    try {
        const existing = localStorage.getItem(key);
        return existing ? JSON.parse(existing) : [];
    } catch (e) {
        return [];
    }
};

const displayResult = () => {
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const finalTime = document.getElementById('final-time');
    const finalMistakes = document.getElementById('final-mistakes');

    const isWin = game.isWin();

    if (resultTitle) {
        resultTitle.textContent = isWin
            ? localization.getUIText('youWin')
            : localization.getUIText('gameOver');
    }

    if (resultMessage) {
        resultMessage.textContent = isWin
            ? localization.getUIText('puzzleCompleted')
            : localization.getUIText('tooManyMistakes');
    }

    if (finalTime) {
        finalTime.textContent = game.formatTime(game.getElapsedTime());
    }

    if (finalMistakes) {
        finalMistakes.textContent = game.getMistakes().toString();
    }

    const finalHints = document.getElementById('final-hints');
    if (finalHints) {
        finalHints.textContent = game.getHintsUsed().toString();
    }

    // Render High Scores
    const scores = getHighScores();
    const tbody = document.getElementById('high-scores-body');
    const container = document.querySelector('.high-scores-container');

    // Only show high scores if player won
    if (isWin) {
        if (container) container.classList.remove('hidden');
        if (tbody) {
            tbody.innerHTML = '';
            scores.forEach((s, index) => {
                const tr = document.createElement('tr');

                // Highlight current run if it matches
                const currentTime = game.getElapsedTime();
                const currentMistakes = game.getMistakes();
                const currentHints = game.getHintsUsed();

                if (s.time === currentTime &&
                    s.mistakes === currentMistakes &&
                    s.hintsUsed === currentHints &&
                    (typeof s.date === 'number' && Date.now() - s.date < 1000)) {
                    tr.classList.add('current-run');
                }

                let dateStr = '';
                if (typeof s.date === 'number') {
                    const lang = localization.language;
                    const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
                    dateStr = new Date(s.date).toLocaleDateString(locale);
                } else {
                    dateStr = s.date as string;
                }

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${s.hintsUsed}</td>
                    <td>${game.formatTime(s.time)}</td>
                    <td>${s.mistakes}</td>
                    <td>${dateStr}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } else {
        if (container) container.classList.add('hidden');
    }
};

// Subscribe to language changes
localization.subscribe(() => {
    updateTexts();
    if (currentGameState === 'RESULT') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
