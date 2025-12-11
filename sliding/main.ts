import './style.css';
import { game } from './Game';
import type { GameState, BoardSize } from './Game';
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
    const activeSizeBtn = document.querySelector('.size-btn.active') as HTMLElement;
    if (activeSizeBtn) {
        const size = parseInt(activeSizeBtn.dataset.size || '3') as BoardSize;
        localStorage.setItem('sliding_setup', JSON.stringify({ size }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('sliding_setup');
        if (saved) {
            const { size } = JSON.parse(saved);
            document.querySelectorAll('.size-btn').forEach(btn => {
                const btnSize = parseInt((btn as HTMLElement).dataset.size || '0');
                if (btnSize === size) {
                    btn.classList.add('active');
                    game.setBoardSize(size);
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    } catch (e) {
        console.error('Failed to load sliding puzzle setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
    document.getElementById('label-board-size')!.textContent = localization.getUIText('boardSize');
    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('result-title')!.textContent = localization.getUIText('gameOver');
    document.getElementById('result-message')!.textContent = localization.getUIText('congratulations');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('totalTime');
    document.getElementById('label-total-moves')!.textContent = localization.getUIText('totalMoves');
    document.getElementById('play-again-btn')!.textContent = localization.getUIText('playAgain');

    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');
    document.getElementById('reference-label')!.textContent = localization.getUIText('reference');
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

    // Board size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const size = parseInt(target.dataset.size || '3') as BoardSize;

            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setBoardSize(size);
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

const renderReferenceBoard = () => {
    const referenceBoardElement = document.getElementById('reference-board');
    if (!referenceBoardElement) return;

    referenceBoardElement.innerHTML = '';
    const size = game.getBoardSize();
    const totalTiles = size * size;

    // Set grid template
    referenceBoardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    referenceBoardElement.dataset.size = size.toString();

    // Create solved board: [1, 2, 3, ..., size*size-1, null]
    for (let i = 1; i < totalTiles; i++) {
        const tileDiv = document.createElement('div');
        tileDiv.className = 'tile';
        tileDiv.textContent = i.toString();
        referenceBoardElement.appendChild(tileDiv);
    }

    // Add empty tile
    const emptyTile = document.createElement('div');
    emptyTile.className = 'tile empty';
    referenceBoardElement.appendChild(emptyTile);
};

const renderBoard = () => {
    const boardElement = document.getElementById('puzzle-board');
    if (!boardElement) return;

    boardElement.innerHTML = '';
    const board = game.getBoard();
    const size = game.getBoardSize();

    // Set grid template
    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardElement.dataset.size = size.toString();

    board.forEach((value, index) => {
        const tileDiv = document.createElement('div');

        if (value === null) {
            tileDiv.className = 'tile empty';
        } else {
            tileDiv.className = 'tile';
            tileDiv.textContent = value.toString();
            tileDiv.dataset.value = value.toString();

            // Click handler
            tileDiv.addEventListener('click', () => {
                const moved = game.makeMove(index);
                if (moved) {
                    animateTileMove(tileDiv);
                }
            });
        }

        boardElement.appendChild(tileDiv);
    });
};

const animateTileMove = (tile: HTMLElement) => {
    tile.classList.add('moving');
    setTimeout(() => {
        tile.classList.remove('moving');
        renderBoard();
    }, 200);
};

const updateGameInfo = () => {
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = util.formatTime(game.getElapsedTime());
    }

    const movesDisplay = document.getElementById('moves-display');
    if (movesDisplay) {
        movesDisplay.textContent = game.getMoves().toString();
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
    moves: number;
    time: number;
    date: number | string;
}

let currentGameState: GameState = 'MENU';
let timerInterval: number | null = null;

game.onStateChange((state: GameState) => {
    currentGameState = state;
    if (state === 'MENU') {
        showView('menu-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    if (state === 'PLAYING') {
        showView('game-view');
        renderReferenceBoard();
        renderBoard();
        updateGameInfo();

        // Start timer
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = window.setInterval(() => {
            updateGameInfo();
        }, 1000);
    }
    if (state === 'WON') {
        showView('result-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        saveHighScore();
        displayResult();
    }
});

game.onBoardUpdate(() => {
    renderBoard();
});

game.onMovesUpdate(() => {
    updateGameInfo();
});

const saveHighScore = () => {
    const size = game.getBoardSize();
    const moves = game.getMoves();
    const time = game.getElapsedTime();
    const date = Date.now();

    const newScore: HighScore = { moves, time, date };
    const key = `sliding_highscores_${size}x${size}`;

    try {
        const existing = localStorage.getItem(key);
        let scores: HighScore[] = existing ? JSON.parse(existing) : [];

        scores.push(newScore);

        // Sort: Fewer moves first, then faster time
        scores.sort((a, b) => {
            if (a.moves !== b.moves) {
                return a.moves - b.moves;
            }
            return a.time - b.time;
        });

        // Keep top 5
        scores = scores.slice(0, 5);

        localStorage.setItem(key, JSON.stringify(scores));
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
};

const getHighScores = (): HighScore[] => {
    const size = game.getBoardSize();
    const key = `sliding_highscores_${size}x${size}`;
    try {
        const existing = localStorage.getItem(key);
        return existing ? JSON.parse(existing) : [];
    } catch (e) {
        return [];
    }
};

const displayResult = () => {
    const finalTime = document.getElementById('final-time');
    const finalMoves = document.getElementById('final-moves');

    if (finalTime) {
        finalTime.textContent = util.formatTime(game.getElapsedTime());
    }

    if (finalMoves) {
        finalMoves.textContent = game.getMoves().toString();
    }

    // Render High Scores
    const scores = getHighScores();
    const tbody = document.getElementById('high-scores-body');

    if (tbody) {
        tbody.innerHTML = '';
        scores.forEach((s, index) => {
            const tr = document.createElement('tr');

            // Highlight current run if it matches
            const currentMoves = game.getMoves();
            const currentTime = game.getElapsedTime();

            if (s.moves === currentMoves &&
                s.time === currentTime &&
                (typeof s.date === 'number' && Date.now() - s.date < 1000)) {
                tr.classList.add('current-run');
            }


            const dateStr = util.formatDate(s.date, localization.language);

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${s.moves}</td>
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
    if (currentGameState === 'WON') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
