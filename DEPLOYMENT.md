# 🚀 DAO³ Labs - 完整部署指南

> 从零到上线的完整部署教程，无需购买服务器，完全免费！

---

## 📋 部署前置检查清单

在开始之前，请确认：

- [ ] 你已有一个 GitHub 账号
- [ ] 你有一个域名（或准备购买一个）
- [ ] 你有电脑和浏览器（用于操作）
- [ ] 大约 30 分钟的时间

---

## 🔵 第一步：创建 Supabase 数据库

### 1.1 注册 Supabase

1. 访问 **[https://supabase.com](https://supabase.com)**
2. 点击右上角 **"Sign Up"**
3. 选择使用 **GitHub** 账号登录（推荐，速度快）
4. 完成注册流程

### 1.2 创建项目

1. 登录后，点击 **"New Project"**
2. 填写项目信息：
   ```
   项目名称: DAO³ Labs
   数据库密码: [设置强密码，务必保存好！]
   区域: Southeast Asia (Singapore) 🇸🇬
         或 East Asia (Tokyo) 🇯🇵
         或选择离你最近的区域
   ```
3. 点击 **"Create new project"**
4. 等待 1-2 分钟，项目创建完成

### 1.3 执行数据库初始化脚本

1. 在左侧菜单找到并点击 **SQL Editor**（图标是 `</>`）
2. 点击 **"New query"**
3. 复制项目根目录的 `supabase/schema.sql` 文件的**全部内容**
4. 粘贴到编辑器中
5. 点击右上角 **"Run"** 按钮（或按 `Ctrl+Enter`）
6. 等待执行完成，看到 "Success" 提示

### 1.4 获取 API 凭证

1. 在左侧菜单点击 **Settings**（齿轮图标⚙️）
2. 点击 **API** 子菜单
3. 找到并复制以下两个值：

```
✅ Project URL:
https://xxxxx.supabase.co

✅ anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要**：将这两个值保存到记事本，后面会用到！

---

## 🟢 第二步：准备 GitHub 仓库

### 2.1 安装 Git（如果还没有）

**Windows 用户**：
- 访问 [https://git-scm.com/download/win](https://git-scm.com/download/win)
- 下载并安装 Git

**Mac 用户**：
```bash
# 在终端执行
git --version
# 如果没安装，会提示安装命令
```

### 2.2 推送代码到 GitHub

1. **登录 GitHub**
   - 访问 [https://github.com](https://github.com)
   - 注册/登录账号

2. **创建新仓库**
   - 点击右上角 **"+"** → **"New repository"**
   - 仓库名称：`dao3-labs`（或其他你喜欢的名字）
   - 设置为 **Public**（公开仓库）
   - **不要**勾选 "Add a README file"
   - 点击 **"Create repository"**

3. **推送代码**

在项目目录打开终端（命令行），执行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "准备部署到 Vercel + Supabase"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/dao3-labs.git

# 推送代码
git push -u origin main
```

**如果遇到错误**：
```bash
# 如果提示 "main" 分支不存在
git branch -M main
git push -u origin main

# 如果提示需要认证
# GitHub 会提示你使用 Personal Access Token
# 按照提示操作即可
```

---

## 🟡 第三步：部署到 Vercel

### 3.1 注册 Vercel

1. 访问 **[https://vercel.com](https://vercel.com)**
2. 点击右上角 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（推荐）
4. 授权 Vercel 访问你的 GitHub
5. 完成注册

### 3.2 导入项目

1. 登录后会自动跳转到 Dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 `dao3-labs` 仓库
5. Vercel 会自动检测到这是一个 **Next.js** 项目

### 3.3 配置项目

**构建设置**：
```
Framework Preset: Next.js ✅
Root Directory: ./ ✅
Build Command: npm run build ✅
Output Directory: .next ✅
```

**环境变量**（重要！）：

点击 **"Environment Variables"**，添加以下变量：

| 名称 | 值 |
|------|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |
| `ADMIN_PASSWORD` | `dao3admin2025`（或你自定义的密码） |

**注意**：
- 不要使用引号
- 直接粘贴值
- 点击 "Add" 添加每个变量

### 3.4 开始部署

1. 检查配置无误后，点击 **"Deploy"**
2. 等待 2-3 分钟，看到 "Congratulations!" 即成功
3. Vercel 会给你一个临时域名：
   ```
   https://dao3-labs-xxxxx.vercel.app
   ```

---

## 🟣 第四步：绑定自定义域名

### 4.1 添加域名

1. 在 Vercel 项目页面，点击 **"Settings"** 标签
2. 点击左侧 **"Domains"**
3. 输入你的域名（如：`dao3labs.com`）
4. 点击 **"Add"**

### 4.2 配置 DNS

Vercel 会显示需要的 DNS 记录：

```
类型    名称                值
A       @                   76.76.21.21
A       www                 76.76.21.21
```

**在你的域名注册商配置 DNS**：

#### **如果你用的是阿里云**：

1. 登录 [阿里云](https://www.aliyun.com)
2. 进入 **"控制台"** → **"域名"**
3. 找到你的域名，点击 **"解析"**
4. 添加以下记录：

```
记录类型: A
主机记录: @
记录值: 76.76.21.21

记录类型: A
主机记录: www
记录值: 76.76.21.21
```

#### **如果你用的是腾讯云**：

1. 登录 [腾讯云](https://cloud.tencent.com)
2. 进入 **"控制台"** → **"云解析"**
3. 找到你的域名，点击 **"解析"**
4. 添加同样的记录（如上）

#### **其他域名商**：

操作类似，找到 **DNS 管理** → **添加记录** 即可

### 4.3 等待 DNS 生效

- 通常需要 **5-30 分钟**
- Vercel 会自动检测 DNS 配置
- 配置完成后会自动颁发 SSL 证书

**检查 DNS 是否生效**：
```bash
# Windows 用户
ping dao3labs.com

# Mac/Linux 用户
ping dao3labs.com
```

如果返回 Vercel 的 IP（如 76.76.21.21），说明已生效！

---

## ✅ 第五步：测试网站

### 5.1 更新本地环境变量

在项目根目录创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Key
ADMIN_PASSWORD=dao3admin2025
```

### 5.2 本地测试

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 5.3 测试线上网站

1. 访问 `https://你的域名.com`
2. 测试各个功能：
   - ✅ 首页加载
   - ✅ 工具导航
   - ✅ 空投任务
   - ✅ 知识库
   - ✅ 后台管理（使用你的 ADMIN_PASSWORD 登录）
   - ✅ 数据是否能保存（后台修改后刷新页面，数据还在）

---

## 🎉 完成！

恭喜！你的 DAO³ Labs 网站已经上线！

**你的网站地址**：
- 主域名：`https://你的域名.com`
- 自动跳转：`http` → `https` （自动加密）

---

## 📊 后续管理

### **更新网站**

以后每次更新代码，只需要：

```bash
# 1. 修改代码
# 2. 提交到 GitHub
git add .
git commit -m "更新功能"
git push

# 3. Vercel 会自动检测并重新部署！
```

### **管理数据库**

1. 登录 Supabase Dashboard
2. 点击 **Table Editor** 查看和编辑数据
3. 点击 **SQL Editor** 执行高级查询

### **查看统计**

1. **Vercel Dashboard** - 访问量、带宽使用
2. **Supabase Dashboard** - 数据库存储、API 调用

---

## 🆘 常见问题

### **Q1: DNS 配置后还是无法访问？**

**A**: DNS 生效需要时间，通常：
- 全球：5-30 分钟
- 国内：1-24 小时
- 可以使用 [https://dnschecker.org](https://dnschecker.org) 检查状态

### **Q2: 部署后页面空白？**

**A**: 检查以下几点：
1. 环境变量是否正确配置
2. 浏览器控制台是否有错误（F12 → Console）
3. Supabase 项目是否正常运行

### **Q3: 如何修改数据？**

**A**: 有两种方式：
1. **后台管理**：访问 `/admin`，登录后可以管理
2. **Supabase Dashboard**：直接在数据库中修改

### **Q4: 免费额度够用吗？**

**A**: 对于大多数项目完全够用：
- Vercel：100GB 流量/月
- Supabase：500MB 数据库，无限 API 调用
- 可支撑：10 万+ 用户，100 万+ 月访问量

如果超出，可以升级到付费计划。

---

## 💰 成本总结

| 项目 | 原本需要 | 实际花费 | 节省 |
|------|---------|---------|------|
| 服务器 | ¥2000/年 | ¥0 | ¥2000 |
| 数据库 | ¥3000/年 | ¥0 | ¥3000 |
| CDN | ¥1000/年 | ¥0 | ¥1000 |
| SSL证书 | ¥500/年 | ¥0 | ¥500 |
| **域名** | ¥50/年 | ¥50/年 | ¥0 |
| **总计** | **¥6550/年** | **¥50/年** | **¥6500** |

**一年节省 6500 元！** 💰

---

## 🎯 部署检查清单

部署完成后，逐一检查：

- [ ] Vercel 部署成功（绿色✅）
- [ ] 可以访问 `https://你的域名.com`
- [ ] 所有页面都能正常打开
- [ ] 后台管理能正常登录
- [ ] 数据可以正常保存
- [ ] HTTPS 证书已配置（浏览器显示小锁🔒）
- [ ] DNS 解析已完成
- [ ] 移动端访问正常

---

## 📞 需要帮助？

如果在部署过程中遇到问题：

1. **查看错误日志**：Vercel Dashboard → 项目 → Deployments
2. **检查环境变量**：Vercel Dashboard → 项目 → Settings → Environment Variables
3. **查看数据库状态**：Supabase Dashboard → 项目 → Database

---

**准备好了吗？让我们开始部署吧！** 🚀

有任何问题随时告诉我！
