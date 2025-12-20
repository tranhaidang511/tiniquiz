
import './style.css';
import { game, Side } from './Game.js';
import type { Piece, GameState } from './Game.js';
import { Localization } from '../common/Localization.js';
import type { Language } from '../common/Localization.js';
import { Consent } from '../common/Consent.js';
import { util } from '../common/util.js';

import { en } from './i18n/en.js';
import { ja } from './i18n/ja.js';
import { vi } from './i18n/vi.js';

// --- Types ---
interface HighScore {
    moves: number;
    time: number;
    date: number | string;
}

// --- Constants ---
const CELL_SIZE = 50;
const PADDING = 25;
const COLS = 9;
const ROWS = 10;
const BOARD_WIDTH = PADDING * 2 + (COLS - 1) * CELL_SIZE;
const BOARD_HEIGHT = PADDING * 2 + (ROWS - 1) * CELL_SIZE;

// --- State ---
let timerInterval: number | null = null;
let currentSettings = {
    mode: 'pvp' as 'pvp' | 'pve',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    side: 'red' as 'red' | 'black' // User's side in PvE
};

// --- Initialization ---
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi }, savedLang || 'en');
new Consent();

function init() {
    setupEventListeners();
    loadSetup();

    // Initial localization
    updateTexts();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
    });

    // Check if game was already running (reload) or start fresh
    // For now, always show menu on load
    showView('menu-view');
}

// --- View Management ---
function showView(viewId: string) {
    ['menu-view', 'game-view', 'result-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== viewId);
    });

    if (viewId === 'menu-view') {
        stopTimer();
    } else if (viewId === 'game-view') {
        startTimer();
        renderBoard();
        updateGameInfo();
    } else if (viewId === 'result-view') {
        stopTimer();
        renderResult();
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    // Language Switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = (e.target as HTMLElement).dataset.lang as Language;
            if (lang) {
                localization.setLanguage(lang);
                localStorage.setItem('language', lang);
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateTexts();
                const currentState = game.getState();
                if (currentState === 'PLAYING' || currentState === 'CHECK') {
                    updateGameInfo();
                }
            }
        });
    });

    // Menu: Game Mode
    const modeBtns = document.querySelectorAll('.mode-btn');
    const pveSettings = document.querySelectorAll('.pve-setting');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mode = (btn as HTMLElement).dataset.mode as 'pvp' | 'pve';
            currentSettings.mode = mode;

            pveSettings.forEach(el => {
                if (mode === 'pve') el.classList.remove('hidden');
                else el.classList.add('hidden');
            });
        });
    });

    // Menu: Difficulty
    const diffBtns = document.querySelectorAll('.difficulty-btn');
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSettings.difficulty = (btn as HTMLElement).dataset.difficulty as 'easy' | 'medium' | 'hard';
        });
    });

    // Menu: Side Selection
    const sideBtns = document.querySelectorAll('.side-btn');
    sideBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sideBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSettings.side = (btn as HTMLElement).dataset.side as 'red' | 'black';
        });
    });

    // Start Game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();
        // Determine AI side
        let aiSide: Side | null = null;
        if (currentSettings.mode === 'pve') {
            // User plays currentSettings.side (e.g. 'red')
            // AI plays opposite (e.g. 'BLACK')
            aiSide = currentSettings.side === 'red' ? Side.BLACK : Side.RED;
        }

        game.start(currentSettings.mode, aiSide, currentSettings.difficulty);
    });

    // Game: Board Interaction
    document.getElementById('board')?.addEventListener('click', handleBoardClick);

    // Game: Restart
    document.getElementById('restart-btn')?.addEventListener('click', () => {
        game.restart();
    });

    // Game: Home
    document.getElementById('home-btn')?.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Result: New Game (Go to Menu)
    document.getElementById('new-game-btn')?.addEventListener('click', () => {
        game.restart()
    });
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
        const timerEl = document.getElementById('game-timer');
        if (timerEl) {
            timerEl.textContent = util.formatTime(game.getElapsedTime());
        }
    }, 1000);
}

// --- Logic Integration ---
game.onStateChange((state: GameState) => {
    if (state === 'MENU') {
        showView('menu-view');
    } else if (state === 'PLAYING' || state === 'CHECK') {
        showView('game-view');
    } else if (state === 'CHECKMATE' || state === 'STALEMATE' || state === 'RESULT') {
        // If the game transitions to a result state
        // For checkmate/stalemate, we often still show board briefly or show result view immediately.
        // The game loop usually handles final state.
        // Let's assume onStateChange to RESULT means "Game Over, show results".
        // But game.ts might transition to CHECKMATE then wait.
        // Let's check `game.isGameOver()`
        if (game.isGameOver()) {
            handleGameOver();
        }
    }
});

game.onMove(() => {
    renderBoard();
    updateGameInfo();
});

game.onBoardUpdate(() => {
    renderBoard();
});

function handleGameOver() {
    saveHighScoreIfApplicable();
    showView('result-view');
}

// --- Persistence ---
function saveSetup() {
    localStorage.setItem('xiangqi_setup', JSON.stringify(currentSettings));
}

function loadSetup() {
    try {
        const saved = localStorage.getItem('xiangqi_setup');
        if (saved) {
            const parsed = JSON.parse(saved);
            currentSettings = { ...currentSettings, ...parsed };
            updateMenuUI();
        }
    } catch (e) {
        console.error("Failed to load setup", e);
    }
}

function updateMenuUI() {
    // Mode
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const m = (btn as HTMLElement).dataset.mode;
        btn.classList.toggle('active', m === currentSettings.mode);
    });

    // Difficulty
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        const d = (btn as HTMLElement).dataset.difficulty;
        btn.classList.toggle('active', d === currentSettings.difficulty);
    });

    // Side
    document.querySelectorAll('.side-btn').forEach(btn => {
        const s = (btn as HTMLElement).dataset.side;
        btn.classList.toggle('active', s === currentSettings.side);
    });

    // Visibility
    const pveSettings = document.querySelectorAll('.pve-setting');
    pveSettings.forEach(el => {
        if (currentSettings.mode === 'pve') el.classList.remove('hidden');
        else el.classList.add('hidden');
    });
}

// --- Rendering ---
function renderBoard() {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    svg.innerHTML = ''; // Clear

    // Flipped if User is Black.
    // In PvE: If user chose Black, user plays Black. We flip so Black is at bottom.
    // In PvP: Red is usually bottom. Maybe auto-flip or keep Red bottom?
    // Let's stick to: Red is bottom by default. Flip only if User is explicitly Black (PvE).
    // Or if it's black's turn in PvP? No, usually static in local PvP.

    // Check if we need to flip
    // If PvE and User is Black -> Flip.
    const isFlipped = (currentSettings.mode === 'pve' && currentSettings.side === 'black');

    drawGrid(svg);
    drawLastMove(svg, isFlipped);
    drawPieces(svg, isFlipped);
    drawHighlights(svg, isFlipped);
}

function getVisualPos(row: number, col: number, isFlipped: boolean) {
    // Row 0 is Top (Black side usually), Row 9 is Bottom (Red side).
    // If not flipped: Red at bottom (Row 9).
    // x = PADDING + col * CELL_SIZE
    // y = PADDING + row * CELL_SIZE

    if (isFlipped) {
        // User (Black) at bottom. Top is Red (Row 9).
        // Wait. Row 0 is top of board logic.
        // If standard: Row 0 is Top-most line.
        // If flipped: Row 9 is Top-most line (visually).
        return {
            x: PADDING + (8 - col) * CELL_SIZE, // Flip col (8-0)
            y: PADDING + (9 - row) * CELL_SIZE  // Flip row (9-0)
        };
    }
    return {
        x: PADDING + col * CELL_SIZE,
        y: PADDING + row * CELL_SIZE
    };
}

function drawGrid(svg: SVGSVGElement) {
    let d = '';
    // Horizontal lines (10)
    for (let r = 0; r < ROWS; r++) {
        const y = PADDING + r * CELL_SIZE;
        d += `M ${PADDING} ${y} L ${BOARD_WIDTH - PADDING} ${y} `;
    }
    // Vertical lines (9)
    for (let c = 0; c < COLS; c++) {
        const x = PADDING + c * CELL_SIZE;
        if (c === 0 || c === COLS - 1) {
            d += `M ${x} ${PADDING} L ${x} ${BOARD_HEIGHT - PADDING} `;
        } else {
            // Split at river (between row 4 and 5)
            const riverTop = PADDING + 4 * CELL_SIZE;
            const riverBot = PADDING + 5 * CELL_SIZE;
            d += `M ${x} ${PADDING} L ${x} ${riverTop} `;
            d += `M ${x} ${riverBot} L ${x} ${BOARD_HEIGHT - PADDING} `;
        }
    }
    // Palaces (Top: 0-2, Bot: 7-9. Cols 3-5)
    // Top
    d += `M ${PADDING + 3 * CELL_SIZE} ${PADDING} L ${PADDING + 5 * CELL_SIZE} ${PADDING + 2 * CELL_SIZE} `;
    d += `M ${PADDING + 5 * CELL_SIZE} ${PADDING} L ${PADDING + 3 * CELL_SIZE} ${PADDING + 2 * CELL_SIZE} `;
    // Bottom
    d += `M ${PADDING + 3 * CELL_SIZE} ${PADDING + 9 * CELL_SIZE} L ${PADDING + 5 * CELL_SIZE} ${PADDING + 7 * CELL_SIZE} `;
    d += `M ${PADDING + 5 * CELL_SIZE} ${PADDING + 9 * CELL_SIZE} L ${PADDING + 3 * CELL_SIZE} ${PADDING + 7 * CELL_SIZE} `;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'grid-line');
    path.setAttribute('stroke', '#000');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
}

function drawPieces(svg: SVGSVGElement, isFlipped: boolean) {
    const board = game.getBoard();
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const p = board[r][c];
            if (p) {
                const { x, y } = getVisualPos(r, c, isFlipped);
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('class', `piece ${p.side.toLowerCase()}`);
                g.setAttribute('transform', `translate(${x}, ${y})`);

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', '20');
                circle.setAttribute('class', 'base');
                g.appendChild(circle);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.textContent = getPieceChar(p);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'central');
                text.setAttribute('y', '1'); // Slight visual adjustment
                g.appendChild(text);

                svg.appendChild(g);
            }
        }
    }
}

function getPieceChar(p: Piece): string {
    const chars: Record<string, Record<Side, string>> = {
        'general': { [Side.RED]: '帥', [Side.BLACK]: '將' },
        'advisor': { [Side.RED]: '仕', [Side.BLACK]: '士' },
        'elephant': { [Side.RED]: '相', [Side.BLACK]: '象' },
        'horse': { [Side.RED]: '傌', [Side.BLACK]: '馬' },
        'chariot': { [Side.RED]: '俥', [Side.BLACK]: '車' },
        'cannon': { [Side.RED]: '炮', [Side.BLACK]: '砲' },
        'soldier': { [Side.RED]: '兵', [Side.BLACK]: '卒' }
    };
    return chars[p.type][p.side] || '?';
}

function drawHighlights(svg: SVGSVGElement, isFlipped: boolean) {
    const selected = game.getSelectedPiece();
    if (selected) {
        // Selection marker
        const { x, y } = getVisualPos(selected.row, selected.col, isFlipped);
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', x.toString());
        ring.setAttribute('cy', y.toString());
        ring.setAttribute('r', '23');
        ring.setAttribute('class', 'selected-marker');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', '#4CAF50');
        ring.setAttribute('stroke-width', '2');
        svg.appendChild(ring);

        // Valid moves
        const moves = game.getValidMovesForSelected();
        moves.forEach(m => {
            const pos = getVisualPos(m.row, m.col, isFlipped);
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', pos.x.toString());
            dot.setAttribute('cy', pos.y.toString());

            // Check if capture
            const target = game.getBoard()[m.row][m.col];
            if (target) {
                dot.setAttribute('r', '22');
                dot.setAttribute('class', 'capture-marker');
                dot.setAttribute('fill', 'none');
                dot.setAttribute('stroke', '#d32f2f');
                dot.setAttribute('stroke-width', '2');
            } else {
                dot.setAttribute('r', '5');
                dot.setAttribute('class', 'move-marker');
                dot.setAttribute('fill', '#4CAF50');
            }
            svg.appendChild(dot);
        });
    }
}

function drawLastMove(svg: SVGSVGElement, isFlipped: boolean) {
    const last = game.getLastMove();
    if (last) {
        const from = getVisualPos(last.from.row, last.from.col, isFlipped);
        const to = getVisualPos(last.to.row, last.to.col, isFlipped);

        // From marker (faded box or something)
        const rectFrom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectFrom.setAttribute('x', (from.x - 22).toString());
        rectFrom.setAttribute('y', (from.y - 22).toString());
        rectFrom.setAttribute('width', '44');
        rectFrom.setAttribute('height', '44');
        rectFrom.setAttribute('class', 'last-move-from');
        svg.appendChild(rectFrom);

        // To marker
        const rectTo = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectTo.setAttribute('x', (to.x - 22).toString());
        rectTo.setAttribute('y', (to.y - 22).toString());
        rectTo.setAttribute('width', '44');
        rectTo.setAttribute('height', '44');
        rectTo.setAttribute('class', 'last-move-to');
        svg.appendChild(rectTo);
    }
}

function handleBoardClick(e: MouseEvent) {
    // If PvE and it's AI turn, ignore
    if (currentSettings.mode === 'pve' && game.getCurrentPlayer() !== (currentSettings.side === 'red' ? Side.RED : Side.BLACK)) {
        if (!game.isGameOver()) return;
    }
    if (game.isGameOver()) return;

    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();

    // SVG viewBox is implicit from width/height in CSS or attrs? 
    // We didn't set viewBox on SVG element in HTML, so 1 px = 1 unit.
    // Ensure styles match. BOARD_WIDTH = 450, HEIGHT = 500.

    const scaleX = BOARD_WIDTH / rect.width;
    const scaleY = BOARD_HEIGHT / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Inverse of getVisualPos
    // x = PADDING + (isFlipped ? 8-col : col) * CELL_SIZE
    // (x - PADDING) / CELL_SIZE = (isFlipped ? 8-col : col)

    const isFlipped = (currentSettings.mode === 'pve' && currentSettings.side === 'black');
    let c = Math.round((x - PADDING) / CELL_SIZE);
    let r = Math.round((y - PADDING) / CELL_SIZE);

    if (isFlipped) {
        c = 8 - c;
        r = 9 - r;
    }

    if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
        game.selectPiece(r, c);
    }
}

function updateGameInfo() {
    const turn = game.getCurrentPlayer();
    const state = game.getState();
    const turnTextEl = document.getElementById('turn-text');
    const indicatorEl = document.querySelector('.turn-indicator');

    if (turnTextEl && indicatorEl) {
        // Classes: 'turn-indicator red' or 'black'
        indicatorEl.className = `turn-indicator ${turn.toLowerCase()}`;

        let textKey = turn === Side.RED ? 'redTurn' : 'blackTurn';
        if (state === 'CHECK') textKey = 'check'; // Or combine e.g. "Red Turn (Check)"? 
        // Localization keys: 'redTurn', 'blackTurn', 'check'
        // If check, usually we say "Check!" or "Red - Check!". 
        // Let's stick to turn, and maybe append check status.

        let text = localization.getUIText(textKey);
        if (state === 'CHECK') {
            text += ` - ${localization.getUIText('check')}`;
        }
        turnTextEl.textContent = text;
    }

    document.getElementById('move-number')!.textContent = game.getMoveCount().toString();
    document.getElementById('game-timer')!.textContent = util.formatTime(game.getElapsedTime());
}

function updateTexts() {
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    document.getElementById('menu-title')!.textContent = localization.getUIText('menuTitle');
    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('result-title')!.textContent = localization.getUIText('gameOver');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('totalTime');
    document.getElementById('label-total-moves')!.textContent = localization.getUIText('totalMoves');
    // Settings
    document.getElementById('label-mode')!.textContent = localization.getUIText('labelMode');
    document.getElementById('mode-pvp')!.textContent = localization.getUIText('modePvP');
    document.getElementById('mode-pve')!.textContent = localization.getUIText('modePvE');
    document.getElementById('label-difficulty')!.textContent = localization.getUIText('labelDifficulty');
    document.getElementById('diff-easy')!.textContent = localization.getUIText('difficultyEasy');
    document.getElementById('diff-medium')!.textContent = localization.getUIText('difficultyMedium');
    document.getElementById('diff-hard')!.textContent = localization.getUIText('difficultyHard');
    document.getElementById('label-side')!.textContent = localization.getUIText('labelSide');
    document.getElementById('side-red')!.textContent = localization.getUIText('sideRed');
    document.getElementById('side-black')!.textContent = localization.getUIText('sideBlack');
    // Result
    document.getElementById('result-title')!.textContent = localization.getUIText('gameOver');
    document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');
    // Labels
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = (el as HTMLElement).dataset.i18n;
        if (key) el.textContent = localization.getUIText(key);
    });
}

function renderResult() {
    const state = game.getFinalGameState();
    const winner = game.getWinner();
    const display = document.getElementById('winner-display');
    if (display) {
        let key = 'draw';
        if (state === 'CHECKMATE' && winner) {
            key = winner === Side.RED ? 'redWins' : 'blackWins';
        } else if (state === 'STALEMATE') {
            key = 'stalemate'; // or draw
        }
        display.innerHTML = `<h3>${localization.getUIText(key)}</h3>`;
    }

    document.getElementById('total-time')!.textContent = util.formatTime(game.getElapsedTime());
    document.getElementById('total-moves')!.textContent = game.getMoveCount().toString();

    renderHighScores();
}

// --- High Scores ---
function saveHighScoreIfApplicable() {
    if (currentSettings.mode !== 'pve') return;

    const winner = game.getWinner();
    // User wins if winner matches their side
    const userSide = currentSettings.side === 'red' ? Side.RED : Side.BLACK;

    if (winner === userSide) {
        const score: HighScore = {
            moves: game.getMoveCount(),
            time: game.getElapsedTime(),
            date: Date.now()
        };
        const key = `xiangqi_highscores_${currentSettings.difficulty}`;
        util.saveHighScore(key, score, (a, b) => {
            // Sort by moves asc, then time asc
            if (a.moves !== b.moves) return a.moves - b.moves;
            return a.time - b.time;
        });
    }
}

function renderHighScores() {
    const container = document.querySelector('.high-scores-container');
    if (currentSettings.mode !== 'pve') {
        if (container) container.classList.add('hidden');
        return;
    }
    if (container) container.classList.remove('hidden');

    const key = `xiangqi_highscores_${currentSettings.difficulty}`;
    const scores = util.getHighScores<HighScore>(key);
    const tbody = document.getElementById('high-scores-body');
    if (tbody) {
        tbody.innerHTML = '';
        scores.forEach((s, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${s.moves}</td>
                <td>${util.formatTime(s.time)}</td>
                <td>${util.formatDate(s.date, localization.language)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
}

// Start
init();
