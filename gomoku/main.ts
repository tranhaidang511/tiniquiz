import './style.css';
import { game } from './Game';
import type { GameState, Stone } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

interface HighScore {
    moves: number;
    time: number;
    date: number | string;
    boardSize: number;
}

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi }, savedLang || 'en');

// --- UI Templates ---

const toggleSideSelector = () => {
    const mode = game.getGameMode();
    const sideSection = document.getElementById('side-section');
    if (sideSection) {
        if (mode === 'VS_AI') {
            sideSection.classList.remove('hidden');
        } else {
            sideSection.classList.add('hidden');
        }
    }
};

const renderApp = () => {
    setupEventListeners();
    updateTexts();

    // Set active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
    });

    // Load saved setup
    loadSetup();
    toggleSideSelector();
};

// --- Setup Persistence ---

const saveSetup = () => {
    const modeBtn = document.querySelector('.mode-btn.active') as HTMLElement;
    const sizeBtn = document.querySelector('.size-btn.active') as HTMLElement;

    if (modeBtn && sizeBtn) {
        const setup = {
            mode: modeBtn.dataset.mode,
            size: sizeBtn.dataset.size,
            side: (document.querySelector('.side-btn.active') as HTMLElement)?.dataset.side || 'BLACK'
        };
        localStorage.setItem('gomoku_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('gomoku_setup');
        if (saved) {
            const { mode, size } = JSON.parse(saved);

            // Restore Mode
            if (mode) {
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    const btnMode = (btn as HTMLElement).dataset.mode;
                    if (btnMode === mode) {
                        btn.classList.add('active');
                        game.setGameMode(mode);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Size
            if (size) {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    const btnSize = (btn as HTMLElement).dataset.size;
                    if (btnSize === size) {
                        btn.classList.add('active');
                        game.setBoardSize(parseInt(size));
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Side
            if ('side' in JSON.parse(saved)) {
                const { side } = JSON.parse(saved);
                if (side) {
                    document.querySelectorAll('.side-btn').forEach(btn => {
                        const btnSide = (btn as HTMLElement).dataset.side;
                        if (btnSide === side) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }

            toggleSideSelector();
        }
    } catch (e) {
        console.error('Failed to load Gomoku setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    // Title
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    // Menu
    document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
    document.getElementById('label-mode')!.textContent = localization.getUIText('gameMode');
    document.getElementById('mode-two-player')!.textContent = localization.getUIText('twoPlayers');
    document.getElementById('mode-vs-ai')!.textContent = localization.getUIText('vsAI');
    document.getElementById('label-board-size')!.textContent = localization.getUIText('boardSize');
    document.getElementById('label-side')!.textContent = localization.getUIText('labelSide');
    document.getElementById('side-black')!.textContent = localization.getUIText('sideBlack');
    document.getElementById('side-white')!.textContent = localization.getUIText('sideWhite');
    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    // Game view
    document.getElementById('label-move')!.textContent = localization.getUIText('move');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    // Result view
    document.getElementById('label-total-moves')!.textContent = localization.getUIText('totalMoves');
    document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('totalTime');
    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');

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

            // Update active class
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');
        });
    });

    // Mode selection (2-player only for now)
    document.querySelectorAll('.mode-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const mode = target.dataset.mode as any;

            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setGameMode(mode);
            toggleSideSelector();
        });
    });

    // Side Selection
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Board size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const size = parseInt(target.dataset.size || '15');

            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setBoardSize(size);
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();

        // Set AI Side
        if (game.getGameMode() === 'VS_AI') {
            const sideBtn = document.querySelector('.side-btn.active') as HTMLElement;
            const userSide = sideBtn?.dataset.side || 'BLACK';
            // User BLACK -> AI WHITE (Second). User WHITE -> AI BLACK (First).
            game.setAISide(userSide === 'BLACK' ? 'WHITE' : 'BLACK');
        } else {
            game.setAISide(null);
        }

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
    svg.setAttribute('viewBox', '0 0 600 600');

    const boardSize = game.getBoardSize();
    const padding = 30;
    const boardWidth = 600 - 2 * padding;
    const cellSize = boardWidth / (boardSize - 1);

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '600');
    bg.setAttribute('height', '600');
    bg.setAttribute('fill', 'var(--board-color)');
    bg.setAttribute('rx', '8');
    svg.appendChild(bg);

    // Grid lines
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('stroke', 'var(--board-line)');
    gridGroup.setAttribute('stroke-width', '1.5');

    for (let i = 0; i < boardSize; i++) {
        const pos = padding + i * cellSize;

        // Horizontal line
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', padding.toString());
        hLine.setAttribute('y1', pos.toString());
        hLine.setAttribute('x2', (600 - padding).toString());
        hLine.setAttribute('y2', pos.toString());
        gridGroup.appendChild(hLine);

        // Vertical line
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', pos.toString());
        vLine.setAttribute('y1', padding.toString());
        vLine.setAttribute('x2', pos.toString());
        vLine.setAttribute('y2', (600 - padding).toString());
        gridGroup.appendChild(vLine);
    }
    svg.appendChild(gridGroup);

    // Star points
    let starPoints: number[][] = [];
    if (boardSize === 9) {
        starPoints = [[2, 2], [2, 6], [4, 4], [6, 2], [6, 6]];
    } else if (boardSize === 15) {
        starPoints = [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]];
    } else {
        starPoints = [[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]];
    }

    starPoints.forEach(([row, col]) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', (padding + col * cellSize).toString());
        circle.setAttribute('cy', (padding + row * cellSize).toString());
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'var(--board-line)');
        svg.appendChild(circle);
    });

    // Stones group
    const stonesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    stonesGroup.setAttribute('id', 'stones-group');
    svg.appendChild(stonesGroup);

    // Hover stone
    const hoverStone = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hoverStone.setAttribute('r', (cellSize * 0.42).toString());
    hoverStone.setAttribute('class', 'stone-hover');
    hoverStone.style.opacity = '0';
    hoverStone.style.pointerEvents = 'none';
    svg.appendChild(hoverStone);

    // Create transparent hit area for mouse events
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('x', '0');
    hitArea.setAttribute('y', '0');
    hitArea.setAttribute('width', '600');
    hitArea.setAttribute('height', '600');
    hitArea.setAttribute('fill', 'transparent');
    hitArea.style.cursor = 'crosshair';

    hitArea.addEventListener('mousemove', (e) => {
        if (game.getState() !== 'PLAYING') {
            hoverStone.style.opacity = '0';
            return;
        }

        const rect = svg.getBoundingClientRect();
        const scale = 600 / rect.width;
        const col = Math.round(((e.clientX - rect.left) * scale - padding) / cellSize);
        const row = Math.round(((e.clientY - rect.top) * scale - padding) / cellSize);

        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && !game.getBoard()[row][col]) {
            const currentPlayer = game.getCurrentPlayer();
            hoverStone.setAttribute('cx', (padding + col * cellSize).toString());
            hoverStone.setAttribute('cy', (padding + row * cellSize).toString());
            hoverStone.setAttribute('class', `stone-hover ${currentPlayer.toLowerCase()}`);
            hoverStone.style.opacity = '0.4';
        } else {
            hoverStone.style.opacity = '0';
        }
    });

    hitArea.addEventListener('mouseleave', () => {
        hoverStone.style.opacity = '0';
    });

    hitArea.addEventListener('click', (e) => {
        if (game.getState() !== 'PLAYING') return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const scale = 600 / rect.width;
        const boardX = x * scale;
        const boardY = y * scale;

        const col = Math.round((boardX - padding) / cellSize);
        const row = Math.round((boardY - padding) / cellSize);

        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
            game.makeMove(row, col);
        }
    });

    svg.appendChild(hitArea);
};

const addStone = (stone: Stone) => {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    const stonesGroup = document.getElementById('stones-group');
    if (!svg || !stonesGroup) return;

    const boardSize = game.getBoardSize();
    const padding = 30;
    const boardWidth = 600 - 2 * padding;
    const cellSize = boardWidth / (boardSize - 1);
    const stoneRadius = cellSize * 0.42;

    const cx = padding + stone.col * cellSize;
    const cy = padding + stone.row * cellSize;

    // Stone shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    shadow.setAttribute('cx', (cx + 2).toString());
    shadow.setAttribute('cy', (cy + 2).toString());
    shadow.setAttribute('rx', stoneRadius.toString());
    shadow.setAttribute('ry', (stoneRadius * 0.9).toString());
    shadow.setAttribute('fill', 'rgba(0, 0, 0, 0.3)');
    shadow.classList.add('stone-animate');
    stonesGroup.appendChild(shadow);

    // Gradient for stone
    const gradId = `grad-${stone.player}-${stone.row}-${stone.col}`;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', gradId);
    gradient.setAttribute('cx', '30%');
    gradient.setAttribute('cy', '30%');

    if (stone.player === 'BLACK') {
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
        stop2.setAttribute('stop-color', '#f7fafc');
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
    }
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Stone circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', stoneRadius.toString());
    circle.setAttribute('fill', `url(#${gradId})`);
    circle.setAttribute('stroke', stone.player === 'BLACK' ? '#0d131a' : '#e2e8f0');
    circle.setAttribute('stroke-width', '2');
    circle.classList.add('stone-animate');

    // Manage Last Move Highlight
    // Remove from previous
    const previousLast = svg.querySelector('.last-move');
    if (previousLast) {
        previousLast.classList.remove('last-move');
    }
    // Add to current
    circle.classList.add('last-move');

    stonesGroup.appendChild(circle);
};

const updateGameInfo = () => {
    const turnIndicator = document.querySelector('.turn-indicator');
    const turnText = document.getElementById('turn-text');
    const moveNumber = document.getElementById('move-number');

    const currentPlayer = game.getCurrentPlayer();
    const moves = game.getMoves();

    if (turnIndicator) {
        turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}`;
    }

    if (turnText) {
        turnText.textContent = currentPlayer === 'BLACK'
            ? localization.getUIText('blackTurn')
            : localization.getUIText('whiteTurn');
    }

    if (moveNumber) {
        moveNumber.textContent = moves.length.toString();
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
    if (state === 'RESULT') {
        showView('result-view');
        saveHighScore();
        displayResult();
    }
});

game.onMove((stone: Stone) => {
    addStone(stone);
    updateGameInfo();
});

game.onTimerUpdate(() => {
    const elapsed = game.getElapsedTime();
    const formatted = util.formatTime(elapsed);
    const timerEl = document.getElementById('game-timer');
    if (timerEl) timerEl.textContent = formatted;
});


const getHighScoreKey = () => {
    let userSide = 'BLACK';
    if (game.getGameMode() === 'VS_AI') {
        userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';
    }
    return `gomoku_highscores_${userSide}`;
};

const saveHighScore = () => {
    // Only save for VS_AI mode
    if (game.getGameMode() !== 'VS_AI') return;

    const userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';

    // Only save if User won
    if (game.getWinner() !== userSide) return;

    const totalMovesCount = game.getMoves().length;
    const time = game.getElapsedTime();
    const date = Date.now();
    const boardSize = game.getBoardSize();

    const newScore: HighScore = { moves: totalMovesCount, time, date, boardSize };
    const key = getHighScoreKey();

    util.saveHighScore(key, newScore, (a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time - b.time;
    });
};

const displayResult = () => {
    const winner = game.getWinner();
    const winnerDisplay = document.getElementById('winner-display');
    const totalMoves = document.getElementById('total-moves');
    const totalTime = document.getElementById('total-time');
    const resultTitle = document.getElementById('result-title');

    if (totalMoves) {
        totalMoves.textContent = game.getMoves().length.toString();
    }

    if (totalTime) {
        totalTime.textContent = util.formatTime(game.getElapsedTime());
    }

    if (winner) {
        if (resultTitle) {
            resultTitle.textContent = winner === 'BLACK'
                ? localization.getUIText('blackWins')
                : localization.getUIText('whiteWins');
        }

        if (winnerDisplay) {
            const playerWinsText = winner === 'BLACK'
                ? localization.getUIText('blackPlayerWins')
                : localization.getUIText('whitePlayerWins');

            winnerDisplay.innerHTML = `
        <div class="winner-stone ${winner.toLowerCase()}"></div>
        <span>${playerWinsText}</span>
      `;
        }
    } else {
        if (resultTitle) resultTitle.textContent = localization.getUIText('draw');
        if (winnerDisplay) {
            winnerDisplay.innerHTML = `<span>${localization.getUIText('boardFull')}</span>`;
        }
    }

    renderHighScores();
};

const renderHighScores = () => {
    const container = document.querySelector('.high-scores-container');
    if (game.getGameMode() !== 'VS_AI') {
        if (container) container.classList.add('hidden');
        return;
    }
    if (container) container.classList.remove('hidden');

    const key = getHighScoreKey();
    const scores = util.getHighScores<HighScore>(key);
    const tbody = document.getElementById('high-scores-body');

    if (tbody) {
        tbody.innerHTML = '';
        scores.forEach((s, index) => {
            const tr = document.createElement('tr');

            // Highlight current run if it matches
            // Note: Simple matching might highlight duplicates
            const currentMoves = game.getMoves().length;
            const currentTime = game.getElapsedTime();
            const userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';

            if (game.getWinner() === userSide &&
                s.moves === currentMoves &&
                s.time === currentTime &&
                // Check if date is very recent (within last second) to avoid highlighting old identical scores
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
    if (game.getState() === 'RESULT') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();

