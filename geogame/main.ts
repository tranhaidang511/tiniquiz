import './style.css';
import { game } from './Game';
import type { GameState, Question } from './Game';
import { localization } from './i18n/Localization';
import type { Language } from './i18n/Localization';
import type { Country } from './data';
import { Consent } from '../common/Consent';

// Initialize Consent Banner
new Consent();

// --- UI Templates ---

const renderApp = () => {
  setupEventListeners();
  populateFilters();
  updateTexts();

  // Set active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === localization.language);
  });

  // Load saved setup
  loadSetup();
};

// --- Setup Persistence ---

const saveSetup = () => {
  const modeBtn = document.querySelector('.mode-btn.active') as HTMLElement;
  const regionFilter = document.getElementById('region-filter') as HTMLSelectElement;
  const countFilter = document.getElementById('count-filter') as HTMLInputElement;

  if (modeBtn && regionFilter && countFilter) {
    const setup = {
      mode: modeBtn.dataset.mode,
      region: regionFilter.value,
      count: countFilter.value
    };
    localStorage.setItem('geogameSetup', JSON.stringify(setup));
  }
};

const loadSetup = () => {
  try {
    const saved = localStorage.getItem('geogameSetup');
    if (saved) {
      const { mode, region, count } = JSON.parse(saved);

      // Restore Mode
      if (mode) {
        document.querySelectorAll('.mode-btn').forEach(btn => {
          const btnMode = (btn as HTMLElement).dataset.mode;
          if (btnMode === mode) {
            btn.classList.add('active');
            game.setGameMode(mode);
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // Restore Region
      const regionSelect = document.getElementById('region-filter') as HTMLSelectElement;
      if (regionSelect && region) {
        regionSelect.value = region;
      }

      // Restore Count
      const countInput = document.getElementById('count-filter') as HTMLInputElement;
      if (countInput && count) {
        countInput.value = count;
      }
    }
  } catch (e) {
    console.error('Failed to load Geogame setup:', e);
  }
};

// --- Event Listeners ---

const setupEventListeners = () => {
  // Home button
  document.getElementById('home-btn')?.addEventListener('click', () => {
    window.location.href = '/';
  });

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
    saveSetup();
    const filterVal = (document.getElementById('region-filter') as HTMLSelectElement).value;
    const countInput = document.getElementById('count-filter') as HTMLInputElement;
    let countVal = parseInt(countInput.value, 10);

    if (isNaN(countVal) || countVal < 1) {
      countVal = 5;
      countInput.value = "5";
    }

    if (filterVal === 'allWorld') {
      game.setFilter('allWorld');
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

  // High Score Table Headers
  const highScoresTitle = document.getElementById('high-scores-title');
  if (highScoresTitle) highScoresTitle.textContent = localization.getUIText('highScores');

  const thRank = document.getElementById('th-rank');
  if (thRank) thRank.textContent = localization.getUIText('rank');

  const thScore = document.getElementById('th-score');
  if (thScore) thScore.textContent = localization.getUIText('score');

  const thTime = document.getElementById('th-time');
  if (thTime) thTime.textContent = localization.getUIText('time');

  const thDate = document.getElementById('th-date');
  if (thDate) thDate.textContent = localization.getUIText('date');
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
let currentGameState: GameState = 'MENU';

game.onStateChange((state: GameState) => {
  currentGameState = state;
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

    // Save score and update display
    saveHighScore();
    displayResult();
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

// --- High Score Logic ---

interface HighScore {
  score: number;
  total: number;
  time: number;
  date: number | string; // timestamp or legacy string
}

const saveHighScore = () => {
  const { score, total } = game.getScore();
  const time = game.getElapsedTime();
  const mode = game.getGameMode();
  const region = game.getRegion();
  const key = `geogame_highscores_${mode}_${region}`;
  const date = Date.now();

  const newScore: HighScore = { score, total, time, date };

  try {
    const existing = localStorage.getItem(key);
    let scores: HighScore[] = existing ? JSON.parse(existing) : [];

    scores.push(newScore);

    // Sort: Higher score first, then lower time
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time - b.time;
    });

    // Keep top 5
    scores = scores.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(scores));
  } catch (e) {
    console.error('Failed to save high score:', e);
  }
};

const getHighScores = (): HighScore[] => {
  const mode = game.getGameMode();
  const region = game.getRegion();
  const key = `geogame_highscores_${mode}_${region}`;
  try {
    const existing = localStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    return [];
  }
};

const displayResult = () => {
  const { score, total } = game.getScore();
  document.getElementById('final-score')!.textContent = score.toString();
  document.getElementById('total-questions')!.textContent = total.toString();

  // Display elapsed time
  const elapsedSeconds = game.getElapsedTime();
  const formattedTime = game.formatTime(elapsedSeconds);
  document.getElementById('elapsed-time')!.textContent = formattedTime;

  // Render High Scores
  const scores = getHighScores();
  const tbody = document.getElementById('high-scores-body');
  if (tbody) {
    tbody.innerHTML = '';
    scores.forEach((s, index) => {
      const tr = document.createElement('tr');

      // Highlight current score if it matches (simple check)
      // Note: This isn't perfect if there are duplicate scores, but good enough for now
      if (s.score === score && s.time === elapsedSeconds && s.total === total) {
        // We could add a class, but since we just saved it, it might be one of the top 5.
        // To strictly highlight *this* run, we'd need a unique ID.
        // For now, let's just render.
        tr.classList.add('current-run');
      }

      let dateStr = '';
      if (typeof s.date === 'number') {
        const lang = localization.language;
        const locale = lang === 'vi' ? 'vi-VN' : 'en-US'; // Use vi-VN for Vietnamese, en-US (or default) for others
        dateStr = new Date(s.date).toLocaleDateString(locale);
      } else {
        dateStr = s.date as string; // Legacy string support
      }

      tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${s.score}/${s.total}</td>
          <td>${game.formatTime(s.time)}</td>
          <td>${dateStr}</td>
        `;
      tbody.appendChild(tr);
    });
  }
};

localization.subscribe(() => {
  updateTexts();
  populateFilters();
  if (currentGameState === 'RESULT') {
    displayResult();
  }
});

// Init
renderApp();
