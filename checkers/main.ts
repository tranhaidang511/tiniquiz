import './style.css';
import { game } from './Game';
import type { GameState, Piece, BoardSize, GameMode, Difficulty } from './Game';
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
}

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
    const sizeBtn = document.querySelector('.size-btn.active') as HTMLElement;
    const forceJumpInput = document.getElementById('force-jump') as HTMLInputElement;

    if (modeBtn && sizeBtn && forceJumpInput) {
        const setup = {
            mode: modeBtn.dataset.mode,
            size: sizeBtn?.dataset.size || '8',
            forceJump: forceJumpInput.checked,
            difficulty: (document.querySelector('.difficulty-btn.active') as HTMLElement)?.dataset.difficulty || 'MEDIUM',
            side: (document.querySelector('.side-btn.active') as HTMLElement)?.dataset.side || 'RED'
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
                document.querySelectorAll('.size-btn').forEach(btn => {
                    const btnSize = (btn as HTMLElement).dataset.size;
                    if (btnSize === size) {
                        btn.classList.add('active');
                        game.setBoardSize(parseInt(size) as BoardSize);
                    } else {
                        btn.classList.remove('active');
                    }
                });
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
        }
    } catch (e) {
        console.error('Failed to load Checkers setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
    document.getElementById('label-mode')!.textContent = localization.getUIText('gameMode');
    document.getElementById('mode-two-player')!.textContent = localization.getUIText('twoPlayers');
    document.getElementById('mode-vs-ai')!.textContent = localization.getUIText('vsAI');
    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-total-moves')!.textContent = localization.getUIText('totalMoves');
    document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
    // High Score Table Headers
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('th-moves')!.textContent = localization.getUIText('moves');
    document.getElementById('th-time')!.textContent = localization.getUIText('time');
    document.getElementById('th-date')!.textContent = localization.getUIText('date');
    document.getElementById('label-board-size')!.textContent = localization.getUIText('boardSize');
    document.getElementById('label-force-jump')!.textContent = localization.getUIText('forceJump');
    document.getElementById('label-difficulty')!.textContent = localization.getUIText('difficulty');
    document.getElementById('diff-easy')!.textContent = localization.getUIText('easy');
    document.getElementById('diff-medium')!.textContent = localization.getUIText('medium');
    document.getElementById('diff-hard')!.textContent = localization.getUIText('hard');
    document.getElementById('label-side')!.textContent = localization.getUIText('labelSide');
    document.getElementById('side-red')!.textContent = localization.getUIText('sideRed');
    document.getElementById('side-black')!.textContent = localization.getUIText('sideBlack');


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

    // Side Selection
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Board Size Selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();

        // Get board size
        const sizeBtn = document.querySelector('.size-btn.active') as HTMLElement;
        const size = parseInt(sizeBtn?.dataset.size || '8') as BoardSize;

        // Get force jump setting
        const forceJumpInput = document.getElementById('force-jump') as HTMLInputElement;
        const forceJump = forceJumpInput?.checked ?? true;

        game.setBoardSize(size);
        game.setForceJump(forceJump);

        // Get difficulty
        const diffBtn = document.querySelector('.difficulty-btn.active') as HTMLElement;
        const difficulty = (diffBtn?.dataset.difficulty || 'MEDIUM') as Difficulty;
        game.setDifficulty(difficulty);

        // Set AI Side
        const modeBtn = document.querySelector('.mode-btn.active') as HTMLElement;
        if (modeBtn && modeBtn.dataset.mode === 'VS_AI') {
            const sideBtn = document.querySelector('.side-btn.active') as HTMLElement;
            const userSide = sideBtn?.dataset.side || 'RED';
            game.setAISide(userSide === 'RED' ? 'BLACK' : 'RED');
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

    const boardSize = game.getBoardSize();
    const totalSize = 600; // SVG viewBox size
    const squareSize = totalSize / boardSize;

    // Check if we need to flip the board (User is BLACK)
    const isFlipped = game.getGameMode() === 'VS_AI' && game.getAISide() === 'RED';

    const getVisualPos = (row: number, col: number) => {
        if (isFlipped) {
            return {
                row: boardSize - 1 - row,
                col: boardSize - 1 - col
            };
        }
        return { row, col };
    };

    // Draw checkerboard
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const visual = getVisualPos(row, col);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (visual.col * squareSize).toString());
            rect.setAttribute('y', (visual.row * squareSize).toString());
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

    // Highlight last move
    const moves = game.getMoves();
    if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        const highlightSquares = [lastMove.from, lastMove.to];

        highlightSquares.forEach(pos => {
            // Find the rect by logical position
            const rect = svg.querySelector(`rect[data-row="${pos.row}"][data-col="${pos.col}"]`);
            if (rect) {
                rect.classList.add('last-move');
            }
        });
    }

    // Draw pieces
    const board = game.getBoard();
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const piece = board[row][col];
            if (piece) {
                // Pass isFlipped to drawPiece
                drawPiece(svg, piece, squareSize, isFlipped, boardSize);
            }
        }
    }

    // Highlight selected piece and valid moves
    highlightMoves(isFlipped, boardSize);

    // Add single click handler to SVG
    svg.onclick = (e) => handleBoardClick(e);
};

const drawPiece = (svg: SVGSVGElement, piece: Piece, squareSize: number, isFlipped: boolean, boardSize: number) => {
    const pieceRadius = squareSize * 0.37; // Scale radius relative to square size

    // Calculate visual position
    let visualRow = piece.row;
    let visualCol = piece.col;
    if (isFlipped) {
        visualRow = boardSize - 1 - piece.row;
        visualCol = boardSize - 1 - piece.col;
    }

    const cx = visualCol * squareSize + squareSize / 2;
    const cy = visualRow * squareSize + squareSize / 2;

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

const highlightMoves = (isFlipped: boolean, boardSize: number) => {
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
        const totalSize = 600;
        const squareSize = totalSize / boardSize;

        let visualRow = move.to.row;
        let visualCol = move.to.col;
        if (isFlipped) {
            visualRow = boardSize - 1 - move.to.row;
            visualCol = boardSize - 1 - move.to.col;
        }

        const cx = visualCol * squareSize + squareSize / 2;
        const cy = visualRow * squareSize + squareSize / 2;

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

game.onMove(() => {
    renderBoard();
    updateGameInfo();
});

game.onBoardUpdate(() => {
    renderBoard();
});

game.onTimerUpdate(() => {
    const elapsed = game.getElapsedTime();
    const formatted = util.formatTime(elapsed);
    const timerEl = document.getElementById('game-timer');
    if (timerEl) timerEl.textContent = formatted;
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

    // Only save high scores for VS_AI mode when User wins
    const userSide = game.getAISide() === 'RED' ? 'BLACK' : 'RED';
    if (game.getGameMode() === 'VS_AI') {
        if (winner !== userSide) return;
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
    const key = `checkers_highscores_${difficulty}_${boardSize}_${userSide}_${forceJump}`;

    util.saveHighScore(key, newScore, (a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time - b.time;
    });
};

const getHighScores = (): HighScore[] => {
    // Only show scores for VS AI
    if (game.getGameMode() !== 'VS_AI') return [];

    const boardSize = game.getBoardSize();
    const forceJump = game.getForceJump();
    const difficulty = game.getDifficulty();
    const userSide = game.getAISide() === 'RED' ? 'BLACK' : 'RED';
    const key = `checkers_highscores_${difficulty}_${boardSize}_${userSide}_${forceJump}`;
    return util.getHighScores<HighScore>(key);
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

                const userSide = game.getAISide() === 'RED' ? 'BLACK' : 'RED';

                if (winner === userSide &&
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
};

// Subscribe to language changes
localization.subscribe(() => {
    updateTexts();
    if (game.getState() === 'RESULT') {
        displayResult();
    }
});

// --- Helper Functions ---

const toggleDifficultySelector = (mode: GameMode) => {
    const diffSection = document.getElementById('difficulty-section');
    const sideSection = document.getElementById('side-section');
    if (diffSection && sideSection) {
        if (mode === 'VS_AI') {
            diffSection.classList.remove('hidden');
            sideSection.classList.remove('hidden');
        } else {
            diffSection.classList.add('hidden');
            sideSection.classList.add('hidden');
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
