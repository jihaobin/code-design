# Research 01 — Claude Design Hands-on Teardown

**日期**：2026-04-18 · **状态**：决策已记录

## TL;DR

Claude Design（claude.ai/design，2026-04-17 发布）是 Anthropic Labs 推出的聊天驱动 AI 设计工具，由 Opus 4.7 驱动。输出格式：HTML / PDF / PPTX / ZIP / Canva push / Claude Code handoff。拥有独立的每周使用额度（数字未公开）。已识别出八个需要复现的 UI 演示。

## UI 布局（已由多个来源确认）

```
┌──────────────────────────────────────────────┐
│ [Logo] [Project]  [Share] [Export ▼]         │
├──────────────────┬───────────────────────────┤
│ LEFT: Chat panel │ RIGHT: Design canvas      │
│ - messages       │ - live HTML render        │
│ - inline comment │ - click element to comment│
│   input          │ - direct text edit        │
│ - progress bar   │ - custom sliders nearby   │
└──────────────────┴───────────────────────────┘
```

- 没有可见的 Figma 风格 version history；聊天本身就是隐式 history
- 滑块由 AI 针对每个设计生成（不是固定 control set）
- click-to-comment 是元素级的，不是区域选择

## 关键交互细节

| 功能                   | 机制                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Inline comments        | 点击元素 → comment popup → submit。已知 bug：comments 偶尔会在处理前消失                                                         |
| Custom sliders         | AI 为 spacing/color/layout 输出每个设计专属的 sliders。拖动 = 实时更新，不重新运行模型                                           |
| Design system          | 通过 GitHub repo / local dir / natural language onboarding。AI 提取 colors、typography、components、spacing。持久化为 `SKILL.md` |
| Web Capture            | 在应用内粘贴 URL（无扩展）。很可能是 screenshot + vision，而不是 DOM scrape                                                      |
| Handoff to Claude Code | 生成带过期时间的 URL，打包 design + chat + README。用户把 URL 粘贴进 Claude Code                                                 |

## 要复现的八个演示

1. Calm Spaces meditation app（移动端原型）
2. Client case study one-pager（深色主题，可导出 PDF）
3. B2B SaaS pitch deck（PPTX export）
4. Inline comment editing loop
5. AI-generated tunable sliders
6. Codebase → design system extraction
7. Web Capture（URL → reference）
8. Handoff bundle to engineering tool（他们的是 Claude Code；我们的是通用 artifact bundle）

## 定价（与我们的定位相关）

- Claude Design 有独立的每周上限，与 Chat / Claude Code 分开
- 每个 tier 的具体生成次数从未公开
- Pro $20/mo，Max 5x $100/mo，Max 20x $200/mo
- → 开源 BYOK 角度：无上限，只有 token 成本

## 已知问题（他们的 — 用来挑选设计经验）

1. Inline comments 有时会在处理前消失
2. Compact layout view 保存错误
3. 大型 monorepos 扫描慢（建议只链接 subdirs）
4. 偶发 rendering errors
5. 没有可复用 component primitives（缺少 Figma 风格 auto-layout）
6. 没有可见的 version history UI
7. 没有 Figma / Sketch / XD integrations（只有 Canva）

## 研究中的关键缺口

**目前没有公开的导出 HTML 文件样本。** 第 1 天的首要任务：购买 Pro 订阅，生成一个，下载，逆向 DOM structure、font embedding、JS runtime presence。没有这个，我们就是在盲目设计。

## 主要来源

1. https://www.anthropic.com/news/claude-design-anthropic-labs（官方公告）
2. https://claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux（官方教程 — 细节最多）
3. https://support.claude.com/en/articles/14667344（pricing / weekly cap mechanics）
4. https://www.youtube.com/watch?v=A2eEv3KYGPg（Vivek Mishra — 找到的唯一完整 walkthrough video）
5. https://dev.to/vteacher/...claude-design-is-finally-here...（日本用户真实截图，提到 SKILL.md output）
6. https://pasqualepillitteri.it/en/news/975/claude-design-anthropic-labs-figma-alternative（带截图的 UI layout teardown）
7. https://gln75.com/en/blog/anthropic-claude-design-launch（引用官方支持文档说明 known bugs）

## 决策影响

- 确认要镜像的 UI layout（左侧 chat / 右侧 canvas）
- 确认八个演示作为 v1.0 成功标准（已在 VISION.md 中）
- 在锁定 artifact schema 前，需要获取一个导出的 HTML 样本
- 差异化角度已确认：无每周上限、无 Canva 依赖、本地设计系统提取
