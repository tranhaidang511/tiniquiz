import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as M, u as w, L as A } from "./util-BKt39bz_.js";
const P = { PAWN: 100, KNIGHT: 320, BISHOP: 330, ROOK: 500, QUEEN: 900, KING: 2e4 },
  $ = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  k = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  B = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  C = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
  b = [
    [-50, -40, -30, -20, -20, -30, -40, -50],
    [-30, -20, -10, 0, 0, -10, -20, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -30, 0, 0, 0, 0, -30, -30],
    [-50, -30, -30, -30, -30, -30, -30, -50],
  ],
  L = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  H = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ];
class N {
  game;
  searchDepth = 3;
  constructor(t) {
    this.game = t;
  }
  getBestMove(t, e) {
    let s = null,
      n = e === "WHITE" ? -1 / 0 : 1 / 0;
    const i = this.getAllPossibleMoves(t, e);
    if (i.length === 0) return null;
    for (const r of i) {
      const l = this.simulateMove(t, r.from, r.to),
        c = this.minimax(l, this.searchDepth - 1, -1 / 0, 1 / 0, e === "BLACK");
      e === "WHITE" ? c > n && ((n = c), (s = r)) : c < n && ((n = c), (s = r));
    }
    return s;
  }
  minimax(t, e, s, n, i) {
    if (e === 0) return this.evaluateBoard(t);
    const r = i ? "WHITE" : "BLACK",
      l = this.getAllPossibleMoves(t, r);
    if (l.length === 0) return this.game.isInCheck(r, t) ? (i ? -1e4 : 1e4) : 0;
    if (i) {
      let c = -1 / 0;
      for (const a of l) {
        const o = this.simulateMove(t, a.from, a.to),
          d = this.minimax(o, e - 1, s, n, !1);
        if (((c = Math.max(c, d)), (s = Math.max(s, d)), n <= s)) break;
      }
      return c;
    } else {
      let c = 1 / 0;
      for (const a of l) {
        const o = this.simulateMove(t, a.from, a.to),
          d = this.minimax(o, e - 1, s, n, !0);
        if (((c = Math.min(c, d)), (n = Math.min(n, d)), n <= s)) break;
      }
      return c;
    }
  }
  evaluateBoard(t) {
    let e = 0;
    const s = this.isEndgame(t);
    for (let n = 0; n < 8; n++)
      for (let i = 0; i < 8; i++) {
        const r = t[n][i];
        if (r) {
          const l = P[r.type],
            c = this.getPositionalValue(r, n, i, s),
            a = l + c;
          e += r.player === "WHITE" ? a : -a;
        }
      }
    return (
      s ||
        ((e += this.evaluateKingSafety(t, "WHITE") * 2),
        (e -= this.evaluateKingSafety(t, "BLACK") * 2)),
      (e += this.evaluateMobility(t, "WHITE") * 5),
      (e -= this.evaluateMobility(t, "BLACK") * 5),
      (e += this.evaluateCenterControl(t)),
      (e += this.evaluatePawnStructure(t)),
      e
    );
  }
  getPositionalValue(t, e, s, n) {
    const i = t.player === "WHITE" ? 7 - e : e;
    switch (t.type) {
      case "PAWN":
        return $[i][s];
      case "KNIGHT":
        return k[i][s];
      case "BISHOP":
        return B[i][s];
      case "ROOK":
        return L[i][s];
      case "QUEEN":
        return H[i][s];
      case "KING":
        return n ? b[i][s] : C[i][s];
      default:
        return 0;
    }
  }
  isEndgame(t) {
    let e = 0,
      s = 0;
    for (let n = 0; n < 8; n++)
      for (let i = 0; i < 8; i++) {
        const r = t[n][i];
        r && (r.type === "QUEEN" && e++, (r.type === "KNIGHT" || r.type === "BISHOP") && s++);
      }
    return e === 0 || (e === 2 && s <= 2);
  }
  evaluateKingSafety(t, e) {
    let s = 0,
      n = -1,
      i = -1;
    for (let a = 0; a < 8; a++) {
      for (let o = 0; o < 8; o++) {
        const d = t[a][o];
        if (d && d.type === "KING" && d.player === e) {
          ((n = a), (i = o));
          break;
        }
      }
      if (n !== -1) break;
    }
    if (n === -1) return 0;
    const l = e === "WHITE" ? n - 1 : n + 1;
    if (l >= 0 && l < 8)
      for (let a = -1; a <= 1; a++) {
        const o = i + a;
        if (o >= 0 && o < 8) {
          const d = t[l][o];
          d && d.type === "PAWN" && d.player === e && (s += 10);
        }
      }
    let c = 0;
    for (let a = 0; a < 8; a++) t[a][i] && c++;
    return (c <= 2 && (s -= 15), (i === 6 || i === 2) && (s += 25), s);
  }
  evaluateMobility(t, e) {
    let s = 0;
    for (let n = 0; n < 8; n++)
      for (let i = 0; i < 8; i++) {
        const r = t[n][i];
        if (r && r.player === e) {
          const l = this.game.getValidMoves(r, t);
          s += l.length;
        }
      }
    return s;
  }
  evaluateCenterControl(t) {
    let e = 0;
    const s = [
      { row: 3, col: 3 },
      { row: 3, col: 4 },
      { row: 4, col: 3 },
      { row: 4, col: 4 },
    ];
    for (const i of s) {
      const r = t[i.row][i.col];
      if (r) {
        const l = r.type === "PAWN" ? 20 : 10;
        e += r.player === "WHITE" ? l : -l;
      }
    }
    const n = [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 2, col: 5 },
      { row: 3, col: 2 },
      { row: 3, col: 5 },
      { row: 4, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 2 },
      { row: 5, col: 3 },
      { row: 5, col: 4 },
      { row: 5, col: 5 },
    ];
    for (const i of n) {
      const r = t[i.row][i.col];
      r && r.type === "PAWN" && (e += r.player === "WHITE" ? 5 : -5);
    }
    return e;
  }
  evaluatePawnStructure(t) {
    let e = 0;
    for (let s = 0; s < 8; s++) {
      let n = 0,
        i = 0;
      for (let r = 0; r < 8; r++) {
        const l = t[r][s];
        l && l.type === "PAWN" && (l.player === "WHITE" ? n++ : i++);
      }
      (n > 1 && (e -= (n - 1) * 15), i > 1 && (e += (i - 1) * 15));
    }
    for (let s = 0; s < 8; s++)
      for (let n = 0; n < 8; n++) {
        const i = t[s][n];
        if (i && i.type === "PAWN" && this.isPassedPawn(t, s, n, i.player)) {
          const r = i.player === "WHITE" ? (7 - s) * 10 : s * 10;
          e += i.player === "WHITE" ? r : -r;
        }
      }
    return e;
  }
  isPassedPawn(t, e, s, n) {
    const i = n === "WHITE" ? -1 : 1,
      r = n === "WHITE" ? e - 1 : e + 1,
      l = n === "WHITE" ? 0 : 7;
    for (let c = r; (n === "WHITE" ? c >= l : c <= l) && !(c < 0 || c >= 8); c += i)
      for (let a = s - 1; a <= s + 1; a++) {
        if (a < 0 || a >= 8) continue;
        const o = t[c][a];
        if (o && o.type === "PAWN" && o.player !== n) return !1;
      }
    return !0;
  }
  getAllPossibleMoves(t, e) {
    const s = [];
    for (let n = 0; n < 8; n++)
      for (let i = 0; i < 8; i++) {
        const r = t[n][i];
        if (r && r.player === e) {
          const l = this.game.getValidMoves(r, t);
          for (const c of l) s.push({ from: { row: n, col: i }, to: c });
        }
      }
    return s;
  }
  simulateMove(t, e, s) {
    const n = t.map((l) => l.map((c) => (c ? { ...c } : null))),
      i = { from: e, to: s };
    this.game.executeMove(i, n);
    const r = n[s.row][s.col];
    return (r && r.type === "PAWN" && (s.row === 0 || s.row === 7) && (r.type = "QUEEN"), n);
  }
}
class x {
  board = [];
  currentPlayer = "WHITE";
  gameState = "MENU";
  selectedPiece = null;
  validMoves = [];
  moveHistory = [];
  capturedPieces = [];
  enPassantTarget = null;
  lastMove = null;
  pendingPromotion = null;
  finalGameState = null;
  gameMode = "TWO_PLAYER";
  aiPlayer = null;
  startTime = 0;
  elapsedTime = 0;
  timerInterval = null;
  stateChangeListeners = [];
  moveListeners = [];
  timerUpdateListeners = [];
  promotionListeners = [];
  boardUpdateListeners = [];
  constructor() {
    this.initializeBoard();
  }
  initializeBoard() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    const t = ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"];
    for (let e = 0; e < 8; e++)
      ((this.board[0][e] = { type: t[e], player: "BLACK", row: 0, col: e, hasMoved: !1 }),
        (this.board[1][e] = { type: "PAWN", player: "BLACK", row: 1, col: e, hasMoved: !1 }));
    for (let e = 0; e < 8; e++)
      ((this.board[6][e] = { type: "PAWN", player: "WHITE", row: 6, col: e, hasMoved: !1 }),
        (this.board[7][e] = { type: t[e], player: "WHITE", row: 7, col: e, hasMoved: !1 }));
  }
  setGameMode(t) {
    this.gameMode = t;
  }
  setAISide(t) {
    this.aiPlayer = t;
  }
  start() {
    (this.initializeBoard(),
      (this.currentPlayer = "WHITE"),
      (this.gameState = "PLAYING"),
      (this.selectedPiece = null),
      (this.validMoves = []),
      (this.moveHistory = []),
      (this.capturedPieces = []),
      (this.enPassantTarget = null),
      (this.lastMove = null),
      (this.finalGameState = null),
      this.startTimer(),
      this.notifyStateChange(),
      this.notifyBoardUpdate(),
      this.gameMode === "VS_AI" &&
        this.aiPlayer === "WHITE" &&
        setTimeout(() => this.makeAIMove(), 500));
  }
  restart() {
    (this.stopTimer(), (this.gameState = "MENU"), this.notifyStateChange());
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
  selectPiece(t, e) {
    const s = this.board[t][e];
    return this.selectedPiece && this.validMoves.some((n) => n.row === t && n.col === e)
      ? this.makeMove(t, e)
      : !s ||
          s.player !== this.currentPlayer ||
          (this.gameState !== "PLAYING" && this.gameState !== "CHECK")
        ? ((this.selectedPiece = null), (this.validMoves = []), this.notifyBoardUpdate(), !1)
        : ((this.selectedPiece = s),
          (this.validMoves = this.getValidMoves(s)),
          this.notifyBoardUpdate(),
          !0);
  }
  makeMove(t, e) {
    if (!this.selectedPiece) return !1;
    const s = { row: this.selectedPiece.row, col: this.selectedPiece.col },
      n = { row: t, col: e };
    if (!this.validMoves.some((l) => l.row === t && l.col === e)) return !1;
    const i = { from: s, to: n },
      r = this.board[t][e];
    if (
      (r && ((i.captured = r), this.capturedPieces.push(r)),
      this.selectedPiece.type === "PAWN" &&
        this.enPassantTarget &&
        t === this.enPassantTarget.row &&
        e === this.enPassantTarget.col)
    ) {
      const l = this.currentPlayer === "WHITE" ? t + 1 : t - 1,
        c = this.board[l][e];
      c &&
        ((i.captured = c),
        (i.special = "EN_PASSANT"),
        this.capturedPieces.push(c),
        (this.board[l][e] = null));
    }
    if (this.selectedPiece.type === "KING" && Math.abs(e - s.col) === 2) {
      i.special = "CASTLING";
      const l = e > s.col;
      i.castlingSide = l ? "KINGSIDE" : "QUEENSIDE";
      const c = l ? 7 : 0,
        a = l ? e - 1 : e + 1,
        o = this.board[t][c];
      o && ((this.board[t][a] = o), (this.board[t][c] = null), (o.col = a), (o.hasMoved = !0));
    }
    return (
      this.executeMove(i, this.board),
      i.special === "PROMOTION"
        ? ((this.pendingPromotion = { row: t, col: e, move: i }), this.notifyPromotion(t, e), !0)
        : ((this.lastMove = i),
          this.moveHistory.push(i),
          (this.selectedPiece = null),
          (this.validMoves = []),
          (this.enPassantTarget = null),
          this.board[t][e]?.type === "PAWN" &&
            Math.abs(t - s.row) === 2 &&
            (this.enPassantTarget = {
              row: this.currentPlayer === "WHITE" ? t + 1 : t - 1,
              col: e,
            }),
          (this.currentPlayer = this.currentPlayer === "WHITE" ? "BLACK" : "WHITE"),
          this.checkGameState(),
          this.notifyMove(i),
          this.notifyBoardUpdate(),
          this.gameMode === "VS_AI" &&
            this.aiPlayer === this.currentPlayer &&
            (this.gameState === "PLAYING" || this.gameState === "CHECK") &&
            setTimeout(() => this.makeAIMove(), 500),
          !0)
    );
  }
  executeMove(t, e = this.board) {
    const s = e[t.from.row][t.from.col];
    if (!s) return;
    const n = t.to.row,
      i = t.to.col;
    if (s.type === "PAWN" && !e[n][i] && t.to.col !== t.from.col) {
      const r = s.player === "WHITE" ? n + 1 : n - 1;
      ((e[r][i] = null), (t.special = "EN_PASSANT"));
    }
    if (s.type === "KING" && Math.abs(i - t.from.col) === 2) {
      t.special = "CASTLING";
      const r = i > t.from.col;
      t.castlingSide = r ? "KINGSIDE" : "QUEENSIDE";
      const l = r ? 7 : 0,
        c = r ? i - 1 : i + 1,
        a = e[n][l];
      a && ((e[n][c] = a), (e[n][l] = null), (a.col = c), (a.row = n), (a.hasMoved = !0));
    }
    (s.type === "PAWN" && (n === 0 || n === 7) && (t.special = "PROMOTION"),
      (e[n][i] = s),
      (e[t.from.row][t.from.col] = null),
      (s.row = n),
      (s.col = i),
      (s.hasMoved = !0));
  }
  getValidMoves(t, e = this.board) {
    let s = [];
    switch (t.type) {
      case "PAWN":
        s = this.getPawnMoves(t, e);
        break;
      case "ROOK":
        s = this.getRookMoves(t, e);
        break;
      case "KNIGHT":
        s = this.getKnightMoves(t, e);
        break;
      case "BISHOP":
        s = this.getBishopMoves(t, e);
        break;
      case "QUEEN":
        s = this.getQueenMoves(t, e);
        break;
      case "KING":
        s = this.getKingMoves(t, e);
        break;
    }
    return ((s = s.filter((n) => !this.wouldBeInCheck(t, n, e))), s);
  }
  getPawnMoves(t, e = this.board) {
    const s = [],
      n = t.player === "WHITE" ? -1 : 1,
      i = t.player === "WHITE" ? 6 : 1,
      r = t.row + n;
    if (
      this.isInBounds(r, t.col) &&
      !e[r][t.col] &&
      (s.push({ row: r, col: t.col }), t.row === i)
    ) {
      const l = t.row + 2 * n;
      e[l][t.col] || s.push({ row: l, col: t.col });
    }
    for (const l of [-1, 1]) {
      const c = t.col + l;
      if (this.isInBounds(r, c)) {
        const a = e[r][c];
        (a && a.player !== t.player && s.push({ row: r, col: c }),
          e === this.board &&
            this.enPassantTarget &&
            r === this.enPassantTarget.row &&
            c === this.enPassantTarget.col &&
            s.push({ row: r, col: c }));
      }
    }
    return s;
  }
  getRookMoves(t, e = this.board) {
    return this.getLinearMoves(
      t,
      [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ],
      e
    );
  }
  getKnightMoves(t, e = this.board) {
    const s = [],
      n = [
        { row: -2, col: -1 },
        { row: -2, col: 1 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 },
      ];
    for (const i of n) {
      const r = t.row + i.row,
        l = t.col + i.col;
      if (this.isInBounds(r, l)) {
        const c = e[r][l];
        (!c || c.player !== t.player) && s.push({ row: r, col: l });
      }
    }
    return s;
  }
  getBishopMoves(t, e = this.board) {
    return this.getLinearMoves(
      t,
      [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ],
      e
    );
  }
  getQueenMoves(t, e = this.board) {
    return this.getLinearMoves(
      t,
      [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ],
      e
    );
  }
  getKingMoves(t, e = this.board) {
    const s = [];
    for (let n = -1; n <= 1; n++)
      for (let i = -1; i <= 1; i++) {
        if (n === 0 && i === 0) continue;
        const r = t.row + n,
          l = t.col + i;
        if (this.isInBounds(r, l)) {
          const c = e[r][l];
          (!c || c.player !== t.player) && s.push({ row: r, col: l });
        }
      }
    if (e === this.board && !t.hasMoved && !this.isInCheck(t.player, e)) {
      const n = e[t.row][7];
      n &&
        !n.hasMoved &&
        !e[t.row][5] &&
        !e[t.row][6] &&
        !this.isSquareUnderAttack(t.row, 5, t.player, e) &&
        !this.isSquareUnderAttack(t.row, 6, t.player, e) &&
        s.push({ row: t.row, col: 6 });
      const i = e[t.row][0];
      i &&
        !i.hasMoved &&
        !e[t.row][1] &&
        !e[t.row][2] &&
        !e[t.row][3] &&
        !this.isSquareUnderAttack(t.row, 2, t.player, e) &&
        !this.isSquareUnderAttack(t.row, 3, t.player, e) &&
        s.push({ row: t.row, col: 2 });
    }
    return s;
  }
  getLinearMoves(t, e, s = this.board) {
    const n = [];
    for (const i of e) {
      let r = t.row + i.row,
        l = t.col + i.col;
      for (; this.isInBounds(r, l); ) {
        const c = s[r][l];
        if (!c) n.push({ row: r, col: l });
        else {
          c.player !== t.player && n.push({ row: r, col: l });
          break;
        }
        ((r += i.row), (l += i.col));
      }
    }
    return n;
  }
  wouldBeInCheck(t, e, s = this.board) {
    t.type === "KING" && Math.abs(e.col - t.col);
    const n = t.row,
      i = t.col,
      r = s[e.row][e.col];
    ((s[e.row][e.col] = t), (s[n][i] = null), (t.row = e.row), (t.col = e.col));
    const l = this.isInCheck(t.player, s);
    return ((s[n][i] = t), (s[e.row][e.col] = r), (t.row = n), (t.col = i), l);
  }
  isInCheck(t, e = this.board) {
    let s = null;
    for (let n = 0; n < 8; n++) {
      for (let i = 0; i < 8; i++) {
        const r = e[n][i];
        if (r && r.type === "KING" && r.player === t) {
          s = { row: n, col: i };
          break;
        }
      }
      if (s) break;
    }
    return s ? this.isSquareUnderAttack(s.row, s.col, t, e) : !1;
  }
  isSquareUnderAttack(t, e, s, n = this.board) {
    const i = s === "WHITE" ? "BLACK" : "WHITE";
    for (let r = 0; r < 8; r++)
      for (let l = 0; l < 8; l++) {
        const c = n[r][l];
        if (c && c.player === i && this.getPieceMoves(c, n).some((o) => o.row === t && o.col === e))
          return !0;
      }
    return !1;
  }
  getPieceMoves(t, e = this.board) {
    switch (t.type) {
      case "PAWN":
        return this.getPawnAttackMoves(t);
      case "ROOK":
        return this.getRookMoves(t, e);
      case "KNIGHT":
        return this.getKnightMoves(t, e);
      case "BISHOP":
        return this.getBishopMoves(t, e);
      case "QUEEN":
        return this.getQueenMoves(t, e);
      case "KING":
        return this.getKingAttackMoves(t);
      default:
        return [];
    }
  }
  getPawnAttackMoves(t) {
    const e = [],
      s = t.player === "WHITE" ? -1 : 1,
      n = t.row + s;
    for (const i of [-1, 1]) {
      const r = t.col + i;
      this.isInBounds(n, r) && e.push({ row: n, col: r });
    }
    return e;
  }
  getKingAttackMoves(t) {
    const e = [];
    for (let s = -1; s <= 1; s++)
      for (let n = -1; n <= 1; n++) {
        if (s === 0 && n === 0) continue;
        const i = t.row + s,
          r = t.col + n;
        this.isInBounds(i, r) && e.push({ row: i, col: r });
      }
    return e;
  }
  checkGameState(t = this.board) {
    (this.isInCheck(this.currentPlayer, t)
      ? this.hasNoLegalMoves(this.currentPlayer, t)
        ? t === this.board &&
          ((this.gameState = "CHECKMATE"),
          (this.finalGameState = "CHECKMATE"),
          this.stopTimer(),
          setTimeout(() => {
            ((this.gameState = "RESULT"), this.notifyStateChange());
          }, 2e3))
        : t === this.board && (this.gameState = "CHECK")
      : this.hasNoLegalMoves(this.currentPlayer, t)
        ? t === this.board &&
          ((this.gameState = "STALEMATE"),
          (this.finalGameState = "STALEMATE"),
          this.stopTimer(),
          setTimeout(() => {
            ((this.gameState = "RESULT"), this.notifyStateChange());
          }, 2e3))
        : t === this.board && (this.gameState = "PLAYING"),
      t === this.board && this.notifyStateChange());
  }
  hasNoLegalMoves(t, e = this.board) {
    for (let s = 0; s < 8; s++)
      for (let n = 0; n < 8; n++) {
        const i = e[s][n];
        if (i && i.player === t && this.getValidMoves(i, e).length > 0) return !1;
      }
    return !0;
  }
  isInBounds(t, e) {
    return t >= 0 && t < 8 && e >= 0 && e < 8;
  }
  getGameMode() {
    return this.gameMode;
  }
  getAIPlayer() {
    return this.aiPlayer;
  }
  getBoard() {
    return this.board;
  }
  getState() {
    return this.gameState;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getSelectedPiece() {
    return this.selectedPiece;
  }
  getValidMovesForSelected() {
    return this.validMoves;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  getMoveCount() {
    return this.moveHistory.length;
  }
  getLastMove() {
    return this.lastMove;
  }
  getWinner() {
    return this.finalGameState === "CHECKMATE"
      ? this.currentPlayer === "WHITE"
        ? "BLACK"
        : "WHITE"
      : null;
  }
  getFinalGameState() {
    return this.finalGameState;
  }
  getPendingPromotion() {
    return this.pendingPromotion;
  }
  promotePawn(t) {
    if (!this.pendingPromotion) return;
    const { row: e, col: s, move: n } = this.pendingPromotion,
      i = this.board[e][s];
    (i && i.type === "PAWN" && (i.type = t),
      (this.enPassantTarget = null),
      (this.lastMove = n),
      this.moveHistory.push(n),
      (this.selectedPiece = null),
      (this.validMoves = []),
      (this.pendingPromotion = null),
      (this.currentPlayer = this.currentPlayer === "WHITE" ? "BLACK" : "WHITE"),
      this.checkGameState(),
      this.notifyMove(n),
      this.notifyBoardUpdate(),
      this.gameMode === "VS_AI" &&
        this.aiPlayer === this.currentPlayer &&
        (this.gameState === "PLAYING" || this.gameState === "CHECK") &&
        setTimeout(() => this.makeAIMove(), 500));
  }
  makeAIMove() {
    if (
      (this.gameState !== "PLAYING" && this.gameState !== "CHECK") ||
      this.gameMode !== "VS_AI" ||
      this.aiPlayer !== this.currentPlayer
    )
      return;
    const e = new N(this).getBestMove(this.board, this.currentPlayer);
    e
      ? (this.selectPiece(e.from.row, e.from.col), this.makeMove(e.to.row, e.to.col))
      : console.error("No valid move found for AI!");
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
  onPromotion(t) {
    this.promotionListeners.push(t);
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
  notifyPromotion(t, e) {
    this.promotionListeners.forEach((s) => s(t, e));
  }
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((t) => t(this.elapsedTime));
  }
}
const u = new x(),
  W = {
    ui: {
      gameTitle: "Chess",
      menuTitle: "Game Setup",
      startGame: "Start Game",
      newGame: "New Game",
      whiteTurn: "White's Turn",
      blackTurn: "Black's Turn",
      time: "Time",
      moves: "Moves",
      totalTime: "Time",
      totalMoves: "Total Moves",
      check: "Check!",
      checkmate: "Checkmate!",
      stalemate: "Stalemate!",
      gameOver: "Game Over",
      whiteWins: "White Wins!",
      blackWins: "Black Wins!",
      draw: "Draw!",
      playAgain: "Play Again",
      promotion: "Promotion",
      queen: "Queen",
      rook: "Rook",
      bishop: "Bishop",
      knight: "Knight",
      labelMode: "Game Mode",
      twoPlayers: "2 Players",
      vsAI: "vs AI",
      labelDifficulty: "Difficulty",
      difficultyEasy: "Easy",
      difficultyMedium: "Medium",
      difficultyHard: "Hard",
      labelSide: "Play As",
      sideWhite: "White",
      sideBlack: "Black",
      aiThinking: "AI is thinking...",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
    },
  },
  U = {
    ui: {
      gameTitle: "チェス",
      menuTitle: "ゲーム設定",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      whiteTurn: "白の番",
      blackTurn: "黒の番",
      time: "時間",
      moves: "手数",
      totalTime: "時間",
      totalMoves: "総手数",
      check: "チェック！",
      checkmate: "チェックメイト！",
      stalemate: "ステイルメイト！",
      gameOver: "ゲーム終了",
      whiteWins: "白の勝ち！",
      blackWins: "黒の勝ち！",
      draw: "引き分け！",
      playAgain: "もう一度",
      promotion: "昇進",
      queen: "女王",
      rook: "ロク",
      bishop: "ビショップ",
      knight: "ナイト",
      labelMode: "ゲームモード",
      twoPlayers: "二人対戦",
      vsAI: "AI対戦",
      labelDifficulty: "難易度",
      difficultyEasy: "簡単",
      difficultyMedium: "普通",
      difficultyHard: "難しい",
      labelSide: "サイド選択",
      sideWhite: "白",
      sideBlack: "黒",
      aiThinking: "AIが考え中...",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
    },
  },
  G = {
    ui: {
      gameTitle: "Cờ vua",
      menuTitle: "Thiết lập trò chơi",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      whiteTurn: "Lượt trắng",
      blackTurn: "Lượt đen",
      time: "Thời gian",
      moves: "Nước đi",
      totalTime: "Thời gian",
      totalMoves: "Tổng nước đi",
      check: "Chiếu!",
      checkmate: "Chiếu hết!",
      stalemate: "Hòa!",
      gameOver: "Kết thúc",
      whiteWins: "Trắng thắng!",
      blackWins: "Đen thắng!",
      draw: "Hòa!",
      playAgain: "Chơi lại",
      promotion: "Phong cấp",
      queen: "Hậu",
      rook: "Xe",
      bishop: "Tượng",
      knight: "Mã",
      labelMode: "Chế độ chơi",
      twoPlayers: "2 Người chơi",
      vsAI: "vs AI",
      labelDifficulty: "Độ khó",
      difficultyEasy: "Dễ",
      difficultyMedium: "Trung bình",
      difficultyHard: "Khó",
      labelSide: "Chọn quân",
      sideWhite: "Trắng",
      sideBlack: "Đen",
      aiThinking: "AI đang suy nghĩ...",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
    },
  },
  K = {
    ui: {
      gameTitle: "国际象棋",
      menuTitle: "游戏设置",
      startGame: "开始游戏",
      newGame: "新游戏",
      whiteTurn: "白方回合",
      blackTurn: "黑方回合",
      time: "时间",
      moves: "移动次数",
      totalTime: "时间",
      totalMoves: "总移动次数",
      check: "将军！",
      checkmate: "将死！",
      stalemate: "僵局！",
      gameOver: "游戏结束",
      whiteWins: "白方获胜！",
      blackWins: "黑方获胜！",
      draw: "平局！",
      playAgain: "再玩一次",
      promotion: "升变",
      queen: "王后",
      rook: "车",
      bishop: "象",
      knight: "马",
      labelMode: "游戏模式",
      twoPlayers: "双人对战",
      vsAI: "对战AI",
      labelDifficulty: "难度",
      difficultyEasy: "简单",
      difficultyMedium: "中等",
      difficultyHard: "困难",
      labelSide: "执棋方",
      sideWhite: "白方",
      sideBlack: "黑方",
      aiThinking: "AI思考中...",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
    },
  },
  O = {
    ui: {
      gameTitle: "الشطرنج",
      menuTitle: "إعداد اللعبة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      whiteTurn: "دور الأبيض",
      blackTurn: "دور الأسود",
      time: "الوقت",
      moves: "الحركات",
      totalTime: "الوقت",
      totalMoves: "إجمالي الحركات",
      check: "كش ملك!",
      checkmate: "كش مات!",
      stalemate: "تعادل (Stalemate)!",
      gameOver: "انتهت اللعبة",
      whiteWins: "الأبيض يفوز!",
      blackWins: "الأسود يفوز!",
      draw: "تعادل!",
      playAgain: "العب مرة أخرى",
      promotion: "ترقية",
      queen: "وزير",
      rook: "رخ",
      bishop: "فيل",
      knight: "حصان",
      labelMode: "وضع اللعبة",
      twoPlayers: "لاعبان",
      vsAI: "ضد الكمبيوتر",
      labelDifficulty: "الصعوبة",
      difficultyEasy: "سهل",
      difficultyMedium: "متوسط",
      difficultyHard: "صعب",
      labelSide: "العب بـ",
      sideWhite: "الأبيض",
      sideBlack: "الأسود",
      aiThinking: "الكمبيوتر يفكر...",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
    },
  };
let I = null;
new M();
const q = localStorage.getItem("language"),
  m = new A({ en: W, ja: U, vi: G, zh: K, ar: O }, q || "en");
function R() {
  (D(),
    E(),
    document.querySelectorAll(".lang-btn").forEach((h) => {
      h.classList.toggle("active", h.dataset.lang === m.language);
    }),
    V());
}
const _ = () => {
    const h = document.querySelector(".mode-btn.active"),
      t = document.querySelector(".side-btn.active");
    if (h && t) {
      const e = { mode: h.dataset.mode, side: t.dataset.side };
      localStorage.setItem("chess_setup", JSON.stringify(e));
    }
  },
  V = () => {
    try {
      const h = localStorage.getItem("chess_setup");
      if (h) {
        const { mode: t, side: e } = JSON.parse(h);
        if (t) {
          document.querySelectorAll(".mode-btn").forEach((n) => {
            n.dataset.mode === t ? n.classList.add("active") : n.classList.remove("active");
          });
          const s = document.getElementById("side-section");
          t === "VS_AI" ? s?.classList.remove("hidden") : s?.classList.add("hidden");
        }
        e &&
          document.querySelectorAll(".side-btn").forEach((s) => {
            s.dataset.side === e ? s.classList.add("active") : s.classList.remove("active");
          });
      }
    } catch (h) {
      console.error("Failed to load chess setup:", h);
    }
  };
function D() {
  (document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "/";
  }),
    document.querySelectorAll(".lang-btn").forEach((a) => {
      a.addEventListener("click", (o) => {
        const d = o.target.dataset.lang;
        m.setLanguage(d);
      });
    }),
    document.getElementById("new-game-btn")?.addEventListener("click", () => {
      u.restart();
    }),
    document.getElementById("restart-btn")?.addEventListener("click", () => {
      u.restart();
    }),
    document.getElementById("board")?.addEventListener("click", Y));
  const n = document.getElementById("mode-two-player"),
    i = document.getElementById("mode-vs-ai"),
    r = document.getElementById("side-section");
  (n?.addEventListener("click", () => {
    (n.classList.add("active"), i?.classList.remove("active"), r?.classList.add("hidden"));
  }),
    i?.addEventListener("click", () => {
      (i.classList.add("active"), n?.classList.remove("active"), r?.classList.remove("hidden"));
    }));
  const l = document.querySelectorAll(".side-btn");
  (l.forEach((a) => {
    a.addEventListener("click", () => {
      (l.forEach((o) => o.classList.remove("active")), a.classList.add("active"));
    });
  }),
    document.getElementById("start-btn")?.addEventListener("click", () => {
      _();
      const o =
        document.querySelector(".mode-btn.active")?.getAttribute("data-mode") || "TWO_PLAYER";
      let d = null;
      (o === "VS_AI" &&
        (d =
          document.querySelector(".side-btn.active")?.dataset.side === "white" ? "BLACK" : "WHITE"),
        u.setGameMode(o),
        u.setAISide(d),
        (I = null),
        u.start());
    }));
}
function T() {
  const h = document.getElementById("board");
  if (!h) return;
  h.innerHTML = "";
  const t = 100,
    e = 40,
    s = u.getGameMode() === "VS_AI" && u.getAIPlayer() === "WHITE";
  h.setAttribute("viewBox", "0 0 880 880");
  const n = (a, o) => (s ? { row: 7 - a, col: 7 - o } : { row: a, col: o });
  for (let a = 0; a < 8; a++)
    for (let o = 0; o < 8; o++) {
      const d = n(a, o),
        g = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      (g.setAttribute("x", (d.col * t + e).toString()),
        g.setAttribute("y", (d.row * t + e).toString()),
        g.setAttribute("width", t.toString()),
        g.setAttribute("height", t.toString()));
      const f = (a + o) % 2 === 1;
      (g.setAttribute("class", f ? "square dark" : "square light"),
        (g.dataset.row = a.toString()),
        (g.dataset.col = o.toString()),
        h.appendChild(g));
    }
  for (let a = 0; a < 8; a++) {
    const o = s ? String.fromCharCode(104 - a) : String.fromCharCode(97 + a),
      d = document.createElementNS("http://www.w3.org/2000/svg", "text");
    (d.setAttribute("x", (a * t + t / 2 + e).toString()),
      d.setAttribute("y", (e - 10).toString()),
      d.classList.add("coord-label"),
      d.setAttribute("text-anchor", "middle"),
      (d.textContent = o),
      h.appendChild(d));
    const g = d.cloneNode(!0);
    (g.setAttribute("y", (8 * t + e + 25).toString()), h.appendChild(g));
  }
  for (let a = 0; a < 8; a++) {
    const o = s ? (1 + a).toString() : (8 - a).toString(),
      d = document.createElementNS("http://www.w3.org/2000/svg", "text");
    (d.setAttribute("x", (e - 10).toString()),
      d.setAttribute("y", (a * t + t / 2 + e + 5).toString()),
      d.classList.add("coord-label"),
      d.setAttribute("text-anchor", "end"),
      (d.textContent = o),
      h.appendChild(d));
    const g = d.cloneNode(!0);
    (g.setAttribute("x", (8 * t + e + 10).toString()),
      g.setAttribute("text-anchor", "start"),
      h.appendChild(g));
  }
  const i = u.getSelectedPiece();
  if (i) {
    const a = n(i.row, i.col),
      o = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    (o.setAttribute("x", (a.col * t + e).toString()),
      o.setAttribute("y", (a.row * t + e).toString()),
      o.setAttribute("width", t.toString()),
      o.setAttribute("height", t.toString()),
      o.setAttribute("class", "square selected"),
      h.appendChild(o));
  }
  const r = u.getLastMove();
  r &&
    [r.from, r.to].forEach((a) => {
      const o = n(a.row, a.col),
        d = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      (d.setAttribute("x", (o.col * t + e).toString()),
        d.setAttribute("y", (o.row * t + e).toString()),
        d.setAttribute("width", t.toString()),
        d.setAttribute("height", t.toString()),
        d.setAttribute("class", "square last-move"),
        h.appendChild(d));
    });
  const l = u.getBoard();
  (l.forEach((a) => {
    a.forEach((o) => {
      o && Q(h, o, t, e, s);
    });
  }),
    u.getValidMovesForSelected().forEach((a) => {
      const o = l[a.row][a.col] !== null,
        d = n(a.row, a.col),
        g = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      (g.setAttribute("cx", (d.col * t + t / 2 + e).toString()),
        g.setAttribute("cy", (d.row * t + t / 2 + e).toString()),
        g.setAttribute("r", o ? "40" : "15"),
        g.classList.add("move-indicator"),
        o &&
          (g.setAttribute("fill", "none"),
          g.setAttribute("stroke", "rgba(127, 166, 80, 0.8)"),
          g.setAttribute("stroke-width", "8")),
        h.appendChild(g));
    }));
}
function Q(h, t, e, s, n) {
  const i = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let r = t.row,
    l = t.col;
  n && ((r = 7 - t.row), (l = 7 - t.col));
  const c = l * e + e / 2 + s,
    a = r * e + e / 2 + s,
    o = 1;
  (i.setAttribute("class", `piece ${t.player.toLowerCase()}`),
    (i.dataset.row = t.row.toString()),
    (i.dataset.col = t.col.toString()),
    (i.dataset.player = t.player));
  let d = "";
  switch (t.type) {
    case "PAWN":
      d = `M ${c} ${a - 20 * o}
                    a ${12 * o} ${12 * o} 0 1 1 0 ${24 * o}
                    a ${12 * o} ${12 * o} 0 1 1 0 -${24 * o}
                    M ${c - 15 * o} ${a + 15 * o}
                    h ${30 * o}
                    l -${5 * o} ${10 * o}
                    h -${20 * o} z`;
      break;
    case "ROOK":
      d = `M ${c - 20 * o} ${a - 25 * o}
                    h ${8 * o} v ${8 * o} h ${8 * o} v -${8 * o} h ${8 * o}
                    v ${8 * o} h ${8 * o} v -${8 * o} h ${8 * o}
                    v ${30 * o} h ${10 * o} v ${12 * o} h -${60 * o}
                    v -${12 * o} h ${10 * o} z`;
      break;
    case "KNIGHT":
      d = `M ${c - 20 * o} ${a + 30 * o}
                    h ${40 * o}
                    l -${7 * o} -${10 * o}
                    q ${5 * o} -${15 * o} ${7 * o} -${25 * o}
                    l -${5 * o} -${8 * o}
                    l -${5 * o} ${4 * o}
                    q -${8 * o} ${2 * o} -${14 * o} ${10 * o}
                    l -${5 * o} ${6 * o}
                    l ${4 * o} ${6 * o}
                    q ${5 * o} -${2 * o} ${8 * o} -${4 * o}
                    q -${2 * o} ${10 * o} ${2 * o} ${15 * o}
                    L ${c - 13 * o} ${a + 20 * o}
                    l -${7 * o} ${10 * o}
                    z`;
      break;
    case "BISHOP":
      d = `M ${c} ${a - 30 * o}
                    a ${8 * o} ${8 * o} 0 1 1 0 ${16 * o}
                    a ${8 * o} ${8 * o} 0 1 1 0 -${16 * o}
                    M ${c - 5 * o} ${a - 15 * o}
                    l -${10 * o} ${30 * o}
                    h ${30 * o}
                    l -${10 * o} -${30 * o}
                    M ${c - 20 * o} ${a + 15 * o}
                    h ${40 * o}
                    l -${5 * o} ${10 * o}
                    h -${30 * o} z`;
      break;
    case "QUEEN":
      d = `M ${c} ${a - 30 * o}
                    l -${5 * o} ${10 * o}
                    l -${10 * o} -${5 * o}
                    l -${5 * o} ${10 * o}
                    l -${10 * o} -${5 * o}
                    l 0 ${15 * o}
                    l -${5 * o} ${20 * o}
                    h ${70 * o}
                    l -${5 * o} -${20 * o}
                    v -${15 * o}
                    l -${10 * o} ${5 * o}
                    l -${5 * o} -${10 * o}
                    l -${10 * o} ${5 * o}
                    l -${5 * o} -${10 * o}
                    M ${c - 25 * o} ${a + 20 * o}
                    h ${50 * o}
                    l -${5 * o} ${8 * o}
                    h -${40 * o} z`;
      break;
    case "KING":
      d = `M ${c} ${a - 35 * o}
                    v ${10 * o}
                    h -${5 * o}
                    v ${5 * o}
                    h ${5 * o}
                    v ${5 * o}
                    l -${15 * o} ${20 * o}
                    l -${5 * o} ${15 * o}
                    h ${40 * o}
                    l -${5 * o} -${15 * o}
                    l -${15 * o} -${20 * o}
                    v -${5 * o}
                    h ${5 * o}
                    v -${5 * o}
                    h -${5 * o}
                    v -${10 * o}
                    M ${c - 20 * o} ${a + 20 * o}
                    h ${40 * o}
                    l -${5 * o} ${8 * o}
                    h -${30 * o} z`;
      break;
  }
  const g = document.createElementNS("http://www.w3.org/2000/svg", "path");
  (g.setAttribute("d", d), i.appendChild(g), h.appendChild(i));
}
function Y(h) {
  if (u.getGameMode() === "VS_AI" && u.getAIPlayer() === u.getCurrentPlayer()) return;
  const t = document.getElementById("board");
  if (!t) return;
  const e = t.getBoundingClientRect(),
    s = 40,
    n = 880 / e.width,
    i = 880 / e.height,
    r = (h.clientX - e.left) * n,
    l = (h.clientY - e.top) * i,
    c = r - s,
    a = l - s,
    o = 100,
    d = u.getGameMode() === "VS_AI" && u.getAIPlayer() === "WHITE";
  let g = Math.floor(c / o),
    f = Math.floor(a / o);
  (d && ((g = 7 - g), (f = 7 - f)), f >= 0 && f < 8 && g >= 0 && g < 8 && u.selectPiece(f, g));
}
function y() {
  const h = u.getCurrentPlayer(),
    t = document.querySelector(".turn-indicator"),
    e = document.getElementById("turn-text"),
    s = u.getState();
  t &&
    e &&
    ((t.className = `turn-indicator ${h.toLowerCase()}`),
    s === "CHECK"
      ? (e.textContent = `${m.getUIText(h === "WHITE" ? "whiteTurn" : "blackTurn")} - ${m.getUIText("check")}`)
      : (e.textContent = m.getUIText(h === "WHITE" ? "whiteTurn" : "blackTurn")));
  const n = document.getElementById("game-timer");
  n && (n.textContent = w.formatTime(u.getElapsedTime()));
  const i = document.getElementById("move-number");
  i && (i.textContent = u.getMoveCount().toString());
}
function v(h) {
  ["menu-view", "game-view", "result-view"].forEach((e) => {
    const s = document.getElementById(e);
    s && s.classList.toggle("hidden", e !== h);
  });
}
function E() {
  ((document.getElementById("game-title").textContent = m.getUIText("gameTitle")),
    (document.getElementById("menu-title").textContent = m.getUIText("menuTitle")),
    (document.getElementById("start-btn").textContent = m.getUIText("startGame")),
    (document.getElementById("new-game-btn").textContent = m.getUIText("newGame")),
    (document.getElementById("label-time").textContent = m.getUIText("time")),
    (document.getElementById("label-moves").textContent = m.getUIText("moves")),
    (document.getElementById("result-title").textContent = m.getUIText("gameOver")),
    (document.getElementById("label-total-time").textContent = m.getUIText("totalTime")),
    (document.getElementById("label-total-moves").textContent = m.getUIText("totalMoves")),
    (document.getElementById("restart-btn").textContent = m.getUIText("playAgain")),
    (document.getElementById("promotion-title").textContent = m.getUIText("promotion")),
    (document.getElementById("promotion-queen").textContent = m.getUIText("queen")),
    (document.getElementById("promotion-rook").textContent = m.getUIText("rook")),
    (document.getElementById("promotion-bishop").textContent = m.getUIText("bishop")),
    (document.getElementById("promotion-knight").textContent = m.getUIText("knight")),
    (document.getElementById("label-mode").textContent = m.getUIText("labelMode")),
    (document.getElementById("mode-two-player").textContent = m.getUIText("twoPlayers")),
    (document.getElementById("mode-vs-ai").textContent = m.getUIText("vsAI")),
    (document.getElementById("label-side").textContent = m.getUIText("labelSide")),
    (document.getElementById("side-white").textContent = m.getUIText("sideWhite")),
    (document.getElementById("side-black").textContent = m.getUIText("sideBlack")),
    (document.getElementById("high-scores-title").textContent = m.getUIText("highScores")),
    (document.getElementById("th-rank").textContent = m.getUIText("rank")),
    (document.getElementById("th-moves").textContent = m.getUIText("moves")),
    (document.getElementById("th-time").textContent = m.getUIText("time")),
    (document.getElementById("th-date").textContent = m.getUIText("date")),
    y());
}
u.onStateChange((h) => {
  h === "MENU"
    ? v("menu-view")
    : h === "PLAYING" || h === "CHECK"
      ? (v("game-view"), T(), y())
      : h === "RESULT" && (v("result-view"), F(), p());
});
u.onMove(() => {
  (T(), y());
});
u.onBoardUpdate(() => {
  T();
});
u.onTimerUpdate(() => {
  y();
});
u.onPromotion(() => {
  z();
});
function z() {
  const h = document.getElementById("promotion-modal");
  if (!h) return;
  (h.classList.remove("hidden"),
    h.querySelectorAll(".promotion-piece").forEach((e) => {
      const s = e.cloneNode(!0);
      (e.parentNode?.replaceChild(s, e),
        s.addEventListener(
          "click",
          () => {
            const n = s.dataset.piece;
            (u.promotePawn(n), h.classList.add("hidden"));
          },
          { once: !0 }
        ));
    }));
}
const S = () => `chess_highscores_${u.getAIPlayer() === "WHITE" ? "BLACK" : "WHITE"}`,
  F = () => {
    if (u.getFinalGameState() !== "CHECKMATE") return;
    const t = u.getWinner();
    if (!t || u.getGameMode() !== "VS_AI") return;
    const e = u.getAIPlayer() === "WHITE" ? "BLACK" : "WHITE";
    if (t !== e) return;
    const s = u.getMoveCount(),
      n = u.getElapsedTime(),
      i = Date.now();
    I = i;
    const r = { moves: s, time: n, date: i },
      l = S();
    w.saveHighScore(l, r, (c, a) => (c.moves !== a.moves ? c.moves - a.moves : c.time - a.time));
  };
function p() {
  v("result-view");
  const h = document.getElementById("winner-display"),
    t = document.getElementById("total-time"),
    e = document.getElementById("total-moves");
  if (h && t && e) {
    const s = u.getWinner(),
      n = u.getFinalGameState();
    let i = "";
    if (n === "STALEMATE")
      i = `
                <h3>${m.getUIText("stalemate")}</h3>
                <p>${m.getUIText("draw")}</p>
            `;
    else if (n === "CHECKMATE" && s) {
      const r = s === "WHITE" ? m.getUIText("whiteWins") : m.getUIText("blackWins");
      i = `
                <h3>${m.getUIText("checkmate")}</h3>
                <p>${r}</p>
            `;
    }
    ((h.innerHTML = i),
      (t.textContent = w.formatTime(u.getElapsedTime())),
      (e.textContent = u.getMoveCount().toString()));
  }
  X();
}
function X() {
  const h = document.querySelector(".high-scores-container");
  if (u.getGameMode() !== "VS_AI") {
    h && h.classList.add("hidden");
    return;
  }
  h && h.classList.remove("hidden");
  const t = S(),
    e = w.getHighScores(t),
    s = document.getElementById("high-scores-body");
  s &&
    ((s.innerHTML = ""),
    e.forEach((n, i) => {
      const r = document.createElement("tr");
      n.date === I && r.classList.add("current-run");
      const l = w.formatDate(n.date, m.language);
      ((r.innerHTML = `
                <td>${i + 1}</td>
                <td>${n.moves}</td>
                <td>${w.formatTime(n.time)}</td>
                <td>${l}</td>
            `),
        s.appendChild(r));
    }));
}
m.subscribe((h) => {
  ((document.documentElement.dir = h === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((t) => {
      t.classList.toggle("active", t.dataset.lang === h);
    }),
    E(),
    u.getState() === "RESULT" && p());
});
R();
