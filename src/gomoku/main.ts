import "./style.css";
import { game } from "./Game";
import type { GameState, Stone } from "./Game";
import { Localization } from "../common/Localization";
import type { Language } from "../common/Localization";
import en from "./i18n/en";
import ja from "./i18n/ja";
import vi from "./i18n/vi";
import zh from "./i18n/zh";
import ar from "./i18n/ar";
import { Consent } from "../common/Consent";
import { util } from "../common/util";

interface HighScore {
  moves: number;
  time: number;
  date: number | string;
  boardSize: number;
}

let lastScoreDate: number | null = null;

// Initialize Consent Banner
new Consent();

// Initialize Localization
const savedLang = localStorage.getItem("language") as Language | null;
const localization = new Localization({ en, ja, vi, zh, ar }, savedLang || "en");

// --- UI Templates ---

const toggleSideSelector = () => {
  const mode = game.getGameMode();
  const sideSection = document.getElementById("side-section");
  if (sideSection) {
    if (mode === "VS_AI") {
      sideSection.classList.remove("hidden");
    } else {
      sideSection.classList.add("hidden");
    }
  }
};

const renderApp = () => {
  setupEventListeners();
  updateTexts();

  // Set active language button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === localization.language);
  });

  // Load saved setup
  loadSetup();
  toggleSideSelector();
};

// --- Setup Persistence ---

const saveSetup = () => {
  const modeBtn = document.querySelector(".mode-btn.active") as HTMLElement;
  const sizeBtn = document.querySelector(".size-btn.active") as HTMLElement;
  const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;

  if (modeBtn && sizeBtn) {
    const setup = {
      mode: modeBtn.dataset.mode,
      size: sizeBtn.dataset.size,
      side: (document.querySelector(".side-btn.active") as HTMLElement)?.dataset.side || "BLACK",
      style: styleBtn?.dataset.style || "GO",
    };
    localStorage.setItem("gomoku_setup", JSON.stringify(setup));
  }
};

const loadSetup = () => {
  try {
    const saved = localStorage.getItem("gomoku_setup");
    if (saved) {
      const { mode, size } = JSON.parse(saved);

      // Restore Mode
      if (mode) {
        document.querySelectorAll(".mode-btn").forEach((btn) => {
          const btnMode = (btn as HTMLElement).dataset.mode;
          if (btnMode === mode) {
            btn.classList.add("active");
            game.setGameMode(mode);
          } else {
            btn.classList.remove("active");
          }
        });
      }

      // Restore Size
      if (size) {
        document.querySelectorAll(".size-btn").forEach((btn) => {
          const btnSize = (btn as HTMLElement).dataset.size;
          if (btnSize === size) {
            btn.classList.add("active");
            game.setBoardSize(parseInt(size));
          } else {
            btn.classList.remove("active");
          }
        });
      }

      // Restore Side
      if ("side" in JSON.parse(saved)) {
        const { side } = JSON.parse(saved);
        if (side) {
          document.querySelectorAll(".side-btn").forEach((btn) => {
            const btnSide = (btn as HTMLElement).dataset.side;
            if (btnSide === side) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
      }

      // Restore Style
      if ("style" in JSON.parse(saved)) {
        const { style } = JSON.parse(saved);
        if (style) {
          document.querySelectorAll(".style-btn").forEach((btn) => {
            const btnStyle = (btn as HTMLElement).dataset.style;
            if (btnStyle === style) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
      }

      // Restore Style
      if ("style" in JSON.parse(saved)) {
        const { style } = JSON.parse(saved);
        if (style) {
          document.querySelectorAll(".style-btn").forEach((btn) => {
            const btnStyle = (btn as HTMLElement).dataset.style;
            if (btnStyle === style) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
      }

      toggleSideSelector();
      updateTexts();
    }
  } catch (e) {
    console.error("Failed to load Gomoku setup:", e);
  }
};

// --- Text Updates ---

const updateTexts = () => {
  // Title
  document.getElementById("game-title")!.textContent = localization.getUIText("gameTitle");
  // Menu
  document.getElementById("menu-title")!.textContent = localization.getUIText("gameSetup");
  document.getElementById("label-mode")!.textContent = localization.getUIText("gameMode");
  document.getElementById("mode-two-player")!.textContent = localization.getUIText("twoPlayers");
  document.getElementById("mode-vs-ai")!.textContent = localization.getUIText("vsAI");
  document.getElementById("label-board-size")!.textContent = localization.getUIText("boardSize");
  document.getElementById("label-side")!.textContent = localization.getUIText("labelSide");

  const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
  const boardStyle = styleBtn?.dataset.style || "GO";

  if (boardStyle === "XO") {
    document.getElementById("side-black")!.textContent = localization.getUIText("sideX");
    document.getElementById("side-white")!.textContent = localization.getUIText("sideO");
  } else {
    document.getElementById("side-black")!.textContent = localization.getUIText("sideBlack");
    document.getElementById("side-white")!.textContent = localization.getUIText("sideWhite");
  }

  document.getElementById("label-board-style")!.textContent = localization.getUIText("boardStyle");
  document.querySelectorAll(".style-btn").forEach((btn) => {
    const style = (btn as HTMLElement).dataset.style;
    if (style === "GO") btn.textContent = localization.getUIText("styleGo");
    if (style === "XO") btn.textContent = localization.getUIText("styleXO");
  });
  document.getElementById("start-btn")!.textContent = localization.getUIText("startGame");
  // Game view
  document.getElementById("label-move")!.textContent = localization.getUIText("move");
  document.getElementById("new-game-btn")!.textContent = localization.getUIText("newGame");
  // Result view
  document.getElementById("label-total-moves")!.textContent = localization.getUIText("totalMoves");
  document.getElementById("restart-btn")!.textContent = localization.getUIText("playAgain");
  document.getElementById("label-time")!.textContent = localization.getUIText("time");
  document.getElementById("label-total-time")!.textContent = localization.getUIText("totalTime");
  // High Score Table Headers
  document.getElementById("high-scores-title")!.textContent = localization.getUIText("highScores");
  document.getElementById("th-rank")!.textContent = localization.getUIText("rank");
  document.getElementById("th-moves")!.textContent = localization.getUIText("moves");
  document.getElementById("th-time")!.textContent = localization.getUIText("time");
  document.getElementById("th-date")!.textContent = localization.getUIText("date");

  updateGameInfo();
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

  // Mode selection (2-player only for now)
  document.querySelectorAll(".mode-btn:not(.disabled)").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const mode = target.dataset.mode as any;

      document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");

      game.setGameMode(mode);
      toggleSideSelector();
    });
  });

  // Side Selection
  document.querySelectorAll(".side-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      document.querySelectorAll(".side-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    });
  });

  // Board size selection
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const size = parseInt(target.dataset.size || "15");

      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");

      game.setBoardSize(size);
    });
  });

  // Board Style selection
  document.querySelectorAll(".style-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      document.querySelectorAll(".style-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
      updateTexts();
    });
  });

  // Start game
  document.getElementById("start-btn")?.addEventListener("click", () => {
    saveSetup();

    // Set AI Side
    if (game.getGameMode() === "VS_AI") {
      const sideBtn = document.querySelector(".side-btn.active") as HTMLElement;
      const userSide = sideBtn?.dataset.side || "BLACK";
      // User BLACK -> AI WHITE (Second). User WHITE -> AI BLACK (First).
      game.setAISide(userSide === "BLACK" ? "WHITE" : "BLACK");
    } else {
      game.setAISide(null);
    }

    lastScoreDate = null;
    game.start();
  });

  // New Game (during gameplay)
  document.getElementById("new-game-btn")?.addEventListener("click", () => {
    game.restart();
  });

  // Restart game
  document.getElementById("restart-btn")?.addEventListener("click", () => {
    game.restart();
  });
};

// --- Board Rendering ---

const renderBoard = () => {
  const svg = document.getElementById("board") as unknown as SVGSVGElement;
  if (!svg) return;

  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 600 600");

  const boardSize = game.getBoardSize();
  const padding = 30;
  const boardWidth = 600 - 2 * padding;

  const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
  const boardStyle = styleBtn?.dataset.style || "GO";

  // Calculate cell size based on style
  // GO: Intersections (size-1 spaces)
  // XO: Cells (size spaces)
  const cellSize = boardStyle === "XO" ? boardWidth / boardSize : boardWidth / (boardSize - 1);

  // Background
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", "600");
  bg.setAttribute("width", "600");
  bg.setAttribute("height", "600");
  bg.setAttribute("rx", "8");

  if (boardStyle === "XO") {
    bg.setAttribute("fill", "#f8f9fa"); // Brighter, close to white
    bg.setAttribute("stroke", "#e2e8f0");
    bg.setAttribute("stroke-width", "2");
  } else {
    bg.setAttribute("fill", "var(--board-color)");
  }
  svg.appendChild(bg);

  // Grid lines
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  if (boardStyle === "XO") {
    gridGroup.setAttribute("stroke", "#cbd5e0"); // Lighter grid for XO
  } else {
    gridGroup.setAttribute("stroke", "var(--board-line)");
  }
  gridGroup.setAttribute("stroke-width", "1.5");

  // Draw grid
  const lineCount = boardStyle === "XO" ? boardSize + 1 : boardSize;
  for (let i = 0; i < lineCount; i++) {
    const pos = padding + i * cellSize;

    // Horizontal line
    const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hLine.setAttribute("x1", padding.toString());
    hLine.setAttribute("y1", pos.toString());
    hLine.setAttribute("x2", (600 - padding).toString());
    hLine.setAttribute("y2", pos.toString());
    gridGroup.appendChild(hLine);

    // Vertical line
    const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vLine.setAttribute("x1", pos.toString());
    vLine.setAttribute("y1", padding.toString());
    vLine.setAttribute("x2", pos.toString());
    vLine.setAttribute("y2", (600 - padding).toString());
    gridGroup.appendChild(vLine);
  }
  svg.appendChild(gridGroup);

  // Star points
  let starPoints: number[][] = [];
  if (boardSize === 9) {
    starPoints = [
      [2, 2],
      [2, 6],
      [4, 4],
      [6, 2],
      [6, 6],
    ];
  } else if (boardSize === 15) {
    starPoints = [
      [3, 3],
      [3, 11],
      [7, 7],
      [11, 3],
      [11, 11],
    ];
  } else {
    starPoints = [
      [3, 3],
      [3, 9],
      [3, 15],
      [9, 3],
      [9, 9],
      [9, 15],
      [15, 3],
      [15, 9],
      [15, 15],
    ];
  }

  if (boardStyle === "XO") {
    // Don't show star points in XO mode
  } else {
    starPoints.forEach(([row, col]) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", (padding + col * cellSize).toString());
      circle.setAttribute("cy", (padding + row * cellSize).toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "var(--board-line)");
      svg.appendChild(circle);
    });
  }

  // Stones group
  const stonesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  stonesGroup.setAttribute("id", "stones-group");
  svg.appendChild(stonesGroup);

  // Hover element group
  const hoverGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  hoverGroup.setAttribute("class", "stone-hover-group");
  hoverGroup.style.opacity = "0";
  hoverGroup.style.pointerEvents = "none";
  svg.appendChild(hoverGroup);

  // Create transparent hit area for mouse events
  const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  hitArea.setAttribute("x", "0");
  hitArea.setAttribute("y", "0");
  hitArea.setAttribute("width", "600");
  hitArea.setAttribute("height", "600");
  hitArea.setAttribute("fill", "transparent");
  hitArea.style.cursor = "crosshair";

  hitArea.addEventListener("mousemove", (e) => {
    if (game.getState() !== "PLAYING") {
      hoverGroup.style.opacity = "0";
      return;
    }

    const rect = svg.getBoundingClientRect();
    const scale = 600 / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;

    let col, row;
    if (boardStyle === "XO") {
      // Hit detection for cells
      col = Math.floor((x - padding) / cellSize);
      row = Math.floor((y - padding) / cellSize);
    } else {
      // Hit detection for intersections
      col = Math.round((x - padding) / cellSize);
      row = Math.round((y - padding) / cellSize);
    }

    if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && !game.getBoard()[row][col]) {
      const currentPlayer = game.getCurrentPlayer();
      let cx, cy;

      if (boardStyle === "XO") {
        cx = padding + col * cellSize + cellSize / 2;
        cy = padding + row * cellSize + cellSize / 2;
      } else {
        cx = padding + col * cellSize;
        cy = padding + row * cellSize;
      }

      // Clear previous hover content
      hoverGroup.innerHTML = "";

      if (boardStyle === "XO") {
        if (currentPlayer === "BLACK") {
          // Draw X
          const size = cellSize * 0.6;
          const x1 = cx - size / 2;
          const y1 = cy - size / 2;
          const x2 = cx + size / 2;
          const y2 = cy + size / 2;

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", `M${x1},${y1} L${x2},${y2} M${x2},${y1} L${x1},${y2}`);
          path.setAttribute("stroke", "var(--accent-secondary)");
          path.setAttribute("stroke-width", "2");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("class", "stone-hover xo");
          hoverGroup.appendChild(path);
        } else {
          // Draw O
          const hoverCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          hoverCircle.setAttribute("cx", cx.toString());
          hoverCircle.setAttribute("cy", cy.toString());
          hoverCircle.setAttribute("r", (cellSize * 0.35).toString());
          hoverCircle.setAttribute("fill", "transparent");
          hoverCircle.setAttribute("stroke", "var(--accent-primary)");
          hoverCircle.setAttribute("stroke-width", "2");
          hoverCircle.setAttribute("class", "stone-hover xo");
          hoverGroup.appendChild(hoverCircle);
        }
      } else {
        const hoverCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hoverCircle.setAttribute("cx", cx.toString());
        hoverCircle.setAttribute("cy", cy.toString());
        hoverCircle.setAttribute("r", (cellSize * 0.42).toString());
        hoverCircle.setAttribute("class", `stone-hover ${currentPlayer.toLowerCase()}`);
        hoverGroup.appendChild(hoverCircle);
      }

      hoverGroup.style.opacity = "0.4";
    } else {
      hoverGroup.style.opacity = "0";
    }
  });

  hitArea.addEventListener("mouseleave", () => {
    hoverGroup.style.opacity = "0";
  });

  hitArea.addEventListener("click", (e) => {
    if (game.getGameMode() === "VS_AI" && game.isAITurn()) return;
    if (game.getState() !== "PLAYING") return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 600 / rect.width;
    const boardX = x * scale;
    const boardY = y * scale;

    let col, row;
    if (boardStyle === "XO") {
      col = Math.floor((boardX - padding) / cellSize);
      row = Math.floor((boardY - padding) / cellSize);
    } else {
      col = Math.round((boardX - padding) / cellSize);
      row = Math.round((boardY - padding) / cellSize);
    }

    if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
      game.makeMove(row, col);
    }
  });

  svg.appendChild(hitArea);
};

const addStone = (stone: Stone) => {
  const svg = document.getElementById("board") as unknown as SVGSVGElement;
  const stonesGroup = document.getElementById("stones-group");
  if (!svg || !stonesGroup) return;

  const boardSize = game.getBoardSize();
  const padding = 30;
  const boardWidth = 600 - 2 * padding;
  const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
  const boardStyle = styleBtn?.dataset.style || "GO";

  const cellSize = boardStyle === "XO" ? boardWidth / boardSize : boardWidth / (boardSize - 1);
  let cx, cy;

  if (boardStyle === "XO") {
    cx = padding + stone.col * cellSize + cellSize / 2;
    cy = padding + stone.row * cellSize + cellSize / 2;
  } else {
    cx = padding + stone.col * cellSize;
    cy = padding + stone.row * cellSize;
  }

  const stoneRadius = cellSize * 0.42;

  if (boardStyle === "XO") {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("stone-animate");
    group.classList.add("last-move-target"); // Add class for identifying last move in XO mode

    if (stone.player === "BLACK") {
      // Draw X
      // Use Accent Secondary (Red-ish) for Black/X
      const size = cellSize * 0.6;
      const x1 = cx - size / 2;
      const y1 = cy - size / 2;
      const x2 = cx + size / 2;
      const y2 = cy + size / 2;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${x1},${y1} L${x2},${y2} M${x2},${y1} L${x1},${y2}`);
      path.setAttribute("stroke", "var(--accent-secondary)");
      path.setAttribute("stroke-width", "4");
      path.setAttribute("stroke-linecap", "round");
      group.appendChild(path);
    } else {
      // Draw O
      // Use Accent Primary (Blue-ish) for White/O
      const radius = cellSize * 0.35;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx.toString());
      circle.setAttribute("cy", cy.toString());
      circle.setAttribute("r", radius.toString());
      circle.setAttribute("stroke", "var(--accent-primary)");
      circle.setAttribute("stroke-width", "4");
      circle.setAttribute("fill", "transparent");
      group.appendChild(circle);
    }

    stonesGroup.appendChild(group);

    // Update last move highlight specific for XO
    const previousLast = svg.querySelector(".xo-last-move");
    if (previousLast) {
      previousLast.classList.remove("xo-last-move");
    }
    group.classList.add("xo-last-move");

    return;
  }

  // Stone shadow
  const shadow = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  shadow.setAttribute("cx", (cx + 2).toString());
  shadow.setAttribute("cy", (cy + 2).toString());
  shadow.setAttribute("rx", stoneRadius.toString());
  shadow.setAttribute("ry", (stoneRadius * 0.9).toString());
  shadow.setAttribute("fill", "rgba(0, 0, 0, 0.3)");
  shadow.classList.add("stone-animate");
  stonesGroup.appendChild(shadow);

  // Gradient for stone
  const gradId = `grad-${stone.player}-${stone.row}-${stone.col}`;
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
  gradient.setAttribute("id", gradId);
  gradient.setAttribute("cx", "30%");
  gradient.setAttribute("cy", "30%");

  if (stone.player === "BLACK") {
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#4a5568");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#1a202c");
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
  } else {
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#ffffff");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#f7fafc");
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
  }
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Stone circle
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", cx.toString());
  circle.setAttribute("cy", cy.toString());
  circle.setAttribute("r", stoneRadius.toString());
  circle.setAttribute("fill", `url(#${gradId})`);
  circle.setAttribute("stroke", stone.player === "BLACK" ? "#0d131a" : "#e2e8f0");
  circle.setAttribute("stroke-width", "2");
  circle.classList.add("stone-animate");

  // Manage Last Move Highlight
  // Remove from previous
  const previousLast = svg.querySelector(".last-move");
  if (previousLast) {
    previousLast.classList.remove("last-move");
  }
  // Add to current
  circle.classList.add("last-move");

  stonesGroup.appendChild(circle);
};

const updateGameInfo = () => {
  const turnIndicator = document.querySelector(".turn-indicator");
  const turnText = document.getElementById("turn-text");
  const moveNumber = document.getElementById("move-number");

  const currentPlayer = game.getCurrentPlayer();
  const moves = game.getMoves();

  if (turnIndicator) {
    const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
    const boardStyle = styleBtn?.dataset.style || "GO";
    turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}`;
    if (boardStyle === "XO") {
      turnIndicator.classList.add("xo");
    }
  }

  if (turnText) {
    const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
    const boardStyle = styleBtn?.dataset.style || "GO";
    if (boardStyle === "XO") {
      turnText.textContent =
        currentPlayer === "BLACK"
          ? localization.getUIText("turnX")
          : localization.getUIText("turnO");
    } else {
      turnText.textContent =
        currentPlayer === "BLACK"
          ? localization.getUIText("blackTurn")
          : localization.getUIText("whiteTurn");
    }
  }

  if (moveNumber) {
    moveNumber.textContent = moves.length.toString();
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
    renderBoard();
    updateGameInfo();
  }
  if (state === "RESULT") {
    showView("result-view");
    saveHighScore();
    displayResult();
  }
});

game.onMove((stone: Stone) => {
  addStone(stone);
  updateGameInfo();
});

game.onTimerUpdate(() => {
  const elapsed = game.getElapsedTime();
  const formatted = util.formatTime(elapsed);
  const timerEl = document.getElementById("game-timer");
  if (timerEl) timerEl.textContent = formatted;
});

const getHighScoreKey = () => {
  let userSide = "BLACK";
  if (game.getGameMode() === "VS_AI") {
    userSide = game.getAISide() === "WHITE" ? "BLACK" : "WHITE";
  }
  return `gomoku_highscores_${userSide}`;
};

const saveHighScore = () => {
  // Only save for VS_AI mode
  if (game.getGameMode() !== "VS_AI") return;

  const userSide = game.getAISide() === "WHITE" ? "BLACK" : "WHITE";

  // Only save if User won
  if (game.getWinner() !== userSide) return;

  const totalMovesCount = game.getMoves().length;
  const time = game.getElapsedTime();
  const date = Date.now();
  lastScoreDate = date;

  const newScore: HighScore = {
    moves: totalMovesCount,
    time,
    date,
    boardSize: game.getBoardSize(),
  };
  const key = getHighScoreKey();

  util.saveHighScore(key, newScore, (a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.time - b.time;
  });
};

const displayResult = () => {
  const winner = game.getWinner();
  const winnerDisplay = document.getElementById("winner-display");
  const totalMoves = document.getElementById("total-moves");
  const totalTime = document.getElementById("total-time");

  if (totalMoves) {
    totalMoves.textContent = game.getMoves().length.toString();
  }

  if (totalTime) {
    totalTime.textContent = util.formatTime(game.getElapsedTime());
  }

  if (winner) {
    if (winnerDisplay) {
      let playerWinsText;
      const styleBtn = document.querySelector(".style-btn.active") as HTMLElement;
      const boardStyle = styleBtn?.dataset.style || "GO";

      if (boardStyle === "XO") {
        playerWinsText =
          winner === "BLACK" ? localization.getUIText("winsX") : localization.getUIText("winsO");
      } else {
        playerWinsText =
          winner === "BLACK"
            ? localization.getUIText("blackPlayerWins")
            : localization.getUIText("whitePlayerWins");
      }

      winnerDisplay.innerHTML = `
        <div class="winner-stone ${winner.toLowerCase()} ${boardStyle === "XO" ? "xo" : ""}"></div>
        <span>${playerWinsText}</span>
      `;
    }
  } else {
    if (winnerDisplay) {
      winnerDisplay.innerHTML = `<span>${localization.getUIText("boardFull")}</span>`;
    }
  }

  renderHighScores();
};

const renderHighScores = () => {
  const container = document.querySelector(".high-scores-container");
  if (game.getGameMode() !== "VS_AI") {
    if (container) container.classList.add("hidden");
    return;
  }
  if (container) container.classList.remove("hidden");

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
  if (game.getState() === "RESULT") {
    displayResult();
  }
});

// --- Initialize ---
renderApp();
