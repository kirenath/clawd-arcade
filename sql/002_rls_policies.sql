-- Row Level Security policies
-- 因为后端用 service_key 访问，RLS 对 API 不生效
-- 但启用 RLS 防止匿名/客户端直接访问

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取（排行榜需要）
CREATE POLICY "Public read users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Public read scores"
  ON scores FOR SELECT
  USING (true);

-- 写操作只允许 service role（后端）
-- service_key 默认绕过 RLS，无需额外 policy
