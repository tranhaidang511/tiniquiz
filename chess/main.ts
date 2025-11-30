import './style.css';
import { game } from './Game';
import type { GameState, Piece } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import { Consent } from '../common/consent';

import { en } from './i18n/en';
import { ja } from './i18n/ja';
import { vi } from './i18n/vi';

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi }, savedLang || 'en');

// --- State ---
let currentGameState: GameState = 'MENU';
let timerInterval: number | null = null;

// --- UI Rendering ---

function renderApp() {
    setupEventListeners();
    updateTexts();
}

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

    // Start game
    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => {
        game.start();
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
}

// --- Board Rendering ---

function renderBoard() {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    // Clear existing content
    svg.innerHTML = '';

    const squareSize = 100;
    const board = game.getBoard();
    const selectedPiece = game.getSelectedPiece();
    const validMoves = game.getValidMovesForSelected();
    const lastMove = game.getLastMove();

    // Draw squares
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isLight = (row + col) % 2 === 0;
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (col * squareSize).toString());
            rect.setAttribute('y', (row * squareSize).toString());
            rect.setAttribute('width', squareSize.toString());
            rect.setAttribute('height', squareSize.toString());
            rect.classList.add('square');
            rect.classList.add(isLight ? 'light' : 'dark');
            rect.dataset.row = row.toString();
            rect.dataset.col = col.toString();

            // Highlight selected square
            if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
                rect.classList.add('selected');
            }

            // Highlight last move
            if (lastMove) {
                if ((lastMove.from.row === row && lastMove.from.col === col) ||
                    (lastMove.to.row === row && lastMove.to.col === col)) {
                    rect.classList.add('last-move');
                }
            }

            svg.appendChild(rect);
        }
    }

    // Draw valid move indicators
    validMoves.forEach(move => {
        const hasTarget = board[move.row][move.col] !== null;
        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        indicator.setAttribute('cx', (move.col * squareSize + squareSize / 2).toString());
        indicator.setAttribute('cy', (move.row * squareSize + squareSize / 2).toString());
        indicator.setAttribute('r', hasTarget ? '40' : '15');
        indicator.classList.add('move-indicator');
        if (hasTarget) {
            indicator.setAttribute('fill', 'none');
            indicator.setAttribute('stroke', 'rgba(127, 166, 80, 0.8)');
            indicator.setAttribute('stroke-width', '8');
        }
        svg.appendChild(indicator);
    });

    // Draw pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                drawPiece(svg, piece, squareSize);
            }
        }
    }

    // Draw coordinates
    for (let i = 0; i < 8; i++) {
        // Column labels (a-h)
        const colLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        colLabel.setAttribute('x', (i * squareSize + squareSize - 8).toString());
        colLabel.setAttribute('y', (8 * squareSize - 5).toString());
        colLabel.classList.add('coord-label');
        colLabel.textContent = String.fromCharCode(97 + i); // a-h
        svg.appendChild(colLabel);

        // Row labels (1-8)
        const rowLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        rowLabel.setAttribute('x', '5');
        rowLabel.setAttribute('y', (i * squareSize + 15).toString());
        rowLabel.classList.add('coord-label');
        rowLabel.textContent = (8 - i).toString();
        svg.appendChild(rowLabel);
    }
}

function drawPiece(svg: SVGSVGElement, piece: Piece, squareSize: number) {
    const x = piece.col * squareSize + squareSize / 2;
    const y = piece.row * squareSize + squareSize / 2;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('piece');
    group.classList.add(piece.player.toLowerCase());
    group.dataset.row = piece.row.toString();
    group.dataset.col = piece.col.toString();

    let path = '';
    const scale = 0.8;

    switch (piece.type) {
        case 'PAWN':
            path = `M ${x} ${y - 25 * scale} 
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
            path = `M ${x} ${y - 25 * scale}
                    q -${10 * scale} -${5 * scale} -${15 * scale} ${5 * scale}
                    q -${5 * scale} ${10 * scale} 0 ${20 * scale}
                    l -${5 * scale} ${5 * scale}
                    q -${5 * scale} ${5 * scale} 0 ${15 * scale}
                    l -${5 * scale} ${20 * scale}
                    h ${50 * scale}
                    l -${5 * scale} -${20 * scale}
                    q ${5 * scale} -${10 * scale} 0 -${15 * scale}
                    l -${5 * scale} -${5 * scale}
                    q ${5 * scale} -${10 * scale} 0 -${20 * scale}
                    q -${5 * scale} -${10 * scale} -${15 * scale} -${5 * scale}`;
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
    const target = e.target as SVGElement;
    let row: number | null = null;
    let col: number | null = null;

    // Check if clicked on a square or piece
    if (target.dataset.row && target.dataset.col) {
        row = parseInt(target.dataset.row);
        col = parseInt(target.dataset.col);
    } else if (target.parentElement && target.parentElement.dataset.row) {
        row = parseInt(target.parentElement.dataset.row);
        col = parseInt(target.parentElement.dataset.col!);
    } else {
        // Calculate from SVG coordinates
        const svg = document.getElementById('board') as unknown as SVGSVGElement;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const squareSize = rect.width / 8;
        col = Math.floor(x / squareSize);
        row = Math.floor(y / squareSize);
    }

    if (row !== null && col !== null && row >= 0 && row < 8 && col >= 0 && col < 8) {
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
        const elapsed = game.getElapsedTime();
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
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
        piece.addEventListener('click', () => {
            const pieceType = (piece as HTMLElement).dataset.piece as 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN';
            game.promotePawn(pieceType);
            modal.classList.add('hidden');
        }, { once: true });
    });
}

function displayResult() {
    showView('result-view');

    const winnerDisplay = document.getElementById('winner-display');
    const totalTime = document.getElementById('total-time');
    const totalMoves = document.getElementById('total-moves');

    if (winnerDisplay && totalTime && totalMoves) {
        const winner = game.getWinner();
        const gameState = game.getState();

        let resultHTML = '';
        if (gameState === 'STALEMATE') {
            resultHTML = `
                <h3>${localization.getUIText('stalemate')}</h3>
                <p>${localization.getUIText('draw')}</p>
            `;
        } else if (winner) {
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
        const elapsed = game.getElapsedTime();
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        totalMoves.textContent = game.getMoveCount().toString();
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
