# AIGC 电影风格 · 提示词转译器

[![Deploy to GitHub Pages](https://github.com/PizzaPusen/aigc-film-prompt-composer/actions/workflows/pages.yml/badge.svg)](https://github.com/PizzaPusen/aigc-film-prompt-composer/actions/workflows/pages.yml)

纯前端、零 API 成本的影视 AIGC 提示词组合工具。左侧叠加**影像技术**（景别、运镜、光影、色彩…），右侧抓取**导演风格 DNA**，一键生成 Midjourney / 视频大模型可用的 Prompt。

**在线体验：** https://pizzapusen.github.io/aigc-film-prompt-composer/

---

## 功能亮点

- **200+ 导演风格库**：科幻、悬疑、文艺、动作、华语、影史经典等分类
- **影像技术标签**：景别、运镜、光影、色彩、质感、镜头、场景环境
- **示意参考图**：技术类标签内置 SVG 示意图（非电影海报误导）
- **导演参考海报**：本地缓存 + TMDB 回退，国内可访问
- **完全离线可用**：双击 `打开看板.bat`，或加载内嵌 `prompt-data.js`
- **Apple 风格 UI**：浅色简洁界面，三步流程一目了然

---

## 本地使用

### 方式 1：双击打开（无需 Node.js）

```
打开看板.bat
```

### 方式 2：本地服务（推荐开发）

```
启动网址版.bat
```

或：

```bash
node server.js
# 浏览器打开 http://127.0.0.1:8765/index.html
```

---

## 开发与构建

修改导演/标签数据后，重新生成运行时数据：

```bash
node build-data.mjs
```

| 文件 | 作用 |
|------|------|
| `index.html` | 主界面 + 样式 + 交互逻辑 |
| `data.json` | 线上优先加载的提示词数据库 |
| `prompt-data.js` | 离线备用数据（含内嵌 SVG 示意图） |
| `build-data.mjs` | 构建入口，生成上述两个数据文件 |
| `directors-extra.mjs` | 导演与标签源数据 |
| `tech-diagrams.mjs` | 技术类示意 SVG 生成逻辑 |
| `generate-tech-diagrams.mjs` | 生成示意图并写入 data URI |
| `image-enrich.mjs` | 为导演/技术项附加参考图 |
| `ref-images/` | 导演参考海报本地缓存 |
| `sync-local-posters.mjs` | 从 TMDB 同步海报到本地 |

---

## 部署

本仓库已配置 **GitHub Actions** 自动部署到 GitHub Pages。  
推送 `main` 分支后，约 1–2 分钟可在 Actions 页查看部署状态。

手动启用 Pages（首次）：

1. 仓库 **Settings → Pages → Build and deployment**
2. Source 选择 **GitHub Actions**

---

## 开源协议

[MIT License](./LICENSE)

欢迎 Fork、Issue 与 PR。若觉得有用，可以给仓库点个 Star。
