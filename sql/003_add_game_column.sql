-- Migration: add game column to scores table
-- Run this on an existing database that was created with 001_create_tables.sql

-- 1. Drop old primary key and index
ALTER TABLE scores DROP CONSTRAINT scores_pkey;
DROP INDEX IF EXISTS idx_scores_leaderboard;

-- 2. Add game column (default 'jump' so existing rows stay valid)
ALTER TABLE scores ADD COLUMN game TEXT NOT NULL DEFAULT 'jump'
  CHECK (game IN ('jump', 'typing'));

-- 3. Recreate primary key and index with game column
ALTER TABLE scores ADD PRIMARY KEY (user_id, game, difficulty);

CREATE INDEX idx_scores_leaderboard
  ON scores (game, difficulty, score DESC);
