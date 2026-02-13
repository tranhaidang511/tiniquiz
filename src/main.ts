import { localization } from "./i18n";
import type { Language } from "./common/Localization";
import { Consent } from "./common/Consent";
import { adService } from "./common/AdService";

// Initialize AdService
adService.initialize();

const games = [
  { id: "geogame", titleKey: "geo-title", icon: "🌍" },
  { id: "sudoku", titleKey: "sudoku-title", icon: "🔢" },
  { id: "minesweeper", titleKey: "minesweeper-title", icon: "💣" },
  { id: "sliding", titleKey: "sliding-title", icon: "🧩" },
  { id: "chess", titleKey: "chess-title", icon: "👑" },
  { id: "xiangqi", titleKey: "xiangqi-title", icon: "象" },
  { id: "go", titleKey: "go-title", icon: "⚪" },
  { id: "gomoku", titleKey: "gomoku-title", icon: "5️⃣" },
  { id: "checkers", titleKey: "checkers-title", icon: "🏁" },
  { id: "othello", titleKey: "othello-title", icon: "🌗" },
  { id: "mancala", titleKey: "mancala-title", icon: "🏺" },
];

// Initialize Consent Banner
new Consent();

function updateTexts() {
  const titleEl = document.getElementById("main-title");
  const subtitleEl = document.getElementById("main-subtitle");
  const footerEl = document.getElementById("footer-text");
  const contactEl = document.getElementById("contact-text");

  if (titleEl) titleEl.textContent = localization.getUIText("title");
  if (subtitleEl) subtitleEl.textContent = localization.getUIText("subtitle");
  if (footerEl) footerEl.textContent = localization.getUIText("footer");
  if (contactEl) {
    const contactText = localization.getUIText("contact");
    const email = "contact@tiniquiz.com";
    if (contactText.includes(email)) {
      const parts = contactText.split(email);
      contactEl.innerHTML = `${parts[0]}<a href="mailto:${email}">${email}</a>${parts[1]}`;
    } else {
      contactEl.textContent = contactText;
    }
  }

  // Update game titles
  games.forEach((game) => {
    const gameNameEl = document.querySelector(`[data-game-id="${game.id}"] .game-name`);
    if (gameNameEl) {
      gameNameEl.textContent = localization.getUIText(game.titleKey as any);
    }
  });
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
    card.href = `./${game.id}/index.html`;
    card.className = "game-card";
    card.dataset.gameId = game.id;

    card.innerHTML = `
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${localization.getUIText(game.titleKey as any)}</div>
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
