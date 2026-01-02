import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as z, u as c, L as E } from "./util-BKt39bz_.js";
class B {
  state = "MENU";
  boardSize = 3;
  board = [];
  emptyIndex = 0;
  moves = 0;
  puzzleType = "NUMBERS";
  startTime = 0;
  elapsedTime = 0;
  stateListeners = [];
  boardListeners = [];
  movesListeners = [];
  timerUpdateListeners = [];
  constructor() {}
  setBoardSize(e) {
    this.boardSize = e;
  }
  setPuzzleType(e) {
    this.puzzleType = e;
  }
  getBoardSize() {
    return this.boardSize;
  }
  start() {
    const e = this.boardSize * this.boardSize;
    this.board = [];
    for (let s = 1; s < e; s++) this.board.push(s);
    (this.board.push(null),
      (this.emptyIndex = e - 1),
      this.shuffle(),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      this.setState("PLAYING"),
      this.emitBoardUpdate(),
      this.emitMovesUpdate(),
      this.startTimer());
  }
  shuffle() {
    const e = this.boardSize * this.boardSize * 50;
    for (let s = 0; s < e; s++) {
      const n = this.getValidMoves();
      if (n.length > 0) {
        const i = n[Math.floor(Math.random() * n.length)];
        this.swap(i, this.emptyIndex);
      }
    }
  }
  getValidMoves() {
    const e = [],
      s = Math.floor(this.emptyIndex / this.boardSize),
      n = this.emptyIndex % this.boardSize,
      i = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
    for (const { dr: r, dc: l } of i) {
      const d = s + r,
        m = n + l;
      d >= 0 &&
        d < this.boardSize &&
        m >= 0 &&
        m < this.boardSize &&
        e.push(d * this.boardSize + m);
    }
    return e;
  }
  swap(e, s) {
    (([this.board[e], this.board[s]] = [this.board[s], this.board[e]]),
      this.board[e] === null
        ? (this.emptyIndex = e)
        : this.board[s] === null && (this.emptyIndex = s));
  }
  makeMove(e) {
    return this.state !== "PLAYING" || !this.getValidMoves().includes(e)
      ? !1
      : (this.swap(e, this.emptyIndex),
        this.moves++,
        this.emitBoardUpdate(),
        this.emitMovesUpdate(),
        this.checkWin() &&
          ((this.elapsedTime = Date.now() - this.startTime),
          this.stopTimer(),
          this.setState("WON")),
        !0);
  }
  checkWin() {
    const e = this.boardSize * this.boardSize;
    for (let s = 0; s < e - 1; s++) if (this.board[s] !== s + 1) return !1;
    return this.board[e - 1] === null;
  }
  restart() {
    (this.stopTimer(), this.setState("MENU"));
  }
  startTimer() {
    (this.stopTimer(),
      (this.timerInterval = window.setInterval(() => {
        ((this.elapsedTime = Date.now() - this.startTime), this.notifyTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval && (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  timerInterval = null;
  getState() {
    return this.state;
  }
  getPuzzleType() {
    return this.puzzleType;
  }
  getBoard() {
    return [...this.board];
  }
  getMoves() {
    return this.moves;
  }
  getElapsedTime() {
    return this.state === "PLAYING" ? Date.now() - this.startTime : this.elapsedTime;
  }
  getEmptyIndex() {
    return this.emptyIndex;
  }
  setState(e) {
    ((this.state = e),
      e !== "PLAYING" && this.stopTimer(),
      this.stateListeners.forEach((s) => s(this.state)));
  }
  onStateChange(e) {
    this.stateListeners.push(e);
  }
  onBoardUpdate(e) {
    this.boardListeners.push(e);
  }
  onMovesUpdate(e) {
    this.movesListeners.push(e);
  }
  onTimerUpdate(e) {
    this.timerUpdateListeners.push(e);
  }
  emitBoardUpdate() {
    this.boardListeners.forEach((e) => e());
  }
  emitMovesUpdate() {
    this.movesListeners.forEach((e) => e(this.moves));
  }
  notifyTimerUpdate() {
    this.timerUpdateListeners.forEach((e) => e(this.elapsedTime));
  }
}
const a = new B(),
  x = {
    ui: {
      gameTitle: "Sliding Puzzle",
      gameSetup: "Game Setup",
      boardSize: "Board Size",
      startGame: "Start Game",
      newGame: "New Game",
      time: "Time",
      moves: "Moves",
      gameOver: "Puzzle Solved!",
      congratulations: "Congratulations! You solved the puzzle!",
      totalTime: "Total Time",
      totalMoves: "Total Moves",
      playAgain: "Play Again",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
      reference: "Goal:",
      puzzleType: "Puzzle Type",
      typeNumbers: "Numbers",
      typeImage: "Image",
      showNumbers: "Show Numbers",
    },
  },
  L = {
    ui: {
      gameTitle: "スライドパズル",
      gameSetup: "ゲーム設定",
      boardSize: "ボードサイズ",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      time: "時間",
      moves: "手数",
      gameOver: "パズル完成！",
      congratulations: "おめでとうございます！パズルを完成しました！",
      totalTime: "合計時間",
      totalMoves: "合計手数",
      playAgain: "もう一度プレイ",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
      reference: "目標:",
      puzzleType: "パズルの種類",
      typeNumbers: "数字",
      typeImage: "画像",
      showNumbers: "数字を表示",
    },
  },
  w = {
    ui: {
      gameTitle: "Xếp hình",
      gameSetup: "Thiết lập trò chơi",
      boardSize: "Kích thước bảng",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      time: "Thời gian",
      moves: "Số nước",
      gameOver: "Hoàn thành!",
      congratulations: "Chúc mừng! Bạn đã hoàn thành trò chơi!",
      totalTime: "Tổng thời gian",
      totalMoves: "Tổng số nước",
      playAgain: "Chơi lại",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
      reference: "Mục tiêu:",
      puzzleType: "Loại câu đố",
      typeNumbers: "Số",
      typeImage: "Hình ảnh",
      showNumbers: "Hiện số",
    },
  },
  M = {
    ui: {
      gameTitle: "滑块拼图",
      gameSetup: "游戏设置",
      boardSize: "棋盘大小",
      startGame: "开始游戏",
      newGame: "新游戏",
      time: "时间",
      moves: "移动次数",
      gameOver: "拼图完成！",
      congratulations: "恭喜！您完成了拼图！",
      totalTime: "总时间",
      totalMoves: "总移动次数",
      playAgain: "再玩一次",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
      reference: "目标：",
      puzzleType: "拼图类型",
      typeNumbers: "数字",
      typeImage: "图片",
      showNumbers: "显示数字",
    },
  },
  U = {
    ui: {
      gameTitle: "لعبة الألغاز المنزلقة",
      gameSetup: "إعداد اللعبة",
      boardSize: "حجم اللوحة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      time: "الوقت",
      moves: "الحركات",
      gameOver: "تم حل اللغز!",
      congratulations: "تهانينا! لقد قمت بحل اللغز!",
      totalTime: "الوقت الإجمالي",
      totalMoves: "إجمالي الحركات",
      playAgain: "العب مرة أخرى",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
      reference: "الهدف:",
      puzzleType: "نوع اللغز",
      typeNumbers: "أرقام",
      typeImage: "صورة",
      showNumbers: "إظهار الأرقام",
    },
  },
  v = "./assets/nature.png";
let h = null;
new z();
const C = localStorage.getItem("language"),
  o = new E({ en: x, ja: L, vi: w, zh: M, ar: U }, C || "en"),
  N = () => {
    (A(),
      T(),
      document.querySelectorAll(".lang-btn").forEach((t) => {
        t.classList.toggle("active", t.dataset.lang === o.language);
      }),
      G());
  },
  k = () => {
    const t = document.querySelector(".size-btn.active"),
      e = document.querySelector(".type-btn.active");
    if (t && e) {
      const s = parseInt(t.dataset.size || "3"),
        n = e.dataset.type || "NUMBERS";
      localStorage.setItem("sliding_setup", JSON.stringify({ size: s, type: n }));
    }
  },
  G = () => {
    try {
      const t = localStorage.getItem("sliding_setup");
      if (t) {
        const { size: e, type: s } = JSON.parse(t);
        (document.querySelectorAll(".size-btn").forEach((n) => {
          parseInt(n.dataset.size || "0") === e
            ? (n.classList.add("active"), a.setBoardSize(e))
            : n.classList.remove("active");
        }),
          s &&
            document.querySelectorAll(".type-btn").forEach((n) => {
              n.dataset.type === s
                ? (n.classList.add("active"), a.setPuzzleType(s))
                : n.classList.remove("active");
            }));
      }
    } catch (t) {
      console.error("Failed to load sliding puzzle setup:", t);
    }
  },
  T = () => {
    ((document.getElementById("game-title").textContent = o.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = o.getUIText("gameSetup")),
      (document.getElementById("label-board-size").textContent = o.getUIText("boardSize")),
      (document.getElementById("start-btn").textContent = o.getUIText("startGame")),
      (document.getElementById("label-time").textContent = o.getUIText("time")),
      (document.getElementById("label-moves").textContent = o.getUIText("moves")),
      (document.getElementById("new-game-btn").textContent = o.getUIText("newGame")),
      (document.getElementById("result-title").textContent = o.getUIText("gameOver")),
      (document.getElementById("result-message").textContent = o.getUIText("congratulations")),
      (document.getElementById("label-total-time").textContent = o.getUIText("totalTime")),
      (document.getElementById("label-total-moves").textContent = o.getUIText("totalMoves")),
      (document.getElementById("play-again-btn").textContent = o.getUIText("playAgain")),
      (document.getElementById("high-scores-title").textContent = o.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = o.getUIText("rank")),
      (document.getElementById("th-moves").textContent = o.getUIText("moves")),
      (document.getElementById("th-time").textContent = o.getUIText("time")),
      (document.getElementById("th-date").textContent = o.getUIText("date")),
      (document.getElementById("reference-label").textContent = o.getUIText("reference")),
      (document.getElementById("label-puzzle-type").textContent = o.getUIText("puzzleType")),
      (document.getElementById("btn-type-numbers").textContent = o.getUIText("typeNumbers")),
      (document.getElementById("btn-type-image").textContent = o.getUIText("typeImage")),
      (document.getElementById("label-show-numbers").textContent =
        o.getUIText("showNumbers") || "Show Numbers"));
  },
  A = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((t) => {
        t.addEventListener("click", (e) => {
          const s = e.target.dataset.lang;
          o.setLanguage(s);
        });
      }),
      document.querySelectorAll(".size-btn").forEach((t) => {
        t.addEventListener("click", (e) => {
          const s = e.target,
            n = parseInt(s.dataset.size || "3");
          (document.querySelectorAll(".size-btn").forEach((i) => i.classList.remove("active")),
            s.classList.add("active"),
            a.setBoardSize(n));
        });
      }),
      document.querySelectorAll(".type-btn").forEach((t) => {
        t.addEventListener("click", (e) => {
          const s = e.target,
            n = s.dataset.type;
          (document.querySelectorAll(".type-btn").forEach((i) => i.classList.remove("active")),
            s.classList.add("active"),
            a.setPuzzleType(n));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        (k(), (h = null), a.start());
      }),
      document.getElementById("show-numbers-check")?.addEventListener("change", () => {
        g();
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        a.restart();
      }),
      document.getElementById("play-again-btn")?.addEventListener("click", () => {
        a.restart();
      }));
  },
  P = () => {
    const t = document.getElementById("reference-board");
    if (!t) return;
    t.innerHTML = "";
    const e = a.getBoardSize(),
      s = a.getPuzzleType(),
      n = e * e;
    ((t.style.gridTemplateColumns = `repeat(${e}, 1fr)`), (t.dataset.size = e.toString()));
    for (let r = 1; r < n; r++) {
      const l = document.createElement("div");
      if (((l.className = "tile"), s === "IMAGE")) {
        (l.classList.add("image-mode"), (l.style.backgroundImage = `url(${v})`));
        const { x: d, y: m } = I(r - 1, e);
        l.style.backgroundPosition = `${d}% ${m}%`;
      }
      ((l.textContent = r.toString()), t.appendChild(l));
    }
    const i = document.createElement("div");
    ((i.className = "tile empty"), t.appendChild(i));
  },
  g = () => {
    const t = document.getElementById("puzzle-board");
    if (!t) return;
    t.innerHTML = "";
    const e = a.getBoard(),
      s = a.getBoardSize(),
      n = a.getPuzzleType(),
      i = document.getElementById("show-numbers-check")?.checked;
    ((t.style.gridTemplateColumns = `repeat(${s}, 1fr)`), (t.dataset.size = s.toString()));
    const r = document.getElementById("image-controls");
    (r && r.classList.toggle("hidden", n !== "IMAGE"),
      e.forEach((l, d) => {
        const m = document.createElement("div");
        if (l === null) m.className = "tile empty";
        else {
          if (((m.className = "tile"), n === "IMAGE")) {
            (m.classList.add("image-mode"),
              i && m.classList.add("show-numbers"),
              (m.style.backgroundImage = `url(${v})`));
            const { x: y, y: S } = I(l - 1, s);
            m.style.backgroundPosition = `${y}% ${S}%`;
          }
          ((m.textContent = l.toString()),
            (m.dataset.value = l.toString()),
            m.addEventListener("click", () => {
              a.makeMove(d) && H(m);
            }));
        }
        t.appendChild(m);
      }));
  },
  I = (t, e) => {
    const s = Math.floor(t / e),
      i = ((t % e) / (e - 1)) * 100,
      r = (s / (e - 1)) * 100;
    return { x: i, y: r };
  },
  H = (t) => {
    (t.classList.add("moving"),
      setTimeout(() => {
        (t.classList.remove("moving"), g());
      }, 200));
  },
  p = () => {
    const t = document.getElementById("time-display");
    t && (t.textContent = c.formatTime(a.getElapsedTime()));
    const e = document.getElementById("moves-display");
    e && (e.textContent = a.getMoves().toString());
  },
  u = (t) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const s = document.getElementById(e);
      s && (e === t ? s.classList.remove("hidden") : s.classList.add("hidden"));
    });
  };
a.onStateChange((t) => {
  (t === "MENU" && u("menu-view"),
    t === "PLAYING" && (u("game-view"), P(), g(), p()),
    t === "WON" && (u("result-view"), $(), b()));
});
a.onTimerUpdate(() => {
  p();
});
a.onBoardUpdate(() => {
  g();
});
a.onMovesUpdate(() => {
  p();
});
const f = () => {
    const t = a.getBoardSize();
    return `sliding_highscores_${t}x${t}`;
  },
  $ = () => {
    const t = a.getMoves(),
      e = a.getElapsedTime(),
      s = Date.now();
    h = s;
    const n = { moves: t, time: e, date: s },
      i = f();
    c.saveHighScore(i, n, (r, l) => (r.moves !== l.moves ? r.moves - l.moves : r.time - l.time));
  },
  b = () => {
    const t = document.getElementById("final-time"),
      e = document.getElementById("final-moves");
    (t && (t.textContent = c.formatTime(a.getElapsedTime())),
      e && (e.textContent = a.getMoves().toString()),
      D());
  },
  D = () => {
    const t = f(),
      e = c.getHighScores(t),
      s = document.getElementById("high-scores-body");
    s &&
      ((s.innerHTML = ""),
      e.forEach((n, i) => {
        const r = document.createElement("tr");
        n.date === h && r.classList.add("current-run");
        const l = c.formatDate(n.date, o.language);
        ((r.innerHTML = `
                <td>${i + 1}</td>
                <td>${n.moves}</td>
                <td>${c.formatTime(n.time)}</td>
                <td>${l}</td>
            `),
          s.appendChild(r));
      }));
  };
o.subscribe((t) => {
  ((document.documentElement.dir = t === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === t);
    }),
    T(),
    a.getState() === "WON" && b());
});
N();
