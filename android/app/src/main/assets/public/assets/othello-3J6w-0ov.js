import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as U, u as y, L as W } from "./util-BKt39bz_.js";
class D {
  maxDepth = 4;
  positionWeights = [
    [100, -20, 10, 5, 5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [10, -2, 11, 2, 2, 11, -2, 10],
    [5, -2, 2, 2, 2, 2, -2, 5],
    [5, -2, 2, 2, 2, 2, -2, 5],
    [10, -2, 11, 2, 2, 11, -2, 10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10, 5, 5, 10, -20, 100],
  ];
  constructor() {}
  setDifficulty(t) {
    switch (t) {
      case "EASY":
        this.maxDepth = 1;
        break;
      case "MEDIUM":
        this.maxDepth = 7;
        break;
    }
  }
  getBestMove(t, e) {
    const s = this.getValidMoves(t, e);
    if (s.length === 0) return null;
    let i = null,
      r = -1 / 0;
    for (const o of s) {
      const d = this.simulateMove(t, o, e),
        g = this.minimax(d, this.maxDepth - 1, -1 / 0, 1 / 0, !1, e);
      g > r && ((r = g), (i = o));
    }
    return i;
  }
  minimax(t, e, s, i, r, o) {
    const d = o === "BLACK" ? "WHITE" : "BLACK";
    if (e === 0) return this.evaluateBoard(t, o);
    const g = r ? o : d,
      f = this.getValidMoves(t, g);
    if (f.length === 0)
      return this.getValidMoves(t, r ? d : o).length === 0
        ? this.evaluateBoard(t, o) * 1e3
        : this.minimax(t, e - 1, s, i, !r, o);
    if (r) {
      let l = -1 / 0;
      for (const m of f) {
        const u = this.simulateMove(t, m, g),
          h = this.minimax(u, e - 1, s, i, !1, o);
        if (((l = Math.max(l, h)), (s = Math.max(s, h)), i <= s)) break;
      }
      return l;
    } else {
      let l = 1 / 0;
      for (const m of f) {
        const u = this.simulateMove(t, m, g),
          h = this.minimax(u, e - 1, s, i, !0, o);
        if (((l = Math.min(l, h)), (i = Math.min(i, h)), i <= s)) break;
      }
      return l;
    }
  }
  evaluateBoard(t, e) {
    const s = e === "BLACK" ? "WHITE" : "BLACK";
    let i = 0,
      r = 0,
      o = 0;
    for (let u = 0; u < 8; u++)
      for (let h = 0; h < 8; h++)
        t[u][h] === e
          ? (r++, (i += this.positionWeights[u][h]))
          : t[u][h] === s && (o++, (i -= this.positionWeights[u][h]));
    const g = r + o > 48 ? 10 : 5;
    i += (r - o) * g;
    const f = this.getValidMoves(t, e).length,
      l = this.getValidMoves(t, s).length;
    i += (f - l) * 5;
    const m = [
      [0, 0],
      [0, 7],
      [7, 0],
      [7, 7],
    ];
    for (const [u, h] of m) t[u][h] === e ? (i += 100) : t[u][h] === s && (i -= 100);
    return i;
  }
  getValidMoves(t, e) {
    const s = [];
    for (let i = 0; i < 8; i++)
      for (let r = 0; r < 8; r++)
        t[i][r] === null &&
          this.getFlippedDiscs(t, i, r, e).length > 0 &&
          s.push({ row: i, col: r });
    return s;
  }
  getFlippedDiscs(t, e, s, i) {
    const r = [],
      o = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ],
      d = i === "BLACK" ? "WHITE" : "BLACK";
    for (const [g, f] of o) {
      const l = [];
      let m = e + g,
        u = s + f;
      for (; m >= 0 && m < 8 && u >= 0 && u < 8 && t[m][u] !== null; )
        if (t[m][u] === d) (l.push({ row: m, col: u }), (m += g), (u += f));
        else if (t[m][u] === i) {
          r.push(...l);
          break;
        } else break;
    }
    return r;
  }
  simulateMove(t, e, s) {
    const i = t.map((o) => [...o]);
    i[e.row][e.col] = s;
    const r = this.getFlippedDiscs(i, e.row, e.col, s);
    for (const o of r) i[o.row][o.col] = s;
    return i;
  }
}
class H {
  boardSize = 8;
  board = [];
  currentPlayer = "BLACK";
  gameState = "MENU";
  gameMode = "TWO_PLAYER";
  difficulty = "MEDIUM";
  moveHistory = [];
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  winner = null;
  ai;
  aiSide = null;
  stateChangeListeners = [];
  moveListeners = [];
  boardUpdateListeners = [];
  timerUpdateListeners = [];
  constructor() {
    ((this.ai = new D()), this.initializeBoard());
  }
  initializeBoard() {
    this.board = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null));
    const t = this.boardSize / 2;
    ((this.board[t - 1][t - 1] = "WHITE"),
      (this.board[t - 1][t] = "BLACK"),
      (this.board[t][t - 1] = "BLACK"),
      (this.board[t][t] = "WHITE"));
  }
  setGameMode(t) {
    this.gameMode = t;
  }
  setDifficulty(t) {
    ((this.difficulty = t), this.ai.setDifficulty(t));
  }
  setAISide(t) {
    this.aiSide = t;
  }
  getAISide() {
    return this.aiSide;
  }
  getGameMode() {
    return this.gameMode;
  }
  getDifficulty() {
    return this.difficulty;
  }
  start() {
    (this.initializeBoard(),
      (this.currentPlayer = "BLACK"),
      (this.moveHistory = []),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      (this.winner = null),
      (this.gameState = "PLAYING"),
      this.notifyStateChange(),
      this.startTimer(),
      this.notifyBoardUpdate(),
      this.gameMode === "VS_AI" && this.aiSide === "BLACK" && this.makeAIMove());
  }
  restart() {
    (this.stopTimer(), (this.gameState = "MENU"), this.notifyStateChange());
  }
  startTimer() {
    (this.timerInterval && clearInterval(this.timerInterval),
      (this.timerInterval = window.setInterval(() => {
        ((this.elapsedTime = Date.now() - this.startTime), this.notifyTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  makeMove(t, e, s = !1) {
    if (
      this.gameState !== "PLAYING" ||
      (this.gameMode === "VS_AI" && this.currentPlayer === this.aiSide && !s) ||
      this.board[t][e] !== null
    )
      return !1;
    const i = this.getFlippedDiscs(t, e, this.currentPlayer);
    if (i.length === 0) return !1;
    ((this.board[t][e] = this.currentPlayer),
      i.forEach((o) => {
        this.board[o.row][o.col] = this.currentPlayer;
      }));
    const r = { position: { row: t, col: e }, player: this.currentPlayer, flipped: i };
    return (
      this.moveHistory.push(r),
      this.switchPlayer(),
      this.hasValidMoves(this.currentPlayer) ||
        (this.switchPlayer(), this.hasValidMoves(this.currentPlayer) || this.endGame()),
      this.notifyMove(r),
      this.notifyBoardUpdate(),
      this.makeAIMove(),
      !0
    );
  }
  makeAIMove() {
    if (
      this.gameState !== "PLAYING" ||
      this.gameMode !== "VS_AI" ||
      this.currentPlayer !== this.aiSide
    )
      return;
    const t = this.aiSide ? this.ai.getBestMove(this.board, this.aiSide) : null;
    t &&
      setTimeout(() => {
        this.makeMove(t.row, t.col, !0);
      }, 500);
  }
  getFlippedDiscs(t, e, s) {
    const i = [],
      r = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ],
      o = s === "BLACK" ? "WHITE" : "BLACK";
    for (const [d, g] of r) {
      const f = [];
      let l = t + d,
        m = e + g;
      for (
        ;
        l >= 0 && l < this.boardSize && m >= 0 && m < this.boardSize && this.board[l][m] !== null;
      )
        if (this.board[l][m] === o) (f.push({ row: l, col: m }), (l += d), (m += g));
        else if (this.board[l][m] === s) {
          i.push(...f);
          break;
        } else break;
    }
    return i;
  }
  getValidMoves(t) {
    const e = [];
    for (let s = 0; s < this.boardSize; s++)
      for (let i = 0; i < this.boardSize; i++)
        this.board[s][i] === null &&
          this.getFlippedDiscs(s, i, t).length > 0 &&
          e.push({ row: s, col: i });
    return e;
  }
  hasValidMoves(t) {
    return this.getValidMoves(t).length > 0;
  }
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "BLACK" ? "WHITE" : "BLACK";
  }
  endGame() {
    this.stopTimer();
    let t = 0,
      e = 0;
    for (let s = 0; s < this.boardSize; s++)
      for (let i = 0; i < this.boardSize; i++)
        this.board[s][i] === "BLACK" ? t++ : this.board[s][i] === "WHITE" && e++;
    (t > e ? (this.winner = "BLACK") : e > t && (this.winner = "WHITE"),
      (this.gameState = "RESULT"),
      this.notifyStateChange());
  }
  getDiscCount(t) {
    let e = 0;
    for (let s = 0; s < this.boardSize; s++)
      for (let i = 0; i < this.boardSize; i++) this.board[s][i] === t && e++;
    return e;
  }
  getBoard() {
    return this.board;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getState() {
    return this.gameState;
  }
  getMoves() {
    return this.moveHistory;
  }
  getWinner() {
    return this.winner;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  onStateChange(t) {
    this.stateChangeListeners.push(t);
  }
  onMove(t) {
    this.moveListeners.push(t);
  }
  onBoardUpdate(t) {
    this.boardUpdateListeners.push(t);
  }
  onTimerUpdate(t) {
    this.timerUpdateListeners.push(t);
  }
  notifyStateChange() {
    this.stateChangeListeners.forEach((t) => t(this.gameState));
  }
  notifyMove(t) {
    this.moveListeners.forEach((e) => e(t));
  }
  notifyBoardUpdate() {
    this.boardUpdateListeners.forEach((t) => t());
  }
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((t) => t(this.elapsedTime));
  }
}
const a = new H(),
  G = {
    ui: {
      gameTitle: "Othello",
      gameSetup: "Game Setup",
      startGame: "Start Game",
      newGame: "New Game",
      blackTurn: "Black's Turn",
      whiteTurn: "White's Turn",
      blackWins: "Black Wins!",
      whiteWins: "White Wins!",
      draw: "It's a Draw!",
      gameOver: "Game Over",
      totalMoves: "Total Moves",
      playAgain: "Play Again",
      time: "Time",
      moves: "Moves",
      score: "Score",
      blackScore: "Black",
      whiteScore: "White",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
      gameMode: "Game Mode",
      twoPlayers: "2 Players",
      vsAI: "vs AI",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      labelSide: "Play As",
      sideBlack: "Black (First)",
      sideWhite: "White (Second)",
    },
  },
  K = {
    ui: {
      gameTitle: "オセロ",
      gameSetup: "ゲーム設定",
      startGame: "ゲーム開始",
      newGame: "新規ゲーム",
      blackTurn: "黒の番",
      whiteTurn: "白の番",
      blackWins: "黒の勝利！",
      whiteWins: "白の勝利！",
      draw: "引き分け！",
      gameOver: "ゲーム終了",
      totalMoves: "合計手数",
      playAgain: "もう一度プレイ",
      time: "時間",
      moves: "手数",
      score: "スコア",
      blackScore: "黒",
      whiteScore: "白",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
      gameMode: "ゲームモード",
      twoPlayers: "二人対戦",
      vsAI: "AI対戦",
      difficulty: "難易度",
      easy: "簡単",
      medium: "普通",
      hard: "難しい",
      labelSide: "サイド選択",
      sideBlack: "黒 (先攻)",
      sideWhite: "白 (後攻)",
    },
  },
  N = {
    ui: {
      gameTitle: "Cờ lật",
      gameSetup: "Thiết lập trò chơi",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      blackTurn: "Lượt đen",
      whiteTurn: "Lượt trắng",
      blackWins: "Đen thắng!",
      whiteWins: "Trắng thắng!",
      draw: "Hòa!",
      gameOver: "Kết thúc",
      totalMoves: "Tổng số nước",
      playAgain: "Chơi lại",
      time: "Thời gian",
      moves: "Số nước",
      score: "Điểm",
      blackScore: "Đen",
      whiteScore: "Trắng",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
      gameMode: "Chế độ chơi",
      twoPlayers: "2 Người chơi",
      vsAI: "Đấu với AI",
      difficulty: "Độ khó",
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      labelSide: "Chọn quân",
      sideBlack: "Đen (Đi trước)",
      sideWhite: "Trắng (Đi sau)",
    },
  },
  P = {
    ui: {
      gameTitle: "黑白棋",
      gameSetup: "游戏设置",
      startGame: "开始游戏",
      newGame: "新游戏",
      blackTurn: "黑方回合",
      whiteTurn: "白方回合",
      blackWins: "黑方获胜！",
      whiteWins: "白方获胜！",
      draw: "平局！",
      gameOver: "游戏结束",
      totalMoves: "总移动次数",
      playAgain: "再玩一次",
      time: "时间",
      moves: "移动次数",
      score: "得分",
      blackScore: "黑方",
      whiteScore: "白方",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
      gameMode: "游戏模式",
      twoPlayers: "双人对战",
      vsAI: "对战AI",
      difficulty: "难度",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      labelSide: "执棋方",
      sideBlack: "黑方（先手）",
      sideWhite: "白方（后手）",
    },
  },
  q = {
    ui: {
      gameTitle: "أوثيلو",
      gameSetup: "إعداد اللعبة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      blackTurn: "دور الأسود",
      whiteTurn: "دور الأبيض",
      blackWins: "الأسود يفوز!",
      whiteWins: "الأبيض يفوز!",
      draw: "تعادل!",
      gameOver: "انتهت اللعبة",
      totalMoves: "إجمالي الحركات",
      playAgain: "العب مرة أخرى",
      time: "الوقت",
      moves: "الحركات",
      score: "النتيجة",
      blackScore: "الأسود",
      whiteScore: "الأبيض",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
      gameMode: "وضع اللعبة",
      twoPlayers: "لاعبان",
      vsAI: "ضد الكمبيوتر",
      difficulty: "الصعوبة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      labelSide: "العب بـ",
      sideBlack: "الأسود (أولاً)",
      sideWhite: "الأبيض (ثانياً)",
    },
  };
let T = null;
new U();
const V = localStorage.getItem("language"),
  c = new W({ en: G, ja: K, vi: N, zh: P, ar: q }, V || "en"),
  B = () => {
    const n = a.getGameMode(),
      t = document.querySelector(".difficulty-section"),
      e = document.querySelector(".side-section");
    t &&
      e &&
      (n === "VS_AI"
        ? (t.classList.remove("hidden"), e.classList.remove("hidden"))
        : (t.classList.add("hidden"), e.classList.add("hidden")));
  },
  z = () => {
    ($(),
      M(),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.classList.toggle("active", n.dataset.lang === c.language);
      }),
      _(),
      B());
  },
  O = () => {
    const n = document.querySelector(".mode-btn[data-mode].active"),
      t = document.querySelector(".mode-btn[data-difficulty].active");
    if (n) {
      const e = {
        mode: n.dataset.mode,
        difficulty: t ? t.dataset.difficulty : "MEDIUM",
        side: document.querySelector(".mode-btn[data-side].active")?.dataset.side || "BLACK",
      };
      localStorage.setItem("othello_setup", JSON.stringify(e));
    }
  },
  _ = () => {
    try {
      const n = localStorage.getItem("othello_setup");
      if (n) {
        const { mode: t, difficulty: e } = JSON.parse(n);
        if (
          (t &&
            document.querySelectorAll(".mode-btn[data-mode]").forEach((s) => {
              s.dataset.mode === t
                ? (s.classList.add("active"), a.setGameMode(t))
                : s.classList.remove("active");
            }),
          e &&
            document.querySelectorAll(".mode-btn[data-difficulty]").forEach((s) => {
              s.dataset.difficulty === e
                ? (s.classList.add("active"), a.setDifficulty(e))
                : s.classList.remove("active");
            }),
          "side" in JSON.parse(n))
        ) {
          const { side: s } = JSON.parse(n);
          s &&
            document.querySelectorAll(".mode-btn[data-side]").forEach((i) => {
              i.dataset.side === s ? i.classList.add("active") : i.classList.remove("active");
            });
        }
        B();
      }
    } catch (n) {
      console.error("Failed to load Othello setup:", n);
    }
  },
  M = () => {
    ((document.getElementById("game-title").textContent = c.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = c.getUIText("gameSetup")),
      (document.getElementById("label-mode").textContent = c.getUIText("gameMode")),
      (document.getElementById("mode-two-player").textContent = c.getUIText("twoPlayers")),
      (document.getElementById("mode-vs-ai").textContent = c.getUIText("vsAI")),
      (document.getElementById("label-difficulty").textContent = c.getUIText("difficulty")),
      (document.getElementById("difficulty-easy").textContent = c.getUIText("easy")),
      (document.getElementById("difficulty-medium").textContent = c.getUIText("medium")),
      (document.getElementById("start-btn").textContent = c.getUIText("startGame")),
      (document.getElementById("new-game-btn").textContent = c.getUIText("newGame")),
      (document.getElementById("label-time").textContent = c.getUIText("time")),
      (document.getElementById("label-black-score").textContent = c.getUIText("blackScore")),
      (document.getElementById("label-white-score").textContent = c.getUIText("whiteScore")),
      (document.getElementById("label-total-time").textContent = c.getUIText("time")),
      (document.getElementById("label-total-moves").textContent = c.getUIText("totalMoves")),
      (document.getElementById("label-final-black").textContent = c.getUIText("blackScore")),
      (document.getElementById("label-final-white").textContent = c.getUIText("whiteScore")),
      (document.getElementById("restart-btn").textContent = c.getUIText("playAgain")),
      (document.getElementById("high-scores-title").textContent = c.getUIText("highScores")),
      (document.getElementById("label-rank").textContent = c.getUIText("rank")),
      (document.getElementById("label-moves").textContent = c.getUIText("score")),
      (document.getElementById("label-date").textContent = c.getUIText("date")),
      (document.getElementById("label-side").textContent = c.getUIText("labelSide")),
      (document.getElementById("side-black").textContent = c.getUIText("sideBlack")),
      (document.getElementById("side-white").textContent = c.getUIText("sideWhite")),
      b());
  },
  $ = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.addEventListener("click", (t) => {
          const e = t.target.dataset.lang;
          c.setLanguage(e);
        });
      }),
      document.querySelectorAll(".mode-btn[data-mode]").forEach((n) => {
        n.addEventListener("click", (t) => {
          const e = t.target,
            s = e.dataset.mode;
          (document
            .querySelectorAll(".mode-btn[data-mode]")
            .forEach((i) => i.classList.remove("active")),
            e.classList.add("active"),
            a.setGameMode(s),
            B());
        });
      }),
      document.querySelectorAll(".mode-btn[data-difficulty]").forEach((n) => {
        n.addEventListener("click", (t) => {
          const e = t.target,
            s = e.dataset.difficulty;
          (document
            .querySelectorAll(".mode-btn[data-difficulty]")
            .forEach((i) => i.classList.remove("active")),
            e.classList.add("active"),
            a.setDifficulty(s));
        });
      }),
      document.querySelectorAll(".mode-btn[data-side]").forEach((n) => {
        n.addEventListener("click", (t) => {
          const e = t.target;
          (document
            .querySelectorAll(".mode-btn[data-side]")
            .forEach((s) => s.classList.remove("active")),
            e.classList.add("active"));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        if ((O(), a.getGameMode() === "VS_AI")) {
          const t = document.querySelector(".mode-btn[data-side].active")?.dataset.side || "BLACK";
          a.setAISide(t === "BLACK" ? "WHITE" : "BLACK");
        } else a.setAISide(null);
        ((T = null), a.start());
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        a.restart();
      }),
      document.getElementById("restart-btn")?.addEventListener("click", () => {
        a.restart();
      }));
  },
  F = () => {
    const n = document.getElementById("board");
    if (!n) return;
    n.innerHTML = "";
    const t = 8,
      e = 600 / t,
      s = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (s.setAttribute("width", "600"),
      s.setAttribute("height", "600"),
      s.setAttribute("fill", "#0f766e"),
      n.appendChild(s));
    for (let i = 0; i <= t; i++) {
      const r = i * e,
        o = document.createElementNS("http://www.w3.org/2000/svg", "line");
      (o.setAttribute("x1", "0"),
        o.setAttribute("y1", r.toString()),
        o.setAttribute("x2", "600"),
        o.setAttribute("y2", r.toString()),
        o.setAttribute("stroke", "#0d9488"),
        o.setAttribute("stroke-width", "2"),
        n.appendChild(o));
      const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
      (d.setAttribute("x1", r.toString()),
        d.setAttribute("y1", "0"),
        d.setAttribute("x2", r.toString()),
        d.setAttribute("y2", "600"),
        d.setAttribute("stroke", "#0d9488"),
        d.setAttribute("stroke-width", "2"),
        n.appendChild(d));
    }
    for (let i = 0; i < t; i++)
      for (let r = 0; r < t; r++) {
        const o = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        (o.setAttribute("x", (r * e).toString()),
          o.setAttribute("y", (i * e).toString()),
          o.setAttribute("width", e.toString()),
          o.setAttribute("height", e.toString()),
          o.setAttribute("fill", "transparent"),
          o.classList.add("cell-clickable"),
          (o.dataset.row = i.toString()),
          (o.dataset.col = r.toString()),
          o.addEventListener("click", () => {
            (a.getGameMode() === "VS_AI" && a.getCurrentPlayer() === a.getAISide()) ||
              a.makeMove(i, r);
          }),
          n.appendChild(o));
      }
    (C(), L());
  },
  C = () => {
    const n = document.getElementById("board");
    if (!n) return;
    n.querySelectorAll(".disc").forEach((i) => i.remove());
    const t = a.getBoard(),
      e = 600 / 8,
      s = e * 0.4;
    t.forEach((i, r) => {
      i.forEach((o, d) => {
        if (o !== null) {
          const g = d * e + e / 2,
            f = r * e + e / 2,
            l = document.createElementNS("http://www.w3.org/2000/svg", "g");
          l.classList.add("disc");
          const m = `grad-${o}-${r}-${d}`,
            u = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            h = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
          if ((h.setAttribute("id", m), o === "BLACK")) {
            const p = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            (p.setAttribute("offset", "0%"), p.setAttribute("stop-color", "#4a5568"));
            const v = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            (v.setAttribute("offset", "100%"),
              v.setAttribute("stop-color", "#1a202c"),
              h.appendChild(p),
              h.appendChild(v));
          } else {
            const p = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            (p.setAttribute("offset", "0%"), p.setAttribute("stop-color", "#ffffff"));
            const v = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            (v.setAttribute("offset", "100%"),
              v.setAttribute("stop-color", "#e2e8f0"),
              h.appendChild(p),
              h.appendChild(v));
          }
          (u.appendChild(h), n.appendChild(u));
          const w = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          (w.setAttribute("cx", (g + 2).toString()),
            w.setAttribute("cy", (f + 2).toString()),
            w.setAttribute("r", s.toString()),
            w.setAttribute("fill", "rgba(0, 0, 0, 0.3)"),
            l.appendChild(w));
          const S = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          (S.setAttribute("cx", g.toString()),
            S.setAttribute("cy", f.toString()),
            S.setAttribute("r", s.toString()),
            S.setAttribute("fill", `url(#${m})`),
            S.setAttribute("stroke", o === "BLACK" ? "#0d131a" : "#cbd5e0"),
            S.setAttribute("stroke-width", "2"),
            l.appendChild(S),
            n.appendChild(l));
          const I = a.getMoves(),
            A = I.length > 0 ? I[I.length - 1] : null;
          if (A && A.position.row === r && A.position.col === d) {
            const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            (p.classList.add("last-move-marker"),
              p.setAttribute("cx", g.toString()),
              p.setAttribute("cy", f.toString()),
              p.setAttribute("r", (s * 0.3).toString()),
              p.setAttribute("fill", "#ef4444"),
              (p.style.pointerEvents = "none"),
              n.appendChild(p));
          }
        }
      });
    });
  },
  L = () => {
    const n = document.getElementById("board");
    if (!n) return;
    n.querySelectorAll(".valid-move-indicator").forEach((s) => s.remove());
    const t = a.getValidMoves(a.getCurrentPlayer()),
      e = 600 / 8;
    t.forEach((s) => {
      const i = s.col * e + e / 2,
        r = s.row * e + e / 2,
        o = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      (o.classList.add("valid-move-indicator"),
        o.setAttribute("cx", i.toString()),
        o.setAttribute("cy", r.toString()),
        o.setAttribute("r", (e * 0.15).toString()),
        o.setAttribute("fill", a.getCurrentPlayer() === "BLACK" ? "#4a5568" : "#e2e8f0"),
        o.setAttribute("opacity", "0.5"),
        (o.style.pointerEvents = "none"),
        n.appendChild(o));
    });
  },
  b = () => {
    const n = document.querySelector(".turn-indicator"),
      t = document.getElementById("turn-text"),
      e = a.getCurrentPlayer();
    (n && (n.className = `turn-indicator ${e.toLowerCase()}`),
      t && (t.textContent = e === "BLACK" ? c.getUIText("blackTurn") : c.getUIText("whiteTurn")));
    const s = document.getElementById("black-score"),
      i = document.getElementById("white-score");
    (s && (s.textContent = a.getDiscCount("BLACK").toString()),
      i && (i.textContent = a.getDiscCount("WHITE").toString()));
  },
  E = (n) => {
    ["menu-view", "game-view", "result-view"].forEach((t) => {
      const e = document.getElementById(t);
      e && (t === n ? e.classList.remove("hidden") : e.classList.add("hidden"));
    });
  };
a.onStateChange((n) => {
  if (
    (n === "MENU" && E("menu-view"), n === "PLAYING" && (E("game-view"), F(), b()), n === "RESULT")
  ) {
    E("result-view");
    const t = a.getWinner(),
      e = a.getAISide() === "WHITE" ? "BLACK" : "WHITE";
    (t === e && a.getGameMode() === "VS_AI" && Y(), x());
  }
});
a.onTimerUpdate(() => {
  const n = a.getElapsedTime(),
    t = y.formatTime(n),
    e = document.getElementById("game-timer");
  e && (e.textContent = t);
});
a.onMove((n) => {
  (C(), L(), b());
});
a.onBoardUpdate(() => {
  (C(), L(), b());
});
const x = () => {
    const n = a.getWinner(),
      t = document.getElementById("winner-display"),
      e = document.getElementById("total-moves"),
      s = document.getElementById("total-time"),
      i = document.getElementById("final-black"),
      r = document.getElementById("final-white");
    if (
      (e && (e.textContent = a.getMoves().length.toString()),
      s && (s.textContent = y.formatTime(a.getElapsedTime())),
      i && (i.textContent = a.getDiscCount("BLACK").toString()),
      r && (r.textContent = a.getDiscCount("WHITE").toString()),
      n)
    ) {
      if (t) {
        const o = n === "BLACK" ? c.getUIText("blackWins") : c.getUIText("whiteWins");
        t.innerHTML = `
                <div class="winner-disc ${n.toLowerCase()}"></div>
                <span>${o}</span>
            `;
      }
    } else t && (t.innerHTML = `<span>${c.getUIText("draw")}</span>`);
    R();
  },
  R = () => {
    const n = document.querySelector(".high-scores-container");
    if (a.getGameMode() !== "VS_AI") {
      n && n.classList.add("hidden");
      return;
    }
    n && n.classList.remove("hidden");
    const t = k(),
      e = y.getHighScores(t),
      s = document.getElementById("high-scores-body");
    s &&
      ((s.innerHTML = ""),
      e.forEach((i, r) => {
        const o = document.createElement("tr");
        i.date === T && o.classList.add("current-run");
        const d = y.formatDate(i.date, c.language);
        ((o.innerHTML = `
                <td>${r + 1}</td>
                <td>${i.score}</td>
                <td>${y.formatTime(i.time)}</td>
                <td>${d}</td>
            `),
          s.appendChild(o));
      }));
  },
  k = () => {
    const n = a.getDifficulty(),
      t = a.getAISide() === "WHITE" ? "BLACK" : "WHITE";
    return `othello_highscores_${n}_${t}`;
  },
  Y = () => {
    const n = k(),
      t = a.getAISide() === "WHITE" ? "BLACK" : "WHITE",
      e = { score: a.getDiscCount(t), time: a.getElapsedTime(), date: Date.now() };
    (y.saveHighScore(n, e, (s, i) => (i.score !== s.score ? i.score - s.score : s.time - i.time)),
      (T = e.date));
  };
c.subscribe((n) => {
  ((document.documentElement.dir = n === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((t) => {
      t.classList.toggle("active", t.dataset.lang === n);
    }),
    M(),
    a.getState() === "RESULT" && x());
});
z();
