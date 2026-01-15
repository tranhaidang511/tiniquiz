import { localization } from "./i18n";
import type { Language } from "./common/Localization";
import { Consent } from "./common/Consent";

const games = [
  { id: "geogame", name: "GeoGame", icon: "🌍" },
  { id: "sudoku", name: "Sudoku", icon: "🔢" },
  { id: "minesweeper", name: "Minesweeper", icon: "💣" },
  { id: "sliding", name: "Sliding Puzzle", icon: "🧩" },
  { id: "chess", name: "Chess", icon: "♚" },
  { id: "xiangqi", name: "Xiangqi", icon: "象" },
  { id: "go", name: "Go", icon: "⚪" },
  { id: "gomoku", name: "Gomoku", icon: "5️⃣" },
  { id: "checkers", name: "Checkers", icon: "🏁" },
  { id: "othello", name: "Othello", icon: "🌗" },
  { id: "mancala", name: "Mancala", icon: "🏺" },
];

// Initialize Consent Banner
new Consent();

function updateTexts() {
  const titleEl = document.getElementById("main-title");
  const subtitleEl = document.getElementById("main-subtitle");
  const footerEl = document.getElementById("footer-text");

  if (titleEl) titleEl.textContent = localization.getUIText("title");
  if (subtitleEl) subtitleEl.textContent = localization.getUIText("subtitle");
  if (footerEl) footerEl.textContent = localization.getUIText("footer");
}

function setupLanguageSwitcher() {
  // Set initial active language button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === localization.language);
  });

  // Add click event listeners
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const lang = (e.target as HTMLElement).dataset.lang as Language;
      localization.setLanguage(lang);
    });
  });
}

function init() {
  const grid = document.getElementById("game-grid");
  if (!grid) return;

  games.forEach((game) => {
    const card = document.createElement("a");
    card.href = `./${game.id}/`;
    card.className = "game-card";

    card.innerHTML = `
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${game.name}</div>
    `;

    grid.appendChild(card);
  });

  // Setup language switcher
  setupLanguageSwitcher();
  updateTexts();

  // Set initial text direction for RTL languages
  document.documentElement.dir = localization.language === "ar" ? "rtl" : "ltr";
}

// Subscribe to language changes
localization.subscribe((lang) => {
  // Update text direction for RTL
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // Update active button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.lang === lang);
  });

  // Update all text
  updateTexts();
});

document.addEventListener("DOMContentLoaded", init);
