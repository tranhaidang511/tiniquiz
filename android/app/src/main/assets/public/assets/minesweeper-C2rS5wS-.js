import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as A, u as f, L as D } from "./util-BKt39bz_.js";
const v = {
  EASY: { rows: 9, cols: 9, mines: 10 },
  MEDIUM: { rows: 16, cols: 16, mines: 40 },
  HARD: { rows: 16, cols: 30, mines: 99 },
};
class N {
  state = "MENU";
  difficulty = "EASY";
  board = [];
  config = v.EASY;
  flagsPlaced = 0;
  cellsRevealed = 0;
  startTime = 0;
  elapsedTime = 0;
  firstClick = !0;
  stateListeners = [];
  timerListeners = [];
  minesListeners = [];
  constructor() {
    this.initializeEmptyBoard();
  }
  initializeEmptyBoard() {
    this.board = [];
    for (let e = 0; e < this.config.rows; e++) {
      const t = [];
      for (let i = 0; i < this.config.cols; i++)
        t.push({ row: e, col: i, isMine: !1, isRevealed: !1, isFlagged: !1, neighborMines: 0 });
      this.board.push(t);
    }
  }
  setDifficulty(e) {
    ((this.difficulty = e), e !== "CUSTOM" && (this.config = v[e]));
  }
  setCustomConfig(e) {
    const t = Math.max(5, Math.min(30, e.rows)),
      i = Math.max(5, Math.min(30, e.cols)),
      s = t * i - 1,
      o = Math.max(1, Math.min(s, e.mines));
    ((this.config = { rows: t, cols: i, mines: o }), (this.difficulty = "CUSTOM"));
  }
  getDifficulty() {
    return this.difficulty;
  }
  getConfig() {
    return this.config;
  }
  start() {
    (this.difficulty !== "CUSTOM" && (this.config = v[this.difficulty]),
      this.initializeEmptyBoard(),
      (this.flagsPlaced = 0),
      (this.cellsRevealed = 0),
      (this.firstClick = !0),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      this.setState("PLAYING"),
      this.startTimer(),
      this.emitMinesUpdate());
  }
  generateMines(e, t) {
    const i = [];
    for (let s = 0; s < this.config.rows; s++)
      for (let o = 0; o < this.config.cols; o++)
        (Math.abs(s - e) <= 1 && Math.abs(o - t) <= 1) || i.push({ row: s, col: o });
    this.shuffleArray(i);
    for (let s = 0; s < this.config.mines && s < i.length; s++) {
      const { row: o, col: r } = i[s];
      this.board[o][r].isMine = !0;
    }
    this.calculateNeighborMines();
  }
  shuffleArray(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const i = Math.floor(Math.random() * (t + 1));
      [e[t], e[i]] = [e[i], e[t]];
    }
  }
  calculateNeighborMines() {
    for (let e = 0; e < this.config.rows; e++)
      for (let t = 0; t < this.config.cols; t++)
        if (!this.board[e][t].isMine) {
          let i = 0;
          for (let s = -1; s <= 1; s++)
            for (let o = -1; o <= 1; o++) {
              if (s === 0 && o === 0) continue;
              const r = e + s,
                c = t + o;
              this.isValidCell(r, c) && this.board[r][c].isMine && i++;
            }
          this.board[e][t].neighborMines = i;
        }
  }
  isValidCell(e, t) {
    return e >= 0 && e < this.config.rows && t >= 0 && t < this.config.cols;
  }
  revealCell(e, t) {
    if (this.state !== "PLAYING" || !this.isValidCell(e, t)) return;
    const i = this.board[e][t];
    if (!(i.isRevealed || i.isFlagged)) {
      if (
        (this.firstClick && (this.generateMines(e, t), (this.firstClick = !1)),
        (i.isRevealed = !0),
        this.cellsRevealed++,
        i.isMine)
      ) {
        (this.revealAllMines(), this.stopTimer(), this.setState("LOST"));
        return;
      }
      (i.neighborMines === 0 && this.revealNeighbors(e, t), this.checkWin());
    }
  }
  revealNeighbors(e, t) {
    for (let i = -1; i <= 1; i++)
      for (let s = -1; s <= 1; s++) {
        if (i === 0 && s === 0) continue;
        const o = e + i,
          r = t + s;
        if (this.isValidCell(o, r)) {
          const c = this.board[o][r];
          !c.isRevealed &&
            !c.isFlagged &&
            !c.isMine &&
            ((c.isRevealed = !0),
            this.cellsRevealed++,
            c.neighborMines === 0 && this.revealNeighbors(o, r));
        }
      }
  }
  revealAllMines() {
    for (let e = 0; e < this.config.rows; e++)
      for (let t = 0; t < this.config.cols; t++)
        this.board[e][t].isMine && (this.board[e][t].isRevealed = !0);
  }
  toggleFlag(e, t) {
    if (this.state !== "PLAYING" || !this.isValidCell(e, t)) return;
    const i = this.board[e][t];
    i.isRevealed ||
      ((i.isFlagged = !i.isFlagged),
      (this.flagsPlaced += i.isFlagged ? 1 : -1),
      this.emitMinesUpdate());
  }
  checkWin() {
    const t = this.config.rows * this.config.cols - this.config.mines;
    this.cellsRevealed === t && (this.stopTimer(), this.setState("WON"));
  }
  reset() {
    this.start();
  }
  restart() {
    (this.setState("MENU"), this.stopTimer());
  }
  timerInterval = null;
  startTimer() {
    (this.stopTimer(),
      (this.timerInterval = window.setInterval(() => {
        this.state === "PLAYING" &&
          ((this.elapsedTime = Date.now() - this.startTime), this.emitTimerUpdate());
      }, 1e3)));
  }
  stopTimer() {
    this.timerInterval !== null && (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  setState(e) {
    ((this.state = e), this.stateListeners.forEach((t) => t(this.state)));
  }
  getState() {
    return this.state;
  }
  getBoard() {
    return this.board;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  getRemainingMines() {
    return this.config.mines - this.flagsPlaced;
  }
  onStateChange(e) {
    this.stateListeners.push(e);
  }
  onTimerUpdate(e) {
    this.timerListeners.push(e);
  }
  onMinesUpdate(e) {
    this.minesListeners.push(e);
  }
  emitTimerUpdate() {
    this.timerListeners.forEach((e) => e(this.elapsedTime));
  }
  emitMinesUpdate() {
    this.minesListeners.forEach((e) => e(this.getRemainingMines()));
  }
}
const l = new N(),
  O = {
    ui: {
      gameTitle: "Minesweeper",
      gameSetup: "Game Setup",
      difficulty: "Difficulty",
      beginner: "Beginner",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      expert: "Expert",
      custom: "Custom",
      rows: "Rows",
      cols: "Cols",
      startGame: "Start Game",
      newGame: "New Game",
      time: "Time",
      mines: "Mines",
      gameOver: "Game Over!",
      youWin: "You Win!",
      congratulations: "Congratulations! You cleared the board!",
      hitMine: "You hit a mine!",
      totalTime: "Total Time",
      playAgain: "Play Again",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
    },
  },
  k = {
    ui: {
      gameTitle: "マインスイーパー",
      gameSetup: "ゲーム設定",
      difficulty: "難易度",
      beginner: "初級",
      easy: "簡単",
      medium: "中級",
      hard: "上級",
      expert: "エキスパート",
      custom: "カスタム",
      rows: "行",
      cols: "列",
      startGame: "ゲーム開始",
      newGame: "新しいゲーム",
      time: "時間",
      mines: "地雷",
      gameOver: "ゲームオーバー！",
      youWin: "勝利！",
      congratulations: "おめでとうございます！ボードをクリアしました！",
      hitMine: "地雷を踏みました！",
      totalTime: "合計時間",
      playAgain: "もう一度プレイ",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
    },
  },
  G = {
    ui: {
      gameTitle: "Dò mìn",
      gameSetup: "Thiết lập trò chơi",
      difficulty: "Độ khó",
      beginner: "Nhập môn",
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      expert: "Chuyên gia",
      custom: "Tùy chỉnh",
      rows: "Hàng",
      cols: "Cột",
      startGame: "Bắt đầu",
      newGame: "Ván mới",
      time: "Thời gian",
      mines: "Mìn",
      gameOver: "Kết thúc!",
      youWin: "Bạn thắng!",
      congratulations: "Chúc mừng! Bạn đã dọn sạch bảng!",
      hitMine: "Bạn đã đạp phải mìn!",
      totalTime: "Tổng thời gian",
      playAgain: "Chơi lại",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
    },
  },
  R = {
    ui: {
      gameTitle: "扫雷",
      gameSetup: "游戏设置",
      difficulty: "难度",
      beginner: "入门",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      expert: "专家",
      custom: "自定义",
      rows: "行数",
      cols: "列数",
      startGame: "开始游戏",
      newGame: "新游戏",
      time: "时间",
      mines: "地雷",
      gameOver: "游戏结束！",
      youWin: "您获胜！",
      congratulations: "恭喜！您清除了所有地雷！",
      hitMine: "您踩到地雷了！",
      totalTime: "总时间",
      playAgain: "再玩一次",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
    },
  },
  W = {
    ui: {
      gameTitle: "كنس الألغام",
      gameSetup: "إعداد اللعبة",
      difficulty: "الصعوبة",
      beginner: "مبتدئ",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      expert: "خبير",
      custom: "تخصيص",
      rows: "الصفوف",
      cols: "الأعمدة",
      startGame: "ابدأ اللعبة",
      newGame: "لعبة جديدة",
      time: "الوقت",
      mines: "الألغام",
      gameOver: "انتهت اللعبة!",
      youWin: "أنت فزت!",
      congratulations: "تهانينا! لقد قمت بتطهير اللوحة!",
      hitMine: "لقد اصطدمت بلغم!",
      totalTime: "الوقت الإجمالي",
      playAgain: "العب مرة أخرى",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
    },
  };
let w = null;
new A();
const Y = localStorage.getItem("language"),
  a = new D({ en: O, ja: k, vi: G, zh: R, ar: W }, Y || "en");
let p = { rows: 10, cols: 10, mines: 10 };
const F = () => {
    (P(),
      S(),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.classList.toggle("active", n.dataset.lang === a.language);
      }),
      H());
  },
  q = () => {
    const n = document.querySelector(".diff-btn.active");
    if (n) {
      const e = n.dataset.diff;
      if (e === "CUSTOM") {
        const t = document.getElementById("custom-rows"),
          i = document.getElementById("custom-cols"),
          s = document.getElementById("custom-mines");
        p = { rows: parseInt(t.value), cols: parseInt(i.value), mines: parseInt(s.value) };
      }
      localStorage.setItem("minesweeper_setup", JSON.stringify({ difficulty: e, customConfig: p }));
    }
  },
  H = () => {
    try {
      const n = localStorage.getItem("minesweeper_setup");
      if (n) {
        const { difficulty: e, customConfig: t } = JSON.parse(n);
        if (t) {
          const i = document.getElementById("custom-rows"),
            s = document.getElementById("custom-cols"),
            o = document.getElementById("custom-mines");
          (i && t.rows && (i.value = t.rows),
            s && t.cols && (s.value = t.cols),
            o && t.mines && (o.value = t.mines),
            e === "CUSTOM" && l.setCustomConfig(t));
        }
        document.querySelectorAll(".diff-btn").forEach((i) => {
          i.dataset.diff === e
            ? (i.classList.add("active"), l.setDifficulty(e), b(e))
            : i.classList.remove("active");
        });
      }
    } catch (n) {
      console.error("Failed to load Minesweeper setup:", n);
    }
  },
  S = () => {
    ((document.getElementById("game-title").textContent = a.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = a.getUIText("gameSetup")),
      (document.getElementById("label-difficulty").textContent = a.getUIText("difficulty")),
      document.querySelectorAll(".diff-btn").forEach((s) => {
        const o = s.dataset.diff;
        o && (s.textContent = a.getUIText(o.toLowerCase()));
      }),
      (document.getElementById("start-btn").textContent = a.getUIText("startGame")),
      (document.getElementById("label-time").textContent = a.getUIText("time")),
      (document.getElementById("label-mines").textContent = a.getUIText("mines")),
      (document.getElementById("new-game-btn").textContent = a.getUIText("newGame")),
      (document.getElementById("label-total-time").textContent = a.getUIText("totalTime")),
      (document.getElementById("play-again-btn").textContent = a.getUIText("playAgain")),
      (document.getElementById("high-scores-title").textContent = a.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = a.getUIText("rank")),
      (document.getElementById("th-time").textContent = a.getUIText("time")),
      (document.getElementById("th-date").textContent = a.getUIText("date")));
    const e = document.querySelector('label[for="custom-rows"]'),
      t = document.querySelector('label[for="custom-cols"]'),
      i = document.querySelector('label[for="custom-mines"]');
    (e && (e.textContent = a.getUIText("rows")),
      t && (t.textContent = a.getUIText("cols")),
      i && (i.textContent = a.getUIText("mines")));
  },
  P = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target.dataset.lang;
          a.setLanguage(t);
        });
      }),
      document.querySelectorAll(".diff-btn").forEach((n) => {
        n.addEventListener("click", (e) => {
          const t = e.target,
            i = t.dataset.diff;
          (document.querySelectorAll(".diff-btn").forEach((s) => s.classList.remove("active")),
            t.classList.add("active"),
            l.setDifficulty(i),
            b(i));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        if (document.querySelector(".diff-btn.active")?.dataset.diff === "CUSTOM") {
          const t = document.getElementById("custom-rows"),
            i = document.getElementById("custom-cols"),
            s = document.getElementById("custom-mines"),
            o = parseInt(t.value),
            r = parseInt(i.value),
            c = parseInt(s.value);
          l.setCustomConfig({ rows: o, cols: r, mines: c });
        }
        (q(), (w = null), l.start());
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        l.restart();
      }),
      document.getElementById("play-again-btn")?.addEventListener("click", () => {
        l.restart();
      }));
  },
  b = (n) => {
    const e = document.getElementById("custom-setup"),
      t = document.getElementById("custom-rows"),
      i = document.getElementById("custom-cols"),
      s = document.getElementById("custom-mines");
    if (e && t && i && s)
      if ((e.classList.remove("hidden"), n === "CUSTOM"))
        ((t.disabled = !1),
          (i.disabled = !1),
          (s.disabled = !1),
          (t.value = p.rows.toString()),
          (i.value = p.cols.toString()),
          (s.value = p.mines.toString()));
      else {
        ((t.disabled = !0), (i.disabled = !0), (s.disabled = !0));
        const o = l.getConfig();
        ((t.value = o.rows.toString()),
          (i.value = o.cols.toString()),
          (s.value = o.mines.toString()));
      }
  },
  z = () => {
    const n = document.getElementById("minesweeper-board");
    if (!n) return;
    n.innerHTML = "";
    const e = l.getBoard(),
      t = l.getConfig();
    n.style.gridTemplateColumns = `repeat(${t.cols}, 1fr)`;
    const i = Math.min(window.innerWidth - 32, 800),
      s = 50,
      o = 20,
      r = i - t.cols * 1;
    let c = Math.floor(r / t.cols);
    ((c = Math.max(o, Math.min(s, c))),
      n.style.setProperty("--cell-size", `${c}px`),
      e.forEach((B) => {
        B.forEach((u) => {
          const d = document.createElement("div");
          ((d.className = "cell"),
            (d.dataset.row = u.row.toString()),
            (d.dataset.col = u.col.toString()),
            d.addEventListener("click", () => {
              (l.revealCell(u.row, u.col), h());
            }),
            d.addEventListener("contextmenu", (m) => {
              (m.preventDefault(), l.toggleFlag(u.row, u.col), h());
            }));
          let g = null,
            y = !1,
            E = 0,
            C = 0;
          (d.addEventListener(
            "touchstart",
            (m) => {
              m.touches.length === 1 &&
                ((E = m.touches[0].clientX),
                (C = m.touches[0].clientY),
                (y = !1),
                (g = window.setTimeout(() => {
                  ((y = !0),
                    navigator.vibrate && navigator.vibrate(50),
                    l.toggleFlag(u.row, u.col),
                    h());
                }, 500)));
            },
            { passive: !0 }
          ),
            d.addEventListener(
              "touchmove",
              (m) => {
                if (!g) return;
                const L = m.touches[0].clientX,
                  U = m.touches[0].clientY;
                (Math.abs(L - E) > 10 || Math.abs(U - C) > 10) && (clearTimeout(g), (g = null));
              },
              { passive: !0 }
            ),
            d.addEventListener("touchend", (m) => {
              (g && (clearTimeout(g), (g = null)), y && m.cancelable && m.preventDefault());
            }),
            n.appendChild(d));
        });
      }),
      h());
  },
  h = () => {
    l.getBoard().forEach((e) => {
      e.forEach((t) => {
        const i = document.querySelector(`[data-row="${t.row}"][data-col="${t.col}"]`);
        i &&
          ((i.className = "cell"),
          t.isRevealed
            ? (i.classList.add("revealed"),
              t.isMine
                ? (i.classList.add("mine"), (i.textContent = "💣"))
                : t.neighborMines > 0
                  ? ((i.textContent = t.neighborMines.toString()),
                    (i.dataset.num = t.neighborMines.toString()))
                  : (i.textContent = ""))
            : t.isFlagged
              ? (i.classList.add("flagged"), (i.textContent = "🚩"))
              : (i.textContent = ""));
      });
    });
  },
  T = () => {
    const n = document.getElementById("time-display");
    n && (n.textContent = f.formatTime(l.getElapsedTime()));
    const e = document.getElementById("mines-display");
    e && (e.textContent = l.getRemainingMines().toString());
  },
  I = (n) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const t = document.getElementById(e);
      t && (e === n ? t.classList.remove("hidden") : t.classList.add("hidden"));
    });
  };
l.onStateChange((n) => {
  (n === "MENU" && I("menu-view"),
    n === "PLAYING" && (I("game-view"), z(), T()),
    (n === "WON" || n === "LOST") && (I("result-view"), h(), n === "WON" && $(), x()));
});
l.onTimerUpdate(() => {
  T();
});
l.onMinesUpdate(() => {
  T();
});
const M = () => {
    const n = l.getConfig();
    return `minesweeper_highscores_${n.rows}_${n.cols}_${n.mines}`;
  },
  $ = () => {
    const n = l.getElapsedTime(),
      e = Date.now();
    w = e;
    const t = { time: n, date: e },
      i = M();
    f.saveHighScore(i, t, (s, o) => s.time - o.time);
  },
  x = () => {
    const n = document.getElementById("result-title"),
      e = document.getElementById("result-message"),
      t = document.getElementById("final-time"),
      i = l.getState() === "WON";
    (n && (n.textContent = i ? a.getUIText("youWin") : a.getUIText("gameOver")),
      e && (e.textContent = i ? a.getUIText("congratulations") : a.getUIText("hitMine")),
      t && (t.textContent = f.formatTime(l.getElapsedTime())),
      V());
  },
  V = () => {
    const n = M(),
      e = f.getHighScores(n),
      t = document.getElementById("high-scores-body");
    t &&
      ((t.innerHTML = ""),
      e.forEach((i, s) => {
        const o = document.createElement("tr");
        i.date === w && o.classList.add("current-run");
        const r = f.formatDate(i.date, a.language);
        ((o.innerHTML = `
                <td>${s + 1}</td>
                <td>${f.formatTime(i.time)}</td>
                <td>${r}</td>
            `),
          t.appendChild(o));
      }));
  };
a.subscribe((n) => {
  ((document.documentElement.dir = n === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === n);
    }),
    S(),
    (l.getState() === "WON" || l.getState() === "LOST") && x());
});
F();
