import "./style.css";
import { game } from "./Game";
import type { GameState, BoardSize } from "./Game";
import { Localization } from "../common/Localization";
import type { Language } from "../common/Localization";
import en from "./i18n/en";
import ja from "./i18n/ja";
import vi from "./i18n/vi";
import zh from "./i18n/zh";
import ar from "./i18n/ar";
import { Consent } from "../common/Consent";
import { util } from "../common/util";

const IMAGE_URL = "./assets/nature.png";

interface HighScore {
  moves: number;
  time: number;
  date: number | string;
}

let lastScoreDate: number | null = null;

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem("language") as Language | null;
const localization = new Localization({ en, ja, vi, zh, ar }, savedLang || "en");

// --- UI Templates ---

const renderApp = () => {
  setupEventListeners();
  updateTexts();

  // Set active language button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === localization.language);
  });

  // Load saved setup
  loadSetup();
};

// --- Setup Persistence ---

const saveSetup = () => {
  const activeSizeBtn = document.querySelector(".size-btn.active") as HTMLElement;
  const activeTypeBtn = document.querySelector(".type-btn.active") as HTMLElement;
  if (activeSizeBtn && activeTypeBtn) {
    const size = parseInt(activeSizeBtn.dataset.size || "3") as BoardSize;
    const type = (activeTypeBtn.dataset.type || "NUMBERS") as any;
    localStorage.setItem("sliding_setup", JSON.stringify({ size, type }));
  }
};

const loadSetup = () => {
  try {
    const saved = localStorage.getItem("sliding_setup");
    if (saved) {
      const { size, type } = JSON.parse(saved);
      document.querySelectorAll(".size-btn").forEach((btn) => {
        const btnSize = parseInt((btn as HTMLElement).dataset.size || "0");
        if (btnSize === size) {
          btn.classList.add("active");
          game.setBoardSize(size);
        } else {
          btn.classList.remove("active");
        }
      });

      if (type) {
        document.querySelectorAll(".type-btn").forEach((btn) => {
          const btnType = (btn as HTMLElement).dataset.type;
          if (btnType === type) {
            btn.classList.add("active");
            game.setPuzzleType(type);
          } else {
            btn.classList.remove("active");
          }
        });
      }
    }
  } catch (e) {
    console.error("Failed to load sliding puzzle setup:", e);
  }
};

// --- Text Updates ---

const updateTexts = () => {
  document.getElementById("game-title")!.textContent = localization.getUIText("gameTitle");
  document.getElementById("menu-title")!.textContent = localization.getUIText("gameSetup");
  document.getElementById("label-board-size")!.textContent = localization.getUIText("boardSize");
  document.getElementById("start-btn")!.textContent = localization.getUIText("startGame");
  document.getElementById("label-time")!.textContent = localization.getUIText("time");
  document.getElementById("label-moves")!.textContent = localization.getUIText("moves");
  document.getElementById("new-game-btn")!.textContent = localization.getUIText("newGame");
  document.getElementById("result-title")!.textContent = localization.getUIText("gameOver");
  document.getElementById("result-message")!.textContent =
    localization.getUIText("congratulations");
  document.getElementById("label-total-time")!.textContent = localization.getUIText("totalTime");
  document.getElementById("label-total-moves")!.textContent = localization.getUIText("totalMoves");
  document.getElementById("play-again-btn")!.textContent = localization.getUIText("playAgain");

  // High Score Table Headers
  document.getElementById("high-scores-title")!.textContent = localization.getUIText("highScores");
  document.getElementById("th-rank")!.textContent = localization.getUIText("rank");
  document.getElementById("th-moves")!.textContent = localization.getUIText("moves");
  document.getElementById("th-time")!.textContent = localization.getUIText("time");
  document.getElementById("th-date")!.textContent = localization.getUIText("date");
  document.getElementById("reference-label")!.textContent = localization.getUIText("reference");
  document.getElementById("label-puzzle-type")!.textContent = localization.getUIText("puzzleType");
  document.getElementById("btn-type-numbers")!.textContent = localization.getUIText("typeNumbers");
  document.getElementById("btn-type-image")!.textContent = localization.getUIText("typeImage");
  document.getElementById("label-show-numbers")!.textContent =
    localization.getUIText("showNumbers") || "Show Numbers";
};

// --- Event Listeners ---

const setupEventListeners = () => {
  // Home button
  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "/";
  });

  // Language switcher
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const lang = (e.target as HTMLElement).dataset.lang as Language;
      localization.setLanguage(lang);
    });
  });

  // Board size selection
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const size = parseInt(target.dataset.size || "3") as BoardSize;

      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");

      game.setBoardSize(size);
    });
  });

  // Puzzle type selection
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const type = target.dataset.type as any;

      document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");

      game.setPuzzleType(type);
    });
  });

  // Start game
  document.getElementById("start-btn")?.addEventListener("click", () => {
    saveSetup();
    lastScoreDate = null;
    game.start();
  });

  // Show numbers toggle
  document.getElementById("show-numbers-check")?.addEventListener("change", () => {
    renderBoard();
  });

  // New game
  document.getElementById("new-game-btn")?.addEventListener("click", () => {
    game.restart();
  });

  // Play again
  document.getElementById("play-again-btn")?.addEventListener("click", () => {
    game.restart();
  });
};

// --- Board Rendering ---

const renderReferenceBoard = () => {
  const referenceBoardElement = document.getElementById("reference-board");
  if (!referenceBoardElement) return;

  referenceBoardElement.innerHTML = "";
  const size = game.getBoardSize();
  const type = game.getPuzzleType();
  const totalTiles = size * size;

  // Set grid template
  referenceBoardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  referenceBoardElement.dataset.size = size.toString();

  // Create solved board: [1, 2, 3, ..., size*size-1, null]
  for (let i = 1; i < totalTiles; i++) {
    const tileDiv = document.createElement("div");
    tileDiv.className = "tile";
    if (type === "IMAGE") {
      tileDiv.classList.add("image-mode");
      tileDiv.style.backgroundImage = `url(${IMAGE_URL})`;
      const { x, y } = getBackgroundPosition(i - 1, size);
      tileDiv.style.backgroundPosition = `${x}% ${y}%`;
    }
    tileDiv.textContent = i.toString();
    referenceBoardElement.appendChild(tileDiv);
  }

  // Add empty tile
  const emptyTile = document.createElement("div");
  emptyTile.className = "tile empty";
  referenceBoardElement.appendChild(emptyTile);
};

const renderBoard = () => {
  const boardElement = document.getElementById("puzzle-board");
  if (!boardElement) return;

  boardElement.innerHTML = "";
  const board = game.getBoard();
  const size = game.getBoardSize();
  const type = game.getPuzzleType();
  const showNumbers = (document.getElementById("show-numbers-check") as HTMLInputElement)?.checked;

  // Set grid template
  boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardElement.dataset.size = size.toString();

  // Toggle image controls
  const imageControls = document.getElementById("image-controls");
  if (imageControls) {
    imageControls.classList.toggle("hidden", type !== "IMAGE");
  }

  board.forEach((value, index) => {
    const tileDiv = document.createElement("div");

    if (value === null) {
      tileDiv.className = "tile empty";
    } else {
      tileDiv.className = "tile";
      if (type === "IMAGE") {
        tileDiv.classList.add("image-mode");
        if (showNumbers) tileDiv.classList.add("show-numbers");
        tileDiv.style.backgroundImage = `url(${IMAGE_URL})`;
        const { x, y } = getBackgroundPosition(value - 1, size);
        tileDiv.style.backgroundPosition = `${x}% ${y}%`;
      }
      tileDiv.textContent = value.toString();
      tileDiv.dataset.value = value.toString();

      // Click handler
      tileDiv.addEventListener("click", () => {
        const moved = game.makeMove(index);
        if (moved) {
          animateTileMove(tileDiv);
        }
      });
    }

    boardElement.appendChild(tileDiv);
  });
};

const getBackgroundPosition = (value: number, size: number) => {
  const row = Math.floor(value / size);
  const col = value % size;
  const x = (col / (size - 1)) * 100;
  const y = (row / (size - 1)) * 100;
  return { x, y };
};

const animateTileMove = (tile: HTMLElement) => {
  tile.classList.add("moving");
  setTimeout(() => {
    tile.classList.remove("moving");
    renderBoard();
  }, 200);
};

const updateGameInfo = () => {
  const timeDisplay = document.getElementById("time-display");
  if (timeDisplay) {
    timeDisplay.textContent = util.formatTime(game.getElapsedTime());
  }

  const movesDisplay = document.getElementById("moves-display");
  if (movesDisplay) {
    movesDisplay.textContent = game.getMoves().toString();
  }
};

// --- View Management ---

const showView = (viewId: string) => {
  ["menu-view", "game-view", "result-view"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (id === viewId) el.classList.remove("hidden");
      else el.classList.add("hidden");
    }
  });
};

// --- Game Event Handlers ---

game.onStateChange((state: GameState) => {
  if (state === "MENU") {
    showView("menu-view");
  }
  if (state === "PLAYING") {
    showView("game-view");
    renderReferenceBoard();
    renderBoard();
    updateGameInfo();
  }
  if (state === "WON") {
    showView("result-view");
    saveHighScore();
    displayResult();
  }
});

game.onTimerUpdate(() => {
  updateGameInfo();
});

game.onBoardUpdate(() => {
  renderBoard();
});

game.onMovesUpdate(() => {
  updateGameInfo();
});

const getHighScoreKey = () => {
  const size = game.getBoardSize();
  return `sliding_highscores_${size}x${size}`;
};

const saveHighScore = () => {
  const moves = game.getMoves();
  const time = game.getElapsedTime();
  const date = Date.now();
  lastScoreDate = date;

  const newScore: HighScore = { moves, time, date };
  const key = getHighScoreKey();

  util.saveHighScore(key, newScore, (a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.time - b.time;
  });
};

const displayResult = () => {
  const finalTime = document.getElementById("final-time");
  const finalMoves = document.getElementById("final-moves");

  if (finalTime) {
    finalTime.textContent = util.formatTime(game.getElapsedTime());
  }

  if (finalMoves) {
    finalMoves.textContent = game.getMoves().toString();
  }

  renderHighScores();
};

const renderHighScores = () => {
  const key = getHighScoreKey();
  const scores = util.getHighScores<HighScore>(key);
  const tbody = document.getElementById("high-scores-body");

  if (tbody) {
    tbody.innerHTML = "";
    scores.forEach((s, index) => {
      const tr = document.createElement("tr");

      // Highlight current run if it matches
      if (s.date === lastScoreDate) {
        tr.classList.add("current-run");
      }

      const dateStr = util.formatDate(s.date, localization.language as any);

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
localization.subscribe((lang) => {
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === lang);
  });
  updateTexts();
  if (game.getState() === "WON") {
    displayResult();
  }
});

// --- Initialize ---
renderApp();
