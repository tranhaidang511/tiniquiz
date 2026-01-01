import './style.css';
import { game } from './Game';
import type { GameState, Move, GameMode, Difficulty } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import zh from './i18n/zh';
import ar from './i18n/ar';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

interface HighScore {
    score: number;
    time: number;
    date: number;
}

let lastScoreDate: number | null = null;

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem('language') as Language | null;
const localization = new Localization({ en, ja, vi, zh, ar }, savedLang || 'en');

// --- UI Templates ---

const toggleDifficultySelector = () => {
    const mode = game.getGameMode();
    const difficultySection = document.querySelector('.difficulty-section');
    const sideSection = document.querySelector('.side-section');
    if (difficultySection && sideSection) {
        if (mode === 'VS_AI') {
            difficultySection.classList.remove('hidden');
            sideSection.classList.remove('hidden');
        } else {
            difficultySection.classList.add('hidden');
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
    toggleDifficultySelector();
};

// --- Setup Persistence ---

const saveSetup = () => {
    const modeBtn = document.querySelector('.mode-btn[data-mode].active') as HTMLElement;
    const diffBtn = document.querySelector('.mode-btn[data-difficulty].active') as HTMLElement;

    if (modeBtn) {
        const setup = {
            mode: modeBtn.dataset.mode,
            difficulty: diffBtn ? diffBtn.dataset.difficulty : 'MEDIUM',
            side: (document.querySelector('.mode-btn[data-side].active') as HTMLElement)?.dataset.side || 'BLACK'
        };
        localStorage.setItem('othello_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('othello_setup');
        if (saved) {
            const { mode, difficulty } = JSON.parse(saved);

            // Restore Mode
            if (mode) {
                document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
                    const btnMode = (btn as HTMLElement).dataset.mode;
                    if (btnMode === mode) {
                        btn.classList.add('active');
                        game.setGameMode(mode as GameMode);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Difficulty
            if (difficulty) {
                document.querySelectorAll('.mode-btn[data-difficulty]').forEach(btn => {
                    const btnDiff = (btn as HTMLElement).dataset.difficulty;
                    if (btnDiff === difficulty) {
                        btn.classList.add('active');
                        game.setDifficulty(difficulty as Difficulty);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Side
            if ('side' in JSON.parse(saved)) {
                const { side } = JSON.parse(saved);
                if (side) {
                    document.querySelectorAll('.mode-btn[data-side]').forEach(btn => {
                        const btnSide = (btn as HTMLElement).dataset.side;
                        if (btnSide === side) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }

            toggleDifficultySelector();
        }
    } catch (e) {
        console.error('Failed to load Othello setup:', e);
    }
};

// --- Text Updates ---

const updateTexts = () => {
    document.getElementById('game-title')!.textContent = localization.getUIText('gameTitle');
    document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
    document.getElementById('label-mode')!.textContent = localization.getUIText('gameMode');
    document.getElementById('mode-two-player')!.textContent = localization.getUIText('twoPlayers');
    document.getElementById('mode-vs-ai')!.textContent = localization.getUIText('vsAI');
    document.getElementById('label-difficulty')!.textContent = localization.getUIText('difficulty');
    document.getElementById('difficulty-easy')!.textContent = localization.getUIText('easy');
    document.getElementById('difficulty-medium')!.textContent = localization.getUIText('medium');

    document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
    document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');
    document.getElementById('label-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-black-score')!.textContent = localization.getUIText('blackScore');
    document.getElementById('label-white-score')!.textContent = localization.getUIText('whiteScore');
    document.getElementById('label-total-time')!.textContent = localization.getUIText('time');
    document.getElementById('label-total-moves')!.textContent = localization.getUIText('totalMoves');
    document.getElementById('label-final-black')!.textContent = localization.getUIText('blackScore');
    document.getElementById('label-final-white')!.textContent = localization.getUIText('whiteScore');
    document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
    document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
    document.getElementById('label-rank')!.textContent = localization.getUIText('rank');
    document.getElementById('label-moves')!.textContent = localization.getUIText('score');
    document.getElementById('label-date')!.textContent = localization.getUIText('date');
    document.getElementById('label-side')!.textContent = localization.getUIText('labelSide');
    document.getElementById('side-black')!.textContent = localization.getUIText('sideBlack');
    document.getElementById('side-white')!.textContent = localization.getUIText('sideWhite');


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
        });
    });

    // Game Mode Selection
    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const mode = target.dataset.mode as GameMode;

            document.querySelectorAll('.mode-btn[data-mode]').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setGameMode(mode);
            toggleDifficultySelector();
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.mode-btn[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const difficulty = target.dataset.difficulty as Difficulty;

            document.querySelectorAll('.mode-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setDifficulty(difficulty);
        });
    });

    // Side Selection
    document.querySelectorAll('.mode-btn[data-side]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            document.querySelectorAll('.mode-btn[data-side]').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Start game
    document.getElementById('start-btn')?.addEventListener('click', () => {
        saveSetup();

        // Set AI Side
        if (game.getGameMode() === 'VS_AI') {
            const sideBtn = document.querySelector('.mode-btn[data-side].active') as HTMLElement;
            const userSide = sideBtn?.dataset.side || 'BLACK';
            // User BLACK -> AI WHITE. User WHITE -> AI BLACK.
            game.setAISide(userSide === 'BLACK' ? 'WHITE' : 'BLACK');
        } else {
            game.setAISide(null);
        }

        lastScoreDate = null;
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
                if (game.getGameMode() === 'VS_AI' && game.getCurrentPlayer() === game.getAISide()) return;
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

                // Add last move marker if applicable
                const moves = game.getMoves();
                const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;
                const isLast = lastMove && lastMove.position.row === rowIndex && lastMove.position.col === colIndex;

                if (isLast) {
                    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    marker.classList.add('last-move-marker');
                    marker.setAttribute('cx', cx.toString());
                    marker.setAttribute('cy', cy.toString());
                    marker.setAttribute('r', (discRadius * 0.3).toString()); // Smaller red dot
                    marker.setAttribute('fill', '#ef4444'); // Red dot
                    marker.style.pointerEvents = 'none'; // Ensure it doesn't interfere with clicks
                    svg.appendChild(marker);
                }
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
        // Save score only when transitioning to RESULT state, not on every display update
        const winner = game.getWinner();
        const userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';
        if (winner === userSide && game.getGameMode() === 'VS_AI') {
            saveHighScore();
        }
        displayResult();
    }
});

game.onTimerUpdate(() => {
    const elapsed = game.getElapsedTime();
    const formatted = util.formatTime(elapsed);
    const timerEl = document.getElementById('game-timer');
    if (timerEl) timerEl.textContent = formatted;
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
    const finalBlack = document.getElementById('final-black');
    const finalWhite = document.getElementById('final-white');

    if (totalMoves) {
        totalMoves.textContent = game.getMoves().length.toString();
    }

    if (totalTime) {
        totalTime.textContent = util.formatTime(game.getElapsedTime());
    }

    if (finalBlack) {
        finalBlack.textContent = game.getDiscCount('BLACK').toString();
    }

    if (finalWhite) {
        finalWhite.textContent = game.getDiscCount('WHITE').toString();
    }

    if (winner) {
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
        if (winnerDisplay) {
            winnerDisplay.innerHTML = `<span>${localization.getUIText('draw')}</span>`;
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

            if (s.date === lastScoreDate) {
                tr.classList.add('current-run');
            }

            const dateStr = util.formatDate(s.date, localization.language as any);
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${s.score}</td>
                <td>${util.formatTime(s.time)}</td>
                <td>${dateStr}</td>
            `;
            tbody.appendChild(tr);
        });
    }
};

const getHighScoreKey = () => {
    const difficulty = game.getDifficulty();
    const userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';
    return `othello_highscores_${difficulty}_${userSide}`;
};

const saveHighScore = () => {
    const key = getHighScoreKey();
    const userSide = game.getAISide() === 'WHITE' ? 'BLACK' : 'WHITE';

    const newScore: HighScore = {
        score: game.getDiscCount(userSide),
        time: game.getElapsedTime(),
        date: Date.now()
    };

    util.saveHighScore(key, newScore, (a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });

    lastScoreDate = newScore.date;
};

// Subscribe to language changes
localization.subscribe((lang) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === lang);
    });
    updateTexts();
    if (game.getState() === 'RESULT') {
        displayResult();
    }
});

// --- Initialize ---
renderApp();
