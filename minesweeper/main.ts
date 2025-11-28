import './style.css';
import { game } from './Game';
import type { GameState, Difficulty } from './Game';
import { localization } from './i18n/Localization';
import type { Language } from './i18n/Localization';
import { Consent } from '../common/Consent';

// Initialize Consent Banner
new Consent();

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
        localStorage.setItem('minesweeperSetup', JSON.stringify({ difficulty }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('minesweeperSetup');
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
    const gameTitle = document.getElementById('game-title');
    if (gameTitle) gameTitle.textContent = localization.getUIText('gameTitle');

    const menuTitle = document.getElementById('menu-title');
    if (menuTitle) menuTitle.textContent = localization.getUIText('gameSetup');

    const labelDifficulty = document.getElementById('label-difficulty');
    if (labelDifficulty) labelDifficulty.textContent = localization.getUIText('difficulty');

    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach((btn, i) => {
        const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert'];
        btn.textContent = localization.getUIText(difficulties[i]);
    });

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = localization.getUIText('startGame');

    const labelTime = document.getElementById('label-time');
    if (labelTime) labelTime.textContent = localization.getUIText('time');

    const labelMines = document.getElementById('label-mines');
    if (labelMines) labelMines.textContent = localization.getUIText('mines');

    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('totalTime');

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.textContent = localization.getUIText('playAgain');

    // High Score Table Headers
    const highScoresTitle = document.getElementById('high-scores-title');
    if (highScoresTitle) highScoresTitle.textContent = localization.getUIText('highScores');

    const thRank = document.getElementById('th-rank');
    if (thRank) thRank.textContent = localization.getUIText('rank');

    const thTime = document.getElementById('th-time');
    if (thTime) thTime.textContent = localization.getUIText('time');

    const thDate = document.getElementById('th-date');
    if (thDate) thDate.textContent = localization.getUIText('date');
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
        timeDisplay.textContent = game.formatTime(game.getElapsedTime());
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

    try {
        const existing = localStorage.getItem(key);
        let scores: HighScore[] = existing ? JSON.parse(existing) : [];

        scores.push(newScore);

        // Sort: Faster time first
        scores.sort((a, b) => a.time - b.time);

        // Keep top 5
        scores = scores.slice(0, 5);

        localStorage.setItem(key, JSON.stringify(scores));
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
};

const getHighScores = (): HighScore[] => {
    const difficulty = game.getDifficulty();
    const key = `minesweeper_highscores_${difficulty}`;
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
        finalTime.textContent = game.formatTime(game.getElapsedTime());
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
                    <td>${game.formatTime(s.time)}</td>
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
