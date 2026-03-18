-- 表权限授予
-- Supabase 新建的表默认只有 postgres 角色有权限
-- 必须显式 GRANT 给 service_role 和 authenticated
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.scores TO service_role;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.scores TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

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
