# Clawd Arcade

一个由 **Clawd** 螃蟹主演的像素风小游戏合集。纯 HTML/CSS/JS 打造，零依赖，零构建步骤。

> 本项目完全使用 [Claude](https://claude.ai) 构建，从游戏逻辑到像素美术到后端服务，100% AI 生成。

## 游戏列表

| 游戏 | 描述 |
|------|------|
| [Clawd Jump](clawd-jump.html) | Chrome 断网小恐龙风格跑酷。跳过障碍、躲避飞虫，尽可能存活更久。 |
| [Clawd Typing](clawd-typing.html) | 代码关键字从天而降，拼手速击落它们！程序员的打字练习场。 |
| ??? | 更多 Clawd 冒险即将上线…… |

## 特性

- 像素风螃蟹 Clawd 作为主角
- 三档难度（简单 / 普通 / 困难）
- 中英双语界面切换
- [Linux.do](https://linux.do) OAuth2 登录
- Supabase 云端排行榜（按游戏 + 难度分别排名）
- 无后端时自动降级为本地 localStorage 存档

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | 原生 HTML5 Canvas + vanilla JS |
| 后端 | Express.js |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Linux.do Connect (OAuth2) |
| 部署 | GitHub Pages (前端) + VPS + Cloudflare Tunnel (后端) |

## 快速开始

**纯前端体验（无需后端）：**

直接用浏览器打开 `index.html` 即可游玩，分数保存在浏览器本地。


## 项目结构

```
├── index.html          # 游戏大厅
├── clawd-jump.html     # Clawd Jump 游戏
├── clawd-typing.html   # Clawd Typing 游戏
├── i18n.js             # 国际化模块（中/英）
├── auth.js             # 登录 & 分数同步
├── leaderboard.js      # 排行榜组件
├── server/             # Express 后端
│   ├── index.js        # 入口 & 静态文件服务
│   ├── auth.js         # OAuth2 登录流程
│   ├── scores.js       # 分数提交 API
│   ├── leaderboard.js  # 排行榜查询 API
│   └── supabase.js     # Supabase 客户端
└── sql/                # 数据库建表 & RLS 策略
```

## 致谢

- [Linux.do](https://linux.do) — 提供 OAuth2 登录服务，感谢 LINUX DO 社区的支持
- [Supabase](https://supabase.com) — 云端数据库 & 认证平台
- [Claude](https://claude.ai) — 本项目的唯一开发者（是的，AI 写的）

## License

[AGPL-3.0](LICENSE)
