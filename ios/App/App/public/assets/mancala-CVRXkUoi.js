import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as x, u as p, L as b } from "./util-BKt39bz_.js";
class w {
  difficulty;
  maxDepth;
  constructor(e = "MEDIUM") {
    ((this.difficulty = e), (this.maxDepth = this.getMaxDepth(e)));
  }
  getMaxDepth(e) {
    switch (e) {
      case "EASY":
        return 1;
      case "MEDIUM":
        return 7;
    }
  }
  setDifficulty(e) {
    ((this.difficulty = e), (this.maxDepth = this.getMaxDepth(e)));
  }
  getBestMove(e, t, n) {
    const i = this.getValidMoves(e, t, n);
    if (i.length === 0) return -1;
    if (i.length === 1) return i[0];
    if (this.difficulty === "EASY" && Math.random() < 0.3)
      return i[Math.floor(Math.random() * i.length)];
    let o = i[0],
      r = -1 / 0;
    for (const d of i) {
      const l = [...e],
        m = this.simulateMove(l, d, t, n),
        u = this.minimax(l, t, this.maxDepth - 1, -1 / 0, 1 / 0, m ? n : this.getOpponent(n), n);
      u > r && ((r = u), (o = d));
    }
    return o;
  }
  minimax(e, t, n, i, o, r, d) {
    if (n === 0 || this.isGameOver(e, t)) return this.evaluate(e, t, d);
    const l = this.getValidMoves(e, t, r);
    if (l.length === 0) return this.evaluate(e, t, d);
    if (r === d) {
      let m = -1 / 0;
      for (const u of l) {
        const g = [...e],
          h = this.simulateMove(g, u, t, r),
          y = this.minimax(g, t, n - 1, i, o, h ? r : this.getOpponent(r), d);
        if (((m = Math.max(m, y)), (i = Math.max(i, y)), o <= i)) break;
      }
      return m;
    } else {
      let m = 1 / 0;
      for (const u of l) {
        const g = [...e],
          h = this.simulateMove(g, u, t, r),
          y = this.minimax(g, t, n - 1, i, o, h ? r : this.getOpponent(r), d);
        if (((m = Math.min(m, y)), (o = Math.min(o, y)), o <= i)) break;
      }
      return m;
    }
  }
  evaluate(e, t, n) {
    const i = t,
      o = t * 2 + 1,
      r = n === "PLAYER1" ? i : o,
      d = n === "PLAYER1" ? o : i;
    let l = (e[r] - e[d]) * 10;
    const m = n === "PLAYER1" ? 0 : t + 1,
      u = n === "PLAYER1" ? t : t * 2 + 1;
    let g = 0;
    for (let h = m; h < u; h++) g += e[h];
    l += g * 0.5;
    for (let h = m; h < u; h++) {
      const y = e[h];
      y > 0 && (h + y) % e.length === r && (l += 5);
    }
    return l;
  }
  getValidMoves(e, t, n) {
    const i = [];
    if (n === "PLAYER1") for (let o = 0; o < t; o++) e[o] > 0 && i.push(o);
    else for (let o = t + 1; o < t * 2 + 1; o++) e[o] > 0 && i.push(o);
    return i;
  }
  simulateMove(e, t, n, i) {
    const o = e[t];
    e[t] = 0;
    let r = t,
      d = o,
      l = t;
    const m = n,
      u = n * 2 + 1,
      g = i === "PLAYER1" ? u : m;
    for (; d > 0; ) ((r = (r + 1) % e.length), r !== g && (e[r]++, d--, (l = r)));
    const h = i === "PLAYER1" ? m : u;
    if ((i === "PLAYER1" ? l < n : l > n && l < n * 2 + 1) && e[l] === 1 && l !== h) {
      const f = this.getOppositeIndex(l, n),
        S = e[f];
      S > 0 && ((e[h] += e[l] + S), (e[l] = 0), (e[f] = 0));
    }
    return l === h;
  }
  getOppositeIndex(e, t) {
    const n = t,
      i = t * 2 + 1;
    return e < t ? i - 1 - e : n - 1 - (e - t - 1);
  }
  getOpponent(e) {
    return e === "PLAYER1" ? "PLAYER2" : "PLAYER1";
  }
  isGameOver(e, t) {
    const n = e.slice(0, t).reduce((o, r) => o + r, 0),
      i = e.slice(t + 1, t * 2 + 1).reduce((o, r) => o + r, 0);
    return n === 0 || i === 0;
  }
}
class B {
  pitCount = 6;
  initialStones = 4;
  gameMode = "TWO_PLAYER";
  difficulty = "MEDIUM";
  gameState = "MENU";
  currentPlayer = "PLAYER1";
  board = [];
  moveHistory = [];
  winner = null;
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  lastMovePit = null;
  ai;
  aiMoveListeners = [];
  stateChangeListeners = [];
  moveListeners = [];
  boardUpdateListeners = [];
  timerUpdateListeners = [];
  constructor() {
    ((this.ai = new w(this.difficulty)), this.initializeBoard());
  }
  initializeBoard() {
    const e = this.pitCount * 2 + 2;
    this.board = new Array(e).fill(0);
    for (let t = 0; t < this.pitCount; t++)
      ((this.board[t] = this.initialStones),
        (this.board[t + this.pitCount + 1] = this.initialStones));
    ((this.board[this.pitCount] = 0), (this.board[this.pitCount * 2 + 1] = 0));
  }
  setPitCount(e) {
    this.pitCount = e;
  }
  setInitialStones(e) {
    this.initialStones = e;
  }
  getInitialStones() {
    return this.initialStones;
  }
  setGameMode(e) {
    this.gameMode = e;
  }
  setDifficulty(e) {
    ((this.difficulty = e), this.ai.setDifficulty(e));
  }
  getDifficulty() {
    return this.difficulty;
  }
  getPitCount() {
    return this.pitCount;
  }
  getGameMode() {
    return this.gameMode;
  }
  getLastMovePit() {
    return this.lastMovePit;
  }
  start() {
    (this.initializeBoard(),
      (this.currentPlayer = "PLAYER1"),
      (this.moveHistory = []),
      (this.winner = null),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      (this.gameState = "PLAYING"),
      this.notifyStateChange(),
      this.startTimer());
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
  isValidMove(e) {
    if (this.gameState !== "PLAYING") return !1;
    const t = e >= 0 && e < this.pitCount,
      n = e > this.pitCount && e < this.pitCount * 2 + 1;
    return this.currentPlayer === "PLAYER1" ? t && this.board[e] > 0 : n && this.board[e] > 0;
  }
  makeMove(e) {
    if (!this.isValidMove(e)) return !1;
    this.lastMovePit = e;
    const t = this.board[e];
    this.board[e] = 0;
    let n = e,
      i = t,
      o = e;
    const r = this.pitCount,
      d = this.pitCount * 2 + 1,
      l = this.currentPlayer === "PLAYER1" ? d : r;
    for (; i > 0; ) ((n = (n + 1) % this.board.length), n !== l && (this.board[n]++, i--, (o = n)));
    let m = !1,
      u = 0;
    const g = this.currentPlayer === "PLAYER1" ? r : d;
    if (o === g) m = !0;
    else if (
      (this.currentPlayer === "PLAYER1"
        ? o < this.pitCount
        : o > this.pitCount && o < this.pitCount * 2 + 1) &&
      this.board[o] === 1
    ) {
      const f = this.getOppositeIndex(o),
        S = this.board[f];
      S > 0 &&
        ((u = this.board[o] + S), (this.board[g] += u), (this.board[o] = 0), (this.board[f] = 0));
    }
    const h = {
      player: this.currentPlayer,
      pitIndex: e,
      capturedStones: u > 0 ? u : void 0,
      extraTurn: m,
    };
    return (
      this.moveHistory.push(h),
      this.notifyMove(h),
      m || this.switchPlayer(),
      this.checkWinCondition(),
      this.notifyBoardUpdate(),
      this.gameMode === "VS_AI" &&
        this.currentPlayer === "PLAYER2" &&
        this.gameState === "PLAYING" &&
        this.notifyAIMove(),
      !0
    );
  }
  async makeAIMove() {
    if (
      this.gameMode !== "VS_AI" ||
      this.currentPlayer !== "PLAYER2" ||
      this.gameState !== "PLAYING"
    )
      return;
    await new Promise((t) => setTimeout(t, 1e3));
    const e = this.ai.getBestMove(this.getBoard(), this.pitCount, "PLAYER2");
    e !== -1 && this.makeMove(e);
  }
  getOppositeIndex(e) {
    const t = this.pitCount,
      n = this.pitCount * 2 + 1;
    return e < this.pitCount ? n - 1 - e : t - 1 - (e - this.pitCount - 1);
  }
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "PLAYER1" ? "PLAYER2" : "PLAYER1";
  }
  checkWinCondition() {
    const e = this.board.slice(0, this.pitCount).reduce((n, i) => n + i, 0),
      t = this.board.slice(this.pitCount + 1, this.pitCount * 2 + 1).reduce((n, i) => n + i, 0);
    if (e === 0 || t === 0) {
      const n = this.pitCount,
        i = this.pitCount * 2 + 1;
      ((this.board[n] += e), (this.board[i] += t));
      for (let o = 0; o < this.pitCount; o++)
        ((this.board[o] = 0), (this.board[o + this.pitCount + 1] = 0));
      (this.board[n] > this.board[i]
        ? (this.winner = "PLAYER1")
        : this.board[i] > this.board[n]
          ? (this.winner = "PLAYER2")
          : (this.winner = null),
        this.endGame());
    }
  }
  endGame() {
    (this.stopTimer(), (this.gameState = "RESULT"), this.notifyStateChange());
  }
  getBoard() {
    return [...this.board];
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getState() {
    return this.gameState;
  }
  getWinner() {
    return this.winner;
  }
  getMoves() {
    return [...this.moveHistory];
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  getPlayerScore(e) {
    const t = e === "PLAYER1" ? this.pitCount : this.pitCount * 2 + 1;
    return this.board[t];
  }
  onStateChange(e) {
    this.stateChangeListeners.push(e);
  }
  onMove(e) {
    this.moveListeners.push(e);
  }
  onBoardUpdate(e) {
    this.boardUpdateListeners.push(e);
  }
  onAIMove(e) {
    this.aiMoveListeners.push(e);
  }
  onTimerUpdate(e) {
    this.timerUpdateListeners.push(e);
  }
  notifyStateChange() {
    this.stateChangeListeners.forEach((e) => e(this.gameState));
  }
  notifyMove(e) {
    this.moveListeners.forEach((t) => t(e));
  }
  notifyBoardUpdate() {
    this.boardUpdateListeners.forEach((e) => e());
  }
  notifyAIMove() {
    this.aiMoveListeners.forEach((e) => e());
  }
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((e) => e(this.elapsedTime));
  }
}
const a = new B(),
  U = {
    ui: {
      gameTitle: "Mancala",
      gameSetup: "Game Setup",
      gameMode: "Game Mode",
      twoPlayers: "2 Players",
      vsAI: "vs AI",
      comingSoon: "Coming Soon",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      pitCount: "Pits Per Side",
      initialStones: "Stones Per Pit",
      startGame: "Start Game",
      newGame: "New Game",
      player1Turn: "Player 1's Turn",
      player2Turn: "Player 2's Turn",
      you: "You",
      ai: "AI",
      yourTurn: "Your Turn",
      aiTurn: "AI's Turn",
      youWin: "You Win!",
      aiWins: "AI Wins!",
      yourScore: "Your Score",
      aiScore: "AI Score",
      move: "Move",
      time: "Time",
      totalTime: "Total Time",
      totalMoves: "Total Moves",
      player1Wins: "Player 1 Wins!",
      player2Wins: "Player 2 Wins!",
      draw: "It's a Draw!",
      player1Score: "Player 1 Score",
      player2Score: "Player 2 Score",
      playAgain: "Play Again",
      highScores: "High Scores",
      rank: "Rank",
      moves: "Moves",
      date: "Date",
    },
  },
  Y = {
    ui: {
      gameTitle: "マンカラ",
      gameSetup: "ゲーム設定",
      gameMode: "ゲームモード",
      twoPlayers: "二人対戦",
      vsAI: "AI対戦",
      comingSoon: "近日公開",
      difficulty: "難易度",
      easy: "簡単",
      medium: "普通",
      hard: "難しい",
      pitCount: "穴の数",
      initialStones: "穴ごとの石の数",
      startGame: "ゲーム開始",
      newGame: "新規ゲーム",
      player1Turn: "プレイヤー1の番",
      player2Turn: "プレイヤー2の番",
      you: "あなた",
      ai: "AI",
      yourTurn: "あなたの番",
      aiTurn: "AIの番",
      youWin: "あなたの勝利！",
      aiWins: "AIの勝利！",
      yourScore: "あなたのスコア",
      aiScore: "AIスコア",
      move: "手数",
      time: "時間",
      totalTime: "合計時間",
      totalMoves: "合計手数",
      player1Wins: "プレイヤー1の勝利！",
      player2Wins: "プレイヤー2の勝利！",
      draw: "引き分け！",
      player1Score: "プレイヤー1スコア",
      player2Score: "プレイヤー2スコア",
      playAgain: "もう一度",
      highScores: "ハイスコア",
      rank: "順位",
      moves: "手数",
      date: "日付",
    },
  },
  R = {
    ui: {
      gameTitle: "Mancala",
      gameSetup: "Thiết lập trò chơi",
      gameMode: "Chế độ chơi",
      twoPlayers: "2 Người chơi",
      vsAI: "Đấu với AI",
      comingSoon: "Sắp ra mắt",
      difficulty: "Độ khó",
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      pitCount: "Số hố mỗi bên",
      initialStones: "Số đá mỗi hố",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      player1Turn: "Lượt Người chơi 1",
      player2Turn: "Lượt Người chơi 2",
      you: "Bạn",
      ai: "AI",
      yourTurn: "Lượt của bạn",
      aiTurn: "Lượt AI",
      youWin: "Bạn thắng!",
      aiWins: "AI thắng!",
      yourScore: "Điểm của bạn",
      aiScore: "Điểm AI",
      move: "Nước",
      time: "Thời gian",
      totalTime: "Tổng thời gian",
      totalMoves: "Tổng số nước",
      player1Wins: "Người chơi 1 thắng!",
      player2Wins: "Người chơi 2 thắng!",
      draw: "Hòa!",
      player1Score: "Điểm Người chơi 1",
      player2Score: "Điểm Người chơi 2",
      playAgain: "Chơi lại",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      moves: "Nước",
      date: "Ngày",
    },
  },
  G = {
    ui: {
      gameTitle: "播棋",
      gameSetup: "游戏设置",
      gameMode: "游戏模式",
      twoPlayers: "双人对战",
      vsAI: "对战AI",
      comingSoon: "即将推出",
      difficulty: "难度",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      pitCount: "每侧坑数",
      initialStones: "每坑棋子数",
      startGame: "开始游戏",
      newGame: "新游戏",
      player1Turn: "玩家1的回合",
      player2Turn: "玩家2的回合",
      you: "您",
      ai: "AI",
      yourTurn: "您的回合",
      aiTurn: "AI的回合",
      youWin: "您获胜！",
      aiWins: "AI获胜！",
      yourScore: "您的得分",
      aiScore: "AI得分",
      move: "移动",
      time: "时间",
      totalTime: "总时间",
      totalMoves: "总移动次数",
      player1Wins: "玩家1获胜！",
      player2Wins: "玩家2获胜！",
      draw: "平局！",
      player1Score: "玩家1得分",
      player2Score: "玩家2得分",
      playAgain: "再玩一次",
      highScores: "高分榜",
      rank: "排名",
      moves: "移动次数",
      date: "日期",
    },
  },
  W = {
    ui: {
      gameTitle: "منقلة",
      gameSetup: "إعداد اللعبة",
      gameMode: "وضع اللعبة",
      twoPlayers: "لاعبان",
      vsAI: "ضد الكمبيوتر",
      comingSoon: "قريباً",
      difficulty: "الصعوبة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      pitCount: "عدد الحفر لكل جانب",
      initialStones: "الأحجار لكل حفرة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      player1Turn: "دور اللاعب 1",
      player2Turn: "دور اللاعب 2",
      you: "أنت",
      ai: "الكمبيوتر",
      yourTurn: "دورك",
      aiTurn: "دور الكمبيوتر",
      youWin: "أنت فزت!",
      aiWins: "الكمبيوتر فاز!",
      yourScore: "نتيجتك",
      aiScore: "نتيجة الكمبيوتر",
      move: "حركة",
      time: "الوقت",
      totalTime: "الوقت الإجمالي",
      totalMoves: "إجمالي الحركات",
      player1Wins: "اللاعب 1 فاز!",
      player2Wins: "اللاعب 2 فاز!",
      draw: "تعادل!",
      player1Score: "نتيجة اللاعب 1",
      player2Score: "نتيجة اللاعب 2",
      playAgain: "العب مرة أخرى",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      moves: "الحركات",
      date: "التاريخ",
    },
  };
let M = null;
new x();
const k = localStorage.getItem("language"),
  c = new b({ en: U, ja: Y, vi: R, zh: G, ar: W }, k || "en"),
  D = () => {
    (V(),
      L(),
      document.querySelectorAll(".lang-btn").forEach((s) => {
        s.classList.toggle("active", s.dataset.lang === c.language);
      }),
      q());
  },
  N = () => {
    const s = document.querySelector(".mode-btn.active:not([data-difficulty])"),
      e = document.querySelector(".mode-btn.active[data-difficulty]"),
      t = document.querySelector(".pit-btn.active"),
      n = document.querySelector(".stones-btn.active");
    if (s && t && n) {
      const i = {
        mode: s.dataset.mode,
        difficulty: e ? e.dataset.difficulty : "MEDIUM",
        pits: t.dataset.pits,
        stones: n.dataset.stones,
      };
      localStorage.setItem("mancala_setup", JSON.stringify(i));
    }
  },
  q = () => {
    try {
      const s = localStorage.getItem("mancala_setup");
      if (s) {
        const { mode: e, difficulty: t, pits: n, stones: i } = JSON.parse(s);
        (e &&
          document.querySelectorAll(".mode-btn:not(.disabled)").forEach((o) => {
            if (o.dataset.mode === e) {
              (o.classList.add("active"), a.setGameMode(e));
              const d = document.querySelector(".difficulty-section");
              d && (e === "VS_AI" ? d.classList.remove("hidden") : d.classList.add("hidden"));
            } else o.classList.remove("active");
          }),
          n &&
            document.querySelectorAll(".pit-btn").forEach((o) => {
              o.dataset.pits === n
                ? (o.classList.add("active"), a.setPitCount(parseInt(n)))
                : o.classList.remove("active");
            }),
          t &&
            document.querySelectorAll(".mode-btn[data-difficulty]").forEach((o) => {
              o.dataset.difficulty === t
                ? (o.classList.add("active"), a.setDifficulty(t))
                : o.classList.remove("active");
            }),
          i &&
            document.querySelectorAll(".stones-btn").forEach((o) => {
              o.dataset.stones === i
                ? (o.classList.add("active"), a.setInitialStones(parseInt(i)))
                : o.classList.remove("active");
            }));
      }
    } catch (s) {
      console.error("Failed to load Mancala setup:", s);
    }
  },
  L = () => {
    ((document.getElementById("game-title").textContent = c.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = c.getUIText("gameSetup")),
      (document.getElementById("label-mode").textContent = c.getUIText("gameMode")),
      (document.getElementById("mode-two-player").textContent = c.getUIText("twoPlayers")),
      (document.getElementById("mode-vs-ai").textContent = c.getUIText("vsAI")),
      (document.getElementById("label-difficulty").textContent = c.getUIText("difficulty")),
      (document.getElementById("difficulty-easy").textContent = c.getUIText("easy")),
      (document.getElementById("difficulty-medium").textContent = c.getUIText("medium")),
      (document.getElementById("label-pit-count").textContent = c.getUIText("pitCount")),
      (document.getElementById("label-initial-stones").textContent = c.getUIText("initialStones")),
      (document.getElementById("start-btn").textContent = c.getUIText("startGame")),
      (document.getElementById("new-game-btn").textContent = c.getUIText("newGame")),
      (document.getElementById("label-move").textContent = c.getUIText("move")),
      (document.getElementById("label-time").textContent = c.getUIText("time")),
      (document.getElementById("label-total-moves").textContent = c.getUIText("totalMoves")),
      (document.getElementById("label-total-time").textContent = c.getUIText("totalTime")),
      (document.getElementById("restart-btn").textContent = c.getUIText("playAgain")));
    const s = document.getElementById("label-player1-score");
    if (s) {
      const t = a.getGameMode() === "VS_AI";
      s.textContent = t ? c.getUIText("yourScore") : c.getUIText("player1Score");
    }
    const e = document.getElementById("label-player2-score");
    if (e) {
      const t = a.getGameMode() === "VS_AI";
      e.textContent = t ? c.getUIText("aiScore") : c.getUIText("player2Score");
    }
    ((document.getElementById("high-scores-title").textContent = c.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = c.getUIText("rank")),
      (document.getElementById("th-score").textContent = c.getUIText("yourScore")),
      (document.getElementById("th-moves").textContent = c.getUIText("moves")),
      (document.getElementById("th-time").textContent = c.getUIText("time")),
      (document.getElementById("th-date").textContent = c.getUIText("date")),
      v());
  },
  V = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((s) => {
        s.addEventListener("click", (e) => {
          const t = e.target.dataset.lang;
          c.setLanguage(t);
        });
      }),
      document.querySelectorAll(".mode-btn:not([data-difficulty])").forEach((s) => {
        s.addEventListener("click", (e) => {
          const t = e.target,
            n = t.dataset.mode;
          (document
            .querySelectorAll(".mode-btn:not([data-difficulty])")
            .forEach((o) => o.classList.remove("active")),
            t.classList.add("active"),
            a.setGameMode(n));
          const i = document.querySelector(".difficulty-section");
          i && (n === "VS_AI" ? i.classList.remove("hidden") : i.classList.add("hidden"));
        });
      }),
      document.querySelectorAll(".mode-btn[data-difficulty]").forEach((s) => {
        s.addEventListener("click", (e) => {
          const t = e.target,
            n = t.dataset.difficulty;
          (document
            .querySelectorAll(".mode-btn[data-difficulty]")
            .forEach((i) => i.classList.remove("active")),
            t.classList.add("active"),
            a.setDifficulty(n));
        });
      }),
      document.querySelectorAll(".pit-btn").forEach((s) => {
        s.addEventListener("click", (e) => {
          const t = e.target,
            n = parseInt(t.dataset.pits || "6");
          (document.querySelectorAll(".pit-btn").forEach((i) => i.classList.remove("active")),
            t.classList.add("active"),
            a.setPitCount(n));
        });
      }),
      document.querySelectorAll(".stones-btn").forEach((s) => {
        s.addEventListener("click", (e) => {
          const t = e.target,
            n = parseInt(t.dataset.stones || "4");
          (document.querySelectorAll(".stones-btn").forEach((i) => i.classList.remove("active")),
            t.classList.add("active"),
            a.setInitialStones(n));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        (N(), (M = null), a.start());
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        a.restart();
      }),
      document.getElementById("restart-btn")?.addEventListener("click", () => {
        a.restart();
      }));
  },
  T = (s) => {
    if (s === 0) return "";
    if (s <= 16) {
      const t = [];
      for (let n = 0; n < s; n++) t.push('<div class="stone"></div>');
      return `<div class="stones-container small">${t.join("")}</div>`;
    }
    const e = [];
    for (let t = 0; t < 16; t++) e.push('<div class="stone"></div>');
    return `
        <div class="stones-container large">
            ${e.join("")}
            <div class="stone-badge">${s}</div>
        </div>
    `;
  },
  I = () => {
    const s = document.getElementById("board-container");
    if (!s) return;
    s.innerHTML = "";
    const e = a.getPitCount(),
      t = a.getBoard(),
      n = document.createElement("div");
    n.className = "mancala-board";
    const i = document.createElement("div");
    ((i.className = "store player2-store"), (i.innerHTML = T(t[e * 2 + 1])), n.appendChild(i));
    const o = document.createElement("div");
    o.className = "pits-area";
    const r = document.createElement("div");
    r.className = "pit-row player2-pits";
    for (let m = e * 2; m > e; m--) {
      const u = A(t[m], m, "PLAYER2");
      r.appendChild(u);
    }
    o.appendChild(r);
    const d = document.createElement("div");
    d.className = "pit-row player1-pits";
    for (let m = 0; m < e; m++) {
      const u = A(t[m], m, "PLAYER1");
      d.appendChild(u);
    }
    (o.appendChild(d), n.appendChild(o));
    const l = document.createElement("div");
    ((l.className = "store player1-store"),
      (l.innerHTML = T(t[e])),
      n.appendChild(l),
      s.appendChild(n));
  },
  A = (s, e, t) => {
    const n = document.createElement("div");
    return (
      (n.className = "pit"),
      (n.dataset.index = e.toString()),
      (n.dataset.owner = t),
      a.getLastMovePit() === e && n.classList.add("last-move"),
      (n.innerHTML = T(s)),
      n.addEventListener("click", () => {
        _(e);
      }),
      (a.getGameMode() === "VS_AI" ? t === "PLAYER1" && a.isValidMove(e) : a.isValidMove(e)) &&
        n.classList.add("clickable"),
      n
    );
  },
  _ = (s) => {
    (a.getGameMode() === "VS_AI" && a.getCurrentPlayer() === "PLAYER2") ||
      (a.makeMove(s) && (I(), v()));
  },
  v = () => {
    const s = document.querySelector(".turn-indicator"),
      e = document.getElementById("turn-text"),
      t = document.getElementById("move-number"),
      n = document.getElementById("game-timer"),
      i = a.getCurrentPlayer(),
      o = a.getMoves();
    (s && (s.className = `turn-indicator ${i.toLowerCase()}`),
      e &&
        (a.getGameMode() === "VS_AI"
          ? (e.textContent = i === "PLAYER1" ? c.getUIText("yourTurn") : c.getUIText("aiTurn"))
          : (e.textContent =
              i === "PLAYER1" ? c.getUIText("player1Turn") : c.getUIText("player2Turn"))),
      t && (t.textContent = o.length.toString()),
      n && (n.textContent = p.formatTime(a.getElapsedTime())));
  },
  E = (s) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const t = document.getElementById(e);
      t && (e === s ? t.classList.remove("hidden") : t.classList.add("hidden"));
    });
  };
a.onStateChange((s) => {
  (s === "MENU" && E("menu-view"),
    s === "PLAYING" && (E("game-view"), I(), v()),
    s === "RESULT" && (E("result-view"), H(), C()));
});
a.onMove(() => {
  (I(), v());
});
a.onBoardUpdate(() => {
  I();
});
a.onAIMove(() => {
  a.makeAIMove();
});
a.onTimerUpdate(() => {
  v();
});
const P = () => {
    const s = a.getPitCount(),
      e = a.getDifficulty(),
      t = a.getInitialStones();
    return `mancala_highscores_${e}_${s}_${t}`;
  },
  H = () => {
    const s = a.getWinner();
    if (a.getGameMode() !== "VS_AI" || s !== "PLAYER1") return;
    const e = a.getPlayerScore("PLAYER1"),
      t = a.getMoves().length,
      n = a.getElapsedTime(),
      i = Date.now();
    M = i;
    const o = { score: e, moves: t, time: n, date: i },
      r = P();
    p.saveHighScore(r, o, (d, l) =>
      d.score !== l.score
        ? l.score - d.score
        : d.moves !== l.moves
          ? d.moves - l.moves
          : d.time - l.time
    );
  },
  C = () => {
    const s = a.getWinner(),
      e = document.getElementById("winner-display"),
      t = document.getElementById("player1-score"),
      n = document.getElementById("player2-score"),
      i = document.getElementById("total-moves"),
      o = document.getElementById("total-time"),
      r = a.getGameMode() === "VS_AI",
      d = document.getElementById("label-player1-score");
    d && (d.textContent = r ? c.getUIText("yourScore") : c.getUIText("player1Score"));
    const l = document.getElementById("label-player2-score");
    if (
      (l && (l.textContent = r ? c.getUIText("aiScore") : c.getUIText("player2Score")),
      t && (t.textContent = a.getPlayerScore("PLAYER1").toString()),
      n && (n.textContent = a.getPlayerScore("PLAYER2").toString()),
      i && (i.textContent = a.getMoves().length.toString()),
      o && (o.textContent = p.formatTime(a.getElapsedTime())),
      s)
    ) {
      if (e) {
        const u =
          a.getGameMode() === "VS_AI"
            ? s === "PLAYER1"
              ? c.getUIText("youWin")
              : c.getUIText("aiWins")
            : s === "PLAYER1"
              ? c.getUIText("player1Wins")
              : c.getUIText("player2Wins");
        e.innerHTML = `
                <div class="winner-icon ${s.toLowerCase()}">🏆</div>
                <span>${u}</span>
            `;
      }
    } else e && (e.innerHTML = `<span>${c.getUIText("draw")}</span>`);
    O();
  },
  O = () => {
    const s = document.querySelector(".high-scores-container");
    if (a.getGameMode() !== "VS_AI") {
      s && s.classList.add("hidden");
      return;
    }
    s && s.classList.remove("hidden");
    const e = P(),
      t = p.getHighScores(e),
      n = document.getElementById("high-scores-body");
    n &&
      ((n.innerHTML = ""),
      t.forEach((i, o) => {
        const r = document.createElement("tr");
        i.date === M && r.classList.add("current-run");
        const d = p.formatDate(i.date, c.language);
        ((r.innerHTML = `
                <td>${o + 1}</td>
                <td>${i.score}</td>
                <td>${i.moves}</td>
                <td>${p.formatTime(i.time)}</td>
                <td>${d}</td>
            `),
          n.appendChild(r));
      }));
  };
c.subscribe((s) => {
  ((document.documentElement.dir = s === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === s);
    }),
    L(),
    a.getState() === "RESULT" && C());
});
D();
