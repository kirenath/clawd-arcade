-- Clawd Arcade: users + scores tables
-- Run this in Supabase SQL Editor

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id         BIGINT PRIMARY KEY,            -- Linux.do user id
  username   TEXT NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  trust_level INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 分数表
CREATE TABLE IF NOT EXISTS scores (
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard')),
  score      INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, difficulty)
);

-- 排行榜查询索引
CREATE INDEX IF NOT EXISTS idx_scores_leaderboard
  ON scores (difficulty, score DESC);
