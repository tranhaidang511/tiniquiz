import "./modulepreload-polyfill-B5Qt9EMX.js";
import { C as k, u as h, L as T } from "./util-BKt39bz_.js";
class v {
  state = "MENU";
  difficulty = "BEGINNER";
  board = [];
  solution = [];
  mistakes = 0;
  maxMistakes = 3;
  hintsUsed = 0;
  maxHints = 10;
  startTime = 0;
  elapsedTime = 0;
  selectedCell = null;
  notesMode = !1;
  stateListeners = [];
  cellUpdateListeners = [];
  mistakeListeners = [];
  timeListeners = [];
  constructor() {
    this.initializeEmptyBoard();
  }
  initializeEmptyBoard() {
    ((this.board = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({ value: null, isFixed: !1, notes: new Set(), isError: !1 }))
      )),
      (this.solution = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0))));
  }
  setDifficulty(e) {
    this.difficulty = e;
  }
  getDifficulty() {
    return this.difficulty;
  }
  start() {
    (this.initializeEmptyBoard(),
      this.generatePuzzle(),
      (this.mistakes = 0),
      (this.hintsUsed = 0),
      (this.startTime = Date.now()),
      (this.elapsedTime = 0),
      (this.selectedCell = null),
      (this.notesMode = !1),
      this.setState("PLAYING"),
      this.startTimer());
  }
  generatePuzzle() {
    this.generateSolvedBoard();
    for (let t = 0; t < 9; t++)
      for (let s = 0; s < 9; s++) this.solution[t][s] = this.board[t][s].value;
    const e = this.getCellsToRemove();
    this.removeRandomCells(e);
  }
  getCellsToRemove() {
    switch (this.difficulty) {
      case "BEGINNER":
        return 20;
      case "EASY":
        return 30;
      case "MEDIUM":
        return 40;
      case "HARD":
        return 50;
      case "EXPERT":
        return 60;
      default:
        return 40;
    }
  }
  generateSolvedBoard() {
    (this.fillDiagonalBoxes(), this.solveSudoku(0, 0));
  }
  fillDiagonalBoxes() {
    for (let e = 0; e < 3; e++) this.fillBox(e * 3, e * 3);
  }
  fillBox(e, t) {
    const s = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(s);
    let n = 0;
    for (let o = 0; o < 3; o++) for (let a = 0; a < 3; a++) this.board[e + o][t + a].value = s[n++];
  }
  shuffleArray(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const s = Math.floor(Math.random() * (t + 1));
      [e[t], e[s]] = [e[s], e[t]];
    }
  }
  solveSudoku(e, t) {
    if (e === 9) return !0;
    const s = t === 8 ? e + 1 : e,
      n = t === 8 ? 0 : t + 1;
    if (this.board[e][t].value !== null) return this.solveSudoku(s, n);
    const o = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(o);
    for (const a of o)
      if (this.isValidPlacement(e, t, a)) {
        if (((this.board[e][t].value = a), this.solveSudoku(s, n))) return !0;
        this.board[e][t].value = null;
      }
    return !1;
  }
  isValidPlacement(e, t, s) {
    for (let a = 0; a < 9; a++) if (a !== t && this.board[e][a].value === s) return !1;
    for (let a = 0; a < 9; a++) if (a !== e && this.board[a][t].value === s) return !1;
    const n = Math.floor(e / 3) * 3,
      o = Math.floor(t / 3) * 3;
    for (let a = 0; a < 3; a++)
      for (let d = 0; d < 3; d++) {
        const m = n + a,
          c = o + d;
        if ((m !== e || c !== t) && this.board[m][c].value === s) return !1;
      }
    return !0;
  }
  removeRandomCells(e) {
    const t = [];
    for (let s = 0; s < 9; s++) for (let n = 0; n < 9; n++) t.push({ row: s, col: n });
    this.shuffleArray(t);
    for (let s = 0; s < e && s < t.length; s++) {
      const { row: n, col: o } = t[s];
      ((this.board[n][o].value = null), (this.board[n][o].isFixed = !1));
    }
    for (let s = 0; s < 9; s++)
      for (let n = 0; n < 9; n++)
        this.board[s][n].value !== null && (this.board[s][n].isFixed = !0);
  }
  selectCell(e, t) {
    this.state === "PLAYING" && ((this.selectedCell = { row: e, col: t }), this.emitCellUpdate());
  }
  enterNumber(e) {
    if (this.state !== "PLAYING" || !this.selectedCell) return;
    const { row: t, col: s } = this.selectedCell,
      n = this.board[t][s];
    if (!n.isFixed) {
      if (this.notesMode) n.notes.has(e) ? n.notes.delete(e) : n.notes.add(e);
      else {
        if ((n.notes.clear(), (n.value = e), e !== this.solution[t][s])) {
          if (
            ((n.isError = !0),
            this.mistakes++,
            this.emitMistake(),
            this.mistakes >= this.maxMistakes)
          ) {
            this.setState("RESULT");
            return;
          }
        } else n.isError = !1;
        this.isPuzzleComplete() && (this.stopTimer(), this.setState("RESULT"));
      }
      this.emitCellUpdate();
    }
  }
  eraseCell() {
    if (this.state !== "PLAYING" || !this.selectedCell) return;
    const { row: e, col: t } = this.selectedCell,
      s = this.board[e][t];
    s.isFixed || ((s.value = null), s.notes.clear(), (s.isError = !1), this.emitCellUpdate());
  }
  toggleNotesMode() {
    this.notesMode = !this.notesMode;
  }
  getNotesMode() {
    return this.notesMode;
  }
  getHint() {
    if (this.state !== "PLAYING" || !this.selectedCell || this.hintsUsed >= this.maxHints) return;
    const { row: e, col: t } = this.selectedCell,
      s = this.board[e][t];
    s.isFixed ||
      (this.hintsUsed++,
      (s.value = this.solution[e][t]),
      (s.isFixed = !0),
      s.notes.clear(),
      (s.isError = !1),
      this.isPuzzleComplete() && (this.stopTimer(), this.setState("RESULT")),
      this.emitCellUpdate());
  }
  isPuzzleComplete() {
    for (let e = 0; e < 9; e++)
      for (let t = 0; t < 9; t++)
        if (this.board[e][t].value === null || this.board[e][t].isError) return !1;
    return !0;
  }
  pause() {
    this.state === "PLAYING" && (this.setState("PAUSED"), this.stopTimer());
  }
  resume() {
    this.state === "PAUSED" &&
      (this.setState("PLAYING"),
      (this.startTime = Date.now() - this.elapsedTime),
      this.startTimer());
  }
  restart() {
    (this.setState("MENU"), this.stopTimer());
  }
  timerInterval = null;
  startTimer() {
    (this.stopTimer(),
      (this.timerInterval = window.setInterval(() => {
        this.state === "PLAYING" &&
          ((this.elapsedTime = Date.now() - this.startTime), this.emitTime());
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
  getSelectedCell() {
    return this.selectedCell;
  }
  getMistakes() {
    return this.mistakes;
  }
  getMaxMistakes() {
    return this.maxMistakes;
  }
  getHintsUsed() {
    return this.hintsUsed;
  }
  getMaxHints() {
    return this.maxHints;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  isWin() {
    return this.state === "RESULT" && this.mistakes < this.maxMistakes;
  }
  onStateChange(e) {
    this.stateListeners.push(e);
  }
  onCellUpdate(e) {
    this.cellUpdateListeners.push(e);
  }
  onMistake(e) {
    this.mistakeListeners.push(e);
  }
  onTimeUpdate(e) {
    this.timeListeners.push(e);
  }
  emitCellUpdate() {
    this.cellUpdateListeners.forEach((e) => e());
  }
  emitMistake() {
    this.mistakeListeners.forEach((e) => e(this.mistakes));
  }
  emitTime() {
    this.timeListeners.forEach((e) => e(this.elapsedTime));
  }
}
const l = new v(),
  C = {
    ui: {
      gameTitle: "Sudoku",
      gameSetup: "Game Setup",
      difficulty: "Difficulty",
      beginner: "Beginner",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      expert: "Expert",
      startGame: "Start Game",
      pause: "Pause",
      resume: "Resume",
      newGame: "New Game",
      playAgain: "Play Again",
      time: "Time",
      mistakes: "Mistakes",
      hints: "Hints",
      notes: "Notes",
      hint: "Hint",
      erase: "Erase",
      gameOver: "Game Over!",
      youWin: "Congratulations!",
      puzzleCompleted: "Puzzle Completed!",
      youLose: "Out of Chances!",
      tooManyMistakes: "You made too many mistakes.",
      completedIn: "Completed in",
      totalTime: "Total Time",
      tryAgain: "Try Again",
      highScores: "High Scores",
      rank: "Rank",
      date: "Date",
    },
  },
  S = {
    ui: {
      gameTitle: "数独",
      gameSetup: "ゲーム設定",
      difficulty: "難易度",
      beginner: "初心者",
      easy: "簡単",
      medium: "普通",
      hard: "難しい",
      expert: "エキスパート",
      startGame: "ゲーム開始",
      pause: "一時停止",
      resume: "再開",
      newGame: "新規ゲーム",
      playAgain: "もう一度",
      time: "時間",
      mistakes: "ミス",
      hints: "ヒント",
      notes: "メモ",
      hint: "ヒント",
      erase: "消去",
      gameOver: "ゲーム終了！",
      youWin: "おめでとう！",
      puzzleCompleted: "パズル完成！",
      youLose: "チャンスなし！",
      tooManyMistakes: "ミスが多すぎます。",
      completedIn: "クリア時間",
      totalTime: "合計時間",
      tryAgain: "もう一度挑戦",
      highScores: "ハイスコア",
      rank: "順位",
      date: "日付",
    },
  },
  b = {
    ui: {
      gameTitle: "Sudoku",
      gameSetup: "Thiết lập trò chơi",
      difficulty: "Độ khó",
      beginner: "Nhập môn",
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      expert: "Chuyên gia",
      startGame: "Bắt đầu",
      pause: "Tạm dừng",
      resume: "Tiếp tục",
      newGame: "Ván mới",
      playAgain: "Chơi lại",
      time: "Thời gian",
      mistakes: "Sai lầm",
      hints: "Gợi ý",
      notes: "Ghi chú",
      hint: "Gợi ý",
      erase: "Xóa",
      gameOver: "Kết thúc!",
      youWin: "Chúc mừng!",
      puzzleCompleted: "Hoàn thành!",
      youLose: "Hết cơ hội!",
      tooManyMistakes: "Bạn đã có quá nhiều lỗi sai.",
      completedIn: "Hoàn thành trong",
      totalTime: "Tổng thời gian",
      tryAgain: "Thử lại",
      highScores: "Bảng xếp hạng",
      rank: "Hạng",
      date: "Ngày",
    },
  },
  L = {
    ui: {
      gameTitle: "数独",
      gameSetup: "游戏设置",
      difficulty: "难度",
      beginner: "入门",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      expert: "专家",
      startGame: "开始游戏",
      pause: "暂停",
      resume: "继续",
      newGame: "新游戏",
      playAgain: "再玩一次",
      time: "时间",
      mistakes: "错误",
      hints: "提示",
      notes: "笔记",
      hint: "提示",
      erase: "清除",
      gameOver: "游戏结束！",
      youWin: "恭喜！",
      puzzleCompleted: "拼图完成！",
      youLose: "机会用尽！",
      tooManyMistakes: "您犯的错误太多了。",
      completedIn: "完成时间",
      totalTime: "总时间",
      tryAgain: "再试一次",
      highScores: "高分榜",
      rank: "排名",
      date: "日期",
    },
  },
  U = {
    ui: {
      gameTitle: "سودوكو",
      gameSetup: "إعداد اللعبة",
      difficulty: "الصعوبة",
      beginner: "مبتدئ",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      expert: "خبير",
      startGame: "ابدأ اللعبة",
      pause: "إيقاف مؤقت",
      resume: "استئناف",
      newGame: "لعبة جديدة",
      playAgain: "العب مرة أخرى",
      time: "الوقت",
      mistakes: "الأخطاء",
      hints: "تلميحات",
      notes: "ملاحظات",
      hint: "تلميح",
      erase: "مسح",
      gameOver: "انتهت اللعبة!",
      youWin: "تهانينا!",
      puzzleCompleted: "اكتمل اللغز!",
      youLose: "نفدت الفرص!",
      tooManyMistakes: "لقد ارتكبت الكثير من الأخطاء.",
      completedIn: "اكتمل في",
      totalTime: "الوقت الإجمالي",
      tryAgain: "حاول مرة أخرى",
      highScores: "أعلى النتائج",
      rank: "الترتيب",
      date: "التاريخ",
    },
  };
let f = null;
new k();
const B = localStorage.getItem("language"),
  r = new T({ en: C, ja: S, vi: b, zh: L, ar: U }, B || "en"),
  M = () => {
    (G(),
      p(),
      document.querySelectorAll(".lang-btn").forEach((i) => {
        i.classList.toggle("active", i.dataset.lang === r.language);
      }),
      w());
  },
  A = () => {
    const i = document.querySelector(".diff-btn.active");
    if (i) {
      const e = i.dataset.diff;
      localStorage.setItem("sudoku_setup", JSON.stringify({ difficulty: e }));
    }
  },
  w = () => {
    try {
      const i = localStorage.getItem("sudoku_setup");
      if (i) {
        const { difficulty: e } = JSON.parse(i);
        document.querySelectorAll(".diff-btn").forEach((t) => {
          t.dataset.diff === e
            ? (t.classList.add("active"), l.setDifficulty(e))
            : t.classList.remove("active");
        });
      }
    } catch (i) {
      console.error("Failed to load Sudoku setup:", i);
    }
  },
  p = () => {
    ((document.getElementById("game-title").textContent = r.getUIText("gameTitle")),
      (document.getElementById("menu-title").textContent = r.getUIText("gameSetup")),
      (document.getElementById("label-difficulty").textContent = r.getUIText("difficulty")),
      document.querySelectorAll(".diff-btn").forEach((e, t) => {
        const s = ["beginner", "easy", "medium", "hard", "expert"];
        e.textContent = r.getUIText(s[t]);
      }),
      (document.getElementById("start-btn").textContent = r.getUIText("startGame")),
      (document.getElementById("label-time").textContent = r.getUIText("time")),
      (document.getElementById("label-mistakes").textContent = r.getUIText("mistakes")),
      (document.getElementById("label-hints").textContent = r.getUIText("hints")),
      (document.getElementById("erase-btn").textContent = r.getUIText("erase")),
      (document.getElementById("notes-btn").textContent = r.getUIText("notes")),
      (document.getElementById("hint-btn").textContent = r.getUIText("hint")),
      (document.getElementById("new-game-btn").textContent = r.getUIText("newGame")),
      (document.getElementById("label-total-time").textContent = r.getUIText("totalTime")),
      (document.getElementById("label-final-mistakes").textContent = r.getUIText("mistakes")),
      (document.getElementById("label-final-hints").textContent = r.getUIText("hints")),
      (document.getElementById("play-again-btn").textContent = r.getUIText("playAgain")),
      (document.getElementById("high-scores-title").textContent = r.getUIText("highScores")),
      (document.getElementById("th-rank").textContent = r.getUIText("rank")),
      (document.getElementById("th-time").textContent = r.getUIText("time")),
      (document.getElementById("th-mistakes").textContent = r.getUIText("mistakes")),
      (document.getElementById("th-hints").textContent = r.getUIText("hints")),
      (document.getElementById("th-date").textContent = r.getUIText("date")));
  },
  G = () => {
    (document.getElementById("home-btn")?.addEventListener("click", () => {
      window.location.href = "/";
    }),
      document.querySelectorAll(".lang-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target.dataset.lang;
          r.setLanguage(t);
        });
      }),
      document.querySelectorAll(".diff-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = e.target,
            s = t.dataset.diff;
          (document.querySelectorAll(".diff-btn").forEach((n) => n.classList.remove("active")),
            t.classList.add("active"),
            l.setDifficulty(s));
        });
      }),
      document.getElementById("start-btn")?.addEventListener("click", () => {
        (A(), (f = null), l.start());
      }),
      document.querySelectorAll(".num-btn").forEach((i) => {
        i.addEventListener("click", (e) => {
          const t = parseInt(e.target.dataset.num || "0");
          l.enterNumber(t);
        });
      }),
      document.getElementById("erase-btn")?.addEventListener("click", () => {
        l.eraseCell();
      }),
      document.getElementById("notes-btn")?.addEventListener("click", () => {
        l.toggleNotesMode();
        const i = document.getElementById("notes-btn");
        i && i.classList.toggle("active", l.getNotesMode());
      }),
      document.getElementById("hint-btn")?.addEventListener("click", () => {
        l.getHint();
      }),
      document.getElementById("new-game-btn")?.addEventListener("click", () => {
        l.restart();
      }),
      document.getElementById("play-again-btn")?.addEventListener("click", () => {
        l.restart();
      }),
      document.addEventListener("keydown", (i) => {
        l.getState() === "PLAYING" &&
          (i.key >= "1" && i.key <= "9"
            ? l.enterNumber(parseInt(i.key))
            : (i.key === "Backspace" || i.key === "Delete") && l.eraseCell());
      }));
  },
  N = () => {
    const i = document.getElementById("sudoku-grid");
    if (i) {
      i.innerHTML = "";
      for (let e = 0; e < 9; e++)
        for (let t = 0; t < 9; t++) {
          const s = document.createElement("div");
          ((s.className = "sudoku-cell"),
            (s.dataset.row = e.toString()),
            (s.dataset.col = t.toString()),
            s.addEventListener("click", () => {
              l.selectCell(e, t);
            }),
            i.appendChild(s));
        }
    }
  },
  E = () => {
    const i = l.getBoard(),
      e = l.getSelectedCell(),
      t = e ? i[e.row][e.col].value : null;
    for (let s = 0; s < 9; s++)
      for (let n = 0; n < 9; n++) {
        const o = document.querySelector(`[data-row="${s}"][data-col="${n}"]`);
        if (!o) continue;
        const a = i[s][n];
        if (
          ((o.className = "sudoku-cell"),
          a.isFixed && o.classList.add("fixed"),
          a.isError && o.classList.add("error"),
          e && e.row === s && e.col === n && o.classList.add("selected"),
          t && a.value === t && o.classList.add("same-number"),
          a.value)
        )
          o.textContent = a.value.toString();
        else if (a.notes.size > 0) {
          o.innerHTML = '<div class="cell-notes"></div>';
          const d = o.querySelector(".cell-notes");
          if (d)
            for (let m = 1; m <= 9; m++) {
              const c = document.createElement("span");
              ((c.textContent = a.notes.has(m) ? m.toString() : ""), d.appendChild(c));
            }
        } else o.textContent = "";
      }
  },
  y = () => {
    const i = l.getElapsedTime(),
      e = Math.floor(i / 6e4),
      t = Math.floor((i % 6e4) / 1e3),
      s = document.getElementById("time-display");
    s && (s.textContent = `${e}:${t.toString().padStart(2, "0")}`);
    const n = l.getMistakes(),
      o = l.getMaxMistakes(),
      a = document.getElementById("mistakes-display");
    a && (a.textContent = `${n}/${o}`);
    const d = l.getHintsUsed(),
      m = l.getMaxHints(),
      c = document.getElementById("hints-display");
    c && (c.textContent = `${d}/${m}`);
    const u = document.getElementById("hint-btn");
    u &&
      (d >= m
        ? (u.classList.add("disabled"), u.setAttribute("disabled", "true"))
        : (u.classList.remove("disabled"), u.removeAttribute("disabled")));
  },
  g = (i) => {
    ["menu-view", "game-view", "result-view"].forEach((e) => {
      const t = document.getElementById(e);
      t && (e === i ? t.classList.remove("hidden") : t.classList.add("hidden"));
    });
  };
l.onStateChange((i) => {
  (i === "MENU" && g("menu-view"),
    i === "PLAYING" && (g("game-view"), N(), E(), y()),
    i === "RESULT" && (g("result-view"), z(), I()));
});
l.onCellUpdate(() => {
  E();
});
l.onMistake(() => {
  y();
});
l.onTimeUpdate(() => {
  y();
});
const x = () => `sudoku_highscores_${l.getDifficulty()}`,
  z = () => {
    if (!l.isWin()) return;
    const i = l.getElapsedTime(),
      e = l.getMistakes(),
      t = l.getHintsUsed(),
      s = Date.now();
    f = s;
    const n = { time: i, mistakes: e, hintsUsed: t, date: s },
      o = x();
    h.saveHighScore(o, n, (a, d) =>
      a.hintsUsed !== d.hintsUsed
        ? a.hintsUsed - d.hintsUsed
        : a.time !== d.time
          ? a.time - d.time
          : a.mistakes - d.mistakes
    );
  },
  I = () => {
    const i = document.getElementById("result-title"),
      e = document.getElementById("result-message"),
      t = document.getElementById("final-time"),
      s = document.getElementById("final-mistakes"),
      n = l.isWin();
    (i && (i.textContent = n ? r.getUIText("youWin") : r.getUIText("gameOver")),
      e && (e.textContent = n ? r.getUIText("puzzleCompleted") : r.getUIText("tooManyMistakes")),
      t && (t.textContent = h.formatTime(l.getElapsedTime())),
      s && (s.textContent = l.getMistakes().toString()));
    const o = document.getElementById("final-hints");
    (o && (o.textContent = l.getHintsUsed().toString()), H());
  },
  H = () => {
    const i = x(),
      e = h.getHighScores(i),
      t = document.getElementById("high-scores-body");
    t &&
      ((t.innerHTML = ""),
      e.forEach((s, n) => {
        const o = document.createElement("tr");
        s.date === f && o.classList.add("current-run");
        const a = h.formatDate(s.date, r.language);
        ((o.innerHTML = `
                <td>${n + 1}</td>
                <td>${s.hintsUsed}</td>
                <td>${h.formatTime(s.time)}</td>
                <td>${s.mistakes}</td>
                <td>${a}</td>
            `),
          t.appendChild(o));
      }));
  };
r.subscribe((i) => {
  ((document.documentElement.dir = i === "ar" ? "rtl" : "ltr"),
    document.querySelectorAll(".lang-btn").forEach((e) => {
      e.classList.toggle("active", e.dataset.lang === i);
    }),
    p(),
    l.getState() === "RESULT" && I());
});
M();
