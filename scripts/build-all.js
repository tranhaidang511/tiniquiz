import { execSync } from "child_process";
import { readdirSync, existsSync, renameSync, readFileSync, writeFileSync } from "fs";
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

function standardizeFavicon(distDir) {
  try {
    if (!existsSync(distDir)) return;

    const files = readdirSync(distDir);
    const faviconFile = files.find(f => f.startsWith('favicon-') && f.endsWith('.svg'));

    if (faviconFile) {
      const oldPath = join(distDir, faviconFile);
      const newPath = join(distDir, 'favicon.svg');
      renameSync(oldPath, newPath);
      console.log(`✨ Renamed ${faviconFile} to favicon.svg in ${distDir}`);

      const indexHtmlPath = join(distDir, 'index.html');
      if (existsSync(indexHtmlPath)) {
        let html = readFileSync(indexHtmlPath, 'utf-8');
        // Replace the hashed filename with standard filename
        html = html.split(faviconFile).join('favicon.svg');
        writeFileSync(indexHtmlPath, html);
        console.log(`📄 Updated index.html reference in ${distDir}`);
      }
    }
  } catch (e) {
    console.warn(`⚠️  Warning: Could not standardize favicon in ${distDir}:`, e.message);
  }
}

console.log("🚀 Starting build process for all games...");

try {
  // 1. Run type checking for the whole project
  console.log("\n🔍 Running type check...");
  execSync("npm run lint:tsc", { stdio: "inherit" });

  // 2. Build homepage
  console.log("\n🏠 Building Homepage...");
  execSync(`npx vite build src`, { stdio: "inherit" });
  standardizeFavicon(join(process.cwd(), "dist"));

  // 3. Build each game using its own config
  for (const game of games) {
    const gamePath = join(process.cwd(), "src", game);
    if (existsSync(gamePath)) {
      console.log(`\n📦 Building ${game}...`);
      execSync(`npx vite build`, { cwd: gamePath, stdio: "inherit" });
      standardizeFavicon(join(process.cwd(), "dist", game));
    }
  }

  console.log("\n✅ All games built successfully!");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
