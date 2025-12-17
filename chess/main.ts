import './style.css';
import { game } from './Game';
import type { GameState, Piece } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

import { en } from './i18n/en';
import { ja } from './i18n/ja';
import { vi } from './i18n/vi';

interface HighScore {
    moves: number;
    time: number;
    date: number | string;
}

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi }, savedLang || 'en');

// --- State ---
let currentGameState: GameState = 'MENU';
let timerInterval: number | null = null;

// Track current game settings
let currentGameMode: 'TWO_PLAYER' | 'VS_AI' = 'TWO_PLAYER';
let currentDifficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';
let currentAISide: 'WHITE' | 'BLACK' | null = null;

// --- UI Rendering ---

function renderApp() {
    setupEventListeners();
    updateTexts();

    // Set active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
    });

    loadSetup();
}

// --- Setup Persistence ---

const saveSetup = () => {
    const modeBtn = document.querySelector('.mode-btn.active') as HTMLElement;
    const diffBtn = document.querySelector('.difficulty-btn.active') as HTMLElement;
    const sideBtn = document.querySelector('.side-btn.active') as HTMLElement;

    if (modeBtn && diffBtn && sideBtn) {
        const setup = {
            mode: modeBtn.dataset.mode,
            difficulty: diffBtn.dataset.difficulty,
            side: sideBtn.dataset.side
        };
        localStorage.setItem('chess_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('chess_setup');
        if (saved) {
            const { mode, difficulty, side } = JSON.parse(saved);

            // Restore Mode
            if (mode) {
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    const btnMode = (btn as HTMLElement).dataset.mode;
                    if (btnMode === mode) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                // Show/hide difficulty and side sections based on mode
                const diffSection = document.getElementById('difficulty-section');
                const sideSection = document.getElementById('side-section');
                if (mode === 'VS_AI') {
                    diffSection?.classList.remove('hidden');
                    sideSection?.classList.remove('hidden');
                } else {
                    diffSection?.classList.add('hidden');
                    sideSection?.classList.add('hidden');
                }
            }

            // Restore Difficulty
            if (difficulty) {
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    const btnDiff = (btn as HTMLElement).dataset.difficulty;
                    if (btnDiff === difficulty) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Side
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
    } catch (e) {
        console.error('Failed to load chess setup:', e);
    }
};

// --- Event Listeners ---

function setupEventListeners() {
    // Home button
    const homeBtn = document.getElementById('home-btn');
    homeBtn?.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const lang = target.dataset.lang as Language;
            if (lang) {
                localization.setLanguage(lang);
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                target.classList.add('active');
            }
        });
    });

    // New game
    const newGameBtn = document.getElementById('new-game-btn');
    newGameBtn?.addEventListener('click', () => {
        game.restart();
    });

    // Restart
    const restartBtn = document.getElementById('restart-btn');
    restartBtn?.addEventListener('click', () => {
        game.restart();
    });

    // Board click
    const board = document.getElementById('board');
    board?.addEventListener('click', handleBoardClick);

    // Game mode selection
    const twoPlayersBtn = document.getElementById('mode-two-player');
    const vsAiBtn = document.getElementById('mode-vs-ai');
    const difficultySection = document.getElementById('difficulty-section');
    const sideSection = document.getElementById('side-section');
    twoPlayersBtn?.addEventListener('click', () => {
        twoPlayersBtn.classList.add('active');
        vsAiBtn?.classList.remove('active');
        difficultySection?.classList.add('hidden');
        sideSection?.classList.add('hidden');
    });
    vsAiBtn?.addEventListener('click', () => {
        vsAiBtn.classList.add('active');
        twoPlayersBtn?.classList.remove('active');
        difficultySection?.classList.remove('hidden');
        sideSection?.classList.remove('hidden');
    });
    // Difficulty selection
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    // Side selection
    const sideBtns = document.querySelectorAll('.side-btn');
    sideBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sideBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    // Start game
    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => {
        saveSetup();
        const modeBtn = document.querySelector('.mode-btn.active');
        const mode = modeBtn?.getAttribute('data-mode') as 'TWO_PLAYER' | 'VS_AI' || 'TWO_PLAYER';

        let aiSide: 'WHITE' | 'BLACK' | null = null;
        let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';

        if (mode === 'VS_AI') {
            const sideBtn = document.querySelector('.side-btn.active');
            const selectedSide = sideBtn?.getAttribute('data-side');
            aiSide = selectedSide === 'white' ? 'BLACK' : 'WHITE'; // AI plays opposite

            const diffBtn = document.querySelector('.difficulty-btn.active');
            difficulty = (diffBtn?.getAttribute('data-difficulty') as 'EASY' | 'MEDIUM' | 'HARD') || 'MEDIUM';
        }

        // Store current settings
        currentGameMode = mode;
        currentDifficulty = difficulty;
        currentAISide = aiSide;

        game.start(mode, aiSide, difficulty);
    });
}

// --- Board Rendering ---

function renderBoard() {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    svg.innerHTML = '';
    const squareSize = 100;
    const padding = 40; // Padding for coordinates

    // Check if we need to flip the board (User is BLACK)
    // In VS_AI, if AI is WHITE (first), then User is BLACK (second).
    // Or generally, if User is playing Black, we flip.
    // game.getAIPlayer() returns the AI's side.
    const isFlipped = currentGameMode === 'VS_AI' && game.getAIPlayer() === 'WHITE';

    // Set viewBox to include padding
    // Board is 800x800, plus 40px padding on all sides = 880x880
    svg.setAttribute('viewBox', '0 0 880 880');

    const getVisualPos = (row: number, col: number) => {
        if (isFlipped) {
            return {
                row: 7 - row,
                col: 7 - col
            };
        }
        return { row, col };
    };

    // Draw squares
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const visual = getVisualPos(row, col);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (visual.col * squareSize + padding).toString());
            rect.setAttribute('y', (visual.row * squareSize + padding).toString());
            rect.setAttribute('width', squareSize.toString());
            rect.setAttribute('height', squareSize.toString());

            const isDark = (row + col) % 2 === 1;
            rect.setAttribute('class', isDark ? 'square dark' : 'square light');

            // Add data attributes for click handling
            rect.dataset.row = row.toString();
            rect.dataset.col = col.toString();

            svg.appendChild(rect);
        }
    }

    // Draw coordinates
    // Column labels (a-h)
    for (let i = 0; i < 8; i++) {
        // If flipped, labels are h-a (7-0). i goes 0-7.
        // Standard: i=0 -> 'a'. Flipped: i=0 -> 'h' (which is charCode 104) -> wait.
        // The visual column 'i' should display the correct file char.
        // Visual column 0 (leftmost) corresponds to:
        // Normal: File 'a' (col 0).
        // Flipped: File 'h' (col 7).

        const displayChar = isFlipped ? String.fromCharCode(104 - i) : String.fromCharCode(97 + i);

        const colLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // Center in the square column, in the top margin
        colLabel.setAttribute('x', (i * squareSize + squareSize / 2 + padding).toString());
        colLabel.setAttribute('y', (padding - 10).toString()); // 10px above board
        colLabel.classList.add('coord-label');
        colLabel.setAttribute('text-anchor', 'middle');
        colLabel.textContent = displayChar;
        svg.appendChild(colLabel);

        // Bottom labels
        const colLabelBottom = colLabel.cloneNode(true) as SVGTextElement;
        colLabelBottom.setAttribute('y', (8 * squareSize + padding + 25).toString()); // 25px below board
        svg.appendChild(colLabelBottom);
    }

    // Row labels (1-8)
    for (let i = 0; i < 8; i++) {
        // Visual row 'i' (0 is top).
        // Standard: Row 0 is Rank 8. So '8 - i'.
        // Flipped: Row 0 is Rank 1. So '1 + i'.
        const displayNum = isFlipped ? (1 + i).toString() : (8 - i).toString();

        const rowLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // Center in the square row, in the left margin
        rowLabel.setAttribute('x', (padding - 10).toString()); // 10px left of board
        rowLabel.setAttribute('y', (i * squareSize + squareSize / 2 + padding + 5).toString()); // +5 for vertical centering
        rowLabel.classList.add('coord-label');
        rowLabel.setAttribute('text-anchor', 'end');
        rowLabel.textContent = displayNum;
        svg.appendChild(rowLabel);

        // Right labels
        const rowLabelRight = rowLabel.cloneNode(true) as SVGTextElement;
        rowLabelRight.setAttribute('x', (8 * squareSize + padding + 10).toString()); // 10px right of board
        rowLabelRight.setAttribute('text-anchor', 'start');
        svg.appendChild(rowLabelRight);
    }

    // Highlight selected piece
    const selectedPiece = game.getSelectedPiece();
    if (selectedPiece) {
        const visual = getVisualPos(selectedPiece.row, selectedPiece.col);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', (visual.col * squareSize + padding).toString());
        rect.setAttribute('y', (visual.row * squareSize + padding).toString());
        rect.setAttribute('width', squareSize.toString());
        rect.setAttribute('height', squareSize.toString());
        rect.setAttribute('class', 'square selected');
        svg.appendChild(rect);
    }

    // Highlight last move
    const lastMove = game.getLastMove();
    if (lastMove) {
        [lastMove.from, lastMove.to].forEach(pos => {
            const visual = getVisualPos(pos.row, pos.col);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (visual.col * squareSize + padding).toString());
            rect.setAttribute('y', (visual.row * squareSize + padding).toString());
            rect.setAttribute('width', squareSize.toString());
            rect.setAttribute('height', squareSize.toString());
            rect.setAttribute('class', 'square last-move');
            svg.appendChild(rect);
        });
    }

    // Draw pieces
    const board = game.getBoard();
    board.forEach(row => {
        row.forEach(piece => {
            if (piece) {
                drawPiece(svg, piece, squareSize, padding, isFlipped);
            }
        });
    });

    // Draw valid moves
    const validMoves = game.getValidMovesForSelected();
    validMoves.forEach(move => {
        const hasTarget = board[move.row][move.col] !== null;
        const visual = getVisualPos(move.row, move.col);
        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        indicator.setAttribute('cx', (visual.col * squareSize + squareSize / 2 + padding).toString());
        indicator.setAttribute('cy', (visual.row * squareSize + squareSize / 2 + padding).toString());
        indicator.setAttribute('r', hasTarget ? '40' : '15');
        indicator.classList.add('move-indicator');
        if (hasTarget) {
            indicator.setAttribute('fill', 'none');
            indicator.setAttribute('stroke', 'rgba(127, 166, 80, 0.8)');
            indicator.setAttribute('stroke-width', '8');
        }
        svg.appendChild(indicator);
    });
}

function drawPiece(svg: SVGSVGElement, piece: Piece, squareSize: number, padding: number, isFlipped: boolean) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    let visualRow = piece.row;
    let visualCol = piece.col;
    if (isFlipped) {
        visualRow = 7 - piece.row;
        visualCol = 7 - piece.col;
    }

    const x = visualCol * squareSize + squareSize / 2 + padding;
    const y = visualRow * squareSize + squareSize / 2 + padding;
    const scale = 1; // Can adjust if needed

    group.setAttribute('class', `piece ${piece.player.toLowerCase()}`);
    group.dataset.row = piece.row.toString();
    group.dataset.col = piece.col.toString();
    group.dataset.player = piece.player;

    let path = '';

    switch (piece.type) {
        case 'PAWN':
            path = `M ${x} ${y - 20 * scale}
                    a ${12 * scale} ${12 * scale} 0 1 1 0 ${24 * scale}
                    a ${12 * scale} ${12 * scale} 0 1 1 0 -${24 * scale}
                    M ${x - 15 * scale} ${y + 15 * scale}
                    h ${30 * scale}
                    l -${5 * scale} ${10 * scale}
                    h -${20 * scale} z`;
            break;

        case 'ROOK':
            path = `M ${x - 20 * scale} ${y - 25 * scale}
                    h ${8 * scale} v ${8 * scale} h ${8 * scale} v -${8 * scale} h ${8 * scale}
                    v ${8 * scale} h ${8 * scale} v -${8 * scale} h ${8 * scale}
                    v ${30 * scale} h ${10 * scale} v ${12 * scale} h -${60 * scale}
                    v -${12 * scale} h ${10 * scale} z`;
            break;

        case 'KNIGHT':
            path = `M ${x - 20 * scale} ${y + 30 * scale}
                    h ${40 * scale}
                    l -${7 * scale} -${10 * scale}
                    q ${5 * scale} -${15 * scale} ${7 * scale} -${25 * scale}
                    l -${5 * scale} -${8 * scale}
                    l -${5 * scale} ${4 * scale}
                    q -${8 * scale} ${2 * scale} -${14 * scale} ${10 * scale}
                    l -${5 * scale} ${6 * scale}
                    l ${4 * scale} ${6 * scale}
                    q ${5 * scale} -${2 * scale} ${8 * scale} -${4 * scale}
                    q -${2 * scale} ${10 * scale} ${2 * scale} ${15 * scale}
                    L ${x - 13 * scale} ${y + 20 * scale}
                    l -${7 * scale} ${10 * scale}
                    z`;
            break;

        case 'BISHOP':
            path = `M ${x} ${y - 30 * scale}
                    a ${8 * scale} ${8 * scale} 0 1 1 0 ${16 * scale}
                    a ${8 * scale} ${8 * scale} 0 1 1 0 -${16 * scale}
                    M ${x - 5 * scale} ${y - 15 * scale}
                    l -${10 * scale} ${30 * scale}
                    h ${30 * scale}
                    l -${10 * scale} -${30 * scale}
                    M ${x - 20 * scale} ${y + 15 * scale}
                    h ${40 * scale}
                    l -${5 * scale} ${10 * scale}
                    h -${30 * scale} z`;
            break;

        case 'QUEEN':
            path = `M ${x} ${y - 30 * scale}
                    l -${5 * scale} ${10 * scale}
                    l -${10 * scale} -${5 * scale}
                    l -${5 * scale} ${10 * scale}
                    l -${10 * scale} -${5 * scale}
                    l ${0} ${15 * scale}
                    l -${5 * scale} ${20 * scale}
                    h ${70 * scale}
                    l -${5 * scale} -${20 * scale}
                    v -${15 * scale}
                    l -${10 * scale} ${5 * scale}
                    l -${5 * scale} -${10 * scale}
                    l -${10 * scale} ${5 * scale}
                    l -${5 * scale} -${10 * scale}
                    M ${x - 25 * scale} ${y + 20 * scale}
                    h ${50 * scale}
                    l -${5 * scale} ${8 * scale}
                    h -${40 * scale} z`;
            break;

        case 'KING':
            path = `M ${x} ${y - 35 * scale}
                    v ${10 * scale}
                    h -${5 * scale}
                    v ${5 * scale}
                    h ${5 * scale}
                    v ${5 * scale}
                    l -${15 * scale} ${20 * scale}
                    l -${5 * scale} ${15 * scale}
                    h ${40 * scale}
                    l -${5 * scale} -${15 * scale}
                    l -${15 * scale} -${20 * scale}
                    v -${5 * scale}
                    h ${5 * scale}
                    v -${5 * scale}
                    h -${5 * scale}
                    v -${10 * scale}
                    M ${x - 20 * scale} ${y + 20 * scale}
                    h ${40 * scale}
                    l -${5 * scale} ${8 * scale}
                    h -${30 * scale} z`;
            break;
    }

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    group.appendChild(pathElement);
    svg.appendChild(group);
}

function handleBoardClick(e: MouseEvent) {
    // Don't allow interaction during AI's turn
    if (currentGameMode === 'VS_AI' && currentAISide === game.getCurrentPlayer()) {
        return;
    }

    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const padding = 40; // Must match renderBoard padding
    // Calculate click position relative to the board area (excluding padding)
    // The SVG is scaled by CSS, so we need to map client coordinates to SVG coordinates
    // However, since we use viewBox, the internal units are 880x880.
    // We need to determine the scale factor between screen pixels and SVG units.

    const scaleX = 880 / rect.width;
    const scaleY = 880 / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Adjust for padding
    const boardX = clickX - padding;
    const boardY = clickY - padding;

    const squareSize = 100;

    // Check if we need to flip the board (User is BLACK)
    const isFlipped = currentGameMode === 'VS_AI' && game.getAIPlayer() === 'WHITE';

    let col = Math.floor(boardX / squareSize);
    let row = Math.floor(boardY / squareSize);

    if (isFlipped) {
        col = 7 - col;
        row = 7 - row;
    }

    // Check if click is within the board grid
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        game.selectPiece(row, col);
    }
}

function updateGameInfo() {
    const currentPlayer = game.getCurrentPlayer();
    const turnIndicator = document.querySelector('.turn-indicator');
    const turnText = document.getElementById('turn-text');
    const gameState = game.getState();

    if (turnIndicator && turnText) {
        turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}`;

        if (gameState === 'CHECK') {
            turnText.textContent = `${localization.getUIText(currentPlayer === 'WHITE' ? 'whiteTurn' : 'blackTurn')} - ${localization.getUIText('check')}`;
        } else {
            turnText.textContent = localization.getUIText(currentPlayer === 'WHITE' ? 'whiteTurn' : 'blackTurn');
        }
    }

    // Update timer
    const timer = document.getElementById('game-timer');
    if (timer) {
        timer.textContent = util.formatTime(game.getElapsedTime());
    }

    // Update move count
    const moveNumber = document.getElementById('move-number');
    if (moveNumber) {
        moveNumber.textContent = game.getMoveCount().toString();
    }
}

// --- View Management ---

function showView(viewId: string) {
    const views = ['menu-view', 'game-view', 'result-view'];
    views.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
            view.classList.toggle('hidden', id !== viewId);
        }
    });
}

// --- Text Updates ---

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
    document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
    document.getElementById('promotion-title')!.textContent = localization.getUIText('promotion');
    document.getElementById('promotion-queen')!.textContent = localization.getUIText('queen');
    document.getElementById('promotion-rook')!.textContent = localization.getUIText('rook');
    document.getElementById('promotion-bishop')!.textContent = localization.getUIText('bishop');
    document.getElementById('promotion-knight')!.textContent = localization.getUIText('knight');
    // Update game mode labels
    document.getElementById('label-mode')!.textContent = localization.getUIText('labelMode');
    document.getElementById('mode-two-player')!.textContent = localization.getUIText('twoPlayers');
    document.getElementById('mode-vs-ai')!.textContent = localization.getUIText('vsAI');
    document.getElementById('label-difficulty')!.textContent = localization.getUIText('labelDifficulty');
    document.getElementById('diff-easy')!.textContent = localization.getUIText('difficultyEasy');
    document.getElementById('diff-medium')!.textContent = localization.getUIText('difficultyMedium');
    document.getElementById('diff-hard')!.textContent = localization.getUIText('difficultyHard');
    document.getElementById('label-side')!.textContent = localization.getUIText('labelSide');
    document.getElementById('side-white')!.textContent = localization.getUIText('sideWhite');
    document.getElementById('side-black')!.textContent = localization.getUIText('sideBlack');
    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');
    updateGameInfo();
}

// --- Game Event Handlers ---

game.onStateChange((state: GameState) => {
    currentGameState = state;

    if (state === 'MENU') {
        showView('menu-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    } else if (state === 'PLAYING' || state === 'CHECK') {
        showView('game-view');
        renderBoard();
        updateGameInfo();

        if (!timerInterval) {
            timerInterval = window.setInterval(() => {
                updateGameInfo();
            }, 1000);
        }
    } else if (state === 'RESULT') {
        showView('result-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        saveHighScore();
        displayResult();
    }
});

game.onMove(() => {
    renderBoard();
    updateGameInfo();
});

game.onBoardUpdate(() => {
    renderBoard();
});

game.onPromotion(() => {
    showPromotionModal();
});

function showPromotionModal() {
    const modal = document.getElementById('promotion-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    // Setup piece selection
    const pieces = modal.querySelectorAll('.promotion-piece');
    pieces.forEach(piece => {
        // Clone to remove old listeners
        const newPiece = piece.cloneNode(true);
        piece.parentNode?.replaceChild(newPiece, piece);

        newPiece.addEventListener('click', () => {
            const pieceType = (newPiece as HTMLElement).dataset.piece as 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN';
            game.promotePawn(pieceType);
            modal.classList.add('hidden');
        }, { once: true });
    });
}

const saveHighScore = () => {
    const finalState = game.getFinalGameState();
    if (finalState !== 'CHECKMATE') return;

    const winner = game.getWinner();
    if (!winner) return;

    // Only save for VS_AI mode when White (human) wins
    if (currentGameMode !== 'VS_AI') return;
    if (winner !== 'WHITE') return;

    const moves = game.getMoveCount();
    const time = game.getElapsedTime();
    const date = Date.now();

    const newScore: HighScore = { moves, time, date };
    const key = `chess_highscores_${currentDifficulty}`;

    util.saveHighScore(key, newScore, (a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time - b.time;
    });
};

const getHighScores = (): HighScore[] => {
    if (currentGameMode !== 'VS_AI') return [];

    const key = `chess_highscores_${currentDifficulty}`;
    return util.getHighScores<HighScore>(key);
};

function displayResult() {
    showView('result-view');

    const winnerDisplay = document.getElementById('winner-display');
    const totalTime = document.getElementById('total-time');
    const totalMoves = document.getElementById('total-moves');

    if (winnerDisplay && totalTime && totalMoves) {
        const winner = game.getWinner();
        const finalState = game.getFinalGameState();

        let resultHTML = '';
        if (finalState === 'STALEMATE') {
            resultHTML = `
                <h3>${localization.getUIText('stalemate')}</h3>
                <p>${localization.getUIText('draw')}</p>
            `;
        } else if (finalState === 'CHECKMATE' && winner) {
            const winnerText = winner === 'WHITE' ?
                localization.getUIText('whiteWins') :
                localization.getUIText('blackWins');
            resultHTML = `
                <h3>${localization.getUIText('checkmate')}</h3>
                <p>${winnerText}</p>
            `;
        }

        winnerDisplay.innerHTML = resultHTML;

        // Update stats
        totalTime.textContent = util.formatTime(game.getElapsedTime());
        totalMoves.textContent = game.getMoveCount().toString();
    }

    // Render High Scores (add at end of displayResult function)
    const scores = getHighScores();
    const tbody = document.getElementById('high-scores-body');
    const container = document.querySelector('.high-scores-container');

    const mode = 'VS_AI'; // Get from your stored mode value
    if (mode === 'VS_AI') {
        if (container) container.classList.remove('hidden');
        if (tbody) {
            tbody.innerHTML = '';
            scores.forEach((s, index) => {
                const tr = document.createElement('tr');

                // Highlight current run if it matches
                const currentMoves = game.getMoveCount();
                const currentTime = game.getElapsedTime();
                const winner = game.getWinner();

                if (winner === 'WHITE' &&
                    s.moves === currentMoves &&
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
    } else {
        if (container) container.classList.add('hidden');
    }
}

// Subscribe to language changes
localization.subscribe(() => {
    updateTexts();
    if (currentGameState === 'RESULT') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
