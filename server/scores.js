const { Router } = require('express');
const supabase = require('./supabase');

const router = Router();

const VALID_DIFFICULTIES = ['easy', 'normal', 'hard'];
const VALID_GAMES = ['jump', 'typing'];
const MAX_SCORE = { jump: 999999, typing: 999999 };

// 登录检查中间件
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: '未登录' });
  }
  next();
}

// 获取当前用户所有分数（按游戏分组）
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('scores')
    .select('game, difficulty, score')
    .eq('user_id', req.session.user.id);

  if (error) {
    console.error('Fetch scores error:', error);
    return res.status(500).json({ error: '查询分数失败' });
  }

  const scores = {};
  for (const row of data) {
    if (!scores[row.game]) scores[row.game] = {};
    scores[row.game][row.difficulty] = row.score;
  }
  res.json(scores);
});

// 提交分数
router.post('/', requireAuth, async (req, res) => {
  const { game, difficulty, score } = req.body;

  if (!VALID_GAMES.includes(game)) {
    return res.status(400).json({ error: '无效游戏' });
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ error: '无效难度' });
  }
  if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
    return res.status(400).json({ error: '无效分数' });
  }
  if (score > (MAX_SCORE[game] || 99999)) {
    return res.status(400).json({ error: '分数异常' });
  }

  const intScore = Math.floor(score);
  const userId = req.session.user.id;

  // 查询现有分数
  const { data: existing } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .eq('game', game)
    .eq('difficulty', difficulty)
    .single();

  if (existing && existing.score >= intScore) {
    return res.json({ updated: false, score: existing.score });
  }

  // Upsert 新高分
  const { error } = await supabase.from('scores').upsert({
    user_id: userId,
    game,
    difficulty,
    score: intScore,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,game,difficulty' });

  if (error) {
    console.error('Upsert score error:', error);
    return res.status(500).json({ error: '保存分数失败' });
  }

  res.json({ updated: true, score: intScore });
});

module.exports = router;
