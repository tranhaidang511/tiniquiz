import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as U, u as b, L as M } from "./util-BKt39bz_.js";
class P {
  game;
  constructor(t) {
    this.game = t;
  }
  getBestMove() {
    const t = this.game.getCurrentPlayer(),
      e = t === "BLACK" ? "WHITE" : "BLACK",
      s = this.game.getBoardSize(),
      n = this.game.getBoard(),
      r = [];
    for (let a = 0; a < s; a++)
      for (let d = 0; d < s; d++) n[a][d] === null && r.push({ row: a, col: d });
    if (r.length === 0) return null;
    r.sort(() => Math.random() - 0.5);
    let o = null,
      c = -1 / 0;
    for (const a of r) {
      let d = this.evaluateMove(a.row, a.col, t, e);
      (this.isSelfAtari(a.row, a.col, t, e) && (d -= 50), d > c && ((c = d), (o = a)));
    }
    return c < -500 ? null : o;
  }
  evaluateMove(t, e, s, n) {
    let r = 0;
    const o = this.getNeighbors(t, e),
      c = this.game.getBoard();
    o.forEach((h) => {
      const p = c[h.row][h.col];
      if (p === n) {
        const f = this.countLiberties(h.row, h.col);
        f === 1 ? (r += 20) : f === 2 && (r += 5);
      } else if (p === s) {
        const f = this.countLiberties(h.row, h.col);
        f === 1 ? (r += 15) : f === 2 && (r += 3);
      }
    });
    const a = this.game.getBoardSize(),
      d = (a - 1) / 2,
      g = Math.abs(t - d) + Math.abs(e - d);
    r += (a - g) * 0.1;
    let m = !1;
    return (
      o.forEach((h) => {
        const p = c[h.row][h.col];
        (p === null && (m = !0),
          p === s && this.countLiberties(h.row, h.col) > 1 && (m = !0),
          p === n && this.countLiberties(h.row, h.col) === 1 && (m = !0));
      }),
      m || (r -= 1e3),
      r
    );
  }
  isSelfAtari(t, e, s, n) {
    const r = this.game.getBoard(),
      o = r[t][e];
    r[t][e] = s;
    const c = this.getNeighbors(t, e);
    let a = !1;
    for (const g of c)
      if (r[g.row][g.col] === n && this.countLiberties(g.row, g.col) === 0) {
        a = !0;
        break;
      }
    const d = this.countLiberties(t, e);
    return ((r[t][e] = o), !a && d === 1);
  }
  countLiberties(t, e) {
    const s = this.game.getBoard(),
      n = s[t][e];
    if (!n) return 0;
    const r = new Set(),
      o = [{ row: t, col: e }],
      c = new Set();
    for (; o.length > 0; ) {
      const a = o.pop(),
        d = `${a.row},${a.col}`;
      if (r.has(d)) continue;
      r.add(d);
      const g = this.getNeighbors(a.row, a.col);
      for (const m of g)
        s[m.row][m.col] === null ? c.add(`${m.row},${m.col}`) : s[m.row][m.col] === n && o.push(m);
    }
    return c.size;
  }
  getNeighbors(t, e) {
    const s = [],
      n = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ],
      r = this.game.getBoardSize();
    return (
      n.forEach(([o, c]) => {
        const a = t + o,
          d = e + c;
        a >= 0 && a < r && d >= 0 && d < r && s.push({ row: a, col: d });
      }),
      s
    );
  }
}
class H {
  board = [];
  size = 19;
  currentPlayer = "BLACK";
  gameState = "MENU";
  history = [];
  boardHistory = [];
  captures = { BLACK: 0, WHITE: 0 };
  passCount = 0;
  mode = "TWO_PLAYER";
  aiPlayer = null;
  komi = 6.5;
  handicap = 0;
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  stateChangeListeners = [];
  moveListeners = [];
  boardUpdateListeners = [];
  timerUpdateListeners = [];
  constructor() {
    this.reset(19);
  }
  reset(t = this.size) {
    ((this.size = t),
      (this.board = Array(t)
        .fill(null)
        .map(() => Array(t).fill(null))),
      (this.currentPlayer = "BLACK"),
      (this.history = []),
      (this.boardHistory = [this.serializeBoard()]),
      (this.captures = { BLACK: 0, WHITE: 0 }),
      (this.passCount = 0),
      (this.elapsedTime = 0),
      this.stopTimer(),
      this.applyHandicap());
  }
  setBoardSize(t) {
    ((this.size = t), this.reset(t));
  }
  getBoardSize() {
    return this.size;
  }
  setGameMode(t) {
    this.mode = t;
  }
  getGameMode() {
    return this.mode;
  }
  setAISide(t) {
    this.aiPlayer = t;
  }
  getAIPlayer() {
    return this.aiPlayer;
  }
  setHandicap(t) {
    this.handicap = t;
  }
  getHandicap() {
    return this.handicap;
  }
  setKomi(t) {
    this.komi = t;
  }
  getKomi() {
    return this.komi;
  }
  start() {
    (this.reset(),
      (this.gameState = "PLAYING"),
      this.startTimer(),
      this.notifyStateChange(),
      this.notifyBoardUpdate(),
      this.mode === "VS_AI" &&
        this.currentPlayer === this.aiPlayer &&
        setTimeout(() => this.makeAIMove(), 500));
  }
  restart() {
    ((this.gameState = "MENU"), this.stopTimer(), this.notifyStateChange());
  }
  placeStone(t, e) {
    if (
      this.gameState !== "PLAYING" ||
      t < 0 ||
      t >= this.size ||
      e < 0 ||
      e >= this.size ||
      this.board[t][e] !== null
    )
      return !1;
    const s = this.currentPlayer,
      n = s === "BLACK" ? "WHITE" : "BLACK";
    this.board[t][e] = s;
    const r = this.findCaptures(t, e, n);
    if (r.length === 0 && !this.hasLiberties(t, e)) return ((this.board[t][e] = null), !1);
    r.forEach((a) => {
      this.board[a.row][a.col] = null;
    });
    const o = this.serializeBoard();
    if (this.boardHistory.includes(o))
      return (
        (this.board[t][e] = null),
        r.forEach((a) => {
          this.board[a.row][a.col] = n;
        }),
        !1
      );
    ((this.captures[s] += r.length), this.boardHistory.push(o));
    const c = { player: s, pos: { row: t, col: e }, captured: r };
    return (
      this.history.push(c),
      (this.passCount = 0),
      (this.currentPlayer = n),
      this.notifyMove(c),
      this.notifyBoardUpdate(),
      this.mode === "VS_AI" &&
        this.currentPlayer === this.aiPlayer &&
        setTimeout(() => this.makeAIMove(), 500),
      !0
    );
  }
  pass() {
    if (this.gameState !== "PLAYING") return !1;
    const t = this.currentPlayer,
      e = t === "BLACK" ? "WHITE" : "BLACK",
      s = { player: t, pos: null, captured: [] };
    return (
      this.history.push(s),
      this.passCount++,
      (this.currentPlayer = e),
      this.notifyMove(s),
      this.notifyBoardUpdate(),
      this.passCount >= 2
        ? this.endGame()
        : this.mode === "VS_AI" &&
          this.currentPlayer === this.aiPlayer &&
          setTimeout(() => this.makeAIMove(), 500),
      !0
    );
  }
  findCaptures(t, e, s) {
    const n = [];
    return (
      this.getNeighbors(t, e).forEach((o) => {
        this.board[o.row][o.col] === s &&
          (this.hasLiberties(o.row, o.col) || n.push(...this.getGroup(o.row, o.col)));
      }),
      n.filter((o, c, a) => a.findIndex((d) => d.row === o.row && d.col === o.col) === c)
    );
  }
  hasLiberties(t, e) {
    const s = this.board[t][e];
    if (!s) return !1;
    const n = new Set(),
      r = [{ row: t, col: e }];
    for (; r.length > 0; ) {
      const o = r.pop(),
        c = `${o.row},${o.col}`;
      if (n.has(c)) continue;
      n.add(c);
      const a = this.getNeighbors(o.row, o.col);
      for (const d of a) {
        if (this.board[d.row][d.col] === null) return !0;
        this.board[d.row][d.col] === s && r.push(d);
      }
    }
    return !1;
  }
  getGroup(t, e) {
    const s = this.board[t][e];
    if (!s) return [];
    const n = [],
      r = new Set(),
      o = [{ row: t, col: e }];
    for (; o.length > 0; ) {
      const c = o.pop(),
        a = `${c.row},${c.col}`;
      if (r.has(a)) continue;
      (r.add(a), n.push(c));
      const d = this.getNeighbors(c.row, c.col);
      for (const g of d) this.board[g.row][g.col] === s && o.push(g);
    }
    return n;
  }
  getNeighbors(t, e) {
    const s = [];
    return (
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].forEach(([r, o]) => {
        const c = t + r,
          a = e + o;
        c >= 0 && c < this.size && a >= 0 && a < this.size && s.push({ row: c, col: a });
      }),
      s
    );
  }
  serializeBoard() {
    return this.board.map((t) =>
      t.map((e) => (e === "BLACK" ? "B" : e === "WHITE" ? "W" : ".")).join("")
    ).join(`
`);
  }
  applyHandicap() {
    if (this.handicap <= 0) return;
    const e =
        {
          9: [
            { row: 2, col: 6 },
            { row: 6, col: 2 },
            { row: 6, col: 6 },
            { row: 2, col: 2 },
            { row: 4, col: 4 },
          ],
          13: [
            { row: 3, col: 9 },
            { row: 9, col: 3 },
            { row: 9, col: 9 },
            { row: 3, col: 3 },
            { row: 6, col: 6 },
            { row: 3, col: 6 },
            { row: 9, col: 6 },
            { row: 6, col: 3 },
            { row: 6, col: 9 },
          ],
          19: [
            { row: 3, col: 15 },
            { row: 15, col: 3 },
            { row: 15, col: 15 },
            { row: 3, col: 3 },
            { row: 9, col: 9 },
            { row: 3, col: 9 },
            { row: 15, col: 9 },
            { row: 9, col: 3 },
            { row: 9, col: 15 },
          ],
        }[this.size] || [],
      s = Math.min(this.handicap, e.length);
    for (let n = 0; n < s; n++) this.board[e[n].row][e[n].col] = "BLACK";
    s > 0 && (this.currentPlayer = "WHITE");
  }
  calculateScore() {
    let t = 0,
      e = this.komi;
    const s = new Set();
    for (let n = 0; n < this.size; n++)
      for (let r = 0; r < this.size; r++) {
        const o = `${n},${r}`;
        if (s.has(o)) continue;
        const c = this.board[n][r];
        if (c === "BLACK") (t++, s.add(o));
        else if (c === "WHITE") (e++, s.add(o));
        else {
          const { cells: a, boundary: d } = this.getTerritory(n, r);
          (a.forEach((g) => s.add(`${g.row},${g.col}`)),
            d.size === 1 && (d.has("BLACK") && (t += a.length), d.has("WHITE") && (e += a.length)));
        }
      }
    return { black: t, white: e };
  }
  getTerritory(t, e) {
    const s = [],
      n = new Set(),
      r = new Set(),
      o = [{ row: t, col: e }];
    for (; o.length > 0; ) {
      const c = o.pop(),
        a = `${c.row},${c.col}`;
      if (r.has(a)) continue;
      (r.add(a), s.push(c));
      const d = this.getNeighbors(c.row, c.col);
      for (const g of d) {
        const m = this.board[g.row][g.col];
        m === null ? o.push(g) : n.add(m);
      }
    }
    return { cells: s, boundary: n };
  }
  endGame() {
    ((this.gameState = "RESULT"), this.stopTimer(), this.notifyStateChange());
  }
  makeAIMove() {
    if (this.gameState !== "PLAYING" || this.currentPlayer !== this.aiPlayer) return;
    const e = new P(this).getBestMove();
    e ? this.placeStone(e.row, e.col) : this.pass();
  }
  getState() {
    return this.gameState;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getBoard() {
    return this.board;
  }
  getMoveCount() {
    return this.history.length;
  }
  getCaptures() {
    return this.captures;
  }
  getLastMove() {
    for (let t = this.history.length - 1; t >= 0; t--)
      if (this.history[t].pos) return this.history[t].pos;
    return null;
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
  startTimer() {
    ((this.startTime = Date.now() - this.elapsedTime),
      (this.timerInterval = window.setInterval(() => {
        ((this.elapsedTime = Date.now() - this.startTime), this.notifyTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
}
const l = new H(),
  W = {
    ui: {
      gameTitle: "Go",
      menuTitle: "Game Setup",
      startGame: "Start Game",
      newGame: "New Game",
      playAgain: "Play Again",
      mainMenu: "Main Menu",
      TWO_PLAYER: "2 Players",
      VS_AI: "Vs AI",
      mode: "Mode",
      difficulty: "Difficulty",
      boardSize: "Board Size",
      handicap: "Handicap",
      komi: "Komi",
      selectSide: "Select Side",
      BLACK: "Black",
      WHITE: "White",
      blackTurn: "Black's Turn",
      whiteTurn: "White's Turn",
      gameOver: "Game Over",
      blackWins: "Black Wins!",
      whiteWins: "White Wins!",
      draw: "Draw!",
      captures: "Captures",
      territory: "Territory",
      totalScore: "Total Score",
      time: "Time",
      moves: "Moves",
      pass: "Pass",
      highScores: "High Scores",
      rank: "Rank",
      score: "Score",
      date: "Date",
      none: "None",
      stones: "{n} Stones",
    },
  },
  K = {
    ui: {
      gameTitle: "囲碁",
      menuTitle: "ゲーム設定",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      playAgain: "もう一度プレイ",
      mainMenu: "メインメニュー",
      TWO_PLAYER: "二人対戦",
      VS_AI: "AI対戦",
      mode: "モード",
      difficulty: "難易度",
      boardSize: "盤面サイズ",
      handicap: "置き石",
      komi: "コミ",
      selectSide: "手番選択",
      BLACK: "黒",
      WHITE: "白",
      blackTurn: "黒の番",
      whiteTurn: "白の番",
      gameOver: "終局",
      blackWins: "黒の勝ち！",
      whiteWins: "白の勝ち！",
      draw: "引き分け！",
      captures: "アゲハマ",
      territory: "地",
      totalScore: "合計スコア",
      time: "時間",
      moves: "手数",
      pass: "パス",
      highScores: "ハイスコア",
      rank: "順位",
      score: "スコア",
      date: "日付",
      none: "なし",
      stones: "{n}子",
    },
  },
  G = {
    ui: {
      gameTitle: "Cờ vây",
      menuTitle: "Thiết lập trò chơi",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      playAgain: "Chơi lại",
      mainMenu: "Menu chính",
      TWO_PLAYER: "2 người chơi",
      VS_AI: "Đấu với AI",
      mode: "Chế độ",
      difficulty: "Độ khó",
      boardSize: "Kích thước bàn cờ",
      handicap: "Chấp quân",
      komi: "Điểm cộng (Komi)",
      selectSide: "Chọn quân",
      BLACK: "Đen",
      WHITE: "Trắng",
      blackTurn: "Lượt đen",
      whiteTurn: "Lượt trắng",
      gameOver: "Trận đấu kết thúc",
      blackWins: "Đen thắng!",
      whiteWins: "Trắng thắng!",
      draw: "Hòa!",
      captures: "Bắt quân",
      territory: "Lãnh thổ",
      totalScore: "Tổng điểm",
      time: "Thời gian",
      moves: "Số nước đi",
      pass: "Bỏ lượt",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      score: "Điểm",
      date: "Ngày",
      none: "Không chấp",
      stones: "{n} quân",
    },
  },
  N = {
    ui: {
      gameTitle: "围棋",
      menuTitle: "游戏设置",
      startGame: "开始游戏",
      newGame: "新游戏",
      playAgain: "再玩一次",
      mainMenu: "主菜单",
      TWO_PLAYER: "双人对战",
      VS_AI: "对战AI",
      mode: "模式",
      difficulty: "难度",
      boardSize: "棋盘大小",
      handicap: "让子",
      komi: "贴目",
      selectSide: "选择执棋方",
      BLACK: "黑方",
      WHITE: "白方",
      blackTurn: "黑方回合",
      whiteTurn: "白方回合",
      gameOver: "游戏结束",
      blackWins: "黑方获胜！",
      whiteWins: "白方获胜！",
      draw: "平局！",
      captures: "提子",
      territory: "地盘",
      totalScore: "总得分",
      time: "时间",
      moves: "手数",
      pass: "虚手",
      highScores: "高分榜",
      rank: "排名",
      score: "得分",
      date: "日期",
      none: "无",
      stones: "{n} 子",
    },
  },
  _ = {
    ui: {
      gameTitle: "غو",
      menuTitle: "إعداد اللعبة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      playAgain: "العب مرة أخرى",
      mainMenu: "القائمة الرئيسية",
      TWO_PLAYER: "لاعبان",
      VS_AI: "ضد الكمبيوتر",
      mode: "الوضع",
      difficulty: "الصعوبة",
      boardSize: "حجم اللوحة",
      handicap: "هانديكاب (Handicap)",
      komi: "كومي (Komi)",
      selectSide: "اختر الجانب",
      BLACK: "الأسود",
      WHITE: "الأبيض",
      blackTurn: "دور الأسود",
      whiteTurn: "دور الأبيض",
      gameOver: "انتهت اللعبة",
      blackWins: "الأسود يفوز!",
      whiteWins: "الأبيض يفوز!",
      draw: "تعادل!",
      captures: "الأسر",
      territory: "الإقليم",
      totalScore: "النتيجة الإجمالية",
      time: "الوقت",
      moves: "الحركات",
      pass: "تجاوز",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      score: "النتيجة",
      date: "التاريخ",
      none: "لا يوجد",
      stones: "{n} أحجار",
    },
  };
let y = null,
  T = null;
new U();
const q = localStorage.getItem("language"),
  u = new M({ en: W, ja: K, vi: G, zh: N, ar: _ }, q || "en");
function L(i) {
  const t = document.getElementById("handicap-select");
  if (!t) return;
  const e = i === 9 ? 5 : 9;
  (t.querySelectorAll("option").forEach((r) => {
    parseInt(r.value) > e ? (r.disabled = !0) : (r.disabled = !1);
  }),
    parseInt(t.value) > e && (t.value = "0"));
}
function $() {
  (R(),
    x(),
    O(),
    document.querySelectorAll(".lang-btn").forEach((t) => {
      t.classList.toggle("active", t.dataset.lang === u.language);
    }));
  const i = document.querySelector(".size-btn.active");
  if (i) {
    const t = parseInt(i.dataset.size || "19");
    L(t);
  }
}
function w(i) {
  (document.querySelectorAll(".card").forEach((t) => t.classList.add("hidden")),
    document.getElementById(i)?.classList.remove("hidden"),
    i === "game-view" ? (C(), B()) : i === "result-view" && A());
}
const V = () => {
    const i = document.querySelector(".mode-btn.active"),
      t = document.querySelector(".size-btn.active"),
      e = document.querySelector(".side-btn.active"),
      s = document.getElementById("handicap-select"),
      n = document.getElementById("komi-select"),
      r = {
        mode: i?.dataset.mode,
        size: t?.dataset.size,
        side: e?.dataset.side,
        handicap: s?.value,
        komi: n?.value,
      };
    localStorage.setItem("go_setup", JSON.stringify(r));
  },
  O = () => {
    try {
      const i = localStorage.getItem("go_setup");
      if (i) {
        const { mode: t, size: e, side: s, handicap: n, komi: r } = JSON.parse(i);
        if (
          (t &&
            (document.querySelectorAll(".mode-btn").forEach((o) => {
              o.classList.toggle("active", o.dataset.mode === t);
            }),
            t === "VS_AI" && document.getElementById("side-section")?.classList.remove("hidden")),
          e &&
            document.querySelectorAll(".size-btn").forEach((o) => {
              o.classList.toggle("active", o.dataset.size === e);
            }),
          s &&
            document.querySelectorAll(".side-btn").forEach((o) => {
              o.classList.toggle("active", o.dataset.side === s);
            }),
          n)
        ) {
          const o = document.getElementById("handicap-select");
          o && (o.value = n);
        }
        if (r) {
          const o = document.getElementById("komi-select");
          o && (o.value = r);
        }
      }
    } catch (i) {
      console.error("Failed to load setup", i);
    }
  };
function C() {
  const i = document.getElementById("board");
  if (!i) return;
  i.innerHTML = "";
  const t = l.getBoardSize(),
    e = 30,
    s = 600 - e * 2,
    n = s / (t - 1);
  for (let m = 0; m < t; m++) {
    const h = e + m * n,
      p = document.createElementNS("http://www.w3.org/2000/svg", "line");
    (p.setAttribute("x1", h.toString()),
      p.setAttribute("y1", e.toString()),
      p.setAttribute("x2", h.toString()),
      p.setAttribute("y2", (e + s).toString()),
      i.appendChild(p));
    const f = document.createElementNS("http://www.w3.org/2000/svg", "line");
    (f.setAttribute("x1", e.toString()),
      f.setAttribute("y1", h.toString()),
      f.setAttribute("x2", (e + s).toString()),
      f.setAttribute("y2", h.toString()),
      i.appendChild(f));
  }
  const o = { 9: [2, 6, 4], 13: [3, 9, 6], 19: [3, 9, 15] }[t] || [];
  o.forEach((m) => {
    o.forEach((h) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      (p.setAttribute("cx", (e + h * n).toString()),
        p.setAttribute("cy", (e + m * n).toString()),
        p.setAttribute("r", "4"),
        p.setAttribute("class", "star-point"),
        i.appendChild(p));
    });
  });
  const c = l.getBoard(),
    a = l.getLastMove(),
    d = n * 0.45;
  for (let m = 0; m < t; m++)
    for (let h = 0; h < t; h++) {
      const p = c[m][h];
      if (p) {
        const f = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        (f.setAttribute("cx", (e + h * n).toString()),
          f.setAttribute("cy", (e + m * n).toString()),
          f.setAttribute("r", d.toString()));
        let S = `stone ${p.toLowerCase()}`;
        (a && a.row === m && a.col === h && (S += " animate last-move"),
          f.setAttribute("class", S),
          i.appendChild(f));
      }
    }
  const g = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  (g.setAttribute("x", "0"),
    g.setAttribute("y", "0"),
    g.setAttribute("width", "600"),
    g.setAttribute("height", "600"),
    g.setAttribute("fill", "transparent"),
    (g.style.cursor = "crosshair"),
    (y = document.createElementNS("http://www.w3.org/2000/svg", "circle")),
    y.setAttribute("r", (n * 0.45).toString()),
    y.setAttribute("class", "stone-hover"),
    (y.style.opacity = "0"),
    (y.style.pointerEvents = "none"),
    i.appendChild(y),
    g.addEventListener("mousemove", (m) => {
      if (l.getState() !== "PLAYING") return;
      const h = i.getBoundingClientRect(),
        p = 600 / h.width,
        f = Math.round(((m.clientX - h.left) * p - e) / n),
        S = Math.round(((m.clientY - h.top) * p - e) / n);
      if (S >= 0 && S < t && f >= 0 && f < t && !l.getBoard()[S][f]) {
        const I = l.getCurrentPlayer();
        (y?.setAttribute("cx", (e + f * n).toString()),
          y?.setAttribute("cy", (e + S * n).toString()),
          y?.setAttribute("class", `stone-hover ${I.toLowerCase()}`),
          y?.style.setProperty("opacity", "0.4"));
      } else y?.style.setProperty("opacity", "0");
    }),
    g.addEventListener("mouseleave", () => {
      y && (y.style.opacity = "0");
    }),
    g.addEventListener("click", (m) => {
      if (l.getGameMode() === "VS_AI" && l.getCurrentPlayer() === l.getAIPlayer()) return;
      const h = i.getBoundingClientRect(),
        p = m.clientX - h.left,
        f = m.clientY - h.top,
        S = 600 / h.width,
        I = p * S,
        z = f * S,
        E = Math.round((I - e) / n),
        v = Math.round((z - e) / n);
      v >= 0 && v < t && E >= 0 && E < t && l.placeStone(v, E);
    }),
    i.appendChild(g));
}
l.onStateChange((i) => {
  i === "MENU"
    ? w("menu-view")
    : i === "PLAYING"
      ? w("game-view")
      : i === "RESULT" && (Y(), w("result-view"));
});
l.onBoardUpdate(() => {
  (C(), B());
});
l.onTimerUpdate((i) => {
  const t = document.getElementById("game-timer");
  t && (t.textContent = b.formatTime(i));
});
function B() {
  const i = l.getCurrentPlayer(),
    t = l.getCaptures(),
    e = document.querySelector(".turn-indicator");
  (e && (e.classList.remove("black", "white"), e.classList.add(i.toLowerCase())),
    (document.getElementById("black-captures").textContent = t.BLACK.toString()),
    (document.getElementById("white-captures").textContent = t.WHITE.toString()),
    (document.getElementById("move-number").textContent = l.getMoveCount().toString()));
  const s = i === "BLACK" ? "blackTurn" : "whiteTurn";
  document.getElementById("turn-text").textContent = u.getUIText(s);
}
function A() {
  const { black: i, white: t } = l.calculateScore(),
    e = i > t ? "BLACK" : t > i ? "WHITE" : null,
    s = document.getElementById("winner-display");
  if (s) {
    let n = "";
    (e === "BLACK"
      ? (n = u.getUIText("blackWins"))
      : e === "WHITE"
        ? (n = u.getUIText("whiteWins"))
        : (n = u.getUIText("draw")),
      (s.innerHTML = `<div>${n}</div>`));
  }
  ((document.getElementById("black-total").textContent = i.toString()),
    (document.getElementById("white-total").textContent = t.toString()),
    (document.getElementById("total-time").textContent = b.formatTime(l.getElapsedTime())),
    (document.getElementById("total-moves").textContent = l.getMoveCount().toString()),
    D());
}
function R() {
  (document.querySelectorAll(".mode-btn").forEach((i) => {
    i.addEventListener("click", (t) => {
      const e = t.target;
      (document.querySelectorAll(".mode-btn").forEach((n) => n.classList.remove("active")),
        e.classList.add("active"));
      const s = e.dataset.mode;
      document.getElementById("side-section")?.classList.toggle("hidden", s !== "VS_AI");
    });
  }),
    document.querySelectorAll(".size-btn").forEach((i) => {
      i.addEventListener("click", (t) => {
        const e = t.target;
        (document.querySelectorAll(".size-btn").forEach((s) => s.classList.remove("active")),
          e.classList.add("active"),
          L(parseInt(e.dataset.size || "19")));
      });
    }),
    document.querySelectorAll(".side-btn").forEach((i) => {
      i.addEventListener("click", (t) => {
        const e = t.target;
        (document.querySelectorAll(".side-btn").forEach((s) => s.classList.remove("active")),
          e.classList.add("active"));
      });
    }),
    document.getElementById("start-btn")?.addEventListener("click", () => {
      const i = document.querySelector(".mode-btn.active"),
        t = document.querySelector(".size-btn.active"),
        e = document.querySelector(".side-btn.active"),
        s = document.getElementById("handicap-select"),
        n = document.getElementById("komi-select"),
        r = i.dataset.mode,
        o = parseInt(t.dataset.size || "19"),
        c = e.dataset.side,
        a = parseInt(s.value || "0"),
        d = parseFloat(n.value || "6.5");
      (l.setGameMode(r),
        l.setBoardSize(o),
        l.setHandicap(a),
        l.setKomi(d),
        r === "VS_AI" ? l.setAISide(c === "BLACK" ? "WHITE" : "BLACK") : l.setAISide(null),
        V(),
        (T = null),
        l.start());
    }),
    document.getElementById("pass-btn")?.addEventListener("click", () => {
      (l.getGameMode() === "VS_AI" && l.getCurrentPlayer() === l.getAIPlayer()) || l.pass();
    }),
    document.getElementById("new-game-btn")?.addEventListener("click", () => l.restart()),
    document.getElementById("restart-btn")?.addEventListener("click", () => l.restart()),
    document
      .getElementById("home-btn")
      ?.addEventListener("click", () => (window.location.href = "../")),
    document.querySelectorAll(".lang-btn").forEach((i) => {
      i.addEventListener("click", (t) => {
        const e = t.target.dataset.lang;
        (u.setLanguage(e), localStorage.setItem("language", e));
      });
    }));
}
function x() {
  ((document.getElementById("game-title").textContent = u.getUIText("gameTitle")),
    (document.getElementById("menu-title").textContent = u.getUIText("menuTitle")),
    (document.getElementById("label-mode").textContent = u.getUIText("mode")),
    (document.getElementById("label-board-size").textContent = u.getUIText("boardSize")),
    (document.getElementById("label-side").textContent = u.getUIText("selectSide")),
    (document.getElementById("label-handicap").textContent = u.getUIText("handicap")),
    (document.getElementById("label-komi").textContent = u.getUIText("komi")),
    (document.getElementById("start-btn").textContent = u.getUIText("startGame")),
    (document.getElementById("mode-two-player").textContent = u.getUIText("TWO_PLAYER")),
    (document.getElementById("mode-vs-ai").textContent = u.getUIText("VS_AI")),
    (document.getElementById("label-time").textContent = u.getUIText("time")),
    (document.getElementById("label-moves").textContent = u.getUIText("moves")),
    (document.getElementById("label-captures").textContent = u.getUIText("captures")),
    (document.getElementById("new-game-btn").textContent = u.getUIText("newGame")),
    (document.getElementById("pass-btn").textContent = u.getUIText("pass")),
    (document.getElementById("result-title").textContent = u.getUIText("gameOver")),
    (document.getElementById("black-score-label").textContent = u.getUIText("BLACK")),
    (document.getElementById("white-score-label").textContent = u.getUIText("WHITE")),
    (document.getElementById("label-total-time").textContent = u.getUIText("time")),
    (document.getElementById("label-total-moves").textContent = u.getUIText("moves")),
    (document.getElementById("restart-btn").textContent = u.getUIText("playAgain")),
    (document.getElementById("high-scores-title").textContent = u.getUIText("highScores")),
    (document.getElementById("th-rank").textContent = u.getUIText("rank")),
    (document.getElementById("th-score").textContent = u.getUIText("score")),
    (document.getElementById("th-moves").textContent = u.getUIText("moves")),
    (document.getElementById("th-time").textContent = u.getUIText("time")),
    (document.getElementById("th-date").textContent = u.getUIText("date")),
    (document.getElementById("side-black").textContent = u.getUIText("BLACK")),
    (document.getElementById("side-white").textContent = u.getUIText("WHITE")));
  const i = document.getElementById("handicap-select");
  (i &&
    Array.from(i.options).forEach((t) => {
      const e = t.value;
      e === "0"
        ? (t.textContent = u.getUIText("none"))
        : (t.textContent = u.getUIText("stones", { n: e }));
    }),
    B(),
    l.getState() === "RESULT" && A());
}
u.subscribe((i) => {
  ((document.documentElement.dir = i === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((t) => {
      t.classList.toggle("active", t.dataset.lang === i);
    }),
    x(),
    l.getState() === "RESULT" && A());
});
function Y() {
  if (l.getGameMode() !== "VS_AI") return;
  const { black: i, white: t } = l.calculateScore(),
    n = {
      score: (l.getAIPlayer() === "BLACK" ? "WHITE" : "BLACK") === "BLACK" ? i : t,
      moves: l.getMoveCount(),
      time: l.getElapsedTime(),
      date: Date.now(),
    };
  T = n.date;
  const r = k();
  b.saveHighScore(r, n, (o, c) =>
    c.score !== o.score
      ? c.score - o.score
      : o.moves !== c.moves
        ? o.moves - c.moves
        : o.time - c.time
  );
}
const k = () => {
  const i = l.getBoardSize(),
    t = l.getAIPlayer() === "BLACK" ? "WHITE" : "BLACK",
    e = l.getHandicap(),
    s = l.getKomi();
  return `go_highscores_${i}_${t}_${e}_${s}`;
};
function D() {
  const i = document.querySelector(".high-scores-container");
  if (l.getGameMode() !== "VS_AI") {
    i && i.classList.add("hidden");
    return;
  }
  i && i.classList.remove("hidden");
  const t = k(),
    e = b.getHighScores(t),
    s = document.getElementById("high-scores-body");
  s &&
    ((s.innerHTML = ""),
    e.forEach((n, r) => {
      const o = document.createElement("tr");
      (n.date === T && o.classList.add("current-run"),
        (o.innerHTML = `
                <td>${r + 1}</td>
                <td>${n.score.toFixed(1)}</td>
                <td>${n.moves}</td>
                <td>${b.formatTime(n.time)}</td>
                <td>${b.formatDate(n.date, u.language)}</td>
            `),
        s.appendChild(o));
    }));
}
$();
