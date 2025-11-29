import './style.css';
import { game } from './Game';
import type { GameState, Piece, BoardSize, GameMode, Difficulty } from './Game';
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
    const sizeInput = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;
    const forceJumpInput = document.getElementById('force-jump') as HTMLInputElement;

    if (modeBtn && sizeInput && forceJumpInput) {
        const setup = {
            mode: modeBtn.dataset.mode,
            size: sizeInput.value,
            forceJump: forceJumpInput.checked,
            difficulty: (document.querySelector('.difficulty-btn.active') as HTMLElement)?.dataset.difficulty || 'MEDIUM'
        };
        localStorage.setItem('checkers_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('checkers_setup');
        if (saved) {
            const { mode, size, forceJump, difficulty } = JSON.parse(saved);

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

            // Restore Size
            if (size) {
                const radio = document.querySelector(`input[name="board-size"][value="${size}"]`) as HTMLInputElement;
                if (radio) {
                    radio.checked = true;
                    game.setBoardSize(parseInt(size) as BoardSize);
                }
            }

            // Restore Force Jump
            if (forceJump !== undefined) {
                const checkbox = document.getElementById('force-jump') as HTMLInputElement;
                if (checkbox) {
                    checkbox.checked = forceJump;
                    game.setForceJump(forceJump);
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
        }
    } catch (e) {
        console.error('Failed to load Checkers setup:', e);
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

    const labelMoves = document.getElementById('label-moves');
    if (labelMoves) labelMoves.textContent = localization.getUIText('moves');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('time');

    const labelTotalMoves = document.getElementById('label-total-moves');
    if (labelTotalMoves) labelTotalMoves.textContent = localization.getUIText('totalMoves');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.textContent = localization.getUIText('playAgain');

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

    const labelBoardSize = document.getElementById('label-board-size');
    if (labelBoardSize) labelBoardSize.textContent = localization.getUIText('boardSize');

    const labelForceJump = document.getElementById('label-force-jump');
    if (labelForceJump) labelForceJump.textContent = localization.getUIText('forceJump');

    const labelDifficulty = document.getElementById('label-difficulty');
    if (labelDifficulty) labelDifficulty.textContent = localization.getUIText('difficulty');

    const diffEasy = document.getElementById('diff-easy');
    if (diffEasy) diffEasy.textContent = localization.getUIText('easy');

    const diffMedium = document.getElementById('diff-medium');
    if (diffMedium) diffMedium.textContent = localization.getUIText('medium');

    const diffHard = document.getElementById('diff-hard');
    if (diffHard) diffHard.textContent = localization.getUIText('hard');

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

    // Game Mode Selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const mode = target.dataset.mode as GameMode;

            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setGameMode(mode);
            toggleDifficultySelector(mode);
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();

        // Get board size
        const sizeInput = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;
        const size = parseInt(sizeInput?.value || '8') as BoardSize;

        // Get force jump setting
        const forceJumpInput = document.getElementById('force-jump') as HTMLInputElement;
        const forceJump = forceJumpInput?.checked ?? true;

        game.setBoardSize(size);
        game.setForceJump(forceJump);

        // Get difficulty
        const diffBtn = document.querySelector('.difficulty-btn.active') as HTMLElement;
        const difficulty = (diffBtn?.dataset.difficulty || 'MEDIUM') as Difficulty;
        game.setDifficulty(difficulty);

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
    const totalSize = 600; // SVG viewBox size
    const squareSize = totalSize / boardSize;

    // Draw checkerboard
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (col * squareSize).toString());
            rect.setAttribute('y', (row * squareSize).toString());
            rect.setAttribute('width', squareSize.toString());
            rect.setAttribute('height', squareSize.toString());

            const isLight = (row + col) % 2 === 0;
            rect.classList.add('board-square');
            rect.classList.add(isLight ? 'light' : 'dark');
            rect.dataset.row = row.toString();
            rect.dataset.col = col.toString();

            svg.appendChild(rect);
        }
    }

    // Draw pieces
    const board = game.getBoard();
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const piece = board[row][col];
            if (piece) {
                drawPiece(svg, piece, squareSize);
            }
        }
    }

    // Highlight selected piece and valid moves
    highlightMoves();

    // Add single click handler to SVG
    svg.onclick = handleBoardClick;
};

const drawPiece = (svg: SVGSVGElement, piece: Piece, squareSize: number) => {
    const pieceRadius = squareSize * 0.37; // Scale radius relative to square size
    const cx = piece.col * squareSize + squareSize / 2;
    const cy = piece.row * squareSize + squareSize / 2;

    // Piece group
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('piece');
    group.dataset.row = piece.row.toString();
    group.dataset.col = piece.col.toString();

    // Shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shadow.setAttribute('cx', (cx + 2).toString());
    shadow.setAttribute('cy', (cy + 2).toString());
    shadow.setAttribute('r', pieceRadius.toString());
    shadow.setAttribute('fill', 'rgba(0, 0, 0, 0.3)');
    group.appendChild(shadow);

    // Gradient for piece
    const gradId = `grad-${piece.player}-${piece.row}-${piece.col}`;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', gradId);
    gradient.setAttribute('cx', '30%');
    gradient.setAttribute('cy', '30%');

    if (piece.player === 'RED') {
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ef4444');
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#dc2626');
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
    } else {
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#4b5563');
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#1f2937');
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
    }
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Piece circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', pieceRadius.toString());
    circle.setAttribute('fill', `url(#${gradId})`);
    circle.setAttribute('stroke', piece.player === 'RED' ? '#b91c1c' : '#111827');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);

    // King crown
    if (piece.type === 'KING') {
        const crown = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        crown.setAttribute('x', cx.toString());
        crown.setAttribute('y', (cy + (squareSize * 0.08)).toString());
        crown.setAttribute('text-anchor', 'middle');
        crown.setAttribute('font-size', (squareSize * 0.32).toString());
        crown.setAttribute('fill', '#fbbf24');
        crown.textContent = '♔';
        group.appendChild(crown);
    }

    svg.appendChild(group);
};

const highlightMoves = () => {
    const svg = document.getElementById('board') as unknown as SVGSVGElement;
    if (!svg) return;

    const selectedPiece = game.getSelectedPiece();
    const validMoves = game.getValidMoves();

    // Reset highlights
    svg.querySelectorAll('.board-square').forEach(sq => {
        sq.classList.remove('selected', 'valid-move');
    });

    svg.querySelectorAll('.piece').forEach(p => {
        p.classList.remove('selected');
    });

    // Remove old indicators
    svg.querySelectorAll('.move-indicator').forEach(ind => ind.remove());

    // Highlight selected piece
    if (selectedPiece) {
        const pieceElement = svg.querySelector(
            `.piece[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`
        );
        pieceElement?.classList.add('selected');

        const square = svg.querySelector(
            `.board-square[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`
        );
        square?.classList.add('selected');
    }

    // Highlight valid moves
    validMoves.forEach(move => {
        const square = svg.querySelector(
            `.board-square[data-row="${move.to.row}"][data-col="${move.to.col}"]`
        );
        square?.classList.add('valid-move');

        // Draw move indicator
        const boardSize = game.getBoardSize();
        const totalSize = 600;
        const squareSize = totalSize / boardSize;
        const cx = move.to.col * squareSize + squareSize / 2;
        const cy = move.to.row * squareSize + squareSize / 2;

        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        indicator.classList.add('move-indicator');
        indicator.setAttribute('cx', cx.toString());
        indicator.setAttribute('cy', cy.toString());
        indicator.setAttribute('r', (squareSize * 0.16).toString());
        indicator.setAttribute('fill', move.captures && move.captures.length > 0 ? '#ef4444' : '#81b64c');
        indicator.setAttribute('opacity', '0.8');
        indicator.style.pointerEvents = 'none';
        svg.appendChild(indicator);
    });
};

const handleBoardClick = (e: MouseEvent) => {
    const target = e.target as SVGElement;

    // Find the clicked square or piece
    const square = target.closest('.board-square') as SVGRectElement | null;
    const pieceGroup = target.closest('.piece') as SVGGElement | null;

    if (pieceGroup) {
        const row = parseInt(pieceGroup.dataset.row || '-1');
        const col = parseInt(pieceGroup.dataset.col || '-1');
        if (row !== -1 && col !== -1) {
            handlePieceClick(row, col);
        }
    } else if (square) {
        const row = parseInt(square.dataset.row || '-1');
        const col = parseInt(square.dataset.col || '-1');
        if (row !== -1 && col !== -1) {
            handleSquareClick(row, col);
        }
    }
};

const handleSquareClick = (row: number, col: number) => {
    const board = game.getBoard();
    const piece = board[row][col];

    if (piece) {
        handlePieceClick(row, col);
    } else {
        game.makeMove(row, col);
    }
};

const handlePieceClick = (row: number, col: number) => {
    game.selectPiece(row, col);
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
        turnText.textContent = currentPlayer === 'RED'
            ? localization.getUIText('redTurn')
            : localization.getUIText('blackTurn');
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

game.onMove(() => {
    renderBoard();
    updateGameInfo();
});

game.onBoardUpdate(() => {
    renderBoard();
});

game.onAIThinking((thinking: boolean) => {
    const board = document.getElementById('board');
    if (board) {
        if (thinking) {
            board.style.cursor = 'wait';
            board.style.opacity = '0.8';
        } else {
            board.style.cursor = 'pointer';
            board.style.opacity = '1';
        }
    }
});

const saveHighScore = () => {
    const winner = game.getWinner();
    if (!winner) return;

    // Only save high scores for VS_AI mode when Player (RED) wins
    if (game.getGameMode() === 'VS_AI') {
        if (winner !== 'RED') return;
    } else {
        // In Two Player mode, maybe we don't save high scores?
        // Or we save for both? Gomoku only saves for VS_AI.
        // Let's follow Gomoku pattern: Only save for VS_AI (Player wins).
        return;
    }

    const moves = game.getMoves().length;
    const time = game.getElapsedTime();
    const date = Date.now();
    const boardSize = game.getBoardSize();
    const forceJump = game.getForceJump();
    const difficulty = game.getDifficulty();

    const newScore: HighScore = { moves, time, date };
    const key = `checkers_highscores_${difficulty}_${boardSize}_${forceJump}`;

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
    // Only show scores for VS AI
    if (game.getGameMode() !== 'VS_AI') return [];

    const boardSize = game.getBoardSize();
    const forceJump = game.getForceJump();
    const difficulty = game.getDifficulty();
    const key = `checkers_highscores_${difficulty}_${boardSize}_${forceJump}`;
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
            resultTitle.textContent = winner === 'RED'
                ? localization.getUIText('redWins')
                : localization.getUIText('blackWins');
        }

        if (winnerDisplay) {
            const playerWinsText = winner === 'RED'
                ? localization.getUIText('redPlayerWins')
                : localization.getUIText('blackPlayerWins');

            winnerDisplay.innerHTML = `
                <div class="winner-stone ${winner.toLowerCase()}"></div>
                <span>${playerWinsText}</span>
            `;
        }
    }

    // Render High Scores
    const scores = getHighScores();
    const tbody = document.getElementById('high-scores-body');
    const container = document.querySelector('.high-scores-container');

    if (game.getGameMode() === 'VS_AI') {
        if (container) container.classList.remove('hidden');
        if (tbody) {
            tbody.innerHTML = '';
            scores.forEach((s, index) => {
                const tr = document.createElement('tr');

                // Highlight current run if it matches
                const currentMoves = game.getMoves().length;
                const currentTime = game.getElapsedTime();

                if (winner === 'RED' &&
                    s.moves === currentMoves &&
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

// --- Helper Functions ---

const toggleDifficultySelector = (mode: GameMode) => {
    const section = document.getElementById('difficulty-section');
    if (section) {
        if (mode === 'VS_AI') {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    }
};

// --- Initialize ---
renderApp();
// Initial toggle check
const initialModeBtn = document.querySelector('.mode-btn.active') as HTMLElement;
if (initialModeBtn) {
    toggleDifficultySelector(initialModeBtn.dataset.mode as GameMode);
}
