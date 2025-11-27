import './style.css';
import { game } from './Game';
import type { GameState, Stone } from './Game';
import { localization } from './Localization';
import type { Language } from './Localization';
import { ConsentBanner } from './ConsentBanner';

// Initialize Consent Banner
new ConsentBanner();

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
        displayResult();
    }
});

game.onMove((stone: Stone) => {
    addStone(stone);
    updateGameInfo();
});

const displayResult = () => {
    const winner = game.getWinner();
    const winnerDisplay = document.getElementById('winner-display');
    const totalMoves = document.getElementById('total-moves');
    const resultTitle = document.getElementById('result-title');

    if (totalMoves) {
        totalMoves.textContent = game.getMoves().length.toString();
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
};

// Subscribe to language changes
localization.subscribe(() => {
    updateTexts();
});

// --- Initialize ---
renderApp();

