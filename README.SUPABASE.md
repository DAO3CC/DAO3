# DAO³ Labs - Supabase 数据库集成指南

## 📋 前置准备

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project"
4. 创建项目：
   - **项目名称**: DAO3 Labs
   - **数据库密码**: 设置强密码（请保存好）
   - **区域**: 选择 Southeast Asia (Singapore) 或其他离你最近的区域
5. 等待项目创建完成（约1-2分钟）

---

## 🔧 数据库设置

### 步骤 1: 执行 SQL 初始化脚本

1. 在 Supabase Dashboard 中，进入你的项目
2. 点击左侧菜单的 **SQL Editor**
3. 点击 "New Query"
4. 复制 `supabase/schema.sql` 文件中的所有内容
5. 粘贴到 SQL Editor 中
6. 点击 **Run** 或按 `Ctrl+Enter` 执行

这将会创建：
- ✅ 5个数据表（tools, categories, airdrops, articles, article_categories）
- ✅ 所有索引
- ✅ 行级安全策略（RLS）
- ✅ 更新时间戳触发器
- ✅ 示例数据

---

## 🔑 获取 API 凭证

### 步骤 2: 获取项目 URL 和 Anon Key

1. 在 Supabase Dashboard 左侧菜单，点击 **Settings** (齿轮图标)
2. 选择 **API** 子菜单
3. 复制以下信息：

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚙️ 配置环境变量

### 步骤 3: 更新 `.env.local` 文件

在项目根目录打开 `.env.local` 文件，替换以下内容：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=dao3admin2025
```

**注意**：
- ✅ 替换为你的实际 Project URL
- ✅ 替换为你的实际 anon public key
- ✅ ADMIN_PASSWORD 可以自定义

---

## 🚀 本地开发

### 步骤 4: 启动开发服务器

```bash
# 安装依赖（如果还未安装）
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 📊 数据库管理

### 使用 Supabase Dashboard 管理数据

1. **Table Editor** - 可视化编辑数据
   - 左侧菜单 → Table Editor
   - 可以直接添加/编辑/删除数据
   - 类似 Excel 的操作体验

2. **SQL Editor** - 执行自定义 SQL
   - 左侧菜单 → SQL Editor
   - 可以执行复杂的查询和批量操作

---

## 🔐 安全设置

### 配置 Row Level Security (RLS)

默认已启用基础 RLS 策略。如需配置更精细的权限：

1. 进入 **Authentication** → **Policies**
2. 选择表（如 `tools`）
3. 添加新策略：
   - **SELECT**: 允许所有人读取
   - **INSERT/UPDATE/DELETE**: 仅允许管理员

示例策略：

```sql
-- 仅允许管理员修改数据
CREATE POLICY "管理员可修改工具"
ON tools
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  )
);
```

---

## 🌐 部署到生产环境

### 选项 1: Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 在部署设置中添加环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ADMIN_PASSWORD=your-password
   ```
5. 点击 **Deploy**

### 选项 2: 其他平台

- Netlify
- AWS Amplify
- Railway
- Render

---

## 📝 API 使用示例

### 前端调用示例

```typescript
// 获取所有工具
const response = await fetch('/api/tools');
const { data } = await response.json();

// 创建新工具
const response = await fetch('/api/tools', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '新工具',
    description: '工具描述',
    icon: 'https://...',
    url: 'https://...',
    category: 'category-id',
    tags: ['DeFi', '工具'],
  }),
});

// 更新工具
const response = await fetch('/api/tools/tool-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '更新后的名称' }),
});

// 删除工具
const response = await fetch('/api/tools/tool-id', {
  method: 'DELETE',
});
```

---

## 🔄 数据迁移

### 从 Mock 数据迁移到数据库

如果已有 mock 数据，可以使用以下脚本迁移：

```bash
# 创建迁移脚本（可选）
# scripts/migrate-to-supabase.ts
```

---

## 🆘 常见问题

### Q1: 连接超时？
- 检查网络连接
- 确认 Supabase 项目状态（检查 Dashboard 状态）

### Q2: 权限错误？
- 确认 RLS 策略正确配置
- 检查 API Key 是否正确

### Q3: 数据不显示？
- 打开浏览器控制台查看错误
- 检查 Supabase Dashboard 是否有数据
- 确认环境变量配置正确

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Next.js 指南](https://supabase.com/docs/guides/getting-started/nextjs)
- [Supabase TypeScript](https://supabase.com/docs/guides/typescript/support)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 完成

设置完成后，你的 DAO³ Labs 网站将拥有：
- ✅ PostgreSQL 数据库
- ✅ RESTful API
- ✅ 数据持久化
- ✅ 类型安全
- ✅ 实时更新能力（可选）

开始使用你的数据库吧！🚀
