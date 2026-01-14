
```markdown
# 📅 Cloud Glass Calendar

一个基于 Cloudflare Pages + D1 构建的极简主义云端日历。

✨ **核心亮点**：
* **🎨 绝美 UI**: 现代毛玻璃 (Glassmorphism) 设计，自动适配 Bing 每日壁纸。
* **🪄 魔法路径**: 访问 `domain.com/你的密码` 瞬间解锁管理员权限，无登录框。
* **🛡️ 极致安全**: 支持 GitHub Actions 自动部署，敏感信息完全托管。
* **📝 私密日记**: 访客只看日期，主人可写日记（存储于 D1 边缘数据库）。

---

## 🛠️ 目录结构

```text
.
├── .github/workflows/
│   └── deploy.yml          # 🤖 自动部署脚本
├── functions/
│   ├── [auth].js           # 🔑 魔法路径验证
│   └── api/
│       ├── bg.js           # 🖼️ 背景接口
│       └── notes.js        # 📝 日记接口
├── public/
│   └── index.html          # 📅 前端界面
├── schema.sql              # 🗄️ 数据库结构 SQL
└── wrangler.toml           # ⚙️ 配置文件 (仅用于占位)

```

---

## 🚀 部署教程 (纯网页操作版)

本项目提供两种部署方式，均无需在本地安装任何命令行工具。

### 方式 A：GitHub Actions 自动部署 (推荐 🔥)

**特点**：设置一次，后续只需提交代码即可自动更新，且无需在 Cloudflare 后台配置变量。

1. **准备数据库**:
* 登录 Cloudflare Dashboard -> **Workers & Pages** -> **D1**。
* 点击 **Create** 创建一个数据库，命名为 `my-calendar-db`。
* **复制** 它的 Database ID (形如 `xxxx-xxxx...`)。
* 进入该数据库详情页 -> **Console (控制台)** 标签 -> 粘贴项目中的 `schema.sql` 内容 -> 点击 **Execute**。


2. **配置 GitHub Secrets**:
* 进入 GitHub 仓库 -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。
* 添加以下 5 个变量：
* `CLOUDFLARE_API_TOKEN`: 你的 CF API Token (需含 Workers/Pages/D1 权限)。
* `CLOUDFLARE_ACCOUNT_ID`: 你的 CF Account ID。
* `D1_DATABASE_ID`: **第1步复制的真实数据库 ID**。
* `TOKEN`: `你的解锁密码` (自定义)。
* `URL`: `你的背景链接` (可选)。




3. **修改本地配置**:
* 确保根目录的 `wrangler.toml` 中 `database_id` 为 `D1_PLACEHOLDER` (保持占位符)。


4. **推送代码**:
* 提交并推送到 GitHub。Action 会自动运行，替换 ID 并发布。



---

### 方式 B：Cloudflare 网页手动部署

**特点**：适合不想配置 GitHub Action，喜欢在 Cloudflare 后台点点点的用户。

#### 第一步：创建并初始化数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)。
2. 左侧菜单选择 **Workers & Pages** -> **D1**。
3. 点击 **Create**，输入名字 `my-calendar-db`，点击创建。
4. 进入刚创建的数据库，点击 **Console** 标签页。
5. 复制本项目 `schema.sql` 文件的内容，粘贴到输入框，点击 **Execute**。

#### 第二步：连接 Git 部署 Pages

1. 回到 **Workers & Pages** -> **Overview** -> **Create application** -> **Pages** -> **Connect to Git**。
2. 选择你的 GitHub 仓库 -> **Begin setup**。
3. **Build settings (构建设置)**:
* **Framework preset**: `None` (或者保持默认)
* **Build command**: (留空)
* **Build output directory**: `public`


4. 点击 **Save and Deploy**。
* *(注意：第一次部署可能会因为没绑定数据库而报错，请无视，继续下一步)*



#### 第三步：绑定数据库与变量

1. 部署完成后，进入该 Pages 项目的 **Settings** -> **Functions**。
2. 找到 **D1 Database Bindings**:
* **Variable name**: `DB` (必须完全一致)
* **D1 database**: 选择你第一步创建的 `my-calendar-db`。
* 点击 **Save**。


3. 进入 **Settings** -> **Environment variables**:
* 添加 `TOKEN`: `你的密码`
* 添加 `URL`: `你的背景链接` (可选)
* 点击 **Save**。



#### 第四步：重新部署

1. 进入 **Deployments** 标签页。
2. 点击最新的那次部署右侧的 **...** -> **Retry deployment**。
3. 等待成功。

---

## 📖 使用指南

### 1. 访客模式

> 访问: `https://你的域名.pages.dev`

仅显示日历、农历和背景。无法查看日记。

### 2. 管理员模式 (解锁)

> 访问: `https://你的域名.pages.dev/你的密码`

* 页面会自动刷新并隐藏密码。
* 日历上出现**红点**，点击日期即可写日记。
* 权限保存在浏览器缓存中。

---


```
