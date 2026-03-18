// Clawd Arcade - i18n Module
// Default: zh (Simplified Chinese), toggleable to en (English)
(function () {
  const LANG_KEY = 'clawd-lang';

  const translations = {
    zh: {
      // index
      'arcade.subtitle': 'Clawd 螃蟹的小游戏合集',
      'game.jump.desc': 'Chrome 断网小恐龙风格跑酷。跳过障碍、躲避飞虫，尽可能存活更久。',
      'tag.play': '开始游戏',
      'tag.soon': '敬请期待',
      'game.tbd.title': '???',
      'game.tbd.desc': '更多 Clawd 冒险即将上线……',
      'footer': 'CLAWD ARCADE — 使用 Claude 构建',
      // clawd-jump
      'back.arcade': '← 返回大厅',
      'jump.subtitle': '没网？没关系。',
      'score': '分数',
      'hi': '最高',
      'difficulty': '难度',
      'easy': '简单',
      'normal': '普通',
      'hard': '困难',
      'instructions': '{space} / {up} / 点击跳跃 | {down} 下蹲 | {down} + {space} 超级跳',
      'gameover': '游戏结束',
      'restart': '按空格键重新开始',
      'start': '按空格键开始',
      'start.hint': '帮助螃蟹 Clawd 躲避错误和 Bug！',
      // clawd-typing
      'typing.subtitle': '程序员手速测试！',
      'typing.instructions': '键入掉落的关键字来消灭它们 | {esc} 清空输入 | {backspace} 退格',
      'typing.start': '按任意键开始',
      'typing.start.hint': '输入代码关键字，击落入侵的 Bug！',
      'typing.placeholder': '开始输入...',
      'typing.streak': '连击',
      'game.typing.desc': '代码关键字从天而降，拼手速击落它们！程序员的打字练习场。',
      // auth
      'login': '使用 Linux.do 登录',
      'logout': '登出',
      // leaderboard
      'lb.game.jump': 'Clawd 跳跳',
      'lb.game.typing': 'Clawd 打字',
      'leaderboard': '排行榜',
      'lb.rank': '#',
      'lb.player': '玩家',
      'lb.score': '分数',
      'lb.empty': '暂无记录',
      'lb.loading': '加载中...',
      // language toggle
      'lang.switch': 'EN',
    },
    en: {
      // index
      'arcade.subtitle': 'a collection of tiny games starring Clawd the crab',
      'game.jump.desc': 'Chrome dino-style endless runner. Jump over obstacles, duck under birds, survive as long as you can.',
      'tag.play': 'PLAY NOW',
      'tag.soon': 'COMING SOON',
      'game.tbd.title': '???',
      'game.tbd.desc': 'More Clawd adventures coming soon...',
      'footer': 'CLAWD ARCADE — built with Claude',
      // clawd-jump
      'back.arcade': '← ARCADE',
      'jump.subtitle': 'no internet? no problem.',
      'score': 'SCORE',
      'hi': 'HI',
      'difficulty': 'DIFFICULTY',
      'easy': 'EASY',
      'normal': 'NORMAL',
      'hard': 'HARD',
      'instructions': '{space} / {up} / click to jump | {down} to duck | {down} + {space} super jump',
      'gameover': 'GAME OVER',
      'restart': 'Press SPACE to restart',
      'start': 'Press SPACE to start',
      'start.hint': 'Help Clawd the crab dodge the errors and bugs!',
      // clawd-typing
      'typing.subtitle': 'test your dev typing speed!',
      'typing.instructions': 'type the falling keywords to destroy them | {esc} clear input | {backspace} backspace',
      'typing.start': 'Press any key to start',
      'typing.start.hint': 'Type code keywords to shoot down the invading bugs!',
      'typing.placeholder': 'start typing...',
      'typing.streak': 'streak',
      'game.typing.desc': 'Code keywords rain from the sky — type fast to destroy them! A typing drill for devs.',
      // auth
      'login': 'Login with Linux.do',
      'logout': 'Logout',
      // leaderboard
      'lb.game.jump': 'Clawd Jump',
      'lb.game.typing': 'Clawd Typing',
      'leaderboard': 'LEADERBOARD',
      'lb.rank': '#',
      'lb.player': 'Player',
      'lb.score': 'Score',
      'lb.empty': 'No records yet',
      'lb.loading': 'Loading...',
      // language toggle
      'lang.switch': '中文',
    }
  };

  let currentLang = localStorage.getItem(LANG_KEY) || 'zh';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  // Inject language toggle button styles + element
  const style = document.createElement('style');
  style.textContent = `
    .lang-toggle {
      position: fixed;
      top: 16px;
      right: 16px;
      background: rgba(232, 213, 183, 0.08);
      border: 1px solid rgba(232, 213, 183, 0.15);
      border-radius: 8px;
      padding: 6px 14px;
      color: #7a6f5d;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 100;
    }
    .lang-toggle:hover {
      background: rgba(232, 213, 183, 0.15);
      color: #e8d5b7;
      border-color: rgba(232, 213, 183, 0.3);
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'lang-toggle';
  btn.textContent = t('lang.switch');
  btn.addEventListener('click', toggleLang);
  document.body.appendChild(btn);

  // Update toggle button text on language change
  window.addEventListener('langchange', () => {
    btn.textContent = t('lang.switch');
  });

  // Expose globally
  window.i18n = { t, getLang, setLang, toggleLang };
})();
