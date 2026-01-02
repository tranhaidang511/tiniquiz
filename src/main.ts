const games = [
  { id: "minesweeper", name: "Minesweeper", icon: "💣" },
  { id: "sudoku", name: "Sudoku", icon: "🔢" },
  { id: "sliding", name: "Sliding Puzzle", icon: "🧩" },
  { id: "gomoku", name: "Gomoku", icon: "⚪" },
  { id: "mancala", name: "Mancala", icon: "🏺" },
  { id: "othello", name: "Othello", icon: "🌗" },
  { id: "checkers", name: "Checkers", icon: "🏁" },
  { id: "chess", name: "Chess", icon: "♟️" },
  { id: "xiangqi", name: "Xiangqi", icon: "🏮" },
  { id: "go", name: "Go", icon: "⚫" },
  { id: "geogame", name: "GeoGame", icon: "🌍" },
];

function init() {
  const grid = document.getElementById("game-grid");
  if (!grid) return;

  games.forEach((game) => {
    const card = document.createElement("a");
    card.href = `./${game.id}/index.html`;
    card.className = "game-card";

    card.innerHTML = `
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${game.name}</div>
    `;

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", init);
