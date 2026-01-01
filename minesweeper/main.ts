import './style.css';
import { game } from './Game';
import type { GameState, Difficulty } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import zh from './i18n/zh';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

interface HighScore {
    time: number;
    date: number | string;
}

let lastScoreDate: number | null = null;

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi, zh }, savedLang || 'en');

let savedCustomConfig: { rows: number; cols: number; mines: number } = { rows: 10, cols: 10, mines: 10 };

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

        // Update saved config if in custom mode
        if (difficulty === 'CUSTOM') {
            const rowInput = document.getElementById('custom-rows') as HTMLInputElement;
            const colInput = document.getElementById('custom-cols') as HTMLInputElement;
            const minesInput = document.getElementById('custom-mines') as HTMLInputElement;

            savedCustomConfig = {
                rows: parseInt(rowInput.value),
                cols: parseInt(colInput.value),
                mines: parseInt(minesInput.value)
            };
        }

        localStorage.setItem('minesweeper_setup', JSON.stringify({
            difficulty,
            customConfig: savedCustomConfig
        }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('minesweeper_setup');
        if (saved) {
            const { difficulty, customConfig } = JSON.parse(saved);

            // Restore custom inputs if present
            if (customConfig) {
                const rowInput = document.getElementById('custom-rows') as HTMLInputElement;
                const colInput = document.getElementById('custom-cols') as HTMLInputElement;
                const minesInput = document.getElementById('custom-mines') as HTMLInputElement;

                if (rowInput && customConfig.rows) rowInput.value = customConfig.rows;
                if (colInput && customConfig.cols) colInput.value = customConfig.cols;
                if (minesInput && customConfig.mines) minesInput.value = customConfig.mines;

                if (difficulty === 'CUSTOM') {
                    game.setCustomConfig(customConfig);
                }
            }

            // Set active difficulty button
            document.querySelectorAll('.diff-btn').forEach(btn => {
                const btnDiff = (btn as HTMLElement).dataset.diff;
                if (btnDiff === difficulty) {
                    btn.classList.add('active');
                    game.setDifficulty(difficulty);
                    updateCustomInputs(difficulty);
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
    diffButtons.forEach((btn) => {
        const diff = (btn as HTMLElement).dataset.diff;
        if (diff) {
            btn.textContent = localization.getUIText(diff.toLowerCase());
        }
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

    // Custom Setup Labels
    const rowsLabel = document.querySelector('label[for="custom-rows"]');
    const colsLabel = document.querySelector('label[for="custom-cols"]');
    const minesLabel = document.querySelector('label[for="custom-mines"]');

    if (rowsLabel) rowsLabel.textContent = localization.getUIText('rows');
    if (colsLabel) colsLabel.textContent = localization.getUIText('cols');
    if (minesLabel) minesLabel.textContent = localization.getUIText('mines');
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
            updateCustomInputs(diff);
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        const activeDiffBtn = document.querySelector('.diff-btn.active') as HTMLElement;
        const diff = activeDiffBtn?.dataset.diff as Difficulty;

        if (diff === 'CUSTOM') {
            const rowInput = document.getElementById('custom-rows') as HTMLInputElement;
            const colInput = document.getElementById('custom-cols') as HTMLInputElement;
            const minesInput = document.getElementById('custom-mines') as HTMLInputElement;

            const rows = parseInt(rowInput.value);
            const cols = parseInt(colInput.value);
            const mines = parseInt(minesInput.value);

            game.setCustomConfig({ rows, cols, mines });
        }

        saveSetup();
        lastScoreDate = null;
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

const updateCustomInputs = (diff: Difficulty) => {
    const customSetup = document.getElementById('custom-setup');
    const rowInput = document.getElementById('custom-rows') as HTMLInputElement;
    const colInput = document.getElementById('custom-cols') as HTMLInputElement;
    const minesInput = document.getElementById('custom-mines') as HTMLInputElement;

    if (customSetup && rowInput && colInput && minesInput) {
        customSetup.classList.remove('hidden');

        if (diff === 'CUSTOM') {
            rowInput.disabled = false;
            colInput.disabled = false;
            minesInput.disabled = false;

            // Restore saved values
            rowInput.value = savedCustomConfig.rows.toString();
            colInput.value = savedCustomConfig.cols.toString();
            minesInput.value = savedCustomConfig.mines.toString();
        } else {
            rowInput.disabled = true;
            colInput.disabled = true;
            minesInput.disabled = true;

            // Show config for selected difficulty
            const config = game.getConfig();
            rowInput.value = config.rows.toString();
            colInput.value = config.cols.toString();
            minesInput.value = config.mines.toString();
        }
    }
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

    // Calculate dynamic cell size
    const containerWidth = Math.min(window.innerWidth - 32, 800); // 32px padding, max 800px width
    const maxCellSize = 50;
    const minCellSize = 20;

    // Calculate potential size based on width
    // We substract a bit of gap space (config.cols - 1) * 1px
    const availableWidth = containerWidth - (config.cols * 1); // rough estimate
    let cellSize = Math.floor(availableWidth / config.cols);

    // Clamp
    cellSize = Math.max(minCellSize, Math.min(maxCellSize, cellSize));

    boardElement.style.setProperty('--cell-size', `${cellSize}px`);

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

game.onStateChange((state: GameState) => {
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

const getHighScoreKey = () => {
    const config = game.getConfig();
    return `minesweeper_highscores_${config.rows}_${config.cols}_${config.mines}`;
};

const saveHighScore = () => {
    const time = game.getElapsedTime();
    const date = Date.now();
    lastScoreDate = date;

    const newScore: HighScore = { time, date };
    const key = getHighScoreKey();

    util.saveHighScore(key, newScore, (a, b) => a.time - b.time);
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

    renderHighScores();
};

const renderHighScores = () => {
    const key = getHighScoreKey();
    const scores = util.getHighScores<HighScore>(key);
    const tbody = document.getElementById('high-scores-body');

    if (tbody) {
        tbody.innerHTML = '';
        scores.forEach((s, index) => {
            const tr = document.createElement('tr');

            // Highlight current run if it matches
            if (s.date === lastScoreDate) {
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
};

// Subscribe to language changes
localization.subscribe(() => {
    updateTexts();
    if (game.getState() === 'WON' || game.getState() === 'LOST') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
