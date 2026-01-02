import "./modulepreload-polyfill-B5Qt9EMX.js";
const a = [
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
function o() {
  const i = document.getElementById("game-grid");
  i &&
    a.forEach((n) => {
      const e = document.createElement("a");
      ((e.href = `./${n.id}/index.html`),
        (e.className = "game-card"),
        (e.innerHTML = `
      <div class="game-icon">${n.icon}</div>
      <div class="game-name">${n.name}</div>
    `),
        i.appendChild(e));
    });
}
document.addEventListener("DOMContentLoaded", o);
