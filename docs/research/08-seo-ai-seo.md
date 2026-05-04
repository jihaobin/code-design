# 研究 08 — SEO + AI-SEO + GitHub 可发现性

**日期**：2026-04-18 · **状态**：决策已记录

## 已锁定的关键决策

1. **站点根目录下的 /llms.txt + /llms-full.txt**，遵循 https://llmstxt.org 规范
2. **Schema.org JSON-LD**，在每个文档页面上包含 SoftwareApplication + FAQPage
3. **robots.txt 中允许 GPTBot / ClaudeBot / PerplexityBot**（完全允许）
4. **对比页面**作为最高投资回报率的 GEO 内容（`/docs/comparison`）
5. **已设置 20 个 GitHub 主题** — 已应用于仓库
6. **添加 CITATION.cff** 用于学术引用
7. **48 小时协同发布**（HN + Reddit + ProductHunt）当 v0.1 版本上线时

## 复制粘贴素材（从研究中逐字保存）

### llms.txt 模板

请参阅 `website/llms.txt`（将在 `wt/website` 中创建）。

### 对比表格模板

```
| 功能特性 | open-codesign | Claude Design | v0 (Vercel) | Bolt.new |
|---|---|---|---|---|
| 开源状态 | ✅ Apache-2.0 | ❌ 闭源 | ❌ 闭源 | ✅ 开源 (bolt.diy) |
| 桌面原生 | ✅ Tauri v2 | ❌ 仅网页 | ❌ 仅网页 | ❌ 仅网页 |
| 自带密钥 | ✅ 任意提供商 | ❌ 仅 Anthropic | ❌ 仅 Vercel | ⚠️ 有限 |
| 本地/离线 | ✅ 完全本地 | ❌ 云端 | ❌ 云端 | ❌ 云端 |
| 模型 | 20+（Claude、GPT、Gemini、Ollama） | 仅 Claude | GPT-4o | 多 LLM |
| 价格 | 永久免费 | 付费订阅 | 免费增值 | 免费增值 |
| 输出 | HTML/CSS + PPTX/PDF | HTML/PDF/PPTX/Canva | React | 全栈 |
| 数据隐私 | 100%本地处理 | 云端处理 | 云端 | 云端 |
```

### 20 个 GitHub 话题（已锁定）

ai-design, ai-design-tool, claude-design, 开源, tauri, 桌面应用, byok, 本地优先, anthropic, openai, gemini, deepseek, ollama, 多模型, 提示词转设计, html 原型, pptx 导出, pdf 导出, shadcn, tailwindcss

### Show HN 草稿

标题（148 字符）：

> Show HN：open-codesign – 开源 Tauri AI 设计工具，自带密钥，支持 Claude/GPT-4o/Gemini/Ollama

正文（约 600 字）：请参阅 2026 年 4 月 18 日存档的智能体输出（我们将在发布前进行完善）。

### 15 个 awesome-list 提交目标

1. tauri-apps/awesome-tauri —— 需要截图、二进制文件和清晰的 Tauri 应用定位
2. Shubhamsaboo/awesome-llm-apps（105K 星）
3. mahseema/awesome-ai-tools
4. theresanaiforthat.com
5. tools.ai（Ben's Bites）
6. futurepedia.io
7. Product Hunt（安排发布，寻找推荐人）
8. alternativeto.net（归类为“Claude Design 替代品”）
9. openalternative.co（由 Perplexity 收录）
10. unicodeveloper/awesome-opensource-apps
11. vitejs/awesome-vite (14K)
12. Hannibal046/Awesome-LLM
13. heshengtao/awesome-claude-for-developer
14. alvinreal/awesome-opensource-ai
15. alexpate/awesome-design-systems (17K)

### Robots.txt（允许所有 AI 爬虫）

已纳入计划；将根据 SEO 研究建议在 `wt/website` 中创建。

### CITATION.cff

在仓库根目录添加（单独的小提交）。

## 防弃用规则（根据研究）

这些信号向人类和 AI 表明“项目仍在活跃”：

1. 每 6 周发布一个版本，即使只是小修复
2. 保持 CI 徽章为绿色
3. README 必须在首屏包含截图或 GIF
4. 在 7 天内处理每个 Issue
5. 维护 `good-first-issue` 标签列表

## 来源

2026 年 4 月 18 日对话日志中存档的 15 个以上 URL；主要参考：

- https://llmstxt.org
- https://geneo.app/blog/geo-generative-engine-optimization-open-source
- https://arxiv.org/html/2509.08919v1（普林斯顿大学地球科学研究中心）
- https://nuxtseo.com/learn-seo/vue/ssr-frameworks/vitepress
- https://gingiris.github.io/growth-tools/blog/2026/03/25/...
