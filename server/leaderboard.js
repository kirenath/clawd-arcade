const { Router } = require('express');
const supabase = require('./supabase');

const router = Router();

const VALID_DIFFICULTIES = ['easy', 'normal', 'hard'];

router.get('/', async (req, res) => {
  const difficulty = req.query.difficulty || 'normal';
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ error: '无效难度' });
  }

  const { data, error } = await supabase
    .from('scores')
    .select('score, updated_at, users(username, name, avatar_url)')
    .eq('difficulty', difficulty)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Leaderboard query error:', error);
    return res.status(500).json({ error: '查询排行榜失败' });
  }

  const entries = data.map(row => ({
    username: row.users.username,
    name: row.users.name,
    avatar_url: row.users.avatar_url,
    score: row.score,
    updated_at: row.updated_at
  }));

  res.json(entries);
});

module.exports = router;
