import './style.css';
import { game } from './Game';
import type { GameState, BoardSize } from './Game';
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
    const activeSizeBtn = document.querySelector('.size-btn.active') as HTMLElement;
    if (activeSizeBtn) {
        const size = parseInt(activeSizeBtn.dataset.size || '3') as BoardSize;
        localStorage.setItem('slidingpuzzleSetup', JSON.stringify({ size }));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('slidingpuzzleSetup');
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
    const gameTitle = document.getElementById('game-title');
    if (gameTitle) gameTitle.textContent = localization.getUIText('gameTitle');

    const menuTitle = document.getElementById('menu-title');
    if (menuTitle) menuTitle.textContent = localization.getUIText('gameSetup');

    const labelBoardSize = document.getElementById('label-board-size');
    if (labelBoardSize) labelBoardSize.textContent = localization.getUIText('boardSize');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = localization.getUIText('startGame');

    const labelTime = document.getElementById('label-time');
    if (labelTime) labelTime.textContent = localization.getUIText('time');

    const labelMoves = document.getElementById('label-moves');
    if (labelMoves) labelMoves.textContent = localization.getUIText('moves');

    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');

    const resultTitle = document.getElementById('result-title');
    if (resultTitle) resultTitle.textContent = localization.getUIText('gameOver');

    const resultMessage = document.getElementById('result-message');
    if (resultMessage) resultMessage.textContent = localization.getUIText('congratulations');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('totalTime');

    const labelTotalMoves = document.getElementById('label-total-moves');
    if (labelTotalMoves) labelTotalMoves.textContent = localization.getUIText('totalMoves');

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.textContent = localization.getUIText('playAgain');

    // High Score Table Headers
    const highScoresTitle = document.getElementById('high-scores-title');
    if (highScoresTitle) highScoresTitle.textContent = localization.getUIText('highScores');

    const thRank = document.getElementById('th-rank');
    if (thRank) thRank.textContent = localization.getUIText('rank');

    const thMoves = document.getElementById('th-moves');
    if (thMoves) thMoves.textContent = localization.getUIText('moves');

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
                    animateTileMove(tileDiv, index);
                }
            });
        }

        boardElement.appendChild(tileDiv);
    });
};

const animateTileMove = (tile: HTMLElement, index: number) => {
    tile.classList.add('moving');
    setTimeout(() => {
        tile.classList.remove('moving');
        renderBoard();
    }, 200);
};

const updateGameInfo = () => {
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = game.formatTime(game.getElapsedTime());
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
    const key = `slidingpuzzle_highscores_${size}x${size}`;

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
    const key = `slidingpuzzle_highscores_${size}x${size}`;
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
        finalTime.textContent = game.formatTime(game.getElapsedTime());
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
                <td>${s.moves}</td>
                <td>${game.formatTime(s.time)}</td>
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
