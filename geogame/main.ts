import './style.css';
import { game } from './Game';
import type { GameState, Question } from './Game';
import { localization } from './Localization';
import type { Language } from './Localization';
import type { Country } from './data';

console.log("Main.ts loading...");

const app = document.querySelector<HTMLDivElement>('#app')!;

// --- UI Templates ---

const renderApp = () => {
  app.innerHTML = `
    <h1>GeoGame</h1>
    
    <!-- Language Switcher -->
    <div class="lang-switcher">
      <button class="lang-btn active" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="ja">JA</button>
      <button class="lang-btn" data-lang="vi">VI</button>
    </div>

    <!-- Menu View -->
    <div id="menu-view" class="card animate-fade-in">
      <h1 id="menu-title">GeoGame</h1>
      <div class="controls">
        <label id="label-mode">Game Mode</label>
        <div class="mode-selector">
            <button id="mode-capitals" class="mode-btn active" data-mode="CAPITALS">Capitals</button>
            <button id="mode-flags" class="mode-btn" data-mode="FLAGS">Flags</button>
        </div>

        <label id="label-filter">Filter by Region</label>
        <select id="region-filter">
            <option value="all" id="option-all-world">All World</option>
            <optgroup label="Continents" id="continent-options"></optgroup>
            <optgroup label="Regions" id="region-options"></optgroup>
          </select>
        </label>

        <label>
          <span id="label-count">Number of Questions</span>
          <input type="number" id="count-filter" value="5" min="1" max="200">
        </label>
        
        <button id="start-btn" class="primary">Start Game</button>
      </div>
    </div>

    <!-- Game View -->
    <div id="game-view" class="card hidden animate-fade-in">
      <button id="new-game-btn" class="primary">New Game</button>

      <div class="game-header">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="game-timer">
          <span id="game-time-label">Time</span>: <span id="game-timer">00:00</span>
        </div>
      </div>
      
      <div id="flag-container" class="hidden">
        <img id="flag-image" src="" alt="Flag" />
      </div>

      <h3 id="question-text" class="question-text"></h3>
      
      <div class="choices-grid" id="choices-container">
        <!-- Buttons injected here -->
      </div>
    </div>

    <!-- Result View -->
    <div id="result-view" class="card hidden animate-fade-in">
      <h2 id="result-title">Game Over!</h2>
      <div class="score-display">
        <span id="final-score">0</span> / <span id="total-questions">0</span>
      </div>
      <div class="time-display">
        <span id="time-label">Total Time</span>: <span id="elapsed-time">00:00</span>
      </div>
      <p id="result-msg"></p>
      <button id="restart-btn" class="primary">Play Again</button>
    </div>
  `;

  setupEventListeners();
  populateFilters();
  updateTexts();

  // Set active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
  });
};

// --- Event Listeners ---

const setupEventListeners = () => {
  // Language
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = (e.target as HTMLElement).dataset.lang as Language;
      localization.setLanguage(lang);

      // Update active class
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      (e.target as HTMLElement).classList.add('active');
    });
  });

  // Mode Selection
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      const mode = target.dataset.mode as any;

      // Update active state
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');

      game.setGameMode(mode);
    });
  });

  // Start
  document.getElementById('start-btn')?.addEventListener('click', () => {
    const filterVal = (document.getElementById('region-filter') as HTMLSelectElement).value;
    const countInput = document.getElementById('count-filter') as HTMLInputElement;
    let countVal = parseInt(countInput.value, 10);

    if (isNaN(countVal) || countVal < 1) {
      countVal = 5;
      countInput.value = "5";
    }

    if (filterVal === 'all') {
      game.setFilter('all');
    } else if (game.getContinents().includes(filterVal)) {
      game.setFilter('continent', filterVal);
    } else {
      game.setFilter('region', filterVal);
    }

    game.start(countVal);
  });

  // New Game (during gameplay)
  document.getElementById('new-game-btn')?.addEventListener('click', () => {
    game.restart();
  });


  // Restart
  document.getElementById('restart-btn')?.addEventListener('click', () => {
    game.restart();
  });
};

const populateFilters = () => {
  const continentGroup = document.getElementById('continent-options')!;
  const regionGroup = document.getElementById('region-options')!;

  // Clear existing options first (in case of language switch)
  continentGroup.innerHTML = '';
  regionGroup.innerHTML = '';

  game.getContinents().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = localization.getRegionName(c);
    continentGroup.appendChild(opt);
  });

  game.getRegions().forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = localization.getRegionName(r);
    regionGroup.appendChild(opt);
  });
};

// --- Updates ---

const updateTexts = () => {
  // Menu
  const menuTitle = document.getElementById('menu-title');
  if (menuTitle) menuTitle.textContent = localization.getUIText('gameSetup');

  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.textContent = localization.getUIText('startGame');

  const labelFilter = document.getElementById('label-filter');
  if (labelFilter) labelFilter.textContent = localization.getUIText('filterByRegion');

  const labelCount = document.getElementById('label-count');
  if (labelCount) labelCount.textContent = localization.getUIText('numberOfQuestions');

  const labelMode = document.getElementById('label-mode');
  if (labelMode) labelMode.textContent = localization.getUIText('gameMode');

  const modeCapitals = document.getElementById('mode-capitals');
  if (modeCapitals) modeCapitals.textContent = localization.getUIText('modeCapitals');

  const modeFlags = document.getElementById('mode-flags');
  if (modeFlags) modeFlags.textContent = localization.getUIText('modeFlags');

  // Filter Options
  const optionAllWorld = document.getElementById('option-all-world');
  if (optionAllWorld) optionAllWorld.textContent = localization.getUIText('allWorld');

  const optGroupContinents = document.getElementById('continent-options') as HTMLOptGroupElement;
  if (optGroupContinents) optGroupContinents.label = localization.getUIText('continents');

  const optGroupRegions = document.getElementById('region-options') as HTMLOptGroupElement;
  if (optGroupRegions) optGroupRegions.label = localization.getUIText('regions');

  // Result
  const resultTitle = document.getElementById('result-title');
  if (resultTitle) resultTitle.textContent = localization.getUIText('gameOver');

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) restartBtn.textContent = localization.getUIText('playAgain');

  const timeLabel = document.getElementById('time-label');
  if (timeLabel) timeLabel.textContent = localization.getUIText('totalTime');

  const gameTimeLabel = document.getElementById('game-time-label');
  if (gameTimeLabel) gameTimeLabel.textContent = localization.getUIText('time');

  const newGameBtn = document.getElementById('new-game-btn');
  if (newGameBtn) newGameBtn.textContent = localization.getUIText('newGame');
};

const showView = (viewId: string) => {
  ['menu-view', 'game-view', 'result-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === viewId) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
};

// --- Game Logic Integration ---

let timerInterval: number | null = null;

game.onStateChange((state: GameState) => {
  if (state === 'MENU') {
    showView('menu-view');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  if (state === 'PLAYING') {
    showView('game-view');
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      const elapsed = game.getElapsedTime();
      const formatted = game.formatTime(elapsed);
      const timerEl = document.getElementById('game-timer');
      if (timerEl) timerEl.textContent = formatted;
    }, 1000);
  }
  if (state === 'RESULT') {
    showView('result-view');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    const { score, total } = game.getScore();
    document.getElementById('final-score')!.textContent = score.toString();
    document.getElementById('total-questions')!.textContent = total.toString();

    // Display elapsed time
    const elapsedSeconds = game.getElapsedTime();
    const formattedTime = game.formatTime(elapsedSeconds);
    document.getElementById('elapsed-time')!.textContent = formattedTime;
  }
});

game.onQuestionChange((q: Question, index: number, total: number) => {
  // Update Progress
  const progress = ((index - 1) / total) * 100;
  document.getElementById('progress-fill')!.style.width = `${progress}%`;

  // Update Question Text and Flag Display based on game mode
  const qText = document.getElementById('question-text');
  const flagContainer = document.getElementById('flag-container');
  const flagImage = document.getElementById('flag-image') as HTMLImageElement;

  if (game.getGameMode() === 'FLAGS' && q.flagUrl) {
    // Flag Mode
    if (flagContainer) flagContainer.classList.remove('hidden');
    if (flagImage) flagImage.src = q.flagUrl;
    if (qText) qText.textContent = localization.getUIText('guessTheFlag');
  } else {
    // Capital Mode (or Flag mode without flagUrl)
    if (flagContainer) flagContainer.classList.add('hidden');
    if (qText) qText.textContent = localization.getUIText('questionTemplate', { country: localization.getCountryName(q.target.code) });
  }

  // Render Choices
  const container = document.getElementById('choices-container')!;
  container.innerHTML = '';

  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    // For Flag mode, choices are country names. For Capital mode, choices are capitals.
    if (game.getGameMode() === 'FLAGS') {
      btn.textContent = localization.getCountryName(choice.code);
    } else {
      btn.textContent = localization.getCapital(choice.code);
    }

    btn.addEventListener('click', () => {
      handleAnswer(choice, btn, q.target);
    });

    container.appendChild(btn);
  });
});

const handleAnswer = (choice: Country, btn: HTMLElement, target: Country) => {
  // Disable all buttons
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

  const isCorrect = game.submitAnswer(choice);

  if (isCorrect) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    // Highlight correct one
    buttons.forEach(b => {
      const correctText = game.getGameMode() === 'FLAGS'
        ? localization.getCountryName(target.code)
        : localization.getCapital(target.code);

      if (b.textContent === correctText) {
        b.classList.add('correct');
      }
    });
  }

  // Wait and next
  setTimeout(() => {
    game.nextQuestion();
  }, 1000);
};

localization.subscribe(() => {
  updateTexts();
  populateFilters();
});

// Init
renderApp();
