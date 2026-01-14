这是整合了表格的完整优化版 README，格式更清晰且保持了之前的风格：


# ☁️ Cloud Glass Calendar

一个基于 **Cloudflare Pages + D1** 构建的极简主义云端日历。

> 纯粹、私密、无处不在。

<div align="center">
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/Cloudflare-D1-3A3A3A?logo=cloudflare&logoColor=white" alt="Cloudflare D1">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Zero%20Dependency-000000?logo=code&logoColor=white" alt="Zero Dependency">
</div>

<br>

<div align="center">
  <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Cloud Glass Calendar Demo" width="80%" style="border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
  <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">🪄 沉浸在毛玻璃的质感中</p>
</div>

---

## ✨ 核心特性

*   **🎨 极致美学 (UI/UX)**
    *   **动态毛玻璃**：利用 CSS `backdrop-filter` 实现的现代 Glassmorphism 设计，界面通透轻盈。
    *   **每日壁纸**：自动获取 Bing 每日壁纸作为背景，每一天都有新的心情。
    *   **响应式布局**：完美适配从手机到桌面的所有设备。

*   **🪄 魔法路径 (Magic Auth)**
    *   **无框登录**：告别繁琐的账号注册。
    *   **瞬间解锁**：只需访问 `domain.com/你的密码`，路径即身份，自动获得管理员权限。

*   **🛡️ 隐私与安全**
    *   **访客模式**：路人只能看到日期和农历，日记内容不可见。
    *   **边缘计算**：数据存储在 Cloudflare D1 (SQLite 兼容) 边缘数据库，全球毫秒级响应。
    *   **GitHub Actions**：全程自动化部署，敏感信息零暴露。

*   **📝 私密日记**
    *   **轻量级记录**：点击日期即可记录今日心情或代办。
    *   **红点提示**：有日记的日期会显示呼吸红点，一目了然。

---

## 🚀 部署指南 (两种方式)

本项目设计为**零本地依赖**，你可以选择全自动化部署，也可以选择手动部署。

### 方式一：GitHub Actions 自动部署 (推荐 🔥)

只需点击 Fork，配置好 Secrets，剩下的交给 GitHub。

1.  **Fork 本仓库**。
2.  **创建数据库**：
    *   在 Cloudflare Dashboard -> **D1** -> **Create Database** (命名为 `my-calendar-db`)。
    *   复制 **Database ID**。
    *   在 Console 中执行 `schema.sql` 初始化表结构。
3.  **配置 Secrets**（Settings -> Secrets and variables -> Actions）：

| Secret 名称               | 说明                                  |                                   |
|---------------------------|---------------------------------------|---------------------------------------|
| `CLOUDFLARE_API_TOKEN`    | 你的 API Token（需赋予 Pages 和 D1 权限） | 必填                                  |
| `CLOUDFLARE_ACCOUNT_ID`   | 你的 Cloudflare 账户 ID               | 必填                                  |
| `D1_DATABASE_ID`          | 第 2 步复制的数据库 ID                | 必填                                  |
| `TOKEN`                   | 你的管理员密码（例如：`mypass123`）    | 建议填写                                  |
| `URL`                     | （可选）自定义背景图链接              | 可选                                  |

4.  **触发部署**：
    *   推送一次代码，Action 会自动运行 `deploy.yml`，将变量注入并发布。

### 方式二：Cloudflare 网页手动部署

适合喜欢在 Dashboard 上操作的用户。

1.  **创建 Pages 项目**：
    *   Connect to Git -> 选择 Fork 的仓库。
    *   **Build settings**: Framework preset 选 `None`，Build command 留空，Build output directory 填 `public`。
2.  **绑定资源**：
    *   部署完成后，进入 Pages 项目 -> **Settings** -> **Functions** -> **D1 Database Bindings**。
    *   **Variable name**: 必须填 `DB`。
    *   **Database**: 选择你创建的 `my-calendar-db`。
3.  **设置环境变量**：
    *   **Settings** -> **Environment variables** -> 添加 `TOKEN` (你的密码)。
4.  **重新部署**：
    *   在 Deployments 标签页重试最新的部署，使绑定生效。

---

## 📂 项目结构

```text
.
├── .github/workflows/deploy.yml  # 🤖 CI/CD 自动部署脚本
├── functions/                    # 🔋 后端逻辑 (Serverless Functions)
│   ├── [auth].js                 # 🗝️ 魔法路径鉴权 (/password)
│   └── api/
│       ├── bg.js                 # 🖼️ 代理获取 Bing 壁纸
│       └── notes.js              # 📝 日记增删改查接口
├── public/
│   └── index.html                # 🎨 前端核心 (HTML/CSS/JS)
├── schema.sql                    # 🗄️ 数据库表结构
└── wrangler.toml                 # ⚙️ 配置占位符
```

---

## 💡 使用技巧

*   **如何写日记？**
    访问 `https://你的域名/你的密码`，页面右上角会出现 "Admin" 标识，此时点击任意日期即可输入内容。
*   **如何退出？**
    点击浏览器的刷新按钮，或访问根路径 `https://你的域名`，即可回到访客模式。
*   **数据备份？**
    利用 Cloudflare D1 的 `d1 backup` 命令或直接在 Dashboard 导出数据。

---

## 📄 开源协议

本项目基于 **MIT License** 开源。你可以自由地使用、修改和分发，无论是个人还是商业用途。

---

<div align="center">
  <p>Made with ❤️ and ☁️</p>
</div>


要不要我帮你把这份整合好的完整README导出成纯文本格式，方便你直接复制到仓库里？
