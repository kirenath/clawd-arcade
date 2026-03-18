require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./auth');
const scoreRoutes = require('./scores');
const leaderboardRoutes = require('./leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Session
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'clawd-arcade-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// JSON body parser
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 静态文件（项目根目录）
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Clawd Arcade server running on port ${PORT}`);
});
