// Clawd Arcade - Leaderboard Module (progressive enhancement)
(async function () {
  const AREA_ID = 'leaderboard-area';
  const area = document.getElementById(AREA_ID);
  if (!area) return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #${AREA_ID} {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .lb-title {
      text-align: center;
      font-size: 22px;
      letter-spacing: 3px;
      color: #e8d5b7;
      margin-bottom: 16px;
    }
    .lb-game-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .lb-game-tab {
      background: rgba(232, 213, 183, 0.06);
      border: 1px solid rgba(232, 213, 183, 0.12);
      color: #7a6f5d;
      padding: 8px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.2s;
    }
    .lb-game-tab:hover { border-color: rgba(232, 213, 183, 0.4); color: #e8d5b7; }
    .lb-game-tab.active { background: rgba(215, 119, 87, 0.18); border-color: #D77757; color: #D77757; }
    .lb-tabs {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .lb-tab {
      background: rgba(232, 213, 183, 0.08);
      border: 1px solid rgba(232, 213, 183, 0.15);
      color: #7a6f5d;
      padding: 6px 18px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      transition: all 0.2s;
    }
    .lb-tab:hover { border-color: rgba(232, 213, 183, 0.4); color: #e8d5b7; }
    .lb-tab.active { background: rgba(215, 119, 87, 0.15); border-color: #D77757; color: #D77757; }
    .lb-table {
      width: 100%;
      border-collapse: collapse;
    }
    .lb-table th {
      text-align: left;
      color: #7a6f5d;
      font-size: 12px;
      letter-spacing: 1px;
      padding: 8px 10px;
      border-bottom: 1px solid rgba(232, 213, 183, 0.1);
    }
    .lb-table td {
      padding: 10px;
      color: #e8d5b7;
      font-size: 14px;
      border-bottom: 1px solid rgba(232, 213, 183, 0.05);
    }
    .lb-rank { width: 40px; text-align: center; }
    .lb-rank-1 { color: #ffd700; }
    .lb-rank-2 { color: #c0c0c0; }
    .lb-rank-3 { color: #cd7f32; }
    .lb-player {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .lb-player img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(232, 213, 183, 0.2);
    }
    .lb-score { text-align: right; font-variant-numeric: tabular-nums; }
    .lb-empty {
      text-align: center;
      color: #7a6f5d;
      padding: 24px;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);

  // Determine mode: multi-game (index page) or single-game (game page)
  const gamesAttr = area.dataset.games;
  const games = gamesAttr ? gamesAttr.split(',') : null;
  let currentGame = games ? games[0] : (area.dataset.game || 'jump');
  let currentDiff = 'normal';

  async function loadLeaderboard(game, difficulty) {
    try {
      const res = await fetch(`/api/leaderboard?game=${game}&difficulty=${difficulty}&limit=20`, {
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function renderTable(entries) {
    const t = window.i18n ? window.i18n.t : (k) => k;
    if (!entries || entries.length === 0) {
      return `<div class="lb-empty">${t('lb.empty')}</div>`;
    }
    let html = `<table class="lb-table">
      <thead><tr><th class="lb-rank">${t('lb.rank')}</th><th>${t('lb.player')}</th><th class="lb-score">${t('lb.score')}</th></tr></thead><tbody>`;
    entries.forEach((e, i) => {
      const rankClass = i < 3 ? ` lb-rank-${i + 1}` : '';
      const playerCell = e.name
        ? `<div class="lb-player">
            <img src="${e.avatar_url}" alt="${e.name}">
            <span>${e.name}</span>
          </div>`
        : `<div class="lb-player"><span style="color:#7a6f5d">???</span></div>`;
      html += `<tr>
        <td class="lb-rank${rankClass}">${i + 1}</td>
        <td>${playerCell}</td>
        <td class="lb-score">${e.score}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    return html;
  }

  async function render(difficulty) {
    currentDiff = difficulty;
    const tabs = area.querySelectorAll('.lb-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.diff === difficulty));

    const content = area.querySelector('.lb-content');
    const t = window.i18n ? window.i18n.t : (k) => k;
    content.innerHTML = `<div class="lb-empty">${t('lb.loading')}</div>`;

    const data = await loadLeaderboard(currentGame, difficulty);
    if (data === null && !area.dataset.loaded) {
      area.style.display = 'none';
      return;
    }
    area.dataset.loaded = '1';
    content.innerHTML = renderTable(data);
  }

  function switchGame(game) {
    currentGame = game;
    const gameTabs = area.querySelectorAll('.lb-game-tab');
    gameTabs.forEach(t => t.classList.toggle('active', t.dataset.game === game));
    render(currentDiff);
  }

  // Build UI
  function buildUI() {
    const t = window.i18n ? window.i18n.t : (k) => k;

    let gameTabsHTML = '';
    if (games) {
      gameTabsHTML = '<div class="lb-game-tabs">';
      games.forEach(g => {
        const active = g === currentGame ? ' active' : '';
        gameTabsHTML += `<button class="lb-game-tab${active}" data-game="${g}">${t('lb.game.' + g)}</button>`;
      });
      gameTabsHTML += '</div>';
    }

    area.innerHTML = `
      <h2 class="lb-title">${t('leaderboard')}</h2>
      ${gameTabsHTML}
      <div class="lb-tabs">
        <button class="lb-tab" data-diff="easy">${t('easy')}</button>
        <button class="lb-tab active" data-diff="normal">${t('normal')}</button>
        <button class="lb-tab" data-diff="hard">${t('hard')}</button>
      </div>
      <div class="lb-content"></div>
    `;

    if (games) {
      area.querySelectorAll('.lb-game-tab').forEach(tab => {
        tab.addEventListener('click', () => switchGame(tab.dataset.game));
      });
    }

    area.querySelectorAll('.lb-tab').forEach(tab => {
      tab.addEventListener('click', () => render(tab.dataset.diff));
    });
  }

  buildUI();

  window.addEventListener('langchange', () => {
    const activeDiff = currentDiff;
    const activeGame = currentGame;
    buildUI();
    currentGame = activeGame;
    // Re-highlight game tab after rebuild
    if (games) {
      area.querySelectorAll('.lb-game-tab').forEach(t => t.classList.toggle('active', t.dataset.game === activeGame));
    }
    render(activeDiff);
  });

  // Initial load
  render('normal');
})();
