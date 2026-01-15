import { Localization, type Language } from "./common/Localization";

interface UITexts {
  title: string;
  subtitle: string;
  footer: string;
}

const en: { ui: UITexts } = {
  ui: {
    title: "TiniQuiz",
    subtitle: "Free Board Game Collection",
    footer: "© 2026 TiniQuiz",
  },
};

const ja: { ui: UITexts } = {
  ui: {
    title: "TiniQuiz",
    subtitle: "無料のボードゲームコレクション",
    footer: "© 2026 TiniQuiz",
  },
};

const vi: { ui: UITexts } = {
  ui: {
    title: "TiniQuiz",
    subtitle: "Bộ sưu tập game trí tuệ miễn phí",
    footer: "© 2026 TiniQuiz",
  },
};

const zh: { ui: UITexts } = {
  ui: {
    title: "TiniQuiz",
    subtitle: "免费益智游戏合集",
    footer: "© 2026 TiniQuiz",
  },
};

const ar: { ui: UITexts } = {
  ui: {
    title: "TiniQuiz",
    subtitle: "مجموعة ألعاب ألغاز مجانية",
    footer: "© 2026 TiniQuiz",
  },
};

// Get saved language from localStorage or default to 'en'
const savedLang = (localStorage.getItem("language") as Language) || "en";

export const localization = new Localization({ en, ja, vi, zh, ar }, savedLang);
