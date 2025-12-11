import './style.css';
import { game } from './Game';
import type { GameState, Difficulty } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

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
        localStorage.setItem('minesweeper_setup', JSON.stringify({ difficulty }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('minesweeper_setup');
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
        console.error('Failed to load Minesweeper setup:', e);
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
    document.getElementById('label-mines')!.textContent = localization.getUIText('mines');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('totalTime');
    document.getElementById('play-again-btn')!.textContent = localization.getUIText('playAgain');

    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
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

    // New game
    document.getElementById('new-game-btn')?.addEventListener('click', () => {
        game.restart();
    });

    // Play again
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
        game.restart();
    });
};

// --- Board Rendering ---

const renderBoard = () => {
    const boardElement = document.getElementById('minesweeper-board');
    if (!boardElement) return;

    boardElement.innerHTML = '';
    const board = game.getBoard();
    const config = game.getConfig();

    // Set grid template
    boardElement.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

    board.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.row = cell.row.toString();
            cellDiv.dataset.col = cell.col.toString();

            // Click handlers
            cellDiv.addEventListener('click', () => {
                game.revealCell(cell.row, cell.col);
                updateBoard();
            });

            cellDiv.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                game.toggleFlag(cell.row, cell.col);
                updateBoard();
            });

            // Long tap handler for mobile
            let longPressTimer: number | null = null;
            let isLongPress = false;
            let startX = 0;
            let startY = 0;

            cellDiv.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;

                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isLongPress = false;

                longPressTimer = window.setTimeout(() => {
                    isLongPress = true;
                    if (navigator.vibrate) navigator.vibrate(50);
                    game.toggleFlag(cell.row, cell.col);
                    updateBoard();
                }, 500);
            }, { passive: true });

            cellDiv.addEventListener('touchmove', (e) => {
                if (!longPressTimer) return;

                const x = e.touches[0].clientX;
                const y = e.touches[0].clientY;

                // Cancel if moved more than 10px
                if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }, { passive: true });

            cellDiv.addEventListener('touchend', (e) => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }

                if (isLongPress) {
                    if (e.cancelable) e.preventDefault(); // Prevent click event
                }
            });

            boardElement.appendChild(cellDiv);
        });
    });

    updateBoard();
};

const updateBoard = () => {
    const board = game.getBoard();

    board.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`) as HTMLElement;
            if (!cellDiv) return;

            // Reset classes
            cellDiv.className = 'cell';

            if (cell.isRevealed) {
                cellDiv.classList.add('revealed');
                if (cell.isMine) {
                    cellDiv.classList.add('mine');
                    cellDiv.textContent = '💣';
                } else if (cell.neighborMines > 0) {
                    cellDiv.textContent = cell.neighborMines.toString();
                    cellDiv.dataset.num = cell.neighborMines.toString();
                } else {
                    cellDiv.textContent = '';
                }
            } else if (cell.isFlagged) {
                cellDiv.classList.add('flagged');
                cellDiv.textContent = '🚩';
            } else {
                cellDiv.textContent = '';
            }
        });
    });
};

const updateGameInfo = () => {
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = util.formatTime(game.getElapsedTime());
    }

    const minesDisplay = document.getElementById('mines-display');
    if (minesDisplay) {
        minesDisplay.textContent = game.getRemainingMines().toString();
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
}

let currentGameState: GameState = 'MENU';

game.onStateChange((state: GameState) => {
    currentGameState = state;
    if (state === 'MENU') {
        showView('menu-view');
    }
    if (state === 'PLAYING') {
        showView('game-view');
        renderBoard();
        updateGameInfo();
    }
    if (state === 'WON' || state === 'LOST') {
        showView('result-view');
        updateBoard(); // Show all mines if lost
        if (state === 'WON') {
            saveHighScore();
        }
        displayResult();
    }
});

game.onTimerUpdate(() => {
    updateGameInfo();
});

game.onMinesUpdate(() => {
    updateGameInfo();
});

const saveHighScore = () => {
    const difficulty = game.getDifficulty();
    const time = game.getElapsedTime();
    const date = Date.now();

    const newScore: HighScore = { time, date };
    const key = `minesweeper_highscores_${difficulty}`;

    util.saveHighScore(key, newScore, (a, b) => a.time - b.time);
};

const getHighScores = (): HighScore[] => {
    const difficulty = game.getDifficulty();
    const key = `minesweeper_highscores_${difficulty}`;
    return util.getHighScores<HighScore>(key);
};

const displayResult = () => {
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const finalTime = document.getElementById('final-time');

    const isWin = game.getState() === 'WON';

    if (resultTitle) {
        resultTitle.textContent = isWin
            ? localization.getUIText('youWin')
            : localization.getUIText('gameOver');
    }

    if (resultMessage) {
        resultMessage.textContent = isWin
            ? localization.getUIText('congratulations')
            : localization.getUIText('hitMine');
    }

    if (finalTime) {
        finalTime.textContent = util.formatTime(game.getElapsedTime());
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

                if (s.time === currentTime &&
                    (typeof s.date === 'number' && Date.now() - s.date < 1000)) {
                    tr.classList.add('current-run');
                }


                const dateStr = util.formatDate(s.date, localization.language);

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${util.formatTime(s.time)}</td>
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
    if (currentGameState === 'WON' || currentGameState === 'LOST') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
