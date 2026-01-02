import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

const games = [
  "geogame",
  "gomoku",
  "sudoku",
  "minesweeper",
  "sliding",
  "checkers",
  "mancala",
  "othello",
  "chess",
  "xiangqi",
  "go",
];

console.log("🚀 Starting build process for all games...");

try {
  // 1. Run type checking for the whole project
  console.log("\n🔍 Running type check...");
  execSync("npm run lint:tsc", { stdio: "inherit" });

  // 2. Build each game using its own config
  for (const game of games) {
    const gamePath = join(process.cwd(), "src", game);
    if (existsSync(gamePath)) {
      console.log(`\n📦 Building ${game}...`);
      execSync(`npx vite build`, { cwd: gamePath, stdio: "inherit" });
    }
  }

  console.log("\n✅ All games built successfully!");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
