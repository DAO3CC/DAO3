-- ==========================================
-- DAO3 Labs - 数据库表结构
-- 在 Supabase SQL Editor 中执行此文件
-- ==========================================

-- 1. 创建文章分类表
CREATE TABLE IF NOT EXISTS article_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL REFERENCES article_categories(id) ON DELETE CASCADE,
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT 'DAO3 Team',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_num INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建工具分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建工具表
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  tags JSONB DEFAULT '[]'::jsonb,
  hot BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  chain TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建空投任务表
CREATE TABLE IF NOT EXISTS airdrops (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'upcoming')),
  deadline DATE,
  chain TEXT,
  reward_type TEXT CHECK (reward_type IN ('token', 'nft', 'whitelist', 'points', 'other')),
  reward TEXT,
  participants TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建用户表（用于认证）
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_chain ON tools(chain);
CREATE INDEX IF NOT EXISTS idx_tools_hot ON tools(hot) WHERE hot = TRUE;
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured) WHERE featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_airdrops_status ON airdrops(status);
CREATE INDEX IF NOT EXISTS idx_airdrops_chain ON airdrops(chain);
CREATE INDEX IF NOT EXISTS idx_airdrops_reward_type ON airdrops(reward_type);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);

-- 插入示例数据 - 文章分类
INSERT INTO article_categories (id, name, slug, icon, order_num) VALUES
  ('1', 'Crypto 101', 'crypto-101', '📚', 0),
  ('2', '加密知识', 'crypto-knowledge', '🎓', 1),
  ('3', '交易', 'trading', '📈', 2),
  ('4', '术语表', 'glossary', '📖', 3),
  ('5', '安全', 'security', '🔒', 4),
  ('6', 'DeFi', 'defi', '💰', 5),
  ('7', 'NFT', 'nft', '🎨', 6),
  ('8', 'AI & Web3', 'ai-web3', '🤖', 7)
ON CONFLICT (slug) DO NOTHING;

-- 插入示例数据 - 工具分类（部分）
INSERT INTO categories (id, name, slug, icon, description, order_num) VALUES
  ('1', '热门', 'hot', '🔥', '最受欢迎的Web3工具', 0),
  ('2', 'AI Agent', 'ai-agent', '🤖', '人工智能助手和代理工具', 1),
  ('3', 'DeFi', 'defi', '💰', '去中心化金融工具', 2)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 启用行级安全策略 (RLS)
-- ==========================================
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

-- 允许所有读取操作
CREATE POLICY "允许所有用户读取工具" ON tools FOR SELECT USING (true);
CREATE POLICY "允许所有用户读取分类" ON categories FOR SELECT USING (true);
CREATE POLICY "允许所有用户读取空投" ON airdrops FOR SELECT USING (true);
CREATE POLICY "允许所有用户读取文章" ON articles FOR SELECT USING (true);
CREATE POLICY "允许所有用户读取文章分类" ON article_categories FOR SELECT USING (true);

-- 注意：管理员权限的写入策略需要结合认证系统实现
-- 可以在 Supabase Dashboard 中根据需要配置

-- ==========================================
-- 创建更新时间戳触发器
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airdrops_updated_at BEFORE UPDATE ON airdrops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
