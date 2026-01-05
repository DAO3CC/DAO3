# PANews 工具导入指南

本目录包含从 PANews (https://www.panewslab.com/zh/tools) 批量导入工具的脚本。

## 📦 文件说明

- `panews-tools.ts` - 包含所有提取的PANews工具数据（280+个工具）
- `import-panews-tools.ts` - 批量导入脚本，将工具数据导入到Supabase数据库

## 🚀 使用方法

### 1. 准备工作

确保你已经：

- ✅ 创建了 Supabase 项目
- ✅ 执行了 `supabase/schema.sql` 初始化数据库
- ✅ 配置了 `.env.local` 文件，包含以下变量：
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

### 2. 安装依赖（如果还没安装）

```bash
npm install
```

### 3. 执行导入脚本

```bash
# 使用 ts-node 运行脚本
npx ts-node scripts/import-panews-tools.ts

# 或者使用 npm script
npm run import:panews
```

### 4. 查看结果

脚本执行后会显示：
- ✅ 成功导入的工具数量
- ❌ 失败的工具数量
- 📊 详细的导入统计信息

## 📊 工具分类

导入的工具包含以下分类：

| 分类 | 数量 | 说明 |
|------|------|------|
| 热门 | 27+ | 最热门的Web3工具 |
| AI Agent | 30+ | AI代理和框架 |
| Meme工具 | 45+ | Meme币交易和分析工具 |
| 区块浏览器 | 20+ | 各链区块链浏览器 |
| 综合数据 | 28+ | 数据分析平台 |
| BTC生态 | 47+ | 比特币生态工具 |
| 钱包工具 | 10+ | 各类钱包 |
| DeFi | 7+ | DeFi数据工具 |
| NFT | 12+ | NFT相关工具 |
| 其他 | 50+ | 其他类别工具 |

**总计：280+ 工具**

## ⚙️ 脚本功能

- ✅ 自动分类映射（PANews分类 → 数据库分类ID）
- ✅ 批量插入（每批50个，避免限制）
- ✅ 错误处理和重试
- ✅ 详细的进度显示
- ✅ 完整的统计报告

## 🛠 高级用法

### 只导入特定分类

编辑 `import-panews-tools.ts`，修改导入逻辑：

```typescript
// 只导入 AI Agent 分类
const aiAgentTools = panewsTools.filter(t => t.category === 'AI Agent');
// 然后导入 aiAgentTools
```

### 自定义分类映射

修改 `categoryMap` 对象来添加自定义分类：

```typescript
const categoryMap: Record<string, string> = {
  '热门': '1',
  '你的自定义分类': '22', // 使用数据库中的分类ID
  // ...
};
```

### 去重导入

如果数据库中已有工具，可以先清空再导入：

```sql
-- 在 Supabase SQL Editor 中执行
DELETE FROM tools WHERE 1=1;
```

或者修改脚本添加去重逻辑：

```typescript
// 检查URL是否已存在
const { data: existing } = await supabase
  .from('tools')
  .select('id')
  .eq('url', tool.url);

if (existing && existing.length > 0) {
  // 跳过已存在的工具
  continue;
}
```

## ❓ 常见问题

### Q1: 导入时出现错误 "relation tools does not exist"

**A**: 说明数据库表还没创建。请先在 Supabase SQL Editor 中执行 `supabase/schema.sql` 文件内容。

### Q2: 导入速度很慢

**A**: 这是正常的。脚本使用了批量插入（每批50个），并且有延迟以避免触发速率限制。280个工具大约需要1-2分钟。

### Q3: 如何检查工具是否导入成功？

**A**: 有几种方法：
1. 在 Supabase Dashboard → Table Editor 中查看 `tools` 表
2. 访问你的网站 `/tools` 页面
3. 使用以下SQL查询：
   ```sql
   SELECT COUNT(*) FROM tools;
   ```

### Q4: 工具图片不显示

**A**: PANews的图片托管在 `cdn-img.panewslab.com`，如果图片不显示：
- 检查网络连接
- 可能需要下载图片到本地
- 考虑使用CDN加速

### Q5: 如何更新已导入的工具？

**A**: 你有几个选择：
1. 在后台管理界面手动编辑
2. 使用 UPDATE SQL语句
3. 修改脚本使用 `upsert` 而不是 `insert`

## 📝 后续维护

定期更新工具列表：

```bash
# 1. 更新 panews-tools.ts 文件
# 2. 重新运行导入脚本
npx ts-node scripts/import-panews-tools.ts
```

## 🔒 安全提示

- ⚠️ 不要将 `.env.local` 文件提交到 Git
- ⚠️ 生产环境导入前先在测试环境验证
- ⚠️ 建议在导入前备份数据库

## 📞 需要帮助？

如果在导入过程中遇到问题：

1. 查看 Supabase Dashboard → Database → Logs
2. 检查环境变量配置
3. 确认数据库表结构正确
4. 查看脚本输出的错误信息

---

**准备好了吗？开始导入吧！** 🚀

```bash
npx ts-node scripts/import-panews-tools.ts
```
