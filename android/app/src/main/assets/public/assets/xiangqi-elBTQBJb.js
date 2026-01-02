import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as B, L as D, u as g } from "./util-BKt39bz_.js";
class R {
  game;
  searchDepth = 3;
  constructor(e) {
    this.game = e;
  }
  getBestMove() {
    const e = this.getAllValidMoves(this.game.getCurrentPlayer());
    if (e.length === 0) return null;
    let t = null,
      n = -1 / 0;
    const i = -1 / 0,
      a = 1 / 0;
    e.sort(() => Math.random() - 0.5);
    for (const r of e) {
      this.game.makeMove(r.from.row, r.from.col, r.to.row, r.to.col, !0);
      const o = -this.minimax(this.searchDepth - 1, -a, -i);
      (this.game.undoLastMove(), o > n && ((n = o), (t = r)));
    }
    return t;
  }
  minimax(e, t, n) {
    if (e === 0 || this.game.isGameOver()) return this.evaluate();
    const i = this.getAllValidMoves(this.game.getCurrentPlayer());
    if (i.length === 0) return -1e4;
    let a = -1 / 0;
    for (const r of i) {
      this.game.makeMove(r.from.row, r.from.col, r.to.row, r.to.col, !0);
      const o = -this.minimax(e - 1, -n, -t);
      if ((this.game.undoLastMove(), o > a && (a = o), a > t && (t = a), t >= n)) break;
    }
    return a;
  }
  getAllValidMoves(e) {
    const t = [],
      n = this.game.board;
    for (let i = 0; i < 10; i++)
      for (let a = 0; a < 9; a++) {
        const r = n[i][a];
        if (r && r.player === e)
          for (let o = 0; o < 10; o++)
            for (let l = 0; l < 9; l++)
              this.game.isValidMove(i, a, o, l) &&
                t.push({
                  from: { row: i, col: a },
                  to: { row: o, col: l },
                  captured: n[o][l] || void 0,
                });
      }
    return t;
  }
  evaluate() {
    const e = this.game.board;
    let t = 0;
    const n = {
        GENERAL: 1e4,
        ADVISOR: 20,
        ELEPHANT: 20,
        HORSE: 40,
        CANNON: 45,
        CHARIOT: 90,
        SOLDIER: 10,
      },
      i = this.game.getCurrentPlayer();
    for (let a = 0; a < 10; a++)
      for (let r = 0; r < 9; r++) {
        const o = e[a][r];
        if (o) {
          let l = n[o.type];
          (o.type === "SOLDIER" &&
            (o.player === "RED" && a < 5 && (l += 10), o.player === "BLACK" && a > 4 && (l += 10)),
            o.player === i ? (t += l) : (t -= l));
        }
      }
    return t;
  }
}
class w {
  board;
  turn;
  gameState;
  winner;
  history;
  mode = "TWO_PLAYER";
  aiPlayer = "BLACK";
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  selectedPiece = null;
  validMoves = [];
  lastMove = null;
  stateChangeListeners = [];
  moveListeners = [];
  boardUpdateListeners = [];
  timerUpdateListeners = [];
  constructor() {
    ((this.board = this.createBoard()),
      (this.turn = "RED"),
      (this.gameState = "MENU"),
      (this.winner = null),
      (this.history = []));
  }
  setGameMode(e) {
    this.mode = e;
  }
  getGameMode() {
    return this.mode;
  }
  setAIPlayer(e) {
    this.aiPlayer = e;
  }
  getAIPlayer() {
    return this.aiPlayer;
  }
  start() {
    (this.reset(),
      (this.gameState = "PLAYING"),
      this.startTimer(),
      this.notifyStateChange(),
      this.notifyBoardUpdate(),
      this.mode === "VS_AI" && this.aiPlayer === "RED" && setTimeout(() => this.makeAIMove(), 500));
  }
  restart() {
    (this.stopTimer(), (this.gameState = "MENU"), this.notifyStateChange());
  }
  selectPiece(e, t) {
    if (this.gameState !== "PLAYING" && this.gameState !== "CHECK") return !1;
    if (this.selectedPiece && this.validMoves.some((i) => i.row === e && i.col === t))
      return this.makeMove(this.selectedPiece.row, this.selectedPiece.col, e, t);
    const n = this.getPiece(e, t);
    if (!n || n.player !== this.turn)
      return ((this.selectedPiece = null), (this.validMoves = []), this.notifyBoardUpdate(), !1);
    ((this.selectedPiece = n), (this.validMoves = []));
    for (let i = 0; i < 10; i++)
      for (let a = 0; a < 9; a++)
        this.isValidMove(n.row, n.col, i, a) && this.validMoves.push({ row: i, col: a });
    return (this.notifyBoardUpdate(), !0);
  }
  createBoard() {
    return Array(10)
      .fill(null)
      .map(() => Array(9).fill(null));
  }
  reset() {
    ((this.board = this.createBoard()),
      (this.turn = "RED"),
      (this.gameState = "MENU"),
      (this.winner = null),
      (this.history = []),
      (this.lastMove = null),
      (this.selectedPiece = null),
      (this.validMoves = []),
      this.setupBoard());
  }
  setupBoard() {
    const e = (t, n, i, a) => {
      this.board[t][n] = { type: i, player: a, row: t, col: n };
    };
    (e(0, 0, "CHARIOT", "BLACK"),
      e(0, 1, "HORSE", "BLACK"),
      e(0, 2, "ELEPHANT", "BLACK"),
      e(0, 3, "ADVISOR", "BLACK"),
      e(0, 4, "GENERAL", "BLACK"),
      e(0, 5, "ADVISOR", "BLACK"),
      e(0, 6, "ELEPHANT", "BLACK"),
      e(0, 7, "HORSE", "BLACK"),
      e(0, 8, "CHARIOT", "BLACK"),
      e(2, 1, "CANNON", "BLACK"),
      e(2, 7, "CANNON", "BLACK"),
      e(3, 0, "SOLDIER", "BLACK"),
      e(3, 2, "SOLDIER", "BLACK"),
      e(3, 4, "SOLDIER", "BLACK"),
      e(3, 6, "SOLDIER", "BLACK"),
      e(3, 8, "SOLDIER", "BLACK"),
      e(9, 0, "CHARIOT", "RED"),
      e(9, 1, "HORSE", "RED"),
      e(9, 2, "ELEPHANT", "RED"),
      e(9, 3, "ADVISOR", "RED"),
      e(9, 4, "GENERAL", "RED"),
      e(9, 5, "ADVISOR", "RED"),
      e(9, 6, "ELEPHANT", "RED"),
      e(9, 7, "HORSE", "RED"),
      e(9, 8, "CHARIOT", "RED"),
      e(7, 1, "CANNON", "RED"),
      e(7, 7, "CANNON", "RED"),
      e(6, 0, "SOLDIER", "RED"),
      e(6, 2, "SOLDIER", "RED"),
      e(6, 4, "SOLDIER", "RED"),
      e(6, 6, "SOLDIER", "RED"),
      e(6, 8, "SOLDIER", "RED"));
  }
  getPiece(e, t) {
    return e < 0 || e > 9 || t < 0 || t > 8 ? null : this.board[e][t];
  }
  makeMove(e, t, n, i, a = !1) {
    const r = this.board[e][t];
    if (!r || !this.isValidMove(e, t, n, i)) return !1;
    const o = this.board[n][i];
    ((this.board[n][i] = { ...r, row: n, col: i }), (this.board[e][t] = null));
    const l = { from: { row: e, col: t }, to: { row: n, col: i }, captured: o || void 0 };
    return (
      this.history.push(l),
      (this.lastMove = l),
      a || ((this.selectedPiece = null), (this.validMoves = [])),
      (this.turn = this.turn === "RED" ? "BLACK" : "RED"),
      this.updateGameState(a),
      a ||
        (this.notifyMove(l),
        this.notifyBoardUpdate(),
        this.mode === "VS_AI" &&
          this.turn === this.aiPlayer &&
          !this.isGameOver() &&
          setTimeout(() => this.makeAIMove(), 500)),
      !0
    );
  }
  isInPalace(e, t, n) {
    return t < 3 || t > 5 ? !1 : n === "BLACK" ? e >= 0 && e <= 2 : e >= 7 && e <= 9;
  }
  hasCrossedRiver(e, t) {
    return t === "RED" ? e < 5 : t === "BLACK" ? e > 4 : !1;
  }
  isValidMove(e, t, n, i) {
    if (
      e < 0 ||
      e > 9 ||
      t < 0 ||
      t > 8 ||
      n < 0 ||
      n > 9 ||
      i < 0 ||
      i > 8 ||
      (e === n && t === i)
    )
      return !1;
    const a = this.board[e][t];
    if (!a || a.player !== this.turn) return !1;
    const r = this.board[n][i];
    if (r && r.player === a.player) return !1;
    let o = !1;
    switch (a.type) {
      case "GENERAL":
        o = this.validateGeneralMove(e, t, n, i, a.player);
        break;
      case "ADVISOR":
        o = this.validateAdvisorMove(e, t, n, i, a.player);
        break;
      case "ELEPHANT":
        o = this.validateElephantMove(e, t, n, i, a.player);
        break;
      case "HORSE":
        o = this.validateHorseMove(e, t, n, i);
        break;
      case "CHARIOT":
        o = this.validateChariotMove(e, t, n, i);
        break;
      case "CANNON":
        o = this.validateCannonMove(e, t, n, i, r !== null);
        break;
      case "SOLDIER":
        o = this.validateSoldierMove(e, t, n, i, a.player);
        break;
    }
    return !(
      !o ||
      this.causesFlyingGeneral(e, t, n, i) ||
      this.leavesKingInCheck(e, t, n, i, a.player)
    );
  }
  validateGeneralMove(e, t, n, i, a) {
    return this.isInPalace(n, i, a) ? Math.abs(n - e) + Math.abs(i - t) === 1 : !1;
  }
  validateAdvisorMove(e, t, n, i, a) {
    return this.isInPalace(n, i, a) ? Math.abs(n - e) === 1 && Math.abs(i - t) === 1 : !1;
  }
  validateElephantMove(e, t, n, i, a) {
    return !(
      this.hasCrossedRiver(n, a) ||
      Math.abs(n - e) !== 2 ||
      Math.abs(i - t) !== 2 ||
      this.board[(e + n) / 2][(t + i) / 2] !== null
    );
  }
  validateHorseMove(e, t, n, i) {
    const a = Math.abs(n - e),
      r = Math.abs(i - t);
    return (a === 2 && r === 1) || (a === 1 && r === 2)
      ? a === 2
        ? this.board[e + (n > e ? 1 : -1)][t] === null
        : this.board[e][t + (i > t ? 1 : -1)] === null
      : !1;
  }
  validateChariotMove(e, t, n, i) {
    return e !== n && t !== i ? !1 : this.countPiecesBetween(e, t, n, i) === 0;
  }
  validateCannonMove(e, t, n, i, a) {
    if (e !== n && t !== i) return !1;
    const r = this.countPiecesBetween(e, t, n, i);
    return a ? r === 1 : r === 0;
  }
  validateSoldierMove(e, t, n, i, a) {
    const r = n - e,
      o = Math.abs(i - t),
      l = a === "RED" ? -1 : 1;
    return this.hasCrossedRiver(e, a)
      ? (r === l && o === 0) || (r === 0 && o === 1)
      : r === l && o === 0;
  }
  countPiecesBetween(e, t, n, i) {
    let a = 0;
    if (e === n) {
      const r = Math.min(t, i),
        o = Math.max(t, i);
      for (let l = r + 1; l < o; l++) this.board[e][l] !== null && a++;
    } else {
      const r = Math.min(e, n),
        o = Math.max(e, n);
      for (let l = r + 1; l < o; l++) this.board[l][t] !== null && a++;
    }
    return a;
  }
  findGeneral(e) {
    for (let t = 0; t < 10; t++)
      for (let n = 0; n < 9; n++) {
        const i = this.board[t][n];
        if (i && i.type === "GENERAL" && i.player === e) return { row: t, col: n };
      }
    return null;
  }
  causesFlyingGeneral(e, t, n, i) {
    const a = this.board[e][t],
      r = this.board[n][i];
    ((this.board[n][i] = { ...a, row: n, col: i }), (this.board[e][t] = null));
    const o = this.findGeneral("RED"),
      l = this.findGeneral("BLACK");
    let m = !1;
    return (
      o &&
        l &&
        o.col === l.col &&
        this.countPiecesBetween(o.row, o.col, l.row, l.col) === 0 &&
        (m = !0),
      (this.board[e][t] = a),
      (this.board[n][i] = r),
      m
    );
  }
  leavesKingInCheck(e, t, n, i, a) {
    const r = this.board[e][t],
      o = this.board[n][i];
    ((this.board[n][i] = { ...r, row: n, col: i }), (this.board[e][t] = null));
    const l = this.isChecked(a);
    return ((this.board[e][t] = r), (this.board[n][i] = o), l);
  }
  isChecked(e) {
    const t = this.findGeneral(e);
    if (!t) return !0;
    const n = e === "RED" ? "BLACK" : "RED";
    for (let i = 0; i < 10; i++)
      for (let a = 0; a < 9; a++) {
        const r = this.board[i][a];
        if (r && r.player === n) {
          let o = !1;
          switch (r.type) {
            case "GENERAL":
              o = this.validateGeneralMove(i, a, t.row, t.col, n);
              break;
            case "ADVISOR":
              o = this.validateAdvisorMove(i, a, t.row, t.col, n);
              break;
            case "ELEPHANT":
              o = this.validateElephantMove(i, a, t.row, t.col, n);
              break;
            case "HORSE":
              o = this.validateHorseMove(i, a, t.row, t.col);
              break;
            case "CHARIOT":
              o = this.validateChariotMove(i, a, t.row, t.col);
              break;
            case "CANNON":
              o = this.validateCannonMove(i, a, t.row, t.col, !0);
              break;
            case "SOLDIER":
              o = this.validateSoldierMove(i, a, t.row, t.col, n);
              break;
          }
          if (o) return !0;
        }
      }
    return !1;
  }
  updateGameState(e = !1) {
    (this.isNoMoves(this.turn)
      ? ((this.gameState = "CHECKMATE"),
        (this.winner = this.turn === "RED" ? "BLACK" : "RED"),
        (this.finalGameState = "CHECKMATE"),
        e ||
          (this.stopTimer(),
          setTimeout(() => {
            ((this.gameState = "RESULT"), this.notifyStateChange());
          }, 2e3)))
      : this.isChecked(this.turn)
        ? (this.gameState = "CHECK")
        : (this.gameState = "PLAYING"),
      e || this.notifyStateChange());
  }
  finalGameState = null;
  isNoMoves(e) {
    for (let t = 0; t < 10; t++)
      for (let n = 0; n < 9; n++) {
        const i = this.board[t][n];
        if (i && i.player === e)
          for (let a = 0; a < 10; a++)
            for (let r = 0; r < 9; r++) {
              const o = this.turn;
              this.turn = e;
              const l = this.isValidMove(t, n, a, r);
              if (((this.turn = o), l)) return !1;
            }
      }
    return !0;
  }
  isGameOver() {
    return (
      this.gameState === "CHECKMATE" ||
      this.gameState === "STALEMATE" ||
      this.gameState === "RESULT"
    );
  }
  undoLastMove() {
    if (this.history.length === 0) return !1;
    const e = this.history.pop();
    if (!e) return !1;
    const t = this.board[e.to.row][e.to.col];
    return (
      t &&
        ((this.board[e.from.row][e.from.col] = { ...t, row: e.from.row, col: e.from.col }),
        (this.board[e.to.row][e.to.col] = e.captured
          ? { ...e.captured, row: e.to.row, col: e.to.col }
          : null)),
      (this.turn = this.turn === "RED" ? "BLACK" : "RED"),
      (this.gameState = "PLAYING"),
      (this.winner = null),
      !0
    );
  }
  makeAIMove() {
    if (this.mode === "VS_AI" && this.turn === this.aiPlayer && !this.isGameOver()) {
      const t = new R(this).getBestMove();
      t && this.makeMove(t.from.row, t.from.col, t.to.row, t.to.col);
    }
  }
  startTimer() {
    ((this.startTime = Date.now()),
      (this.elapsedTime = 0),
      (this.timerInterval = window.setInterval(() => {
        ((this.elapsedTime = Date.now() - this.startTime), this.notifyTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), (this.timerInterval = null));
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
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((e) => e(this.elapsedTime));
  }
  getState() {
    return this.gameState;
  }
  getCurrentPlayer() {
    return this.turn;
  }
  getBoard() {
    return this.board;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  getMoveCount() {
    return this.history.length;
  }
  getWinner() {
    return this.winner;
  }
  getFinalGameState() {
    return this.finalGameState;
  }
  getLastMove() {
    return this.lastMove;
  }
  getSelectedPiece() {
    return this.selectedPiece;
  }
  getValidMovesForSelected() {
    return this.validMoves;
  }
}
const c = new w(),
  k = {
    ui: {
      gameTitle: "Xiangqi",
      menuTitle: "Game Setup",
      startGame: "Start Game",
      newGame: "New Game",
      redTurn: "Red's Turn",
      blackTurn: "Black's Turn",
      time: "Time",
      moves: "Moves",
      totalTime: "Time",
      totalMoves: "Total Moves",
      check: "Check!",
      checkmate: "Checkmate!",
      gameOver: "Game Over",
      redWins: "Red Wins!",
      blackWins: "Black Wins!",
      draw: "Draw!",
      playAgain: "Play Again",
      labelMode: "Game Mode",
      TWO_PLAYER: "2 Players",
      VS_AI: "vs AI",
      labelDifficulty: "Difficulty",
      EASY: "Easy",
      MEDIUM: "Medium",
      HARD: "Hard",
      labelSide: "Play As",
      RED: "Red",
      BLACK: "Black",
      aiThinking: "AI is thinking...",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
    },
  },
  x = {
    ui: {
      gameTitle: "シャンチー",
      menuTitle: "ゲーム設定",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      redTurn: "紅の手番",
      blackTurn: "黒の手番",
      time: "時間",
      moves: "手数",
      totalTime: "時間",
      totalMoves: "総手数",
      check: "王手！",
      checkmate: "詰み！",
      gameOver: "ゲーム終了",
      redWins: "紅の勝利！",
      blackWins: "黒の勝利！",
      draw: "引き分け",
      playAgain: "もう一度プレイ",
      labelMode: "ゲームモード",
      TWO_PLAYER: "2人対戦",
      VS_AI: "AI対戦",
      labelDifficulty: "難易度",
      EASY: "簡単",
      MEDIUM: "普通",
      HARD: "難しい",
      labelSide: "プレイヤー",
      RED: "紅 (赤)",
      BLACK: "黒",
      aiThinking: "AI思考中...",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
    },
  },
  P = {
    ui: {
      gameTitle: "Cờ tướng",
      menuTitle: "Thiết lập trò chơi",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      redTurn: "Lượt đỏ",
      blackTurn: "Lượt đen",
      time: "Thời gian",
      moves: "Số nước",
      totalTime: "Thời gian",
      totalMoves: "Tổng số nước",
      check: "Chiếu!",
      checkmate: "Chiếu hết!",
      gameOver: "Kết thúc",
      redWins: "Đỏ thắng!",
      blackWins: "Đen thắng!",
      draw: "Hòa",
      playAgain: "Chơi lại",
      labelMode: "Chế độ chơi",
      TWO_PLAYER: "2 Người chơi",
      VS_AI: "Đấu với AI",
      labelDifficulty: "Độ khó",
      EASY: "Dễ",
      MEDIUM: "Thường",
      HARD: "Khó",
      labelSide: "Chọn bên",
      RED: "Đỏ",
      BLACK: "Đen",
      aiThinking: "AI đang suy nghĩ...",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
    },
  },
  O = {
    ui: {
      gameTitle: "象棋",
      menuTitle: "游戏设置",
      startGame: "开始游戏",
      newGame: "新游戏",
      redTurn: "红方回合",
      blackTurn: "黑方回合",
      time: "时间",
      moves: "移动次数",
      totalTime: "时间",
      totalMoves: "总移动次数",
      check: "将军！",
      checkmate: "将死！",
      gameOver: "游戏结束",
      redWins: "红方获胜！",
      blackWins: "黑方获胜！",
      draw: "平局！",
      playAgain: "再玩一次",
      labelMode: "游戏模式",
      TWO_PLAYER: "双人对战",
      VS_AI: "对战AI",
      labelDifficulty: "难度",
      EASY: "简单",
      MEDIUM: "中等",
      HARD: "困难",
      labelSide: "执棋方",
      RED: "红方",
      BLACK: "黑方",
      aiThinking: "AI思考中...",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
    },
  },
  G = {
    ui: {
      gameTitle: "سيانغ تشي",
      menuTitle: "إعداد اللعبة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      redTurn: "دور الأحمر",
      blackTurn: "دور الأسود",
      time: "الوقت",
      moves: "الحركات",
      totalTime: "الوقت",
      totalMoves: "إجمالي الحركات",
      check: "كش!",
      checkmate: "كش مات!",
      gameOver: "انتهت اللعبة",
      redWins: "الأحمر يفوز!",
      blackWins: "الأسود يفوز!",
      draw: "تعادل!",
      playAgain: "العب مرة أخرى",
      labelMode: "وضع اللعبة",
      TWO_PLAYER: "لاعبان",
      VS_AI: "ضد الكمبيوتر",
      labelDifficulty: "الصعوبة",
      EASY: "سهل",
      MEDIUM: "متوسط",
      HARD: "صعب",
      labelSide: "العب بـ",
      RED: "الأحمر",
      BLACK: "الأسود",
      aiThinking: "الكمبيوتر يفكر...",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
    },
  };
let b = null;
const u = 50,
  d = 25,
  f = 9,
  S = 10,
  M = d * 2 + (f - 1) * u,
  y = d * 2 + (S - 1) * u;
new B();
const N = localStorage.getItem("language"),
  h = new D({ en: k, ja: x, vi: P, zh: O, ar: G }, N || "en");
h.subscribe((s) => {
  ((document.documentElement.dir = s === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === s);
    }),
    X(),
    c.getState() === "RESULT" && p());
});
function H() {
  (U(), $(), h.setLanguage(h.language), v("menu-view"));
}
function v(s) {
  (["menu-view", "game-view", "result-view"].forEach((e) => {
    const t = document.getElementById(e);
    t && t.classList.toggle("hidden", e !== s);
  }),
    s === "game-view" ? (T(), L()) : s === "result-view" && p());
}
function U() {
  (document.querySelectorAll(".lang-btn").forEach((t) => {
    t.addEventListener("click", (n) => {
      const i = n.target.dataset.lang;
      if (i) {
        (h.setLanguage(i), localStorage.setItem("language", i));
        const a = c.getState();
        (a === "PLAYING" || a === "CHECK") && L();
      }
    });
  }),
    document.querySelectorAll(".mode-btn").forEach((t) => {
      t.addEventListener("click", () => {
        const n = t.dataset.mode;
        (c.setGameMode(n), I());
      });
    }),
    document.querySelectorAll(".side-btn").forEach((t) => {
      t.addEventListener("click", () => {
        const n = t.dataset.side;
        (c.setAIPlayer(n === "RED" ? "BLACK" : "RED"), I());
      });
    }),
    document.getElementById("start-btn")?.addEventListener("click", () => {
      (K(), (b = null), c.start());
    }),
    document.getElementById("board")?.addEventListener("click", F),
    document.getElementById("restart-btn")?.addEventListener("click", () => {
      c.restart();
    }),
    document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
    document.getElementById("new-game-btn")?.addEventListener("click", () => {
      c.restart();
    }));
}
c.onStateChange((s) => {
  s === "MENU"
    ? v("menu-view")
    : s === "PLAYING" || s === "CHECK" || s === "CHECKMATE" || s === "STALEMATE"
      ? v("game-view")
      : s === "RESULT" && (z(), v("result-view"));
});
c.onTimerUpdate(() => {
  const s = document.getElementById("game-timer");
  s && (s.textContent = g.formatTime(c.getElapsedTime()));
});
c.onMove(() => {
  (T(), L());
});
c.onBoardUpdate(() => {
  T();
});
function K() {
  const s = { mode: c.getGameMode(), aiPlayer: c.getAIPlayer() };
  localStorage.setItem("xiangqi_setup", JSON.stringify(s));
}
function $() {
  try {
    const s = localStorage.getItem("xiangqi_setup");
    if (s) {
      const { mode: e, aiPlayer: t } = JSON.parse(s);
      (e && c.setGameMode(e), t && c.setAIPlayer(t), I());
    }
  } catch (s) {
    console.error("Failed to load setup", s);
  }
}
function I() {
  const s = c.getGameMode(),
    t = c.getAIPlayer() === "RED" ? "BLACK" : "RED";
  (document.querySelectorAll(".mode-btn").forEach((i) => {
    const a = i.dataset.mode;
    i.classList.toggle("active", a === s);
  }),
    document.querySelectorAll(".side-btn").forEach((i) => {
      const a = i.dataset.side;
      i.classList.toggle("active", a === t);
    }),
    document.querySelectorAll(".pve-setting").forEach((i) => {
      s === "VS_AI" ? i.classList.remove("hidden") : i.classList.add("hidden");
    }));
}
function T() {
  const s = document.getElementById("board");
  if (!s) return;
  s.innerHTML = "";
  const e = c.getGameMode() === "VS_AI" && c.getAIPlayer() === "RED";
  (V(s), q(s, e), _(s, e), Y(s, e));
}
function A(s, e, t) {
  return t ? { x: d + (8 - e) * u, y: d + (9 - s) * u } : { x: d + e * u, y: d + s * u };
}
function V(s) {
  let e = "";
  for (let n = 0; n < S; n++) {
    const i = d + n * u;
    e += `M ${d} ${i} L ${M - d} ${i} `;
  }
  for (let n = 0; n < f; n++) {
    const i = d + n * u;
    if (n === 0 || n === f - 1) e += `M ${i} ${d} L ${i} ${y - d} `;
    else {
      const a = d + 4 * u,
        r = d + 5 * u;
      ((e += `M ${i} ${d} L ${i} ${a} `), (e += `M ${i} ${r} L ${i} ${y - d} `));
    }
  }
  ((e += `M ${d + 3 * u} ${d} L ${d + 5 * u} ${d + 2 * u} `),
    (e += `M ${d + 5 * u} ${d} L ${d + 3 * u} ${d + 2 * u} `),
    (e += `M ${d + 3 * u} ${d + 9 * u} L ${d + 5 * u} ${d + 7 * u} `),
    (e += `M ${d + 5 * u} ${d + 9 * u} L ${d + 3 * u} ${d + 7 * u} `));
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  (t.setAttribute("d", e),
    t.setAttribute("class", "grid-line"),
    t.setAttribute("stroke", "#000"),
    t.setAttribute("fill", "none"),
    s.appendChild(t));
}
function _(s, e) {
  const t = c.getBoard();
  for (let n = 0; n < S; n++)
    for (let i = 0; i < f; i++) {
      const a = t[n][i];
      if (a) {
        const { x: r, y: o } = A(n, i, e),
          l = document.createElementNS("http://www.w3.org/2000/svg", "g");
        (l.setAttribute("class", `piece ${a.player.toLowerCase()}`),
          l.setAttribute("transform", `translate(${r}, ${o})`));
        const m = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        (m.setAttribute("r", "20"), m.setAttribute("class", "base"), l.appendChild(m));
        const E = document.createElementNS("http://www.w3.org/2000/svg", "text");
        ((E.textContent = W(a)),
          E.setAttribute("text-anchor", "middle"),
          E.setAttribute("dominant-baseline", "central"),
          E.setAttribute("y", "1"),
          l.appendChild(E),
          s.appendChild(l));
      }
    }
}
function W(s) {
  return (
    {
      GENERAL: { RED: "帥", BLACK: "將" },
      ADVISOR: { RED: "仕", BLACK: "士" },
      ELEPHANT: { RED: "相", BLACK: "象" },
      HORSE: { RED: "傌", BLACK: "馬" },
      CHARIOT: { RED: "俥", BLACK: "車" },
      CANNON: { RED: "炮", BLACK: "砲" },
      SOLDIER: { RED: "兵", BLACK: "卒" },
    }[s.type][s.player] || "?"
  );
}
function Y(s, e) {
  const t = c.getSelectedPiece();
  if (t) {
    const { x: n, y: i } = A(t.row, t.col, e),
      a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    (a.setAttribute("cx", n.toString()),
      a.setAttribute("cy", i.toString()),
      a.setAttribute("r", "23"),
      a.setAttribute("class", "selected-marker"),
      a.setAttribute("fill", "none"),
      a.setAttribute("stroke", "#4CAF50"),
      a.setAttribute("stroke-width", "2"),
      s.appendChild(a),
      c.getValidMovesForSelected().forEach((o) => {
        const l = A(o.row, o.col, e),
          m = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        (m.setAttribute("cx", l.x.toString()),
          m.setAttribute("cy", l.y.toString()),
          c.getBoard()[o.row][o.col]
            ? (m.setAttribute("r", "22"),
              m.setAttribute("class", "capture-marker"),
              m.setAttribute("fill", "none"),
              m.setAttribute("stroke", "#d32f2f"),
              m.setAttribute("stroke-width", "2"))
            : (m.setAttribute("r", "5"),
              m.setAttribute("class", "move-marker"),
              m.setAttribute("fill", "#4CAF50")),
          s.appendChild(m));
      }));
  }
}
function q(s, e) {
  const t = c.getLastMove();
  if (t) {
    const n = A(t.from.row, t.from.col, e),
      i = A(t.to.row, t.to.col, e),
      a = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (a.setAttribute("x", (n.x - 22).toString()),
      a.setAttribute("y", (n.y - 22).toString()),
      a.setAttribute("width", "44"),
      a.setAttribute("height", "44"),
      a.setAttribute("class", "last-move-from"),
      s.appendChild(a));
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (r.setAttribute("x", (i.x - 22).toString()),
      r.setAttribute("y", (i.y - 22).toString()),
      r.setAttribute("width", "44"),
      r.setAttribute("height", "44"),
      r.setAttribute("class", "last-move-to"),
      s.appendChild(r));
  }
}
function F(s) {
  if (
    (c.getGameMode() === "VS_AI" && c.getCurrentPlayer() === c.getAIPlayer() && !c.isGameOver()) ||
    c.isGameOver()
  )
    return;
  const t = s.currentTarget.getBoundingClientRect(),
    n = M / t.width,
    i = y / t.height,
    a = (s.clientX - t.left) * n,
    r = (s.clientY - t.top) * i,
    o = c.getGameMode() === "VS_AI" && c.getAIPlayer() === "RED";
  let l = Math.round((a - d) / u),
    m = Math.round((r - d) / u);
  (o && ((l = 8 - l), (m = 9 - m)), l >= 0 && l < f && m >= 0 && m < S && c.selectPiece(m, l));
}
function L() {
  const s = c.getCurrentPlayer(),
    e = c.getState(),
    t = document.getElementById("turn-text"),
    n = document.querySelector(".turn-indicator");
  if (t && n) {
    n.className = `turn-indicator ${s.toLowerCase()}`;
    const i = s === "RED" ? "redTurn" : "blackTurn";
    let a = h.getUIText(i);
    (e === "CHECK"
      ? (a += ` - ${h.getUIText("check")}`)
      : e === "CHECKMATE"
        ? (a += ` - ${h.getUIText("checkmate")}`)
        : e === "STALEMATE" && (a += ` - ${h.getUIText("draw")}`),
      (t.textContent = a));
  }
  ((document.getElementById("move-number").textContent = c.getMoveCount().toString()),
    (document.getElementById("game-timer").textContent = g.formatTime(c.getElapsedTime())));
}
function X() {
  ((document.getElementById("game-title").textContent = h.getUIText("gameTitle")),
    (document.getElementById("menu-title").textContent = h.getUIText("menuTitle")),
    (document.getElementById("start-btn").textContent = h.getUIText("startGame")),
    (document.getElementById("new-game-btn").textContent = h.getUIText("newGame")),
    (document.getElementById("label-time").textContent = h.getUIText("time")),
    (document.getElementById("label-moves").textContent = h.getUIText("moves")),
    (document.getElementById("result-title").textContent = h.getUIText("gameOver")),
    (document.getElementById("label-total-time").textContent = h.getUIText("totalTime")),
    (document.getElementById("label-total-moves").textContent = h.getUIText("totalMoves")),
    (document.getElementById("label-mode").textContent = h.getUIText("labelMode")),
    (document.getElementById("mode-two-player").textContent = h.getUIText("TWO_PLAYER")),
    (document.getElementById("mode-vs-ai").textContent = h.getUIText("VS_AI")),
    (document.getElementById("label-side").textContent = h.getUIText("labelSide")),
    (document.getElementById("side-red").textContent = h.getUIText("RED")),
    (document.getElementById("side-black").textContent = h.getUIText("BLACK")),
    (document.getElementById("result-title").textContent = h.getUIText("gameOver")),
    (document.getElementById("restart-btn").textContent = h.getUIText("playAgain")),
    (document.getElementById("high-scores-title").textContent = h.getUIText("highScores")),
    (document.getElementById("th-rank").textContent = h.getUIText("rank")),
    (document.getElementById("th-moves").textContent = h.getUIText("moves")),
    (document.getElementById("th-time").textContent = h.getUIText("time")),
    (document.getElementById("th-date").textContent = h.getUIText("date")),
    document.querySelectorAll("[data-i18n]").forEach((s) => {
      const e = s.dataset.i18n;
      e && (s.textContent = h.getUIText(e));
    }));
}
function p() {
  const s = c.getFinalGameState(),
    e = c.getWinner(),
    t = document.getElementById("winner-display");
  if (t) {
    let n = "draw";
    (s === "CHECKMATE" && e
      ? (n = e === "RED" ? "redWins" : "blackWins")
      : s === "STALEMATE" && (n = "STALEMATE"),
      (t.innerHTML = `<h3>${h.getUIText(n)}</h3>`));
  }
  ((document.getElementById("total-time").textContent = g.formatTime(c.getElapsedTime())),
    (document.getElementById("total-moves").textContent = c.getMoveCount().toString()),
    J());
}
const C = () => `xiangqi_highscores_${c.getAIPlayer() === "RED" ? "BLACK" : "RED"}`;
function z() {
  if (c.getGameMode() !== "VS_AI") return;
  const s = c.getWinner(),
    e = c.getAIPlayer() === "RED" ? "BLACK" : "RED";
  if (s === e) {
    const t = Date.now();
    b = t;
    const n = { moves: c.getMoveCount(), time: c.getElapsedTime(), date: t },
      i = C();
    g.saveHighScore(i, n, (a, r) => (a.moves !== r.moves ? a.moves - r.moves : a.time - r.time));
  }
}
function J() {
  const s = document.querySelector(".high-scores-container");
  if (c.getGameMode() !== "VS_AI") {
    s && s.classList.add("hidden");
    return;
  }
  s && s.classList.remove("hidden");
  const e = C(),
    t = g.getHighScores(e),
    n = document.getElementById("high-scores-body");
  (n &&
    ((n.innerHTML = ""),
    t.forEach((i, a) => {
      const r = document.createElement("tr");
      i.date === b && r.classList.add("current-run");
      const o = g.formatDate(i.date, h.language);
      ((r.innerHTML = `
                <td>${a + 1}</td>
                <td>${i.moves}</td>
                <td>${g.formatTime(i.time)}</td>
                <td>${o}</td>
            `),
        n.appendChild(r));
    })),
    (document.getElementById("high-scores-title").textContent = h.getUIText("highScores")));
}
H();
