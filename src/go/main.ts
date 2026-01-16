import "./style.css";
import { game } from "./Game";
import type { BoardSize, Player } from "./Game";
import { Localization } from "../common/Localization";
import type { Language } from "../common/Localization";
import { en } from "./i18n/en";
import { ja } from "./i18n/ja";
import { vi } from "./i18n/vi";
import { zh } from "./i18n/zh";
import ar from "./i18n/ar";
import { Consent } from "../common/Consent";
import { admob } from "../common/AdMob";

// Initialize AdMob
admob.initialize();
import { util } from "../common/util";

interface HighScore {
  score: number;
  moves: number;
  time: number;
  date: number;
}

let hoverStone: SVGCircleElement | null = null;
let lastScoreDate: number | null = null;

// Initialize Components
new Consent();
const savedLang = localStorage.getItem("language") as Language | null;
const localization = new Localization({ en, ja, vi, zh, ar }, savedLang || "en");

// --- State and UI ---

function updateHandicapOptions(size: BoardSize) {
  const handicapSelect = document.getElementById("handicap-select") as HTMLSelectElement;
  if (!handicapSelect) return;

  const maxHandicap = size === 9 ? 5 : 9;
  const options = handicapSelect.querySelectorAll("option");

  options.forEach((opt) => {
    const value = parseInt(opt.value);
    if (value > maxHandicap) {
      opt.disabled = true;
    } else {
      opt.disabled = false;
    }
  });

  // Reset to valid value if current selection is disabled
  const currentValue = parseInt(handicapSelect.value);
  if (currentValue > maxHandicap) {
    handicapSelect.value = "0";
  }
}

function init() {
  setupEventListeners();
  updateTexts();
  loadSetup();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === localization.language);
  });

  // Initialize handicap options based on default board size
  const activeSizeBtn = document.querySelector(".size-btn.active") as HTMLElement;
  if (activeSizeBtn) {
    const size = parseInt(activeSizeBtn.dataset.size || "19") as BoardSize;
    updateHandicapOptions(size);
  }
}

function showView(viewId: string) {
  document.querySelectorAll(".card").forEach((el) => el.classList.add("hidden"));
  document.getElementById(viewId)?.classList.remove("hidden");

  if (viewId === "game-view") {
    renderBoard();
    updateGameInfo();
  } else if (viewId === "result-view") {
    displayResult();
  }
}

// --- Persistence ---

const saveSetup = () => {
  const modeBtn = document.querySelector(".mode-btn.active") as HTMLElement;
  const sizeBtn = document.querySelector(".size-btn.active") as HTMLElement;
  const sideBtn = document.querySelector(".side-btn.active") as HTMLElement;
  const handicapSelect = document.getElementById("handicap-select") as HTMLSelectElement;
  const komiSelect = document.getElementById("komi-select") as HTMLSelectElement;

  const setup = {
    mode: modeBtn?.dataset.mode,
    size: sizeBtn?.dataset.size,
    side: sideBtn?.dataset.side,
    handicap: handicapSelect?.value,
    komi: komiSelect?.value,
  };
  localStorage.setItem("go_setup", JSON.stringify(setup));
};

const loadSetup = () => {
  try {
    const saved = localStorage.getItem("go_setup");
    if (saved) {
      const { mode, size, side, handicap, komi } = JSON.parse(saved);

      if (mode) {
        document.querySelectorAll(".mode-btn").forEach((btn) => {
          btn.classList.toggle("active", (btn as HTMLElement).dataset.mode === mode);
        });
        if (mode === "VS_AI") document.getElementById("side-section")?.classList.remove("hidden");
      }

      if (size) {
        document.querySelectorAll(".size-btn").forEach((btn) => {
          btn.classList.toggle("active", (btn as HTMLElement).dataset.size === size);
        });
      }

      if (side) {
        document.querySelectorAll(".side-btn").forEach((btn) => {
          btn.classList.toggle("active", (btn as HTMLElement).dataset.side === side);
        });
      }

      if (handicap) {
        const select = document.getElementById("handicap-select") as HTMLSelectElement;
        if (select) select.value = handicap;
      }

      if (komi) {
        const select = document.getElementById("komi-select") as HTMLSelectElement;
        if (select) select.value = komi;
      }
    }
  } catch (e) {
    console.error("Failed to load setup", e);
  }
};

// --- Rendering ---

function renderBoard() {
  const svg = document.getElementById("board") as unknown as SVGSVGElement | null;
  if (!svg) return;
  svg.innerHTML = "";

  const size = game.getBoardSize();
  const padding = 30;
  const boardPxSize = 600 - padding * 2;
  const cellSize = boardPxSize / (size - 1);

  // Grid Lines
  for (let i = 0; i < size; i++) {
    const pos = padding + i * cellSize;

    // Vertical
    const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vLine.setAttribute("x1", pos.toString());
    vLine.setAttribute("y1", padding.toString());
    vLine.setAttribute("x2", pos.toString());
    vLine.setAttribute("y2", (padding + boardPxSize).toString());
    svg.appendChild(vLine);

    // Horizontal
    const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hLine.setAttribute("x1", padding.toString());
    hLine.setAttribute("y1", pos.toString());
    hLine.setAttribute("x2", (padding + boardPxSize).toString());
    hLine.setAttribute("y2", pos.toString());
    svg.appendChild(hLine);
  }

  const starPoints: Record<number, number[]> = {
    9: [2, 6, 4],
    13: [3, 9, 6],
    19: [3, 9, 15],
  };

  const hoshi = starPoints[size] || [];
  hoshi.forEach((r) => {
    hoshi.forEach((c) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", (padding + c * cellSize).toString());
      circle.setAttribute("cy", (padding + r * cellSize).toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("class", "star-point");
      svg.appendChild(circle);
    });
  });

  const board = game.getBoard();
  const lastMove = game.getLastMove();
  const stoneRadius = cellSize * 0.45;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const player = board[r][c];
      if (player) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", (padding + c * cellSize).toString());
        circle.setAttribute("cy", (padding + r * cellSize).toString());
        circle.setAttribute("r", stoneRadius.toString());

        let className = `stone ${player.toLowerCase()}`;

        const lastAction = game.getLastAction();
        // Always mark the last played stone
        if (lastMove && lastMove.row === r && lastMove.col === c) {
          className += " last-move";
          // Only animate if the very last action was THIS stone placement
          if (
            lastAction &&
            lastAction.pos &&
            lastAction.pos.row === r &&
            lastAction.pos.col === c
          ) {
            className += " animate";
          }
        }

        circle.setAttribute("class", className);
        svg.appendChild(circle);
      }
    }
  }

  const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  hitArea.setAttribute("x", "0");
  hitArea.setAttribute("y", "0");
  hitArea.setAttribute("width", "600");
  hitArea.setAttribute("height", "600");
  hitArea.setAttribute("fill", "transparent");
  hitArea.style.cursor = "crosshair";

  // Hover stone
  hoverStone = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hoverStone.setAttribute("r", (cellSize * 0.45).toString());
  hoverStone.setAttribute("class", "stone-hover");
  hoverStone.style.opacity = "0";
  hoverStone.style.pointerEvents = "none";
  svg.appendChild(hoverStone);

  hitArea.addEventListener("mousemove", (e) => {
    if (game.getState() !== "PLAYING") return;
    const rect = svg.getBoundingClientRect();
    const scale = 600 / rect.width;
    const col = Math.round(((e.clientX - rect.left) * scale - padding) / cellSize);
    const row = Math.round(((e.clientY - rect.top) * scale - padding) / cellSize);

    if (row >= 0 && row < size && col >= 0 && col < size && !game.getBoard()[row][col]) {
      const player = game.getCurrentPlayer();
      hoverStone?.setAttribute("cx", (padding + col * cellSize).toString());
      hoverStone?.setAttribute("cy", (padding + row * cellSize).toString());
      hoverStone?.setAttribute("class", `stone-hover ${player.toLowerCase()}`);
      hoverStone?.style.setProperty("opacity", "0.4");
    } else {
      hoverStone?.style.setProperty("opacity", "0");
    }
  });

  hitArea.addEventListener("mouseleave", () => {
    if (hoverStone) hoverStone.style.opacity = "0";
  });

  hitArea.addEventListener("click", (e) => {
    if (game.getGameMode() === "VS_AI" && game.getCurrentPlayer() === game.getAIPlayer()) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 600 / rect.width;
    const boardX = x * scale;
    const boardY = y * scale;

    const col = Math.round((boardX - padding) / cellSize);
    const row = Math.round((boardY - padding) / cellSize);

    if (row >= 0 && row < size && col >= 0 && col < size) {
      game.placeStone(row, col);
    }
  });
  svg.appendChild(hitArea);
}

// --- Logic Integration ---

game.onStateChange((state) => {
  if (state === "MENU") {
    showView("menu-view");
  } else if (state === "PLAYING") {
    showView("game-view");
  } else if (state === "RESULT") {
    saveHighScore();
    showView("result-view");
  }
});

game.onBoardUpdate(() => {
  renderBoard();
  updateGameInfo();
});

game.onTimerUpdate((elapsed) => {
  const timerEl = document.getElementById("game-timer");
  if (timerEl) {
    timerEl.textContent = util.formatTime(elapsed);
  }
});

function updateGameInfo() {
  const player = game.getCurrentPlayer();
  const captures = game.getCaptures();

  const indicator = document.querySelector(".turn-indicator");
  if (indicator) {
    indicator.classList.remove("black", "white");
    indicator.classList.add(player.toLowerCase());
  }

  document.getElementById("black-captures")!.textContent = captures.BLACK.toString();
  document.getElementById("white-captures")!.textContent = captures.WHITE.toString();
  document.getElementById("move-number")!.textContent = game.getMoveCount().toString();

  const turnTextKey = player === "BLACK" ? "blackTurn" : "whiteTurn";
  document.getElementById("turn-text")!.textContent = localization.getUIText(turnTextKey);
}

function displayResult() {
  const { black, white } = game.calculateScore();
  const winner = black > white ? "BLACK" : white > black ? "WHITE" : null;

  const display = document.getElementById("winner-display");
  if (display) {
    let text = "";
    if (winner === "BLACK") text = localization.getUIText("blackWins");
    else if (winner === "WHITE") text = localization.getUIText("whiteWins");
    else text = localization.getUIText("draw");
    display.innerHTML = `<div>${text}</div>`;
  }

  document.getElementById("black-total")!.textContent = black.toString();
  document.getElementById("white-total")!.textContent = white.toString();
  document.getElementById("total-time")!.textContent = util.formatTime(game.getElapsedTime());
  document.getElementById("total-moves")!.textContent = game.getMoveCount().toString();

  renderHighScores();
}

// --- Event Listeners ---

function setupEventListeners() {
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");

      const mode = target.dataset.mode;
      document.getElementById("side-section")?.classList.toggle("hidden", mode !== "VS_AI");
    });
  });

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
      updateHandicapOptions(parseInt(target.dataset.size || "19") as BoardSize);
    });
  });

  document.querySelectorAll(".side-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      document.querySelectorAll(".side-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    });
  });

  document.getElementById("start-btn")?.addEventListener("click", () => {
    const modeBtn = document.querySelector(".mode-btn.active") as HTMLElement;
    const sizeBtn = document.querySelector(".size-btn.active") as HTMLElement;
    const sideBtn = document.querySelector(".side-btn.active") as HTMLElement;
    const handicapSelect = document.getElementById("handicap-select") as HTMLSelectElement;
    const komiSelect = document.getElementById("komi-select") as HTMLSelectElement;

    const mode = modeBtn.dataset.mode as "TWO_PLAYER" | "VS_AI";
    const size = parseInt(sizeBtn.dataset.size || "19") as BoardSize;
    const side = sideBtn.dataset.side as Player;
    const handicap = parseInt(handicapSelect.value || "0");
    const komi = parseFloat(komiSelect.value || "6.5");

    game.setGameMode(mode);
    game.setBoardSize(size);
    game.setHandicap(handicap);
    game.setKomi(komi);

    if (mode === "VS_AI") {
      game.setAISide(side === "BLACK" ? "WHITE" : "BLACK");
    } else {
      game.setAISide(null);
    }

    saveSetup();
    lastScoreDate = null;
    game.start();
  });

  document.getElementById("pass-btn")?.addEventListener("click", () => {
    if (game.getGameMode() === "VS_AI" && game.getCurrentPlayer() === game.getAIPlayer()) return;
    game.pass();
  });
  document.getElementById("new-game-btn")?.addEventListener("click", () => game.restart());
  document.getElementById("restart-btn")?.addEventListener("click", () => game.restart());
  document
    .getElementById("home-btn")
    ?.addEventListener("click", () => (window.location.href = "../"));

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const lang = (e.target as HTMLElement).dataset.lang as Language;
      localization.setLanguage(lang);
      localStorage.setItem("language", lang);
    });
  });
}

function updateTexts() {
  document.getElementById("game-title")!.textContent = localization.getUIText("gameTitle");
  // Menu
  document.getElementById("menu-title")!.textContent = localization.getUIText("menuTitle");
  document.getElementById("label-mode")!.textContent = localization.getUIText("mode");
  document.getElementById("label-board-size")!.textContent = localization.getUIText("boardSize");
  document.getElementById("label-side")!.textContent = localization.getUIText("selectSide");
  document.getElementById("label-handicap")!.textContent = localization.getUIText("handicap");
  document.getElementById("label-komi")!.textContent = localization.getUIText("komi");
  document.getElementById("start-btn")!.textContent = localization.getUIText("startGame");

  document.getElementById("mode-two-player")!.textContent = localization.getUIText("TWO_PLAYER");
  document.getElementById("mode-vs-ai")!.textContent = localization.getUIText("VS_AI");

  document.getElementById("label-time")!.textContent = localization.getUIText("time");
  document.getElementById("label-moves")!.textContent = localization.getUIText("moves");
  document.getElementById("label-captures")!.textContent = localization.getUIText("captures");

  document.getElementById("new-game-btn")!.textContent = localization.getUIText("newGame");
  document.getElementById("pass-btn")!.textContent = localization.getUIText("pass");

  document.getElementById("result-title")!.textContent = localization.getUIText("gameOver");
  document.getElementById("black-score-label")!.textContent = localization.getUIText("BLACK");
  document.getElementById("white-score-label")!.textContent = localization.getUIText("WHITE");
  document.getElementById("label-total-time")!.textContent = localization.getUIText("time");
  document.getElementById("label-total-moves")!.textContent = localization.getUIText("moves");

  document.getElementById("restart-btn")!.textContent = localization.getUIText("playAgain");
  document.getElementById("high-scores-title")!.textContent = localization.getUIText("highScores");

  document.getElementById("th-rank")!.textContent = localization.getUIText("rank");
  document.getElementById("th-score")!.textContent = localization.getUIText("score");
  document.getElementById("th-moves")!.textContent = localization.getUIText("moves");
  document.getElementById("th-time")!.textContent = localization.getUIText("time");
  document.getElementById("th-date")!.textContent = localization.getUIText("date");

  document.getElementById("side-black")!.textContent = localization.getUIText("BLACK");
  document.getElementById("side-white")!.textContent = localization.getUIText("WHITE");

  // Handicap Options
  const handicapSelect = document.getElementById("handicap-select") as HTMLSelectElement;
  if (handicapSelect) {
    Array.from(handicapSelect.options).forEach((opt) => {
      const val = opt.value;
      if (val === "0") {
        opt.textContent = localization.getUIText("none");
      } else {
        opt.textContent = localization.getUIText("stones", { n: val });
      }
    });
  }

  updateGameInfo();
  if (game.getState() === "RESULT") displayResult();
}

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
// --- High Scores ---

function saveHighScore() {
  if (game.getGameMode() !== "VS_AI") return;

  const { black, white } = game.calculateScore();
  const userSide = game.getAIPlayer() === "BLACK" ? "WHITE" : "BLACK";
  const score = userSide === "BLACK" ? black : white;

  const highScore: HighScore = {
    score: score,
    moves: game.getMoveCount(),
    time: game.getElapsedTime(),
    date: Date.now(),
  };

  lastScoreDate = highScore.date;

  // key: size_side_handicap_komi
  const key = getHighScoreKey();

  // Sort: Score (desc) > Moves (asc) > Time (asc)
  util.saveHighScore(key, highScore, (a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.time - b.time;
  });
}

const getHighScoreKey = () => {
  const size = game.getBoardSize();
  const side = game.getAIPlayer() === "BLACK" ? "WHITE" : "BLACK";
  const handicap = game.getHandicap();
  const komi = game.getKomi();
  return `go_highscores_${size}_${side}_${handicap}_${komi}`;
};

function renderHighScores() {
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
    scores.forEach((s, i) => {
      const tr = document.createElement("tr");
      if (s.date === lastScoreDate) {
        tr.classList.add("current-run");
      }
      tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${s.score.toFixed(1)}</td>
                <td>${s.moves}</td>
                <td>${util.formatTime(s.time)}</td>
                <td>${util.formatDate(s.date, localization.language as any)}</td>
            `;
      tbody.appendChild(tr);
    });
  }
}

// Start
init();
