const { Router } = require('express');
const crypto = require('crypto');
const supabase = require('./supabase');

const router = Router();

const AUTH_URL = 'https://connect.linux.do/oauth2/authorize';
const TOKEN_URL = 'https://connect.linux.do/oauth2/token';
const USER_INFO_URL = 'https://connect.linux.do/api/user';

// 当前登录状态
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 跳转到 Linux.do 授权页
router.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    response_type: 'code',
    scope: 'user',
    state
  });

  res.redirect(`${AUTH_URL}?${params.toString()}`);
});

// OAuth2 回调
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // 验证 state 防 CSRF
  if (!state || state !== req.session.oauthState) {
    return res.status(403).send('无效的 state 参数');
  }
  delete req.session.oauthState;

  if (!code) {
    return res.status(400).send('缺少授权码');
  }

  try {
    // 用 code 换 token
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      }).toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return res.status(500).send('获取访问令牌失败');
    }

    // 用 token 拿用户信息
    const userRes = await fetch(USER_INFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userInfo = await userRes.json();

    // 处理头像 URL
    let avatarUrl = '';
    if (userInfo.avatar_template) {
      const tpl = userInfo.avatar_template.replace('{size}', '120');
      avatarUrl = tpl.startsWith('http') ? tpl : `https://linux.do${tpl}`;
    }

    const user = {
      id: userInfo.id,
      username: userInfo.username,
      name: userInfo.name || userInfo.username,
      avatar_url: avatarUrl,
      trust_level: userInfo.trust_level || 0
    };

    // Upsert 到 Supabase
    await supabase.from('users').upsert({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar_url: user.avatar_url,
      trust_level: user.trust_level,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    // 存 session
    req.session.user = user;

    res.redirect('/');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('登录失败，请重试');
  }
});

// 登出
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
