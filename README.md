# DAO³ Labs - Web3 工具导航平台

一个现代化的 Web3 工具导航平台，专为区块链创新实验室打造。参考 [PANews 数据导航](https://www.panewslab.com/zh/tools) 设计，采用专业去中心化的科技未来感风格。

![DAO³ Labs](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)

## ✨ 功能特性

- ✅ **现代化首页** - 科技未来感设计，流畅动画效果，浅色系专业风格
- ✅ **工具导航** - 浏览和搜索各类 Web3 工具，支持实时搜索
- ✅ **分类筛选** - 按 AI Agent、Meme、DeFi、NFT 等分类筛选
- ✅ **空投任务** - 轮播图展示最新空投任务
- ✅ **知识库** - Web3 文章和知识内容管理
- ✅ **后台管理** - 完整的 CMS 系统，支持工具、空投、分类、文章管理
- ✅ **数据库集成** - Supabase PostgreSQL 数据持久化
- ✅ **RESTful API** - 完整的 CRUD 接口
- ✅ **密码保护** - 后台管理系统密码保护
- ✅ **响应式设计** - 完美支持桌面和移动设备

## 🛠 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Hooks
- **图标**: SVG 内联图标
- **部署**: Vercel (推荐)

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 凭证：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=dao3admin2025
```

> 💡 如何获取 Supabase 凭证？请参考 [Supabase 集成指南](#-supabase-数据库设置)

### 3. 初始化数据库

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入你的项目
3. 点击 **SQL Editor**
4. 复制 `supabase/schema.sql` 文件内容
5. 粘贴到编辑器并执行

### 4. 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
dao3-labs/
├── src/
│   ├── app/                      # Next.js App Router 页面
│   │   ├── page.tsx             # 首页（高级动画）
│   │   ├── tools/               # 工具导航页面
│   │   ├── airdrops/            # 空投任务页面
│   │   ├── academy/             # 知识库页面
│   │   │   └── [slug]/          # 文章详情页
│   │   ├── admin/               # 后台管理（密码保护）
│   │   ├── api/                 # API 路由
│   │   │   ├── tools/           # 工具 CRUD API
│   │   │   ├── categories/      # 分类 CRUD API
│   │   │   ├── airdrops/        # 空投 CRUD API
│   │   │   ├── articles/        # 文章 CRUD API
│   │   │   └── auth/            # 认证 API
│   │   ├── layout.tsx           # 根布局
│   │   └── globals.css          # 全局样式
│   ├── components/              # React 组件
│   │   ├── layout/              # 布局组件 (Header, Footer)
│   │   └── ui/                  # UI 组件
│   ├── lib/                     # 工具库
│   │   ├── supabase.ts          # Supabase 客户端
│   │   ├── db.ts                # 数据库操作层
│   │   └── utils.ts             # 工具函数
│   ├── types/                   # TypeScript 类型定义
│   │   └── index.ts
│   └── data/                    # 模拟数据（开发用）
│       └── mockData.ts
├── supabase/                    # 数据库相关
│   └── schema.sql               # 数据库初始化脚本
├── public/                      # 静态资源
├── .env.local.example           # 环境变量模板
├── vercel.json                  # Vercel 配置
├── DEPLOYMENT.md                # 部署指南
├── README.SUPABASE.md           # Supabase 设置指南
└── package.json
```

## 🌐 主要页面

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | DAO³ Labs 品牌展示，高级动画效果 |
| `/tools` | 工具导航 | 浏览和搜索 Web3 工具，分类筛选 |
| `/airdrops` | 空投任务 | 轮播图展示最新空投信息 |
| `/academy` | 知识库 | Web3 文章和学习资源 |
| `/academy/[slug]` | 文章详情 | 单篇文章内容展示 |
| `/admin` | 后台管理 | 密码保护的 CMS 管理系统 |

## 🔐 后台管理

访问 `/admin` 进入后台管理系统。

**默认密码**: `dao3admin2025`（可在 `.env.local` 中修改 `ADMIN_PASSWORD`）

**功能**:
- 工具管理：添加、编辑、删除工具
- 分类管理：管理工具分类
- 空投管理：管理空投任务
- 文章管理：发布和管理知识库文章
- 数据实时保存到 Supabase 数据库

## 📊 数据结构

### Tool (工具)
```typescript
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  category: string;
  tags?: string[];
  hot?: boolean;
  featured?: boolean;
  chain?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Category (分类)
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  order: number;
}
```

### Airdrop (空投)
```typescript
interface Airdrop {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  status: 'active' | 'ended' | 'upcoming';
  deadline?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Article (文章)
```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🗄️ Supabase 数据库设置

详细设置步骤请参考 [README.SUPABASE.md](./README.SUPABASE.md)

**快速概览**：

1. **创建 Supabase 项目**
   - 访问 [https://supabase.com](https://supabase.com)
   - 注册/登录并创建新项目

2. **执行数据库初始化脚本**
   - 打开 SQL Editor
   - 运行 `supabase/schema.sql` 文件内容

3. **获取 API 凭证**
   - 进入 Settings → API
   - 复制 Project URL 和 anon public key
   - 填入 `.env.local` 文件

4. **配置 Row Level Security (可选)**
   - 默认已启用基础 RLS 策略
   - 可根据需求自定义权限

## 🚀 部署到生产环境

详细的部署步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

**快速部署到 Vercel**（推荐）：

1. **准备数据库**
   - 按照 Supabase 设置指南完成数据库初始化

2. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dao3-labs.git
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `ADMIN_PASSWORD`
   - 点击部署

4. **绑定自定义域名**（可选）
   - 在 Vercel 项目设置中添加域名
   - 配置 DNS 记录
   - 等待 SSL 证书自动生成

**优势**：
- ✅ 完全免费（Vercel + Supabase 免费额度）
- ✅ 自动 HTTPS/SSL
- ✅ 全球 CDN
- ✅ 自动部署
- ✅ 零服务器维护

**成本对比**：
| 项目 | 传统方案 | 本方案 | 节省 |
|------|---------|--------|------|
| 服务器 | ¥2000/年 | ¥0 | ¥2000 |
| 数据库 | ¥3000/年 | ¥0 | ¥3000 |
| CDN | ¥1000/年 | ¥0 | ¥1000 |
| SSL证书 | ¥500/年 | ¥0 | ¥500 |
| 域名 | ¥50/年 | ¥50/年 | ¥0 |
| **总计** | **¥6550/年** | **¥50/年** | **¥6500** |

## 💻 本地开发

### 推荐的开发工具

- **IDE**: VS Code
- **插件**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

### 代码规范

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码规范
npm run lint

# 自动修复问题
npm run lint -- --fix
```

### 环境要求

- Node.js >= 18.17.0
- npm >= 9.0.0

## 🔧 API 使用示例

### 获取所有工具

```typescript
const response = await fetch('/api/tools');
const { data } = await response.json();
```

### 创建新工具

```typescript
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
```

### 更新工具

```typescript
const response = await fetch('/api/tools/tool-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '更新后的名称' }),
});
```

### 删除工具

```typescript
const response = await fetch('/api/tools/tool-id', {
  method: 'DELETE',
});
```

## 🎨 设计特性

- **浅色主题**: 清爽专业的视觉体验
- **高级动画**:
  - Intersection Observer 滚动触发动画
  - 3D 卡片悬停效果
  - 鼠标跟随视差背景
  - 渐变文字动画
  - Shimmer 光泽效果
- **响应式布局**: 完美适配桌面、平板、手机
- **无障碍设计**: 符合 WCAG 标准的颜色对比度
- **性能优化**:
  - Next.js 图片优化
  - 代码分割
  - 静态生成 (SSG)

## 📈 性能优化建议

1. **图片优化**: 使用 Next.js Image 组件
2. **代码分割**: 利用动态导入减少初始加载体积
3. **CDN**: Vercel 自动提供全球 CDN
4. **缓存**: Supabase 内置查询缓存
5. **懒加载**: 列表组件使用虚拟滚动

## 🆘 常见问题

### Q1: 本地开发时连接数据库失败？

**A**: 检查以下几点：
- `.env.local` 文件是否存在
- Supabase 凭证是否正确
- Supabase 项目是否正在运行
- 网络连接是否正常

### Q2: 部署后页面空白？

**A**: 检查：
- 环境变量是否正确配置（Vercel Dashboard）
- 浏览器控制台是否有错误（F12 → Console）
- Supabase 项目状态是否正常

### Q3: 后台管理无法登录？

**A**:
- 确认密码是否正确（默认: dao3admin2025）
- 检查 `.env.local` 中的 `ADMIN_PASSWORD`
- 清除浏览器缓存和 localStorage

### Q4: 如何备份数据？

**A**: Supabase 提供自动备份：
- 登录 Supabase Dashboard
- 进入 Database → Backups
- 可随时导出完整数据库

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

**开发流程**：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

**代码规范**:
- 遵循现有代码风格
- 添加必要的注释
- 更新相关文档
- 确保所有测试通过

## 📝 许可证

MIT License

---

**开始构建你的 Web3 导航平台吧！** 🚀

有问题？查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署指南或 [README.SUPABASE.md](./README.SUPABASE.md) 数据库设置指南。
