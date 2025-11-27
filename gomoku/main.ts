import './style.css';
import { game } from './Game';
import type { GameState, Stone } from './Game';
import { localization } from './i18n/Localization';
import type { Language } from './i18n/Localization';
import { Consent } from './Consent';

// Initialize Consent Banner
new Consent();

const app = document.querySelector<HTMLDivElement>('#app')!;

// --- UI Templates ---

const renderApp = () => {
    app.innerHTML = `
    <div class="header-controls">
      <button id="home-btn" class="icon-btn" aria-label="Back to Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </button>
      <h1 id="game-title">Gomoku</h1>
    </div>
    
    <!-- Language Switcher -->
    <div class="lang-switcher">
      <button class="lang-btn active" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="ja">JA</button>
      <button class="lang-btn" data-lang="vi">VI</button>
    </div>
    
    <!-- Menu View -->
    <div id="menu-view" class="card animate-fade-in">
      <h2 id="menu-title">Game Setup</h2>
      <div class="menu-options">
        <div class="option-group">
          <label id="label-mode">Game Mode</label>
          <div class="mode-selector">
            <button id="mode-two-player" class="mode-btn active" data-mode="TWO_PLAYER">2 Players</button>
            <button id="mode-vs-ai" class="mode-btn" data-mode="VS_AI">vs AI</button>
          </div>
        </div>

        <div class="option-group">
          <label id="label-board-size">Board Size</label>
          <div class="size-selector">
            <button class="size-btn" data-size="9">9 × 9</button>
            <button class="size-btn active" data-size="15">15 × 15</button>
            <button class="size-btn" data-size="19">19 × 19</button>
          </div>
        </div>

        <button id="start-btn" class="primary">Start Game</button>
      </div>
    </div>

    <!-- Game View -->
    <div id="game-view" class="card hidden animate-fade-in">
      <button id="new-game-btn" class="primary">New Game</button>
      <div class="game-info">
        <div class="current-turn">
          <div class="turn-indicator black"></div>
          <span id="turn-text">Black's Turn</span>
        </div>
        <div class="move-count">
          <span id="label-move">Move</span>: <span id="move-number">0</span>
        </div>
        <div class="game-timer">
          <span id="label-time">Time</span>: <span id="game-timer">00:00</span>
        </div>
      </div>
      
      <div id="board-container">
        <svg id="board" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <!-- Board will be rendered here -->
        </svg>
      </div>
    </div>

    <!-- Result View -->
    <div id="result-view" class="card hidden animate-fade-in">
      <h2 id="result-title">Game Over!</h2>
      
      <div class="winner-display" id="winner-display">
        <!-- Winner info will be injected here -->
      </div>

      <div class="game-stats">
        <div class="stat">
          <div class="stat-label" id="label-total-moves">Total Moves</div>
          <div class="stat-value" id="total-moves">0</div>
        </div>
        <div class="stat">
            <div class="stat-label" id="label-total-time">Total Time</div>
            <div class="stat-value" id="total-time">00:00</div>
        </div>
      </div>

      <!-- High Scores Table -->
      <div class="high-scores-container">
        <h3 id="high-scores-title">High Scores (vs AI)</h3>
        <table id="high-scores-table">
          <thead>
            <tr>
              <th id="th-rank">Rank</th>
              <th id="th-moves">Moves</th>
              <th id="th-time">Time</th>
              <th id="th-date">Date</th>
            </tr>
          </thead>
          <tbody id="high-scores-body">
            <!-- Scores injected here -->
          </tbody>
        </table>
      </div>

      <button id="restart-btn" class="primary">Play Again</button>
    </div>
  `;

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
    const sizeBtn = document.querySelector('.size-btn.active') as HTMLElement;

    if (modeBtn && sizeBtn) {
        const setup = {
            mode: modeBtn.dataset.mode,
            size: sizeBtn.dataset.size
        };
        localStorage.setItem('gomokuSetup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('gomokuSetup');
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
        }
    } catch (e) {
        console.error('Failed to load Gomoku setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    // Title
    const gameTitle = document.getElementById('game-title');
    if (gameTitle) gameTitle.textContent = localization.getUIText('gameTitle');

    // Menu
    const menuTitle = document.getElementById('menu-title');
    if (menuTitle) menuTitle.textContent = localization.getUIText('gameSetup');

    const labelMode = document.getElementById('label-mode');
    if (labelMode) labelMode.textContent = localization.getUIText('gameMode');

    const modeTwoPlayer = document.getElementById('mode-two-player');
    if (modeTwoPlayer) modeTwoPlayer.textContent = localization.getUIText('twoPlayers');

    const modeVsAI = document.getElementById('mode-vs-ai');
    if (modeVsAI) {
        modeVsAI.textContent = localization.getUIText('vsAI');
        // Add "Coming Soon" text
        if (modeVsAI.classList.contains('disabled')) {
            modeVsAI.innerHTML = `${localization.getUIText('vsAI')}<br><span style="font-size: 0.7rem; opacity: 0.7;">(${localization.getUIText('comingSoon')})</span>`;
        }
    }

    const labelBoardSize = document.getElementById('label-board-size');
    if (labelBoardSize) labelBoardSize.textContent = localization.getUIText('boardSize');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = localization.getUIText('startGame');

    // Game view
    const labelMove = document.getElementById('label-move');
    if (labelMove) labelMove.textContent = localization.getUIText('move');

    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');

    updateGameInfo();

    // Result view
    const labelTotalMoves = document.getElementById('label-total-moves');
    if (labelTotalMoves) labelTotalMoves.textContent = localization.getUIText('totalMoves');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.textContent = localization.getUIText('playAgain');

    const labelTime = document.getElementById('label-time');
    if (labelTime) labelTime.textContent = localization.getUIText('time');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('totalTime');

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

    const boardSize = game.getBoardSize();
    const padding = 30;
    const boardWidth = 600 - 2 * padding;
    const cellSize = boardWidth / (boardSize - 1);

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '600');
    bg.setAttribute('height', '600');
    bg.setAttribute('fill', '#2d3748');
    bg.setAttribute('rx', '8');
    svg.appendChild(bg);

    // Grid lines
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('stroke', '#4a5568');
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
        circle.setAttribute('fill', '#4a5568');
        svg.appendChild(circle);
    });

    // Stones group
    const stonesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    stonesGroup.setAttribute('id', 'stones-group');
    svg.appendChild(stonesGroup);

    // Click handler
    svg.style.cursor = 'crosshair';
    svg.addEventListener('click', (e) => {
        if (game.getState() !== 'PLAYING') return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Scale to viewBox coordinates
        const svgX = (x / rect.width) * 600;
        const svgY = (y / rect.height) * 600;

        // Find nearest intersection
        const col = Math.round((svgX - padding) / cellSize);
        const row = Math.round((svgY - padding) / cellSize);

        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
            game.makeMove(row, col);
        }
    });

    // Hover effect
    const hoverStone = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hoverStone.setAttribute('r', (cellSize * 0.4).toString());
    hoverStone.setAttribute('fill', 'none');
    hoverStone.setAttribute('stroke', '#8ab4f8');
    hoverStone.setAttribute('stroke-width', '2');
    hoverStone.setAttribute('opacity', '0');
    hoverStone.setAttribute('pointer-events', 'none');
    svg.appendChild(hoverStone);

    svg.addEventListener('mousemove', (e) => {
        if (game.getState() !== 'PLAYING') {
            hoverStone.setAttribute('opacity', '0');
            return;
        }

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const svgX = (x / rect.width) * 600;
        const svgY = (y / rect.height) * 600;

        const col = Math.round((svgX - padding) / cellSize);
        const row = Math.round((svgY - padding) / cellSize);

        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
            const board = game.getBoard();
            if (board[row][col] === null) {
                hoverStone.setAttribute('cx', (padding + col * cellSize).toString());
                hoverStone.setAttribute('cy', (padding + row * cellSize).toString());
                hoverStone.setAttribute('opacity', '0.6');
            } else {
                hoverStone.setAttribute('opacity', '0');
            }
        } else {
            hoverStone.setAttribute('opacity', '0');
        }
    });

    svg.addEventListener('mouseleave', () => {
        hoverStone.setAttribute('opacity', '0');
    });
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
        saveHighScore();
        displayResult();
    }
});

game.onMove((stone: Stone) => {
    addStone(stone);
    updateGameInfo();
});

interface HighScore {
    moves: number;
    time: number;
    date: number | string;
    boardSize: number;
}

const saveHighScore = () => {
    // Only save for VS_AI mode
    if (game.getGameMode() !== 'VS_AI') return;

    // Only save if Player (Black) won
    if (game.getWinner() !== 'BLACK') return;

    const moves = Math.ceil(game.getMoves().length / 2); // Approximate moves per player or total turns? Usually total moves. Let's use total moves for now as per UI.
    // Actually, "Moves" usually means "Turns" in Gomoku context for high score? Or total stones?
    // Let's use total stones placed (game.getMoves().length).
    // Wait, if I win in 5 moves, that's 9 stones total (5 black, 4 white).
    // Let's stick to total moves count as displayed in UI.
    const totalMovesCount = game.getMoves().length;
    const time = game.getElapsedTime();
    const date = Date.now();
    const boardSize = game.getBoardSize();

    const newScore: HighScore = { moves: totalMovesCount, time, date, boardSize };
    const key = 'gomoku_highscores';

    try {
        const existing = localStorage.getItem(key);
        let scores: HighScore[] = existing ? JSON.parse(existing) : [];

        scores.push(newScore);

        // Sort: Fewer moves first, then lower time
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
    const key = 'gomoku_highscores';
    try {
        const existing = localStorage.getItem(key);
        return existing ? JSON.parse(existing) : [];
    } catch (e) {
        return [];
    }
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
        totalTime.textContent = game.formatTime(game.getElapsedTime());
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

    // Render High Scores
    const scores = getHighScores();
    const tbody = document.getElementById('high-scores-body');
    const container = document.querySelector('.high-scores-container');

    // Only show high scores in VS_AI mode
    if (game.getGameMode() === 'VS_AI') {
        if (container) container.classList.remove('hidden');
        if (tbody) {
            tbody.innerHTML = '';
            scores.forEach((s, index) => {
                const tr = document.createElement('tr');

                // Highlight current run if it matches
                // Note: Simple matching might highlight duplicates
                const currentMoves = game.getMoves().length;
                const currentTime = game.getElapsedTime();

                if (game.getWinner() === 'BLACK' &&
                    s.moves === currentMoves &&
                    s.time === currentTime &&
                    // Check if date is very recent (within last second) to avoid highlighting old identical scores
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

