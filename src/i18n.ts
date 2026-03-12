import { Localization, type Language } from "./common/Localization";

interface UITexts {
  title: string;
  subtitle: string;
  footer: string;
  "geo-title": string;
  "sudoku-title": string;
  "minesweeper-title": string;
  "sliding-title": string;
  "chess-title": string;
  "xiangqi-title": string;
  "go-title": string;
  "gomoku-title": string;
  "checkers-title": string;
  "othello-title": string;
  "mancala-title": string;
  contact: string;
  "ios-download": string;
  "qr-scan": string;
}

const en: { ui: UITexts } = {
  ui: {
    title: "Tiniquiz",
    subtitle: "Free Board Game Collection",
    footer: "© 2026 Tiniquiz",
    contact: "Contact: contact@tiniquiz.com",
    "geo-title": "GeoGame",
    "sudoku-title": "Sudoku",
    "minesweeper-title": "Minesweeper",
    "sliding-title": "Sliding Puzzle",
    "chess-title": "Chess",
    "xiangqi-title": "Xiangqi",
    "go-title": "Go",
    "gomoku-title": "Gomoku",
    "checkers-title": "Checkers",
    "othello-title": "Othello",
    "mancala-title": "Mancala",
    "ios-download": "Download on the App Store",
    "qr-scan": "Scan to Download",
  },
};

const ja: { ui: UITexts } = {
  ui: {
    title: "Tiniquiz",
    subtitle: "無料のボードゲームコレクション",
    footer: "© 2026 Tiniquiz",
    contact: "お問い合わせ: contact@tiniquiz.com",
    "geo-title": "GeoGame",
    "sudoku-title": "数独",
    "minesweeper-title": "マインスイーパー",
    "sliding-title": "スライディングパズル",
    "chess-title": "チェス",
    "xiangqi-title": "シャンチー",
    "go-title": "囲碁",
    "gomoku-title": "五目並べ",
    "checkers-title": "チェッカー",
    "othello-title": "オセロ",
    "mancala-title": "マンカラ",
    "ios-download": "App Storeからダウンロード",
    "qr-scan": "スキャンしてダウンロード",
  },
};

const vi: { ui: UITexts } = {
  ui: {
    title: "Tiniquiz",
    subtitle: "Bộ sưu tập game trí tuệ miễn phí",
    footer: "© 2026 Tiniquiz",
    contact: "Liên hệ: contact@tiniquiz.com",
    "geo-title": "Địa lý",
    "sudoku-title": "Sudoku",
    "minesweeper-title": "Dò mìn",
    "sliding-title": "Xếp hình",
    "chess-title": "Cờ vua",
    "xiangqi-title": "Cờ tướng",
    "go-title": "Cờ vây",
    "gomoku-title": "Cờ ca-rô",
    "checkers-title": "Cờ đam",
    "othello-title": "Cờ lật",
    "mancala-title": "Mancala",
    "ios-download": "Tải xuống trên App Store",
    "qr-scan": "Quét để tải xuống",
  },
};

const zh: { ui: UITexts } = {
  ui: {
    title: "Tiniquiz",
    subtitle: "免费益智游戏合集",
    footer: "© 2026 Tiniquiz",
    contact: "联系我们: contact@tiniquiz.com",
    "geo-title": "地理游戏",
    "sudoku-title": "数独",
    "minesweeper-title": "扫雷",
    "sliding-title": "滑块拼图",
    "chess-title": "国际象棋",
    "xiangqi-title": "中国象棋",
    "go-title": "围棋",
    "gomoku-title": "五子棋",
    "checkers-title": "国际跳棋",
    "othello-title": "黑白棋",
    "mancala-title": "播棋",
    "ios-download": "在 App Store 下载",
    "qr-scan": "扫描下载",
  },
};

const ar: { ui: UITexts } = {
  ui: {
    title: "Tiniquiz",
    subtitle: "مجموعة ألعاب ألغاز مجانية",
    footer: "© 2026 Tiniquiz",
    contact: "اتصل بنا: contact@tiniquiz.com",
    "geo-title": "لعبة الجغرافيا",
    "sudoku-title": "سودوكو",
    "minesweeper-title": "كانسة الألغام",
    "sliding-title": "لغز الانزلاق",
    "chess-title": "الشطرنج",
    "xiangqi-title": "الشطرنج الصيني",
    "go-title": "غو",
    "gomoku-title": "جوموكو",
    "checkers-title": "الداما",
    "othello-title": "أوثيلو",
    "mancala-title": "المنقلة",
    "ios-download": "تنزيل من متجر التطبيقات",
    "qr-scan": "امسح للتنزيل",
  },
};

// Get saved language from localStorage or default to 'en'
const savedLang = (localStorage.getItem("language") as Language) || "en";

export const localization = new Localization({ en, ja, vi, zh, ar }, savedLang);
