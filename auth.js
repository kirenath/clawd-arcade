// Clawd Arcade - Auth Module (progressive enhancement)
// On GitHub Pages: fetch fails silently, zero impact
// On VPS: activates login UI + score sync
(async function () {
  const AUTH_AREA_ID = 'auth-area';

  window.clawdAuth = null;

  let authArea = document.getElementById(AUTH_AREA_ID);
  if (!authArea) return;

  // Inject scoped styles
  const style = document.createElement('style');
  style.textContent = `
    #${AUTH_AREA_ID} {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 12px;
      min-height: 40px;
    }
    .clawd-login-btn {
      background: rgba(215, 119, 87, 0.15);
      border: 1px solid #D77757;
      color: #D77757;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    .clawd-login-btn:hover {
      background: rgba(215, 119, 87, 0.3);
    }
    .clawd-user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .clawd-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(232, 213, 183, 0.3);
    }
    .clawd-username {
      color: #e8d5b7;
      font-size: 14px;
    }
    .clawd-logout-btn {
      background: none;
      border: 1px solid rgba(232, 213, 183, 0.2);
      color: #7a6f5d;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-family: inherit;
      transition: all 0.2s;
    }
    .clawd-logout-btn:hover {
      border-color: #e05252;
      color: #e05252;
    }
  `;
  document.head.appendChild(style);

  // Probe backend
  let status;
  try {
    const res = await fetch('/api/auth/status', { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return;
    status = await res.json();
  } catch {
    return; // No backend, static mode
  }

  if (status.loggedIn) {
    const user = status.user;
    let scores = {};

    // Fetch server scores
    try {
      const res = await fetch('/api/scores');
      if (res.ok) scores = await res.json();
    } catch {}

    window.clawdAuth = {
      user,
      scores,
      async syncScore(difficulty, score) {
        try {
          const res = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, score })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.updated) this.scores[difficulty] = result.score;
          }
        } catch {}
      },
      async getScores() {
        try {
          const res = await fetch('/api/scores');
          if (res.ok) {
            this.scores = await res.json();
            return this.scores;
          }
        } catch {}
        return this.scores;
      }
    };

    // Render user info
    function renderAuthUI() {
      const t = window.i18n ? window.i18n.t : (k) => k;
      authArea.innerHTML = `
        <div class="clawd-user-info">
          <img class="clawd-avatar" src="${user.avatar_url}" alt="${user.name}">
          <span class="clawd-username">${user.name}</span>
          <button class="clawd-logout-btn" id="clawd-logout">${t('logout')}</button>
        </div>
      `;
      document.getElementById('clawd-logout').addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.reload();
      });
    }
    renderAuthUI();
    window.addEventListener('langchange', renderAuthUI);

    // First-login sync: upload localStorage scores to server
    for (const diff of ['easy', 'normal', 'hard']) {
      const local = parseInt(localStorage.getItem('clawd-hi-' + diff) || '0');
      if (local > (scores[diff] || 0)) {
        window.clawdAuth.syncScore(diff, local);
      }
    }
  } else {
    // Show login button
    function renderLoginBtn() {
      const t = window.i18n ? window.i18n.t : (k) => k;
      authArea.innerHTML = `
        <a class="clawd-login-btn" href="/api/auth/login">${t('login')}</a>
      `;
    }
    renderLoginBtn();
    window.addEventListener('langchange', renderLoginBtn);
  }
})();
