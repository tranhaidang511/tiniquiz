import './style.css';
import { game } from './Game';
import type { GameState, Question } from './Game';
import { localization } from './Game';
import type { Language } from '../common/Localization';
import type { Country } from './data/countries';
import type { Province } from './data/provinces';
import { Consent } from '../common/Consent';
import { util } from '../common/util';

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
    localStorage.setItem('geogame_setup', JSON.stringify(setup));
  }
};

const loadSetup = () => {
  try {
    const saved = localStorage.getItem('geogame_setup');
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

        // Show/hide appropriate filters based on saved mode
        const countryFilterContainer = document.getElementById('country-filter-container');
        const regionFilterContainer = document.getElementById('region-filter-container');

        if (mode === 'PROVINCES') {
          // Show country filter, hide region filter
          if (countryFilterContainer) countryFilterContainer.classList.remove('hidden');
          if (regionFilterContainer) regionFilterContainer.classList.add('hidden');
        } else {
          // Show region filter, hide country filter
          if (countryFilterContainer) countryFilterContainer.classList.add('hidden');
          if (regionFilterContainer) regionFilterContainer.classList.remove('hidden');
        }
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

// --- Text Updates ---

const updateTexts = () => {
  // Menu
  document.getElementById('menu-title')!.textContent = localization.getUIText('gameSetup');
  document.getElementById('start-btn')!.textContent = localization.getUIText('startGame');
  document.getElementById('label-filter')!.textContent = localization.getUIText('filterByRegion');
  document.getElementById('label-count')!.textContent = localization.getUIText('numberOfQuestions');
  document.getElementById('label-mode')!.textContent = localization.getUIText('gameMode');
  document.getElementById('mode-capitals')!.textContent = localization.getUIText('modeCapitals');
  document.getElementById('mode-flags')!.textContent = localization.getUIText('modeFlags');
  document.getElementById('mode-provinces')!.textContent = localization.getUIText('modeProvinces');
  document.getElementById('label-country-filter')!.textContent = localization.getUIText('filterByCountry');

  // Filter Options
  document.getElementById('option-all-world')!.textContent = localization.getUIText('allWorld');
  const optGroupContinents = document.getElementById('continent-options') as HTMLOptGroupElement;
  if (optGroupContinents) optGroupContinents.label = localization.getUIText('continents');
  const optGroupRegions = document.getElementById('region-options') as HTMLOptGroupElement;
  if (optGroupRegions) optGroupRegions.label = localization.getUIText('regions');

  // Result
  document.getElementById('result-title')!.textContent = localization.getUIText('gameOver');
  document.getElementById('restart-btn')!.textContent = localization.getUIText('playAgain');
  document.getElementById('time-label')!.textContent = localization.getUIText('totalTime');
  document.getElementById('game-time-label')!.textContent = localization.getUIText('time');
  document.getElementById('new-game-btn')!.textContent = localization.getUIText('newGame');

  // High Score Table Headers
  document.getElementById('high-scores-title')!.textContent = localization.getUIText('highScores');
  document.getElementById('th-rank')!.textContent = localization.getUIText('rank');
  document.getElementById('th-score')!.textContent = localization.getUIText('score');
  document.getElementById('th-time')!.textContent = localization.getUIText('time');
  document.getElementById('th-date')!.textContent = localization.getUIText('date');
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

      // Show/hide appropriate filters based on mode
      const countryFilterContainer = document.getElementById('country-filter-container');
      const regionFilterContainer = document.getElementById('region-filter-container');

      if (mode === 'PROVINCES') {
        // Show country filter, hide region filter
        if (countryFilterContainer) countryFilterContainer.classList.remove('hidden');
        if (regionFilterContainer) regionFilterContainer.classList.add('hidden');

        const countryFilter = document.getElementById('country-filter') as HTMLSelectElement;
        if (countryFilter) {
          game.setCountryFilter(null);
        }
      } else {
        // Show region filter, hide country filter
        if (countryFilterContainer) countryFilterContainer.classList.add('hidden');
        if (regionFilterContainer) regionFilterContainer.classList.remove('hidden');
      }
    });
  });

  // Country Filter for Provinces Mode
  document.getElementById('country-filter')?.addEventListener('change', (e) => {
    const select = e.target as HTMLSelectElement;
    const country = select.value === 'allCountries' ? null : select.value;
    game.setCountryFilter(country);
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
  const countryFilterSelect = document.getElementById('country-filter') as HTMLSelectElement;

  // Clear existing options first (in case of language switch)
  continentGroup.innerHTML = '';
  regionGroup.innerHTML = '';
  if (countryFilterSelect) {
    countryFilterSelect.innerHTML = `<option value="allCountries">${localization.getUIText('allCountries')}</option>`;
  }

  // Populate continents
  game.getContinents().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = localization.getRegionName(c);
    continentGroup.appendChild(opt);
  });

  // Populate regions
  game.getRegions().forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = localization.getRegionName(r);
    regionGroup.appendChild(opt);
  });

  // Populate country filter for provinces mode
  if (countryFilterSelect) {
    const countries = game.getProvinceCountries();
    countries.forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = localization.getCountryName(code);
      countryFilterSelect.appendChild(option);
    });
  }
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
      const formatted = util.formatTime(elapsed);
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
  } else if (q.isProvince) {
    // Province Mode
    if (flagContainer) flagContainer.classList.add('hidden');
    const provinceName = localization.getProvinceName(q.target.code);
    if (qText) qText.textContent = localization.getUIText('questionProvinceTemplate', { province: provinceName });
  } else {
    // Capital Mode
    if (flagContainer) flagContainer.classList.add('hidden');
    if (qText) qText.textContent = localization.getUIText('questionTemplate', { country: localization.getCountryName(q.target.code) });
  }

  // Render Choices
  const container = document.getElementById('choices-container')!;
  container.innerHTML = '';

  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    // For Flag mode, choices are country names. For Capital/Province modes, choices are capitals.
    if (game.getGameMode() === 'FLAGS') {
      btn.textContent = localization.getCountryName(choice.code);
    } else if (q.isProvince) {
      btn.textContent = localization.getProvinceCapital(choice.code);
    } else {
      btn.textContent = localization.getCapital(choice.code);
    }

    btn.addEventListener('click', () => {
      handleAnswer(choice, btn, q.target);
    });

    container.appendChild(btn);
  });
});

const handleAnswer = (choice: Country | Province, btn: HTMLElement, target: Country | Province) => {
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
      let correctText = '';
      const mode = game.getGameMode();

      if (mode === 'FLAGS') {
        correctText = localization.getCountryName(target.code);
      } else if (mode === 'PROVINCES') {
        correctText = localization.getProvinceCapital(target.code);
      } else {
        correctText = localization.getCapital(target.code);
      }

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

  // For provinces mode, use country filter; for other modes, use region
  const filterValue = mode === 'PROVINCES'
    ? (game.getCountryFilter() || 'allCountries')
    : game.getRegion();

  const key = `geogame_highscores_${mode}_${filterValue}`;
  const date = Date.now();

  const newScore: HighScore = { score, total, time, date };

  util.saveHighScore(key, newScore, (a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });
};

const getHighScores = (): HighScore[] => {
  const mode = game.getGameMode();

  // For provinces mode, use country filter; for other modes, use region
  const filterValue = mode === 'PROVINCES'
    ? (game.getCountryFilter() || 'allCountries')
    : game.getRegion();

  const key = `geogame_highscores_${mode}_${filterValue}`;
  return util.getHighScores<HighScore>(key);
};

const displayResult = () => {
  const { score, total } = game.getScore();
  document.getElementById('final-score')!.textContent = score.toString();
  document.getElementById('total-questions')!.textContent = total.toString();

  // Display elapsed time
  const elapsedSeconds = game.getElapsedTime();
  const formattedTime = util.formatTime(elapsedSeconds);
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

      const dateStr = util.formatDate(s.date, localization.language);

      tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${s.score}/${s.total}</td>
          <td>${util.formatTime(s.time)}</td>
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
