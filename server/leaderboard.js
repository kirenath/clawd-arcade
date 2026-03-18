const { Router } = require('express');
const supabase = require('./supabase');

const router = Router();

const VALID_DIFFICULTIES = ['easy', 'normal', 'hard'];
const VALID_GAMES = ['jump', 'typing'];

router.get('/', async (req, res) => {
  const game = req.query.game || 'jump';
  const difficulty = req.query.difficulty || 'normal';
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  if (!VALID_GAMES.includes(game)) {
    return res.status(400).json({ error: '无效游戏' });
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ error: '无效难度' });
  }

  const { data, error } = await supabase
    .from('scores')
    .select('score, updated_at, users(username, name, avatar_url)')
    .eq('game', game)
    .eq('difficulty', difficulty)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Leaderboard query error:', error);
    return res.status(500).json({ error: '查询排行榜失败' });
  }

  const loggedIn = !!(req.session && req.session.user);

  const entries = data.map(row => {
    if (loggedIn) {
      return {
        username: row.users.username,
        name: row.users.name,
        avatar_url: row.users.avatar_url,
        score: row.score
      };
    }
    return { score: row.score };
  });

  res.json(entries);
});

module.exports = router;
