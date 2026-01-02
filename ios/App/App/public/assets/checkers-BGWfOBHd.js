import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as D, u as I, L as R } from "./util-BKt39bz_.js";
class U {
  game;
  maxDepth = 4;
  constructor(e) {
    this.game = e;
  }
  setDifficulty(e) {
    switch (e) {
      case "EASY":
        this.maxDepth = 1;
        break;
      case "MEDIUM":
        this.maxDepth = 7;
        break;
    }
  }
  getBestMove(e, t) {
    const s = this.cloneBoard(e),
      i = this.getAllValidMoves(s, t);
    if (i.length === 0) return null;
    if (i.length === 1) return i[0];
    let o = null,
      r = -1 / 0;
    const m = -1 / 0,
      a = 1 / 0;
    for (const d of i) {
      const l = this.simulateMove(s, d),
        u = this.minimax(l, this.maxDepth - 1, m, a, !1, t);
      u > r && ((r = u), (o = d));
    }
    return o || i[0];
  }
  minimax(e, t, s, i, o, r) {
    const m = r === "BLACK" ? "RED" : "BLACK";
    if (t === 0) return this.evaluateBoard(e, r);
    const a = o ? r : m,
      d = this.getAllValidMoves(e, a);
    if (d.length === 0) return o ? -1e4 : 1e4;
    if (o) {
      let l = -1 / 0;
      for (const u of d) {
        const y = this.simulateMove(e, u),
          g = this.minimax(y, t - 1, s, i, !1, r);
        if (((l = Math.max(l, g)), (s = Math.max(s, g)), i <= s)) break;
      }
      return l;
    } else {
      let l = 1 / 0;
      for (const u of d) {
        const y = this.simulateMove(e, u),
          g = this.minimax(y, t - 1, s, i, !0, r);
        if (((l = Math.min(l, g)), (i = Math.min(i, g)), i <= s)) break;
      }
      return l;
    }
  }
  evaluateBoard(e, t) {
    let s = 0;
    const i = e.length;
    for (let o = 0; o < i; o++)
      for (let r = 0; r < i; r++) {
        const m = e[o][r];
        if (!m) continue;
        let a = 0;
        m.type === "KING"
          ? (a = 50)
          : ((a = 10),
            m.player === "BLACK"
              ? ((a += o), (r === 0 || r === i - 1) && (a += 1))
              : ((a += i - 1 - o), (r === 0 || r === i - 1) && (a += 1)));
        const d = Math.floor(i / 2) - 2,
          l = Math.floor(i / 2) + 2;
        (o >= d && o < l && r >= d && r < l && (a += 2), m.player === t ? (s += a) : (s -= a));
      }
    return s;
  }
  getAllValidMoves(e, t) {
    const s = this.game.getAllPieces(t, e),
      i = [];
    for (const o of s) {
      const r = this.game.calculateValidMoves(o, e);
      i.push(...r);
    }
    return i;
  }
  simulateMove(e, t) {
    const s = this.cloneBoard(e);
    this.game.executeMove(t, s);
    const i = s[t.to.row][t.to.col];
    if (i && i.type !== "KING") {
      const o = s.length;
      ((i.player === "RED" && t.to.row === 0) || (i.player === "BLACK" && t.to.row === o - 1)) &&
        (i.type = "KING");
    }
    return s;
  }
  cloneBoard(e) {
    return e.map((t) => t.map((s) => (s === null ? null : { ...s })));
  }
}
class z {
  boardSize = 8;
  forceJump = !0;
  difficulty = "MEDIUM";
  board = [];
  currentPlayer = "RED";
  gameState = "MENU";
  gameMode = "TWO_PLAYER";
  selectedPiece = null;
  validMoves = [];
  moveHistory = [];
  captureInProgress = !1;
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  winner = null;
  ai;
  aiSide = null;
  isAIThinking = !1;
  stateChangeListeners = [];
  moveListeners = [];
  boardUpdateListeners = [];
  aiThinkingListeners = [];
  timerUpdateListeners = [];
  constructor() {
    ((this.ai = new U(this)), this.initializeBoard());
  }
  initializeBoard() {
    this.board = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null));
    const e = this.boardSize === 8 ? 3 : this.boardSize === 10 ? 4 : 5;
    for (let t = 0; t < e; t++)
      for (let s = 0; s < this.boardSize; s++)
        (t + s) % 2 === 1 &&
          (this.board[t][s] = { player: "BLACK", type: "REGULAR", row: t, col: s });
    for (let t = this.boardSize - e; t < this.boardSize; t++)
      for (let s = 0; s < this.boardSize; s++)
        (t + s) % 2 === 1 &&
          (this.board[t][s] = { player: "RED", type: "REGULAR", row: t, col: s });
  }
  setBoardSize(e) {
    this.boardSize = e;
  }
  setForceJump(e) {
    this.forceJump = e;
  }
  setGameMode(e) {
    this.gameMode = e;
  }
  setDifficulty(e) {
    ((this.difficulty = e), this.ai.setDifficulty(e));
  }
  setAISide(e) {
    this.aiSide = e;
  }
  getAISide() {
    return this.aiSide;
  }
  getForceJump() {
    return this.forceJump;
  }
  getBoardSize() {
    return this.boardSize;
  }
  getGameMode() {
    return this.gameMode;
  }
  getDifficulty() {
    return this.difficulty;
  }
  start() {
    (this.initializeBoard(),
      (this.currentPlayer = "RED"),
      (this.selectedPiece = null),
      (this.validMoves = []),
      (this.moveHistory = []),
      (this.captureInProgress = !1),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      (this.winner = null),
      (this.isAIThinking = !1),
      (this.gameState = "PLAYING"),
      this.notifyStateChange(),
      this.startTimer(),
      this.gameMode === "VS_AI" && this.aiSide === "RED" && this.makeAIMove());
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
  selectPiece(e, t) {
    if (
      this.gameState !== "PLAYING" ||
      this.isAIThinking ||
      (this.gameMode === "VS_AI" && this.currentPlayer === this.aiSide)
    )
      return !1;
    const s = this.board[e][t];
    return !s ||
      s.player !== this.currentPlayer ||
      (this.captureInProgress &&
        this.selectedPiece &&
        (this.selectedPiece.row !== e || this.selectedPiece.col !== t))
      ? !1
      : ((this.selectedPiece = s),
        (this.validMoves = this.calculateValidMoves(s)),
        this.notifyBoardUpdate(),
        !0);
  }
  makeMove(e, t) {
    if (!this.selectedPiece || this.gameState !== "PLAYING" || this.isAIThinking) return !1;
    const s = this.validMoves.find((i) => i.to.row === e && i.to.col === t);
    if (!s) return !1;
    if ((this.executeMove(s), this.checkKingPromotion(e, t), s.captures && s.captures.length > 0)) {
      const i = this.board[e][t];
      if (i) {
        const o = this.getCaptureMoves(i);
        if (o.length > 0)
          return (
            (this.captureInProgress = !0),
            (this.selectedPiece = i),
            (this.validMoves = o),
            this.notifyBoardUpdate(),
            !0
          );
      }
    }
    return (
      (this.captureInProgress = !1),
      (this.selectedPiece = null),
      (this.validMoves = []),
      this.switchPlayer(),
      this.checkWinCondition(),
      s && this.notifyMove(s),
      this.notifyBoardUpdate(),
      this.gameState === "PLAYING" &&
        this.gameMode === "VS_AI" &&
        this.currentPlayer === this.aiSide &&
        this.makeAIMove(),
      !0
    );
  }
  async makeAIMove() {
    ((this.isAIThinking = !0),
      this.notifyAIThinking(!0),
      setTimeout(() => {
        const e = this.aiSide ? this.ai.getBestMove(this.board, this.aiSide) : null;
        e
          ? this.executeAIMoveSequence(e)
          : (this.endGame("RED"), (this.isAIThinking = !1), this.notifyAIThinking(!1));
      }, 500));
  }
  executeAIMoveSequence(e) {
    if (
      (this.executeMove(e),
      this.checkKingPromotion(e.to.row, e.to.col),
      e.captures && e.captures.length > 0)
    ) {
      const t = this.board[e.to.row][e.to.col];
      if (t && this.getCaptureMoves(t).length > 0) {
        setTimeout(() => {
          const i = this.aiSide ? this.ai.getBestMove(this.board, this.aiSide) : null;
          i ? this.executeAIMoveSequence(i) : this.finishAITurn();
        }, 300);
        return;
      }
    }
    this.finishAITurn();
  }
  finishAITurn() {
    if ((this.switchPlayer(), this.checkWinCondition(), this.moveHistory.length > 0)) {
      const e = this.moveHistory[this.moveHistory.length - 1];
      this.notifyMove(e);
    }
    (this.notifyBoardUpdate(), (this.isAIThinking = !1), this.notifyAIThinking(!1));
  }
  executeMove(e, t = this.board) {
    const s = t[e.from.row][e.from.col];
    s &&
      (e.captures &&
        e.captures.forEach((i) => {
          t[i.row][i.col] = null;
        }),
      (t[e.from.row][e.from.col] = null),
      t === this.board && ((s.row = e.to.row), (s.col = e.to.col), this.moveHistory.push(e)),
      (t[e.to.row][e.to.col] = s));
  }
  checkKingPromotion(e, t) {
    const s = this.board[e][t];
    !s ||
      s.type === "KING" ||
      (((s.player === "RED" && e === 0) || (s.player === "BLACK" && e === this.boardSize - 1)) &&
        (s.type = "KING"));
  }
  calculateValidMoves(e, t = this.board) {
    const s = this.getCaptureMoves(e, t);
    if (s.length > 0) return s;
    if (this.forceJump) {
      const i = this.getAllPieces(e.player, t);
      for (const o of i) {
        if (o.row === e.row && o.col === e.col) continue;
        if (this.getCaptureMoves(o, t).length > 0) return [];
      }
    }
    return this.getRegularMoves(e, t);
  }
  getCaptureMoves(e, t = this.board) {
    const s = [],
      i =
        e.type === "KING"
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : e.player === "RED"
            ? [
                [-1, -1],
                [-1, 1],
              ]
            : [
                [1, -1],
                [1, 1],
              ];
    for (const [o, r] of i) this.findCaptures(e, o, r, [], s, t);
    return s;
  }
  findCaptures(e, t, s, i, o, r) {
    const m = e.row + t,
      a = e.col + s,
      d = e.row + 2 * t,
      l = e.col + 2 * s;
    if (d < 0 || d >= this.boardSize || l < 0 || l >= this.boardSize) return;
    const u = r[m][a];
    if (
      !u ||
      u.player === e.player ||
      i.some((f) => f.row === m && f.col === a) ||
      r[d][l] !== null
    )
      return;
    const y = [...i, { row: m, col: a }],
      g = { from: { row: e.row, col: e.col }, to: { row: d, col: l }, captures: y };
    o.push(g);
    const p = { ...e, row: d, col: l },
      v =
        e.type === "KING"
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : e.player === "RED"
            ? [
                [-1, -1],
                [-1, 1],
              ]
            : [
                [1, -1],
                [1, 1],
              ];
    for (const [f, S] of v) this.findMultiCaptures(p, f, S, y, g, o, r);
  }
  findMultiCaptures(e, t, s, i, o, r, m) {
    const a = e.row + t,
      d = e.col + s,
      l = e.row + 2 * t,
      u = e.col + 2 * s;
    if (l < 0 || l >= this.boardSize || u < 0 || u >= this.boardSize) return;
    const y = m[a][d];
    if (
      !y ||
      y.player === e.player ||
      i.some((w) => w.row === a && w.col === d) ||
      m[l][u] !== null
    )
      return;
    const g = [...i, { row: a, col: d }],
      p = r.indexOf(o);
    p > -1 && r.splice(p, 1);
    const v = { from: o.from, to: { row: l, col: u }, captures: g };
    r.push(v);
    const f = { ...e, row: l, col: u },
      S =
        e.type === "KING"
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : e.player === "RED"
            ? [
                [-1, -1],
                [-1, 1],
              ]
            : [
                [1, -1],
                [1, 1],
              ];
    for (const [w, P] of S) this.findMultiCaptures(f, w, P, g, v, r, m);
  }
  getRegularMoves(e, t = this.board) {
    const s = [],
      i =
        e.type === "KING"
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : e.player === "RED"
            ? [
                [-1, -1],
                [-1, 1],
              ]
            : [
                [1, -1],
                [1, 1],
              ];
    for (const [o, r] of i) {
      const m = e.row + o,
        a = e.col + r;
      m >= 0 &&
        m < this.boardSize &&
        a >= 0 &&
        a < this.boardSize &&
        t[m][a] === null &&
        s.push({ from: { row: e.row, col: e.col }, to: { row: m, col: a } });
    }
    return s;
  }
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "RED" ? "BLACK" : "RED";
  }
  checkWinCondition() {
    const e = this.getAllPieces("RED"),
      t = this.getAllPieces("BLACK");
    if (e.length === 0) this.endGame("BLACK");
    else if (t.length === 0) this.endGame("RED");
    else if (!this.currentPlayerHasMoves()) {
      const i = this.currentPlayer === "RED" ? "BLACK" : "RED";
      this.endGame(i);
    }
  }
  currentPlayerHasMoves() {
    const e = this.getAllPieces(this.currentPlayer);
    for (const t of e) if (this.calculateValidMoves(t).length > 0) return !0;
    return !1;
  }
  getAllPieces(e, t = this.board) {
    const s = [];
    for (let i = 0; i < this.boardSize; i++)
      for (let o = 0; o < this.boardSize; o++) {
        const r = t[i][o];
        r && r.player === e && s.push(r);
      }
    return s;
  }
  endGame(e) {
    (this.stopTimer(), (this.gameState = "RESULT"), (this.winner = e), this.notifyStateChange());
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
  getSelectedPiece() {
    return this.selectedPiece;
  }
  getValidMoves() {
    return this.validMoves;
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
  onStateChange(e) {
    this.stateChangeListeners.push(e);
  }
  onMove(e) {
    this.moveListeners.push(e);
  }
  onBoardUpdate(e) {
    this.boardUpdateListeners.push(e);
  }
  onAIThinking(e) {
    this.aiThinkingListeners.push(e);
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
  notifyAIThinking(e) {
    this.aiThinkingListeners.forEach((t) => t(e));
  }
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((e) => e(this.elapsedTime));
  }
}
const c = new z(),
  G = {
    ui: {
      gameTitle: "Checkers",
      gameSetup: "Game Setup",
      startGame: "Start Game",
      newGame: "New Game",
      redTurn: "Red's Turn",
      blackTurn: "Black's Turn",
      redWins: "Red Wins!",
      blackWins: "Black Wins!",
      redPlayerWins: "Red Player Wins!",
      blackPlayerWins: "Black Player Wins!",
      gameOver: "Game Over",
      totalMoves: "Total Moves",
      playAgain: "Play Again",
      time: "Time",
      moves: "Moves",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
      selectPiece: "Select a piece to move",
      mustCapture: "You must capture!",
      invalidMove: "Invalid move",
      boardSize: "Board Size",
      forceJump: "Force Jump (Mandatory Captures)",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      gameMode: "Game Mode",
      twoPlayers: "2 Players",
      vsAI: "vs AI",
      labelSide: "Play As",
      sideRed: "Red (First)",
      sideBlack: "Black (Second)",
    },
  },
  q = {
    ui: {
      gameTitle: "チェッカー",
      gameSetup: "ゲーム設定",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      redTurn: "赤のターン",
      blackTurn: "黒のターン",
      redWins: "赤の勝利！",
      blackWins: "黒の勝利！",
      redPlayerWins: "赤プレイヤーの勝利！",
      blackPlayerWins: "黒プレイヤーの勝利！",
      gameOver: "ゲーム終了",
      totalMoves: "合計手数",
      playAgain: "もう一度プレイ",
      time: "時間",
      moves: "手数",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
      selectPiece: "駒を選択してください",
      mustCapture: "取る必要があります！",
      invalidMove: "無効な移動",
      boardSize: "ボードサイズ",
      forceJump: "強制ジャンプ (必須)",
      difficulty: "難易度",
      easy: "簡単",
      medium: "普通",
      hard: "難しい",
      gameMode: "ゲームモード",
      twoPlayers: "二人対戦",
      vsAI: "AI対戦",
      labelSide: "サイド選択",
      sideRed: "赤 (先攻)",
      sideBlack: "黒 (後攻)",
    },
  },
  N = {
    ui: {
      gameTitle: "Cờ đam",
      gameSetup: "Thiết lập trò chơi",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      redTurn: "Lượt đỏ",
      blackTurn: "Lượt đen",
      redWins: "Đỏ thắng!",
      blackWins: "Đen thắng!",
      redPlayerWins: "Người chơi đỏ thắng!",
      blackPlayerWins: "Người chơi đen thắng!",
      gameOver: "Trò chơi kết thúc",
      totalMoves: "Tổng số nước",
      playAgain: "Chơi lại",
      time: "Thời gian",
      moves: "Số nước",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
      selectPiece: "Chọn quân cờ để di chuyển",
      mustCapture: "Bạn phải ăn quân!",
      invalidMove: "Nước đi không hợp lệ",
      boardSize: "Kích thước bàn cờ",
      forceJump: "Bắt buộc nhảy (Bắt quân)",
      difficulty: "Độ khó",
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      gameMode: "Chế độ chơi",
      twoPlayers: "2 Người chơi",
      vsAI: "Đấu với AI",
      labelSide: "Chọn quân",
      sideRed: "Đỏ (Đi trước)",
      sideBlack: "Đen (Đi sau)",
    },
  },
  W = {
    ui: {
      gameTitle: "跳棋",
      gameSetup: "游戏设置",
      startGame: "开始游戏",
      newGame: "新游戏",
      redTurn: "红方回合",
      blackTurn: "黑方回合",
      redWins: "红方获胜！",
      blackWins: "黑方获胜！",
      redPlayerWins: "红方玩家获胜！",
      blackPlayerWins: "黑方玩家获胜！",
      gameOver: "游戏结束",
      totalMoves: "总移动次数",
      playAgain: "再玩一次",
      time: "时间",
      moves: "移动次数",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
      selectPiece: "选择要移动的棋子",
      mustCapture: "您必须吃子！",
      invalidMove: "无效移动",
      boardSize: "棋盘大小",
      forceJump: "强制跳跃（必须吃子）",
      difficulty: "难度",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      gameMode: "游戏模式",
      twoPlayers: "双人对战",
      vsAI: "对战AI",
      labelSide: "执棋方",
      sideRed: "红方（先手）",
      sideBlack: "黑方（后手）",
    },
  },
  K = {
    ui: {
      gameTitle: "الداما",
      gameSetup: "إعداد اللعبة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      redTurn: "دور الأحمر",
      blackTurn: "دور الأسود",
      redWins: "الأحمر يفوز!",
      blackWins: "الأسود يفوز!",
      redPlayerWins: "اللاعب الأحمر يفوز!",
      blackPlayerWins: "اللاعب الأسود يفوز!",
      gameOver: "انتهت اللعبة",
      totalMoves: "إجمالي الحركات",
      playAgain: "العب مرة أخرى",
      time: "الوقت",
      moves: "الحركات",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
      selectPiece: "اختر قطعة لتحريكها",
      mustCapture: "يجب عليك الأسر!",
      invalidMove: "حركة غير صالحة",
      boardSize: "حجم اللوحة",
      forceJump: "قفز إجباري (أسر إلزامي)",
      difficulty: "الصعوبة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      gameMode: "وضع اللعبة",
      twoPlayers: "لاعبان",
      vsAI: "ضد الكمبيوتر",
      labelSide: "العب بـ",
      sideRed: "الأحمر (أولاً)",
      sideBlack: "الأسود (ثانياً)",
    },
  };
let E = null;
new D();
const J = localStorage.getItem("language"),
  h = new R({ en: G, ja: q, vi: N, zh: W, ar: K }, J || "en"),
  V = () => {
    (_(),
      B(),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.classList.toggle("active", n.dataset.lang === h.language);
      }),
      H());
  },
  $ = () => {
    const n = document.querySelector(".mode-btn.active"),
      e = document.querySelector(".size-btn.active"),
      t = document.getElementById("force-jump");
    if (n && e && t) {
      const s = {
        mode: n.dataset.mode,
        size: e?.dataset.size || "8",
        forceJump: t.checked,
        difficulty:
          document.querySelector(".difficulty-btn.active")?.dataset.difficulty || "MEDIUM",
        side: document.querySelector(".side-btn.active")?.dataset.side || "RED",
      };
      localStorage.setItem("checkers_setup", JSON.stringify(s));
    }
  },
  H = () => {
    try {
      const n = localStorage.getItem("checkers_setup");
      if (n) {
        const { mode: e, size: t, forceJump: s, difficulty: i } = JSON.parse(n);
        if (
          (e &&
            document.querySelectorAll(".mode-btn").forEach((o) => {
              o.dataset.mode === e
                ? (o.classList.add("active"), c.setGameMode(e))
                : o.classList.remove("active");
            }),
          t &&
            document.querySelectorAll(".size-btn").forEach((o) => {
              o.dataset.size === t
                ? (o.classList.add("active"), c.setBoardSize(parseInt(t)))
                : o.classList.remove("active");
            }),
          s !== void 0)
        ) {
          const o = document.getElementById("force-jump");
          o && ((o.checked = s), c.setForceJump(s));
        }
        if (
          (i &&
            document.querySelectorAll(".difficulty-btn").forEach((o) => {
              o.dataset.difficulty === i ? o.classList.add("active") : o.classList.remove("active");
            }),
          "side" in JSON.parse(n))
        ) {
          const { side: o } = JSON.parse(n);
          o &&
            document.querySelectorAll(".side-btn").forEach((r) => {
              r.dataset.side === o ? r.classList.add("active") : r.classList.remove("active");
            });
        }
      }
    } catch (n) {
      console.error("Failed to load Checkers setup:", n);
    }
  },
  B = () => {
    ((document.getElementById("game-title").textContent = h.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = h.getUIText("gameSetup")),
      (document.getElementById("label-mode").textContent = h.getUIText("gameMode")),
      (document.getElementById("mode-two-player").textContent = h.getUIText("twoPlayers")),
      (document.getElementById("mode-vs-ai").textContent = h.getUIText("vsAI")),
      (document.getElementById("start-btn").textContent = h.getUIText("startGame")),
      (document.getElementById("new-game-btn").textContent = h.getUIText("newGame")),
      (document.getElementById("label-time").textContent = h.getUIText("time")),
      (document.getElementById("label-moves").textContent = h.getUIText("moves")),
      (document.getElementById("label-total-time").textContent = h.getUIText("time")),
      (document.getElementById("label-total-moves").textContent = h.getUIText("totalMoves")),
      (document.getElementById("restart-btn").textContent = h.getUIText("playAgain")),
      (document.getElementById("high-scores-title").textContent = h.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = h.getUIText("rank")),
      (document.getElementById("th-moves").textContent = h.getUIText("moves")),
      (document.getElementById("th-time").textContent = h.getUIText("time")),
      (document.getElementById("th-date").textContent = h.getUIText("date")),
      (document.getElementById("label-board-size").textContent = h.getUIText("boardSize")),
      (document.getElementById("label-force-jump").textContent = h.getUIText("forceJump")),
      (document.getElementById("label-difficulty").textContent = h.getUIText("difficulty")),
      (document.getElementById("diff-easy").textContent = h.getUIText("easy")),
      (document.getElementById("diff-medium").textContent = h.getUIText("medium")),
      (document.getElementById("label-side").textContent = h.getUIText("labelSide")),
      (document.getElementById("side-red").textContent = h.getUIText("sideRed")),
      (document.getElementById("side-black").textContent = h.getUIText("sideBlack")),
      M());
  },
  _ = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target.dataset.lang;
          h.setLanguage(t);
        });
      }),
      document.querySelectorAll(".mode-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target,
            s = t.dataset.mode;
          (document.querySelectorAll(".mode-btn").forEach((i) => i.classList.remove("active")),
            t.classList.add("active"),
            c.setGameMode(s),
            L(s));
        });
      }),
      document.querySelectorAll(".difficulty-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target;
          (document
            .querySelectorAll(".difficulty-btn")
            .forEach((s) => s.classList.remove("active")),
            t.classList.add("active"));
        });
      }),
      document.querySelectorAll(".side-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target;
          (document.querySelectorAll(".side-btn").forEach((s) => s.classList.remove("active")),
            t.classList.add("active"));
        });
      }),
      document.querySelectorAll(".size-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target;
          (document.querySelectorAll(".size-btn").forEach((s) => s.classList.remove("active")),
            t.classList.add("active"));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        $();
        const n = document.querySelector(".size-btn.active"),
          e = parseInt(n?.dataset.size || "8"),
          s = document.getElementById("force-jump")?.checked ?? !0;
        (c.setBoardSize(e), c.setForceJump(s));
        const o = document.querySelector(".difficulty-btn.active")?.dataset.difficulty || "MEDIUM";
        c.setDifficulty(o);
        const r = document.querySelector(".mode-btn.active");
        if (r && r.dataset.mode === "VS_AI") {
          const a = document.querySelector(".side-btn.active")?.dataset.side || "RED";
          c.setAISide(a === "RED" ? "BLACK" : "RED");
        } else c.setAISide(null);
        ((E = null), c.start());
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        c.restart();
      }),
      document.getElementById("restart-btn")?.addEventListener("click", () => {
        c.restart();
      }));
  },
  A = () => {
    const n = document.getElementById("board");
    if (!n) return;
    n.innerHTML = "";
    const e = c.getBoardSize(),
      s = 600 / e,
      i = c.getGameMode() === "VS_AI" && c.getAISide() === "RED",
      o = (a, d) => (i ? { row: e - 1 - a, col: e - 1 - d } : { row: a, col: d });
    for (let a = 0; a < e; a++)
      for (let d = 0; d < e; d++) {
        const l = o(a, d),
          u = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        (u.setAttribute("x", (l.col * s).toString()),
          u.setAttribute("y", (l.row * s).toString()),
          u.setAttribute("width", s.toString()),
          u.setAttribute("height", s.toString()));
        const y = (a + d) % 2 === 0;
        (u.classList.add("board-square"),
          u.classList.add(y ? "light" : "dark"),
          (u.dataset.row = a.toString()),
          (u.dataset.col = d.toString()),
          n.appendChild(u));
      }
    const r = c.getMoves();
    if (r.length > 0) {
      const a = r[r.length - 1];
      [a.from, a.to].forEach((l) => {
        const u = n.querySelector(`rect[data-row="${l.row}"][data-col="${l.col}"]`);
        u && u.classList.add("last-move");
      });
    }
    const m = c.getBoard();
    for (let a = 0; a < e; a++)
      for (let d = 0; d < e; d++) {
        const l = m[a][d];
        l && O(n, l, s, i, e);
      }
    (Y(i, e), (n.onclick = (a) => j(a)));
  },
  O = (n, e, t, s, i) => {
    const o = t * 0.37;
    let r = e.row,
      m = e.col;
    s && ((r = i - 1 - e.row), (m = i - 1 - e.col));
    const a = m * t + t / 2,
      d = r * t + t / 2,
      l = document.createElementNS("http://www.w3.org/2000/svg", "g");
    (l.classList.add("piece"),
      (l.dataset.row = e.row.toString()),
      (l.dataset.col = e.col.toString()));
    const u = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    (u.setAttribute("cx", (a + 2).toString()),
      u.setAttribute("cy", (d + 2).toString()),
      u.setAttribute("r", o.toString()),
      u.setAttribute("fill", "rgba(0, 0, 0, 0.3)"),
      l.appendChild(u));
    const y = `grad-${e.player}-${e.row}-${e.col}`,
      g = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
      p = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    if (
      (p.setAttribute("id", y),
      p.setAttribute("cx", "30%"),
      p.setAttribute("cy", "30%"),
      e.player === "RED")
    ) {
      const f = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (f.setAttribute("offset", "0%"), f.setAttribute("stop-color", "#ef4444"));
      const S = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (S.setAttribute("offset", "100%"),
        S.setAttribute("stop-color", "#dc2626"),
        p.appendChild(f),
        p.appendChild(S));
    } else {
      const f = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (f.setAttribute("offset", "0%"), f.setAttribute("stop-color", "#4b5563"));
      const S = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      (S.setAttribute("offset", "100%"),
        S.setAttribute("stop-color", "#1f2937"),
        p.appendChild(f),
        p.appendChild(S));
    }
    (g.appendChild(p), n.appendChild(g));
    const v = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    if (
      (v.setAttribute("cx", a.toString()),
      v.setAttribute("cy", d.toString()),
      v.setAttribute("r", o.toString()),
      v.setAttribute("fill", `url(#${y})`),
      v.setAttribute("stroke", e.player === "RED" ? "#b91c1c" : "#111827"),
      v.setAttribute("stroke-width", "2"),
      l.appendChild(v),
      e.type === "KING")
    ) {
      const f = document.createElementNS("http://www.w3.org/2000/svg", "text");
      (f.setAttribute("x", a.toString()),
        f.setAttribute("y", (d + t * 0.08).toString()),
        f.setAttribute("text-anchor", "middle"),
        f.setAttribute("font-size", (t * 0.32).toString()),
        f.setAttribute("fill", "#fbbf24"),
        (f.textContent = "♔"),
        l.appendChild(f));
    }
    n.appendChild(l);
  },
  Y = (n, e) => {
    const t = document.getElementById("board");
    if (!t) return;
    const s = c.getSelectedPiece(),
      i = c.getValidMoves();
    (t.querySelectorAll(".board-square").forEach((o) => {
      o.classList.remove("selected", "valid-move");
    }),
      t.querySelectorAll(".piece").forEach((o) => {
        o.classList.remove("selected");
      }),
      t.querySelectorAll(".move-indicator").forEach((o) => o.remove()),
      s &&
        (t
          .querySelector(`.piece[data-row="${s.row}"][data-col="${s.col}"]`)
          ?.classList.add("selected"),
        t
          .querySelector(`.board-square[data-row="${s.row}"][data-col="${s.col}"]`)
          ?.classList.add("selected")),
      i.forEach((o) => {
        t.querySelector(
          `.board-square[data-row="${o.to.row}"][data-col="${o.to.col}"]`
        )?.classList.add("valid-move");
        const a = 600 / e;
        let d = o.to.row,
          l = o.to.col;
        n && ((d = e - 1 - o.to.row), (l = e - 1 - o.to.col));
        const u = l * a + a / 2,
          y = d * a + a / 2,
          g = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        (g.classList.add("move-indicator"),
          g.setAttribute("cx", u.toString()),
          g.setAttribute("cy", y.toString()),
          g.setAttribute("r", (a * 0.16).toString()),
          g.setAttribute("fill", o.captures && o.captures.length > 0 ? "#ef4444" : "#81b64c"),
          g.setAttribute("opacity", "0.8"),
          (g.style.pointerEvents = "none"),
          t.appendChild(g));
      }));
  },
  j = (n) => {
    if (c.getGameMode() === "VS_AI" && c.getCurrentPlayer() === c.getAISide()) return;
    const e = n.target,
      t = e.closest(".board-square"),
      s = e.closest(".piece");
    if (s) {
      const i = parseInt(s.dataset.row || "-1"),
        o = parseInt(s.dataset.col || "-1");
      i !== -1 && o !== -1 && T(i, o);
    } else if (t) {
      const i = parseInt(t.dataset.row || "-1"),
        o = parseInt(t.dataset.col || "-1");
      i !== -1 && o !== -1 && F(i, o);
    }
  },
  F = (n, e) => {
    c.getBoard()[n][e] ? T(n, e) : c.makeMove(n, e);
  },
  T = (n, e) => {
    c.selectPiece(n, e);
  },
  M = () => {
    const n = document.querySelector(".turn-indicator"),
      e = document.getElementById("turn-text"),
      t = document.getElementById("move-number"),
      s = c.getCurrentPlayer(),
      i = c.getMoves();
    (n && (n.className = `turn-indicator ${s.toLowerCase()}`),
      e && (e.textContent = s === "RED" ? h.getUIText("redTurn") : h.getUIText("blackTurn")),
      t && (t.textContent = i.length.toString()));
  },
  b = (n) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const t = document.getElementById(e);
      t && (e === n ? t.classList.remove("hidden") : t.classList.add("hidden"));
    });
  };
c.onStateChange((n) => {
  (n === "MENU" && b("menu-view"),
    n === "PLAYING" && (b("game-view"), A(), M()),
    n === "RESULT" && (b("result-view"), Q(), k()));
});
c.onMove(() => {
  (A(), M());
});
c.onBoardUpdate(() => {
  A();
});
c.onTimerUpdate(() => {
  const n = c.getElapsedTime(),
    e = I.formatTime(n),
    t = document.getElementById("game-timer");
  t && (t.textContent = e);
});
c.onAIThinking((n) => {
  const e = document.getElementById("board");
  e &&
    (n
      ? ((e.style.cursor = "wait"), (e.style.opacity = "0.8"))
      : ((e.style.cursor = "pointer"), (e.style.opacity = "1")));
});
const x = () => {
    const n = c.getBoardSize(),
      e = c.getForceJump(),
      t = c.getDifficulty(),
      s = c.getAISide() === "RED" ? "BLACK" : "RED";
    return `checkers_highscores_${t}_${n}_${s}_${e}`;
  },
  Q = () => {
    const n = c.getWinner();
    if (!n) return;
    const e = c.getAISide() === "RED" ? "BLACK" : "RED";
    if (c.getGameMode() === "VS_AI") {
      if (n !== e) return;
    } else return;
    const t = c.getMoves().length,
      s = c.getElapsedTime(),
      i = Date.now();
    E = i;
    const o = { moves: t, time: s, date: i },
      r = x();
    I.saveHighScore(r, o, (m, a) => (m.moves !== a.moves ? m.moves - a.moves : m.time - a.time));
  },
  k = () => {
    const n = c.getWinner(),
      e = document.getElementById("winner-display"),
      t = document.getElementById("total-moves"),
      s = document.getElementById("total-time");
    if (
      (t && (t.textContent = c.getMoves().length.toString()),
      s && (s.textContent = I.formatTime(c.getElapsedTime())),
      n && e)
    ) {
      const i = n === "RED" ? h.getUIText("redPlayerWins") : h.getUIText("blackPlayerWins");
      e.innerHTML = `
                <div class="winner-stone ${n.toLowerCase()}"></div>
                <span>${i}</span>
            `;
    }
    X();
  },
  X = () => {
    const n = document.querySelector(".high-scores-container");
    if (c.getGameMode() !== "VS_AI") {
      n && n.classList.add("hidden");
      return;
    }
    n && n.classList.remove("hidden");
    const e = x(),
      t = I.getHighScores(e),
      s = document.getElementById("high-scores-body");
    s &&
      ((s.innerHTML = ""),
      t.forEach((i, o) => {
        const r = document.createElement("tr");
        i.date === E && r.classList.add("current-run");
        const m = I.formatDate(i.date, h.language);
        ((r.innerHTML = `
                <td>${o + 1}</td>
                <td>${i.moves}</td>
                <td>${I.formatTime(i.time)}</td>
                <td>${m}</td>
            `),
          s.appendChild(r));
      }));
  };
h.subscribe((n) => {
  ((document.documentElement.dir = n === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === n);
    }),
    B(),
    c.getState() === "RESULT" && k());
});
const L = (n) => {
  const e = document.getElementById("difficulty-section"),
    t = document.getElementById("side-section");
  e &&
    t &&
    (n === "VS_AI"
      ? (e.classList.remove("hidden"), t.classList.remove("hidden"))
      : (e.classList.add("hidden"), t.classList.add("hidden")));
};
V();
const C = document.querySelector(".mode-btn.active");
C && L(C.dataset.mode);
