import './style.css';
import { game } from './Game';
import type { GameState, Move, GameMode } from './Game';
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
    const modeBtn = document.querySelector('.mode-btn.active') as HTMLElement;

    if (modeBtn) {
        const setup = {
            mode: modeBtn.dataset.mode
        };
        localStorage.setItem('othello_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('othello_setup');
        if (saved) {
            const { mode } = JSON.parse(saved);

            // Restore Mode
            if (mode) {
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    const btnMode = (btn as HTMLElement).dataset.mode;
                    if (btnMode === mode) {
                        btn.classList.add('active');
                        game.setGameMode(mode as GameMode);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }
    } catch (e) {
        console.error('Failed to load Othello setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    const gameTitle = document.getElementById('game-title');
    if (gameTitle) gameTitle.textContent = localization.getUIText('gameTitle');

    const menuTitle = document.getElementById('menu-title');
    if (menuTitle) menuTitle.textContent = localization.getUIText('gameSetup');

    const labelMode = document.getElementById('label-mode');
    if (labelMode) labelMode.textContent = localization.getUIText('gameMode');

    const modeTwoPlayer = document.getElementById('mode-two-player');
    if (modeTwoPlayer) modeTwoPlayer.textContent = localization.getUIText('twoPlayers');

    const modeVsAI = document.getElementById('mode-vs-ai');
    if (modeVsAI) modeVsAI.textContent = localization.getUIText('vsAI');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = localization.getUIText('startGame');

    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');

    const labelTime = document.getElementById('label-time');
    if (labelTime) labelTime.textContent = localization.getUIText('time');

    const labelBlackScore = document.getElementById('label-black-score');
    if (labelBlackScore) labelBlackScore.textContent = localization.getUIText('blackScore');

    const labelWhiteScore = document.getElementById('label-white-score');
    if (labelWhiteScore) labelWhiteScore.textContent = localization.getUIText('whiteScore');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('time');

    const labelTotalMoves = document.getElementById('label-total-moves');
    if (labelTotalMoves) labelTotalMoves.textContent = localization.getUIText('totalMoves');

    const labelFinalBlack = document.getElementById('label-final-black');
    if (labelFinalBlack) labelFinalBlack.textContent = localization.getUIText('blackScore');

    const labelFinalWhite = document.getElementById('label-final-white');
    if (labelFinalWhite) labelFinalWhite.textContent = localization.getUIText('whiteScore');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.textContent = localization.getUIText('playAgain');

    updateGameInfo();
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

    // Game Mode Selection (AI disabled for now)
    document.querySelectorAll('.mode-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const mode = target.dataset.mode as GameMode;

            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setGameMode(mode);
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();
        game.start();
    });

    // New Game (during gameplay)
    document.getElementById('new-game-btn')?.addEventListener('click', () => {
        game.restart();
    });

    // Restart game
    document.getElementById('restart-btn')?.addEventListener('click', () => {
        game.restart();
    });
};

// --- Board Rendering ---

const renderBoard = () => {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    svg.innerHTML = '';

    const boardSize = 8;
    const cellSize = 600 / boardSize;

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '600');
    bg.setAttribute('height', '600');
    bg.setAttribute('fill', '#0f766e');
    svg.appendChild(bg);

    // Grid lines
    for (let i = 0; i <= boardSize; i++) {
        const pos = i * cellSize;

        // Horizontal line
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '0');
        hLine.setAttribute('y1', pos.toString());
        hLine.setAttribute('x2', '600');
        hLine.setAttribute('y2', pos.toString());
        hLine.setAttribute('stroke', '#0d9488');
        hLine.setAttribute('stroke-width', '2');
        svg.appendChild(hLine);

        // Vertical line
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', pos.toString());
        vLine.setAttribute('y1', '0');
        vLine.setAttribute('x2', pos.toString());
        vLine.setAttribute('y2', '600');
        vLine.setAttribute('stroke', '#0d9488');
        vLine.setAttribute('stroke-width', '2');
        svg.appendChild(vLine);
    }

    // Click areas
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (col * cellSize).toString());
            rect.setAttribute('y', (row * cellSize).toString());
            rect.setAttribute('width', cellSize.toString());
            rect.setAttribute('height', cellSize.toString());
            rect.setAttribute('fill', 'transparent');
            rect.classList.add('cell-clickable');
            rect.dataset.row = row.toString();
            rect.dataset.col = col.toString();

            rect.addEventListener('click', () => {
                game.makeMove(row, col);
            });

            svg.appendChild(rect);
        }
    }

    // Render discs
    renderDiscs();

    // Render valid moves
    renderValidMoves();
};

const renderDiscs = () => {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    // Remove old discs
    svg.querySelectorAll('.disc').forEach(disc => disc.remove());

    const board = game.getBoard();
    const cellSize = 600 / 8;
    const discRadius = cellSize * 0.4;

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== null) {
                const cx = colIndex * cellSize + cellSize / 2;
                const cy = rowIndex * cellSize + cellSize / 2;

                // Disc group
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.classList.add('disc');

                // Gradient
                const gradId = `grad-${cell}-${rowIndex}-${colIndex}`;
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
                gradient.setAttribute('id', gradId);

                if (cell === 'BLACK') {
                    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop1.setAttribute('offset', '0%');
                    stop1.setAttribute('stop-color', '#4a5568');
                    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop2.setAttribute('offset', '100%');
                    stop2.setAttribute('stop-color', '#1a202c');
                    gradient.appendChild(stop1);
                    gradient.appendChild(stop2);
                } else {
                    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop1.setAttribute('offset', '0%');
                    stop1.setAttribute('stop-color', '#ffffff');
                    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop2.setAttribute('offset', '100%');
                    stop2.setAttribute('stop-color', '#e2e8f0');
                    gradient.appendChild(stop1);
                    gradient.appendChild(stop2);
                }
                defs.appendChild(gradient);
                svg.appendChild(defs);

                // Shadow
                const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                shadow.setAttribute('cx', (cx + 2).toString());
                shadow.setAttribute('cy', (cy + 2).toString());
                shadow.setAttribute('r', discRadius.toString());
                shadow.setAttribute('fill', 'rgba(0, 0, 0, 0.3)');
                group.appendChild(shadow);

                // Disc circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cx.toString());
                circle.setAttribute('cy', cy.toString());
                circle.setAttribute('r', discRadius.toString());
                circle.setAttribute('fill', `url(#${gradId})`);
                circle.setAttribute('stroke', cell === 'BLACK' ? '#0d131a' : '#cbd5e0');
                circle.setAttribute('stroke-width', '2');
                group.appendChild(circle);

                svg.appendChild(group);
            }
        });
    });
};

const renderValidMoves = () => {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    // Remove old indicators
    svg.querySelectorAll('.valid-move-indicator').forEach(ind => ind.remove());

    const validMoves = game.getValidMoves(game.getCurrentPlayer());
    const cellSize = 600 / 8;

    validMoves.forEach(move => {
        const cx = move.col * cellSize + cellSize / 2;
        const cy = move.row * cellSize + cellSize / 2;

        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        indicator.classList.add('valid-move-indicator');
        indicator.setAttribute('cx', cx.toString());
        indicator.setAttribute('cy', cy.toString());
        indicator.setAttribute('r', (cellSize * 0.15).toString());
        indicator.setAttribute('fill', game.getCurrentPlayer() === 'BLACK' ? '#4a5568' : '#e2e8f0');
        indicator.setAttribute('opacity', '0.5');
        indicator.style.pointerEvents = 'none';
        svg.appendChild(indicator);
    });
};

const updateGameInfo = () => {
    const turnIndicator = document.querySelector('.turn-indicator');
    const turnText = document.getElementById('turn-text');

    const currentPlayer = game.getCurrentPlayer();

    if (turnIndicator) {
        turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}`;
    }

    if (turnText) {
        turnText.textContent = currentPlayer === 'BLACK'
            ? localization.getUIText('blackTurn')
            : localization.getUIText('whiteTurn');
    }

    // Update scores
    const blackScore = document.getElementById('black-score');
    const whiteScore = document.getElementById('white-score');

    if (blackScore) {
        blackScore.textContent = game.getDiscCount('BLACK').toString();
    }

    if (whiteScore) {
        whiteScore.textContent = game.getDiscCount('WHITE').toString();
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

let timerInterval: number | null = null;
let currentGameState: GameState = 'MENU';

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
            const elapsed = game.getElapsedTime();
            const formatted = game.formatTime(elapsed);
            const timerEl = document.getElementById('game-timer');
            if (timerEl) timerEl.textContent = formatted;
        }, 1000);
    }
    if (state === 'RESULT') {
        showView('result-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        displayResult();
    }
});

game.onMove((_move: Move) => {
    renderDiscs();
    renderValidMoves();
    updateGameInfo();
});

game.onBoardUpdate(() => {
    renderDiscs();
    renderValidMoves();
    updateGameInfo();
});

const displayResult = () => {
    const winner = game.getWinner();
    const winnerDisplay = document.getElementById('winner-display');
    const totalMoves = document.getElementById('total-moves');
    const totalTime = document.getElementById('total-time');
    const resultTitle = document.getElementById('result-title');
    const finalBlack = document.getElementById('final-black');
    const finalWhite = document.getElementById('final-white');

    if (totalMoves) {
        totalMoves.textContent = game.getMoves().length.toString();
    }

    if (totalTime) {
        totalTime.textContent = game.formatTime(game.getElapsedTime());
    }

    if (finalBlack) {
        finalBlack.textContent = game.getDiscCount('BLACK').toString();
    }

    if (finalWhite) {
        finalWhite.textContent = game.getDiscCount('WHITE').toString();
    }

    if (winner) {
        if (resultTitle) {
            resultTitle.textContent = winner === 'BLACK'
                ? localization.getUIText('blackWins')
                : localization.getUIText('whiteWins');
        }

        if (winnerDisplay) {
            const winnerText = winner === 'BLACK'
                ? localization.getUIText('blackWins')
                : localization.getUIText('whiteWins');

            winnerDisplay.innerHTML = `
                <div class="winner-disc ${winner.toLowerCase()}"></div>
                <span>${winnerText}</span>
            `;
        }
    } else {
        // Draw
        if (resultTitle) resultTitle.textContent = localization.getUIText('draw');
        if (winnerDisplay) {
            winnerDisplay.innerHTML = `<span>${localization.getUIText('draw')}</span>`;
        }
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
