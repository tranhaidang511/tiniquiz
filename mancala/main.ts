import './style.css';
import { game } from './Game';
import type { GameState, Player, PitCount, Move, Difficulty } from './Game';
import { Localization } from '../common/Localization';
import type { Language } from '../common/Localization';
import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';
import { Consent } from '../common/Consent';

interface HighScore {
    score: number;
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
    const pitBtn = document.querySelector('.pit-btn.active') as HTMLElement;

    if (modeBtn && pitBtn) {
        const setup = {
            mode: modeBtn.dataset.mode,
            pits: pitBtn.dataset.pits
        };
        localStorage.setItem('mancala_setup', JSON.stringify(setup));
    }
};

const loadSetup = () => {
    try {
        const saved = localStorage.getItem('mancala_setup');
        if (saved) {
            const { mode, pits } = JSON.parse(saved);

            // Restore Mode
            if (mode) {
                document.querySelectorAll('.mode-btn:not(.disabled)').forEach(btn => {
                    const btnMode = (btn as HTMLElement).dataset.mode;
                    if (btnMode === mode) {
                        btn.classList.add('active');
                        game.setGameMode(mode);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Restore Pit Count
            if (pits) {
                document.querySelectorAll('.pit-btn').forEach(btn => {
                    const btnPits = (btn as HTMLElement).dataset.pits;
                    if (btnPits === pits) {
                        btn.classList.add('active');
                        game.setPitCount(parseInt(pits) as PitCount);
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }
    } catch (e) {
        console.error('Failed to load Mancala setup:', e);
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
    if (modeVsAI) {
        modeVsAI.textContent = localization.getUIText('vsAI');
    }

    const labelDifficulty = document.getElementById('label-difficulty');
    if (labelDifficulty) labelDifficulty.textContent = localization.getUIText('difficulty');

    const difficultyEasy = document.getElementById('difficulty-easy');
    if (difficultyEasy) difficultyEasy.textContent = localization.getUIText('easy');

    const difficultyMedium = document.getElementById('difficulty-medium');
    if (difficultyMedium) difficultyMedium.textContent = localization.getUIText('medium');

    const difficultyHard = document.getElementById('difficulty-hard');
    if (difficultyHard) difficultyHard.textContent = localization.getUIText('hard');

    const labelPitCount = document.getElementById('label-pit-count');
    if (labelPitCount) labelPitCount.textContent = localization.getUIText('pitCount');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = localization.getUIText('startGame');

    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');

    const labelMove = document.getElementById('label-move');
    if (labelMove) labelMove.textContent = localization.getUIText('move');

    const labelTime = document.getElementById('label-time');
    if (labelTime) labelTime.textContent = localization.getUIText('time');

    const labelPlayer1Score = document.getElementById('label-player1-score');
    if (labelPlayer1Score) {
        const isAIMode = game.getGameMode() === 'VS_AI';
        labelPlayer1Score.textContent = isAIMode
            ? localization.getUIText('yourScore')
            : localization.getUIText('player1Score');
    }

    const labelPlayer2Score = document.getElementById('label-player2-score');
    if (labelPlayer2Score) {
        const isAIMode = game.getGameMode() === 'VS_AI';
        labelPlayer2Score.textContent = isAIMode
            ? localization.getUIText('aiScore')
            : localization.getUIText('player2Score');
    }

    const labelTotalMoves = document.getElementById('label-total-moves');
    if (labelTotalMoves) labelTotalMoves.textContent = localization.getUIText('totalMoves');

    const labelTotalTime = document.getElementById('label-total-time');
    if (labelTotalTime) labelTotalTime.textContent = localization.getUIText('totalTime');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.textContent = localization.getUIText('playAgain');

    const labelForceJump = document.getElementById('label-force-jump');
    if (labelForceJump) labelForceJump.textContent = localization.getUIText('forceJump');

    // High Score Table Headers
    const highScoresTitle = document.getElementById('high-scores-title');
    if (highScoresTitle) highScoresTitle.textContent = localization.getUIText('highScores');

    const thRank = document.getElementById('th-rank');
    if (thRank) thRank.textContent = localization.getUIText('rank');

    const thScore = document.getElementById('th-score');
    if (thScore) thScore.textContent = localization.getUIText('yourScore');

    const thMoves = document.getElementById('th-moves');
    if (thMoves) thMoves.textContent = localization.getUIText('moves');

    const thTime = document.getElementById('th-time');
    if (thTime) thTime.textContent = localization.getUIText('time');

    const thDate = document.getElementById('th-date');
    if (thDate) thDate.textContent = localization.getUIText('date');

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

    // Mode selection
    document.querySelectorAll('.mode-btn:not([data-difficulty])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const mode = target.dataset.mode as any;

            document.querySelectorAll('.mode-btn:not([data-difficulty])').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setGameMode(mode);

            // Show/hide difficulty selector
            const difficultySection = document.querySelector('.difficulty-section');
            if (difficultySection) {
                if (mode === 'VS_AI') {
                    difficultySection.classList.remove('hidden');
                } else {
                    difficultySection.classList.add('hidden');
                }
            }
        });
    });

    // Difficulty selection
    document.querySelectorAll('.mode-btn[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const difficulty = target.dataset.difficulty as Difficulty;

            document.querySelectorAll('.mode-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setDifficulty(difficulty);
        });
    });

    // Pit count selection
    document.querySelectorAll('.pit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const pits = parseInt(target.dataset.pits || '6') as PitCount;

            document.querySelectorAll('.pit-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            game.setPitCount(pits);
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

// Difficulty selection
document.querySelectorAll('.mode-btn[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const difficulty = target.dataset.difficulty as Difficulty;

        document.querySelectorAll('.mode-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        game.setDifficulty(difficulty);
    });
});

// Pit count selection
document.querySelectorAll('.pit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const pits = parseInt(target.dataset.pits || '6') as PitCount;

        document.querySelectorAll('.pit-btn').forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        game.setPitCount(pits);
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

// --- Board Rendering ---

// Helper function to render visual stones
const renderStones = (count: number): string => {
    if (count === 0) return '';

    // For small counts, show individual stones
    if (count <= 16) {
        const stones = [];
        for (let i = 0; i < count; i++) {
            stones.push('<div class="stone"></div>');
        }
        return `<div class="stones-container small">${stones.join('')}</div>`;
    }

    // For larger counts, show sample stones + number badge
    const sampleStones = [];
    for (let i = 0; i < 16; i++) {
        sampleStones.push('<div class="stone"></div>');
    }
    return `
        <div class="stones-container large">
            ${sampleStones.join('')}
            <div class="stone-badge">${count}</div>
        </div>
    `;
};

const renderBoard = () => {
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) return;

    boardContainer.innerHTML = '';

    const pitCount = game.getPitCount();
    const board = game.getBoard();

    const boardDiv = document.createElement('div');
    boardDiv.className = 'mancala-board';

    // Player 2 Store (left)
    const p2Store = document.createElement('div');
    p2Store.className = 'store player2-store';
    p2Store.innerHTML = renderStones(board[pitCount * 2 + 1]);
    boardDiv.appendChild(p2Store);

    // Pits area
    const pitsArea = document.createElement('div');
    pitsArea.className = 'pits-area';

    // Player 2 pits (top row, right to left)
    const p2Pits = document.createElement('div');
    p2Pits.className = 'pit-row player2-pits';
    for (let i = pitCount * 2; i > pitCount; i--) {
        const pit = createPit(board[i], i, 'PLAYER2');
        p2Pits.appendChild(pit);
    }
    pitsArea.appendChild(p2Pits);

    // Player 1 pits (bottom row, left to right)
    const p1Pits = document.createElement('div');
    p1Pits.className = 'pit-row player1-pits';
    for (let i = 0; i < pitCount; i++) {
        const pit = createPit(board[i], i, 'PLAYER1');
        p1Pits.appendChild(pit);
    }
    pitsArea.appendChild(p1Pits);

    boardDiv.appendChild(pitsArea);

    // Player 1 Store (right)
    const p1Store = document.createElement('div');
    p1Store.className = 'store player1-store';
    p1Store.innerHTML = renderStones(board[pitCount]);
    boardDiv.appendChild(p1Store);

    boardContainer.appendChild(boardDiv);
};

const createPit = (stones: number, index: number, owner: Player): HTMLElement => {
    const pit = document.createElement('div');
    pit.className = 'pit';
    pit.dataset.index = index.toString();
    pit.dataset.owner = owner;

    // Highlight the last move
    if (game.getLastMovePit() === index) {
        pit.classList.add('last-move');
    }

    pit.innerHTML = renderStones(stones);

    // Add click handler
    pit.addEventListener('click', () => {
        handlePitClick(index);
    });

    // Highlight clickable pits
    // In VS_AI mode, only make PLAYER1 pits clickable
    const isAIMode = game.getGameMode() === 'VS_AI';
    const shouldBeClickable = isAIMode
        ? (owner === 'PLAYER1' && game.isValidMove(index))
        : game.isValidMove(index);

    if (shouldBeClickable) {
        pit.classList.add('clickable');
    }

    return pit;
};

const handlePitClick = (index: number) => {
    if (game.makeMove(index)) {
        renderBoard();
        updateGameInfo();
    }
};

const updateGameInfo = () => {
    const turnIndicator = document.querySelector('.turn-indicator');
    const turnText = document.getElementById('turn-text');
    const moveNumber = document.getElementById('move-number');
    const gameTimer = document.getElementById('game-timer');

    const currentPlayer = game.getCurrentPlayer();
    const moves = game.getMoves();

    if (turnIndicator) {
        turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}`;
    }

    if (turnText) {
        const isAIMode = game.getGameMode() === 'VS_AI';
        if (isAIMode) {
            turnText.textContent = currentPlayer === 'PLAYER1'
                ? localization.getUIText('yourTurn')
                : localization.getUIText('aiTurn');
        } else {
            turnText.textContent = currentPlayer === 'PLAYER1'
                ? localization.getUIText('player1Turn')
                : localization.getUIText('player2Turn');
        }
    }

    if (moveNumber) {
        moveNumber.textContent = moves.length.toString();
    }

    if (gameTimer) {
        gameTimer.textContent = game.formatTime(game.getElapsedTime());
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
            updateGameInfo();
        }, 1000);
    }
    if (state === 'RESULT') {
        showView('result-view');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
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

// Handle AI moves
game.onAIMove(() => {
    game.makeAIMove();
});

const saveHighScore = () => {
    const winner = game.getWinner();
    // Only save high scores for VS_AI mode when Player (PLAYER1) wins
    if (game.getGameMode() !== 'VS_AI' || winner !== 'PLAYER1') {
        return;
    }

    const score = game.getPlayerScore('PLAYER1');
    const moves = game.getMoves().length;
    const time = game.getElapsedTime();
    const date = Date.now();
    const pitCount = game.getPitCount();
    const difficulty = game.getDifficulty();

    const newScore: HighScore = { score, moves, time, date };
    const key = `mancala_highscores_${difficulty}_${pitCount}`;

    try {
        const existing = localStorage.getItem(key);
        let scores: HighScore[] = existing ? JSON.parse(existing) : [];

        scores.push(newScore);

        // Sort: Higher score first, then fewer moves, then faster time
        scores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score; // Descending score
            }
            if (a.moves !== b.moves) {
                return a.moves - b.moves; // Ascending moves
            }
            return a.time - b.time; // Ascending time
        });

        // Keep top 5
        scores = scores.slice(0, 5);

        localStorage.setItem(key, JSON.stringify(scores));
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
};

const getHighScores = (): HighScore[] => {
    if (game.getGameMode() !== 'VS_AI') return [];

    const pitCount = game.getPitCount();
    const difficulty = game.getDifficulty();
    const key = `mancala_highscores_${difficulty}_${pitCount}`;
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
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const totalMoves = document.getElementById('total-moves');
    const totalTime = document.getElementById('total-time');
    const resultTitle = document.getElementById('result-title');

    // Update score labels for AI mode
    const isAIMode = game.getGameMode() === 'VS_AI';
    const labelPlayer1Score = document.getElementById('label-player1-score');
    if (labelPlayer1Score) {
        labelPlayer1Score.textContent = isAIMode
            ? localization.getUIText('yourScore')
            : localization.getUIText('player1Score');
    }

    const labelPlayer2Score = document.getElementById('label-player2-score');
    if (labelPlayer2Score) {
        labelPlayer2Score.textContent = isAIMode
            ? localization.getUIText('aiScore')
            : localization.getUIText('player2Score');
    }

    if (player1Score) {
        player1Score.textContent = game.getPlayerScore('PLAYER1').toString();
    }

    if (player2Score) {
        player2Score.textContent = game.getPlayerScore('PLAYER2').toString();
    }

    if (totalMoves) {
        totalMoves.textContent = game.getMoves().length.toString();
    }

    if (totalTime) {
        totalTime.textContent = game.formatTime(game.getElapsedTime());
    }

    if (winner) {
        if (resultTitle) {
            const isAIMode = game.getGameMode() === 'VS_AI';
            if (isAIMode) {
                resultTitle.textContent = winner === 'PLAYER1'
                    ? localization.getUIText('youWin')
                    : localization.getUIText('aiWins');
            } else {
                resultTitle.textContent = winner === 'PLAYER1'
                    ? localization.getUIText('player1Wins')
                    : localization.getUIText('player2Wins');
            }
        }

        if (winnerDisplay) {
            const isAIMode = game.getGameMode() === 'VS_AI';
            const playerWinsText = isAIMode
                ? (winner === 'PLAYER1'
                    ? localization.getUIText('youWin')
                    : localization.getUIText('aiWins'))
                : (winner === 'PLAYER1'
                    ? localization.getUIText('player1Wins')
                    : localization.getUIText('player2Wins'));

            winnerDisplay.innerHTML = `
                <div class="winner-icon ${winner.toLowerCase()}">🏆</div>
                <span>${playerWinsText}</span>
            `;
        }
    } else {
        if (resultTitle) resultTitle.textContent = localization.getUIText('draw');
        if (winnerDisplay) {
            winnerDisplay.innerHTML = `<span>${localization.getUIText('draw')}</span>`;
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
                const currentScore = game.getPlayerScore('PLAYER1');
                const currentMoves = game.getMoves().length;
                const currentTime = game.getElapsedTime();

                if (winner === 'PLAYER1' &&
                    s.score === currentScore &&
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
                    <td>${s.score}</td>
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
