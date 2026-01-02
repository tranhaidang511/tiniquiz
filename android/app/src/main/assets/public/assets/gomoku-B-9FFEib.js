import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as M, u as w, L as z } from "./util-BKt39bz_.js";
class W {
  boardSize;
  constructor(e = 15) {
    this.boardSize = e;
  }
  setBoardSize(e) {
    this.boardSize = e;
  }
  getBestMove(e, t) {
    const n = t === "BLACK" ? "WHITE" : "BLACK",
      s = this.findWinningMove(e, t);
    if (s) return s;
    const d = this.findWinningMove(e, n);
    return d || this.findBestStrategicMove(e, t, n);
  }
  findWinningMove(e, t) {
    const n = this.getValidMoves(e);
    for (const s of n) if (this.wouldWin(e, s.row, s.col, t)) return s;
    return null;
  }
  wouldWin(e, t, n, s) {
    e[t][n] = s;
    const d = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    let o = !1;
    for (const { dr: r, dc: c } of d)
      if (this.countInLine(e, t, n, r, c, s) >= 5) {
        o = !0;
        break;
      }
    return ((e[t][n] = null), o);
  }
  countInLine(e, t, n, s, d, o) {
    let r = 1;
    for (let c = 1; c < 5; c++) {
      const a = t + s * c,
        u = n + d * c;
      if (a < 0 || a >= this.boardSize || u < 0 || u >= this.boardSize || e[a][u] !== o) break;
      r++;
    }
    for (let c = 1; c < 5; c++) {
      const a = t - s * c,
        u = n - d * c;
      if (a < 0 || a >= this.boardSize || u < 0 || u >= this.boardSize || e[a][u] !== o) break;
      r++;
    }
    return r;
  }
  findBestStrategicMove(e, t, n) {
    const s = this.getValidMoves(e);
    if (s.length === 0) return null;
    if (s.length === this.boardSize * this.boardSize) {
      const r = Math.floor(this.boardSize / 2);
      return { row: r, col: r };
    }
    let d = -1 / 0,
      o = null;
    for (const r of s) {
      const c = this.evaluatePosition(e, r.row, r.col, t, n);
      c > d && ((d = c), (o = r));
    }
    return o;
  }
  evaluatePosition(e, t, n, s, d) {
    let o = 0;
    ((e[t][n] = s),
      (o += this.evaluatePatterns(e, t, n, s) * 1.2),
      (e[t][n] = null),
      (e[t][n] = d),
      (o += this.evaluatePatterns(e, t, n, d)),
      (e[t][n] = null));
    const r = Math.abs(t - this.boardSize / 2) + Math.abs(n - this.boardSize / 2);
    return ((o += (this.boardSize - r) * 0.1), o);
  }
  evaluatePatterns(e, t, n, s) {
    let d = 0;
    const o = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    for (const { dr: r, dc: c } of o) {
      const a = this.getPattern(e, t, n, r, c, s);
      d += this.scorePattern(a);
    }
    return d;
  }
  getPattern(e, t, n, s, d, o) {
    let r = "";
    for (let c = -4; c <= 4; c++) {
      const a = t + s * c,
        u = n + d * c;
      a < 0 || a >= this.boardSize || u < 0 || u >= this.boardSize
        ? (r += "X")
        : e[a][u] === o
          ? (r += "O")
          : e[a][u] === null
            ? (r += "-")
            : (r += "X");
    }
    return r;
  }
  scorePattern(e) {
    return e.includes("OOOOO")
      ? 1e5
      : e.includes("-OOOO-")
        ? 1e4
        : e.includes("-OOOO") || e.includes("OOOO-")
          ? 1e3
          : e.includes("-OOO-")
            ? 500
            : e.includes("--OOO-") || e.includes("-OOO--")
              ? 400
              : e.includes("-OOO") || e.includes("OOO-")
                ? 100
                : e.includes("-OO-")
                  ? 50
                  : e.includes("--OO-") || e.includes("-OO--")
                    ? 40
                    : e.includes("-OO") || e.includes("OO-")
                      ? 10
                      : e.includes("-O-")
                        ? 1
                        : 0;
  }
  getValidMoves(e) {
    const t = [];
    if (!e.some((o) => o.some((r) => r !== null))) {
      for (let o = 0; o < this.boardSize; o++)
        for (let r = 0; r < this.boardSize; r++) t.push({ row: o, col: r });
      return t;
    }
    const s = new Set(),
      d = 2;
    for (let o = 0; o < this.boardSize; o++)
      for (let r = 0; r < this.boardSize; r++)
        if (e[o][r] !== null)
          for (let c = -d; c <= d; c++)
            for (let a = -d; a <= d; a++) {
              const u = o + c,
                S = r + a;
              if (
                u >= 0 &&
                u < this.boardSize &&
                S >= 0 &&
                S < this.boardSize &&
                e[u][S] === null
              ) {
                const f = `${u},${S}`;
                s.add(f);
              }
            }
    return (
      s.forEach((o) => {
        const [r, c] = o.split(",").map(Number);
        t.push({ row: r, col: c });
      }),
      t
    );
  }
}
class x {
  state = "MENU";
  mode = "TWO_PLAYER";
  boardSize = 15;
  board = [];
  currentPlayer = "BLACK";
  moves = [];
  winner = null;
  winningLine = null;
  ai;
  aiSide = null;
  isAIThinking = !1;
  startTime = null;
  elapsedTime = 0;
  timerInterval = null;
  stateListeners = [];
  moveListeners = [];
  boardListeners = [];
  aiThinkingListeners = [];
  timerUpdateListeners = [];
  constructor() {
    ((this.ai = new W(this.boardSize)), this.initializeBoard());
  }
  setAISide(e) {
    this.aiSide = e;
  }
  getAISide() {
    return this.aiSide;
  }
  initializeBoard() {
    this.board = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null));
  }
  setBoardSize(e) {
    if (e !== 9 && e !== 15 && e !== 19) throw new Error("Board size must be 9, 15 or 19");
    ((this.boardSize = e), this.ai.setBoardSize(e), this.initializeBoard());
  }
  getBoardSize() {
    return this.boardSize;
  }
  setGameMode(e) {
    this.mode = e;
  }
  getGameMode() {
    return this.mode;
  }
  start() {
    ((this.board = []),
      this.initializeBoard(),
      (this.currentPlayer = "BLACK"),
      (this.moves = []),
      (this.winner = null),
      (this.winningLine = null),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      this.setState("PLAYING"),
      this.emitBoard(),
      this.startTimer(),
      this.mode === "VS_AI" && this.aiSide === "BLACK" && this.makeAIMove());
  }
  makeMove(e, t) {
    if (
      this.state !== "PLAYING" ||
      this.isAIThinking ||
      e < 0 ||
      e >= this.boardSize ||
      t < 0 ||
      t >= this.boardSize ||
      this.board[e][t] !== null ||
      (this.mode === "VS_AI" && this.currentPlayer === this.aiSide)
    )
      return !1;
    const n = { row: e, col: t, player: this.currentPlayer };
    return (
      (this.board[e][t] = this.currentPlayer),
      this.moves.push(n),
      this.checkWin(e, t)
        ? ((this.winner = this.currentPlayer), this.emitMove(n), this.setState("RESULT"), !0)
        : this.moves.length === this.boardSize * this.boardSize
          ? (this.emitMove(n), this.setState("RESULT"), !0)
          : ((this.currentPlayer = this.currentPlayer === "BLACK" ? "WHITE" : "BLACK"),
            this.emitMove(n),
            this.mode === "VS_AI" && this.currentPlayer === this.aiSide && this.makeAIMove(),
            !0)
    );
  }
  async makeAIMove() {
    ((this.isAIThinking = !0),
      this.emitAIThinking(!0),
      setTimeout(() => {
        const e = this.aiSide || "WHITE",
          t = this.ai.getBestMove(this.board, e);
        if (t) {
          const n = { row: t.row, col: t.col, player: e };
          if (((this.board[t.row][t.col] = e), this.moves.push(n), this.checkWin(t.row, t.col))) {
            ((this.winner = e),
              this.emitMove(n),
              this.setState("RESULT"),
              (this.isAIThinking = !1),
              this.emitAIThinking(!1));
            return;
          }
          if (this.moves.length === this.boardSize * this.boardSize) {
            (this.emitMove(n),
              this.setState("RESULT"),
              (this.isAIThinking = !1),
              this.emitAIThinking(!1));
            return;
          }
          ((this.currentPlayer = e === "BLACK" ? "WHITE" : "BLACK"), this.emitMove(n));
        }
        ((this.isAIThinking = !1), this.emitAIThinking(!1));
      }, 500));
  }
  checkWin(e, t) {
    const n = this.board[e][t];
    if (!n) return !1;
    const s = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    for (const { dr: d, dc: o } of s) {
      const r = this.getLine(e, t, d, o, n);
      if (r.length >= 5) return ((this.winningLine = r), !0);
    }
    return !1;
  }
  getLine(e, t, n, s, d) {
    const o = [{ row: e, col: t }];
    for (let r = 1; r < 5; r++) {
      const c = e + n * r,
        a = t + s * r;
      if (c < 0 || c >= this.boardSize || a < 0 || a >= this.boardSize || this.board[c][a] !== d)
        break;
      o.push({ row: c, col: a });
    }
    for (let r = 1; r < 5; r++) {
      const c = e - n * r,
        a = t - s * r;
      if (c < 0 || c >= this.boardSize || a < 0 || a >= this.boardSize || this.board[c][a] !== d)
        break;
      o.unshift({ row: c, col: a });
    }
    return o;
  }
  restart() {
    (this.stopTimer(), this.setState("MENU"));
  }
  startTimer() {
    (this.stopTimer(),
      (this.timerInterval = window.setInterval(() => {
        this.startTime &&
          ((this.elapsedTime = Date.now() - this.startTime), this.emitTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  setState(e) {
    ((this.state = e),
      e !== "PLAYING" && this.stopTimer(),
      this.stateListeners.forEach((t) => t(this.state)));
  }
  getState() {
    return this.state;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getWinner() {
    return this.winner;
  }
  getWinningLine() {
    return this.winningLine;
  }
  getBoard() {
    return this.board;
  }
  getMoves() {
    return [...this.moves];
  }
  isDraw() {
    return this.state === "RESULT" && this.winner === null;
  }
  isAITurn() {
    return this.mode === "VS_AI" && this.currentPlayer === this.aiSide;
  }
  getAIThinking() {
    return this.isAIThinking;
  }
  onStateChange(e) {
    this.stateListeners.push(e);
  }
  onMove(e) {
    this.moveListeners.push(e);
  }
  onBoardChange(e) {
    this.boardListeners.push(e);
  }
  onAIThinking(e) {
    this.aiThinkingListeners.push(e);
  }
  onTimerUpdate(e) {
    this.timerUpdateListeners.push(e);
  }
  emitMove(e) {
    this.moveListeners.forEach((t) => t(e));
  }
  emitBoard() {
    this.boardListeners.forEach((e) => e(this.board));
  }
  emitAIThinking(e) {
    this.aiThinkingListeners.forEach((t) => t(e));
  }
  emitTimerUpdate() {
    this.timerUpdateListeners.forEach((e) => e(this.elapsedTime));
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
}
const l = new x(),
  P = {
    ui: {
      gameTitle: "Gomoku",
      gameSetup: "Game Setup",
      gameMode: "Game Mode",
      twoPlayers: "2 Players",
      vsAI: "vs AI",
      comingSoon: "Coming Soon",
      boardSize: "Board Size",
      startGame: "Start Game",
      newGame: "New Game",
      blackTurn: "Black's Turn",
      whiteTurn: "White's Turn",
      yourTurn: "Your Turn",
      aiTurn: "AI's Turn",
      aiThinking: "AI is thinking...",
      move: "Move",
      gameOver: "Game Over!",
      blackWins: "Black Wins!",
      whiteWins: "White Wins!",
      blackPlayerWins: "Black Player Wins!",
      whitePlayerWins: "White Player Wins!",
      youWin: "You Win!",
      aiWins: "AI Wins!",
      draw: "It's a Draw!",
      boardFull: "The board is full. It's a draw!",
      totalMoves: "Total Moves",
      totalTime: "Total Time",
      playAgain: "Play Again",
      highScores: "High Scores",
      rank: "Rank",
      moves: "Moves",
      time: "Time",
      date: "Date",
      labelSide: "Play As",
      sideBlack: "Black (First)",
      sideWhite: "White (Second)",
    },
  },
  O = {
    ui: {
      gameTitle: "五目並べ",
      gameSetup: "ゲーム設定",
      gameMode: "ゲームモード",
      twoPlayers: "二人対戦",
      vsAI: "AI対戦",
      comingSoon: "近日公開",
      boardSize: "盤面サイズ",
      startGame: "ゲーム開始",
      newGame: "新規ゲーム",
      blackTurn: "黒の番",
      whiteTurn: "白の番",
      yourTurn: "あなたの番",
      aiTurn: "CPUの番",
      aiThinking: "CPUが考え中...",
      move: "手数",
      gameOver: "ゲーム終了！",
      blackWins: "黒の勝ち！",
      whiteWins: "白の勝ち！",
      blackPlayerWins: "黒プレイヤーの勝利！",
      whitePlayerWins: "白プレイヤーの勝利！",
      youWin: "あなたの勝ち！",
      aiWins: "CPUの勝ち！",
      draw: "引き分け！",
      boardFull: "盤面が埋まりました。引き分けです！",
      totalMoves: "合計手数",
      totalTime: "合計時間",
      playAgain: "もう一度プレイ",
      highScores: "ハイスコア",
      rank: "順位",
      moves: "手数",
      time: "時間",
      date: "日付",
      labelSide: "サイド選択",
      sideBlack: "黒 (先攻)",
      sideWhite: "白 (後攻)",
    },
  },
  U = {
    ui: {
      gameTitle: "Cờ ca-rô",
      gameSetup: "Thiết lập trò chơi",
      gameMode: "Chế độ chơi",
      twoPlayers: "2 Người chơi",
      vsAI: "Đấu với AI",
      comingSoon: "Sắp ra mắt",
      boardSize: "Kích thước bàn",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      blackTurn: "Lượt đen",
      whiteTurn: "Lượt trắng",
      yourTurn: "Lượt của bạn",
      aiTurn: "Lượt của máy",
      aiThinking: "Máy đang suy nghĩ...",
      move: "Nước",
      gameOver: "Kết thúc!",
      blackWins: "Đen thắng!",
      whiteWins: "Trắng thắng!",
      blackPlayerWins: "Người chơi đen thắng!",
      whitePlayerWins: "Người chơi trắng thắng!",
      youWin: "Bạn thắng!",
      aiWins: "Máy thắng!",
      draw: "Hòa!",
      boardFull: "Bàn cờ đã đầy. Trận đấu hòa!",
      totalMoves: "Tổng số nước",
      totalTime: "Tổng thời gian",
      playAgain: "Chơi lại",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      moves: "Số nước",
      time: "Thời gian",
      date: "Ngày",
      labelSide: "Chọn quân",
      sideBlack: "Đen (Đi trước)",
      sideWhite: "Trắng (Đi sau)",
    },
  },
  G = {
    ui: {
      gameTitle: "五子棋",
      gameSetup: "游戏设置",
      gameMode: "游戏模式",
      twoPlayers: "双人对战",
      vsAI: "对战AI",
      comingSoon: "即将推出",
      boardSize: "棋盘大小",
      startGame: "开始游戏",
      newGame: "新游戏",
      blackTurn: "黑方回合",
      whiteTurn: "白方回合",
      yourTurn: "您的回合",
      aiTurn: "AI的回合",
      aiThinking: "AI思考中...",
      move: "移动",
      gameOver: "游戏结束！",
      blackWins: "黑方获胜！",
      whiteWins: "白方获胜！",
      blackPlayerWins: "黑方玩家获胜！",
      whitePlayerWins: "白方玩家获胜！",
      youWin: "您获胜！",
      aiWins: "AI获胜！",
      draw: "平局！",
      boardFull: "棋盘已满。平局！",
      totalMoves: "总移动次数",
      totalTime: "总时间",
      playAgain: "再玩一次",
      highScores: "高分榜",
      rank: "排名",
      moves: "移动次数",
      time: "时间",
      date: "日期",
      labelSide: "执棋方",
      sideBlack: "黑方（先手）",
      sideWhite: "白方（后手）",
    },
  },
  N = {
    ui: {
      gameTitle: "غوموكو",
      gameSetup: "إعداد اللعبة",
      gameMode: "وضع اللعبة",
      twoPlayers: "لاعبان",
      vsAI: "ضد الكمبيوتر",
      comingSoon: "قريباً",
      boardSize: "حجم اللوحة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      blackTurn: "دور الأسود",
      whiteTurn: "دور الأبيض",
      yourTurn: "دورك",
      aiTurn: "دور الكمبيوتر",
      aiThinking: "الكمبيوتر يفكر...",
      move: "حركة",
      gameOver: "انتهت اللعبة!",
      blackWins: "الأسود يفوز!",
      whiteWins: "الأبيض يفوز!",
      blackPlayerWins: "اللاعب الأسود يفوز!",
      whitePlayerWins: "اللاعب الأبيض يفوز!",
      youWin: "أنت فزت!",
      aiWins: "الكمبيوتر فاز!",
      draw: "تعادل!",
      boardFull: "اللوحة ممتلئة. تعادل!",
      totalMoves: "إجمالي الحركات",
      totalTime: "الوقت الإجمالي",
      playAgain: "العب مرة أخرى",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      moves: "الحركات",
      time: "الوقت",
      date: "التاريخ",
      labelSide: "العب بـ",
      sideBlack: "الأسود (أولاً)",
      sideWhite: "الأبيض (ثانياً)",
    },
  };
let p = null;
new M();
const K = localStorage.getItem("language"),
  h = new z({ en: P, ja: O, vi: U, zh: G, ar: N }, K || "en"),
  E = () => {
    const i = l.getGameMode(),
      e = document.getElementById("side-section");
    e && (i === "VS_AI" ? e.classList.remove("hidden") : e.classList.add("hidden"));
  },
  H = () => {
    (V(),
      B(),
      document.querySelectorAll(".lang-btn").forEach((i) => {
        i.classList.toggle("active", i.dataset.lang === h.language);
      }),
      $(),
      E());
  },
  q = () => {
    const i = document.querySelector(".mode-btn.active"),
      e = document.querySelector(".size-btn.active");
    if (i && e) {
      const t = {
        mode: i.dataset.mode,
        size: e.dataset.size,
        side: document.querySelector(".side-btn.active")?.dataset.side || "BLACK",
      };
      localStorage.setItem("gomoku_setup", JSON.stringify(t));
    }
  },
  $ = () => {
    try {
      const i = localStorage.getItem("gomoku_setup");
      if (i) {
        const { mode: e, size: t } = JSON.parse(i);
        if (
          (e &&
            document.querySelectorAll(".mode-btn").forEach((n) => {
              n.dataset.mode === e
                ? (n.classList.add("active"), l.setGameMode(e))
                : n.classList.remove("active");
            }),
          t &&
            document.querySelectorAll(".size-btn").forEach((n) => {
              n.dataset.size === t
                ? (n.classList.add("active"), l.setBoardSize(parseInt(t)))
                : n.classList.remove("active");
            }),
          "side" in JSON.parse(i))
        ) {
          const { side: n } = JSON.parse(i);
          n &&
            document.querySelectorAll(".side-btn").forEach((s) => {
              s.dataset.side === n ? s.classList.add("active") : s.classList.remove("active");
            });
        }
        E();
      }
    } catch (i) {
      console.error("Failed to load Gomoku setup:", i);
    }
  },
  B = () => {
    ((document.getElementById("game-title").textContent = h.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = h.getUIText("gameSetup")),
      (document.getElementById("label-mode").textContent = h.getUIText("gameMode")),
      (document.getElementById("mode-two-player").textContent = h.getUIText("twoPlayers")),
      (document.getElementById("mode-vs-ai").textContent = h.getUIText("vsAI")),
      (document.getElementById("label-board-size").textContent = h.getUIText("boardSize")),
      (document.getElementById("label-side").textContent = h.getUIText("labelSide")),
      (document.getElementById("side-black").textContent = h.getUIText("sideBlack")),
      (document.getElementById("side-white").textContent = h.getUIText("sideWhite")),
      (document.getElementById("start-btn").textContent = h.getUIText("startGame")),
      (document.getElementById("label-move").textContent = h.getUIText("move")),
      (document.getElementById("new-game-btn").textContent = h.getUIText("newGame")),
      (document.getElementById("label-total-moves").textContent = h.getUIText("totalMoves")),
      (document.getElementById("restart-btn").textContent = h.getUIText("playAgain")),
      (document.getElementById("label-time").textContent = h.getUIText("time")),
      (document.getElementById("label-total-time").textContent = h.getUIText("totalTime")),
      (document.getElementById("high-scores-title").textContent = h.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = h.getUIText("rank")),
      (document.getElementById("th-moves").textContent = h.getUIText("moves")),
      (document.getElementById("th-time").textContent = h.getUIText("time")),
      (document.getElementById("th-date").textContent = h.getUIText("date")),
      L());
  },
  V = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target.dataset.lang;
          h.setLanguage(t);
        });
      }),
      document.querySelectorAll(".mode-btn:not(.disabled)").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target,
            n = t.dataset.mode;
          (document.querySelectorAll(".mode-btn").forEach((s) => s.classList.remove("active")),
            t.classList.add("active"),
            l.setGameMode(n),
            E());
        });
      }),
      document.querySelectorAll(".side-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target;
          (document.querySelectorAll(".side-btn").forEach((n) => n.classList.remove("active")),
            t.classList.add("active"));
        });
      }),
      document.querySelectorAll(".size-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target,
            n = parseInt(t.dataset.size || "15");
          (document.querySelectorAll(".size-btn").forEach((s) => s.classList.remove("active")),
            t.classList.add("active"),
            l.setBoardSize(n));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        if ((q(), l.getGameMode() === "VS_AI")) {
          const e = document.querySelector(".side-btn.active")?.dataset.side || "BLACK";
          l.setAISide(e === "BLACK" ? "WHITE" : "BLACK");
        } else l.setAISide(null);
        ((p = null), l.start());
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        l.restart();
      }),
      document.getElementById("restart-btn")?.addEventListener("click", () => {
        l.restart();
      }));
  },
  _ = () => {
    const i = document.getElementById("board");
    if (!i) return;
    ((i.innerHTML = ""), i.setAttribute("viewBox", "0 0 600 600"));
    const e = l.getBoardSize(),
      t = 30,
      s = (600 - 2 * t) / (e - 1),
      d = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (d.setAttribute("width", "600"),
      d.setAttribute("height", "600"),
      d.setAttribute("fill", "var(--board-color)"),
      d.setAttribute("rx", "8"),
      i.appendChild(d));
    const o = document.createElementNS("http://www.w3.org/2000/svg", "g");
    (o.setAttribute("stroke", "var(--board-line)"), o.setAttribute("stroke-width", "1.5"));
    for (let S = 0; S < e; S++) {
      const f = t + S * s,
        m = document.createElementNS("http://www.w3.org/2000/svg", "line");
      (m.setAttribute("x1", t.toString()),
        m.setAttribute("y1", f.toString()),
        m.setAttribute("x2", (600 - t).toString()),
        m.setAttribute("y2", f.toString()),
        o.appendChild(m));
      const g = document.createElementNS("http://www.w3.org/2000/svg", "line");
      (g.setAttribute("x1", f.toString()),
        g.setAttribute("y1", t.toString()),
        g.setAttribute("x2", f.toString()),
        g.setAttribute("y2", (600 - t).toString()),
        o.appendChild(g));
    }
    i.appendChild(o);
    let r = [];
    (e === 9
      ? (r = [
          [2, 2],
          [2, 6],
          [4, 4],
          [6, 2],
          [6, 6],
        ])
      : e === 15
        ? (r = [
            [3, 3],
            [3, 11],
            [7, 7],
            [11, 3],
            [11, 11],
          ])
        : (r = [
            [3, 3],
            [3, 9],
            [3, 15],
            [9, 3],
            [9, 9],
            [9, 15],
            [15, 3],
            [15, 9],
            [15, 15],
          ]),
      r.forEach(([S, f]) => {
        const m = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        (m.setAttribute("cx", (t + f * s).toString()),
          m.setAttribute("cy", (t + S * s).toString()),
          m.setAttribute("r", "4"),
          m.setAttribute("fill", "var(--board-line)"),
          i.appendChild(m));
      }));
    const c = document.createElementNS("http://www.w3.org/2000/svg", "g");
    (c.setAttribute("id", "stones-group"), i.appendChild(c));
    const a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    (a.setAttribute("r", (s * 0.42).toString()),
      a.setAttribute("class", "stone-hover"),
      (a.style.opacity = "0"),
      (a.style.pointerEvents = "none"),
      i.appendChild(a));
    const u = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (u.setAttribute("x", "0"),
      u.setAttribute("y", "0"),
      u.setAttribute("width", "600"),
      u.setAttribute("height", "600"),
      u.setAttribute("fill", "transparent"),
      (u.style.cursor = "crosshair"),
      u.addEventListener("mousemove", (S) => {
        if (l.getState() !== "PLAYING") {
          a.style.opacity = "0";
          return;
        }
        const f = i.getBoundingClientRect(),
          m = 600 / f.width,
          g = Math.round(((S.clientX - f.left) * m - t) / s),
          b = Math.round(((S.clientY - f.top) * m - t) / s);
        if (b >= 0 && b < e && g >= 0 && g < e && !l.getBoard()[b][g]) {
          const v = l.getCurrentPlayer();
          (a.setAttribute("cx", (t + g * s).toString()),
            a.setAttribute("cy", (t + b * s).toString()),
            a.setAttribute("class", `stone-hover ${v.toLowerCase()}`),
            (a.style.opacity = "0.4"));
        } else a.style.opacity = "0";
      }),
      u.addEventListener("mouseleave", () => {
        a.style.opacity = "0";
      }),
      u.addEventListener("click", (S) => {
        if ((l.getGameMode() === "VS_AI" && l.isAITurn()) || l.getState() !== "PLAYING") return;
        const f = i.getBoundingClientRect(),
          m = S.clientX - f.left,
          g = S.clientY - f.top,
          b = 600 / f.width,
          v = m * b,
          y = g * b,
          A = Math.round((v - t) / s),
          T = Math.round((y - t) / s);
        T >= 0 && T < e && A >= 0 && A < e && l.makeMove(T, A);
      }),
      i.appendChild(u));
  },
  R = (i) => {
    const e = document.getElementById("board"),
      t = document.getElementById("stones-group");
    if (!e || !t) return;
    const n = l.getBoardSize(),
      s = 30,
      o = (600 - 2 * s) / (n - 1),
      r = o * 0.42,
      c = s + i.col * o,
      a = s + i.row * o,
      u = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    (u.setAttribute("cx", (c + 2).toString()),
      u.setAttribute("cy", (a + 2).toString()),
      u.setAttribute("rx", r.toString()),
      u.setAttribute("ry", (r * 0.9).toString()),
      u.setAttribute("fill", "rgba(0, 0, 0, 0.3)"),
      u.classList.add("stone-animate"),
      t.appendChild(u));
    const S = `grad-${i.player}-${i.row}-${i.col}`,
      f = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
      m = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    if (
      (m.setAttribute("id", S),
      m.setAttribute("cx", "30%"),
      m.setAttribute("cy", "30%"),
      i.player === "BLACK")
    ) {
      const v = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (v.setAttribute("offset", "0%"), v.setAttribute("stop-color", "#4a5568"));
      const y = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (y.setAttribute("offset", "100%"),
        y.setAttribute("stop-color", "#1a202c"),
        m.appendChild(v),
        m.appendChild(y));
    } else {
      const v = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (v.setAttribute("offset", "0%"), v.setAttribute("stop-color", "#ffffff"));
      const y = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (y.setAttribute("offset", "100%"),
        y.setAttribute("stop-color", "#f7fafc"),
        m.appendChild(v),
        m.appendChild(y));
    }
    (f.appendChild(m), e.appendChild(f));
    const g = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    (g.setAttribute("cx", c.toString()),
      g.setAttribute("cy", a.toString()),
      g.setAttribute("r", r.toString()),
      g.setAttribute("fill", `url(#${S})`),
      g.setAttribute("stroke", i.player === "BLACK" ? "#0d131a" : "#e2e8f0"),
      g.setAttribute("stroke-width", "2"),
      g.classList.add("stone-animate"));
    const b = e.querySelector(".last-move");
    (b && b.classList.remove("last-move"), g.classList.add("last-move"), t.appendChild(g));
  },
  L = () => {
    const i = document.querySelector(".turn-indicator"),
      e = document.getElementById("turn-text"),
      t = document.getElementById("move-number"),
      n = l.getCurrentPlayer(),
      s = l.getMoves();
    (i && (i.className = `turn-indicator ${n.toLowerCase()}`),
      e && (e.textContent = n === "BLACK" ? h.getUIText("blackTurn") : h.getUIText("whiteTurn")),
      t && (t.textContent = s.length.toString()));
  },
  I = (i) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const t = document.getElementById(e);
      t && (e === i ? t.classList.remove("hidden") : t.classList.add("hidden"));
    });
  };
l.onStateChange((i) => {
  (i === "MENU" && I("menu-view"),
    i === "PLAYING" && (I("game-view"), _(), L()),
    i === "RESULT" && (I("result-view"), Y(), C()));
});
l.onMove((i) => {
  (R(i), L());
});
l.onTimerUpdate(() => {
  const i = l.getElapsedTime(),
    e = w.formatTime(i),
    t = document.getElementById("game-timer");
  t && (t.textContent = e);
});
const k = () => {
    let i = "BLACK";
    return (
      l.getGameMode() === "VS_AI" && (i = l.getAISide() === "WHITE" ? "BLACK" : "WHITE"),
      `gomoku_highscores_${i}`
    );
  },
  Y = () => {
    if (l.getGameMode() !== "VS_AI") return;
    const i = l.getAISide() === "WHITE" ? "BLACK" : "WHITE";
    if (l.getWinner() !== i) return;
    const e = l.getMoves().length,
      t = l.getElapsedTime(),
      n = Date.now();
    p = n;
    const s = { moves: e, time: t, date: n, boardSize: l.getBoardSize() },
      d = k();
    w.saveHighScore(d, s, (o, r) => (o.moves !== r.moves ? o.moves - r.moves : o.time - r.time));
  },
  C = () => {
    const i = l.getWinner(),
      e = document.getElementById("winner-display"),
      t = document.getElementById("total-moves"),
      n = document.getElementById("total-time");
    if (
      (t && (t.textContent = l.getMoves().length.toString()),
      n && (n.textContent = w.formatTime(l.getElapsedTime())),
      i)
    ) {
      if (e) {
        const s = i === "BLACK" ? h.getUIText("blackPlayerWins") : h.getUIText("whitePlayerWins");
        e.innerHTML = `
        <div class="winner-stone ${i.toLowerCase()}"></div>
        <span>${s}</span>
      `;
      }
    } else e && (e.innerHTML = `<span>${h.getUIText("boardFull")}</span>`);
    D();
  },
  D = () => {
    const i = document.querySelector(".high-scores-container");
    if (l.getGameMode() !== "VS_AI") {
      i && i.classList.add("hidden");
      return;
    }
    i && i.classList.remove("hidden");
    const e = k(),
      t = w.getHighScores(e),
      n = document.getElementById("high-scores-body");
    n &&
      ((n.innerHTML = ""),
      t.forEach((s, d) => {
        const o = document.createElement("tr");
        s.date === p && o.classList.add("current-run");
        const r = w.formatDate(s.date, h.language);
        ((o.innerHTML = `
                <td>${d + 1}</td>
                <td>${s.moves}</td>
                <td>${w.formatTime(s.time)}</td>
                <td>${r}</td>
            `),
          n.appendChild(o));
      }));
  };
h.subscribe((i) => {
  ((document.documentElement.dir = i === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === i);
    }),
    B(),
    l.getState() === "RESULT" && C());
});
H();
