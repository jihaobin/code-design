# 路线图

活文档。随着研究落地和决策做出而更新。

## Phase 0 — Foundations（当前）

**目标**：仓库已经准备好接收代码。

- [ ] 仓库已创建（`open-design`）
- [ ] 本地 git 已初始化，remote 已链接
- [ ] Vision、Principles、AGENTS.md 已起草
- [ ] Apache-2.0 license + DCO + standard OSS files
- [ ] Vite+ + pnpm workspace + TypeScript + Oxlint/Oxfmt/Vitest scaffold
- [ ] CI：lint、typecheck、test、size budget
- [ ] CONTRIBUTING + ISSUE/PR templates + CODEOWNERS
- [ ] 第一次 commit 已 push

## Phase 1 — Spike（研究落地后）

**目标**：用一个演示验证架构。不做 UI 打磨。

依赖 `docs/RESEARCH_QUEUE.md` 完成。研究完成后：

- [ ] `packages/providers` 包装 pi-ai，导出统一的 `generate()`
- [ ] `packages/runtime` 在 iframe sandbox 中渲染一个 HTML artifact（sandbox 技术待研究项 #3 决定）
- [ ] `packages/core` 编排：prompt → model call → artifact → render
- [ ] `apps/desktop` Tauri wrapper + React renderer，带 chat panel + preview pane
- [ ] 一个演示端到端可用：**Calm Spaces meditation app**

## Phase 2 — Three demos

**目标**：展示足够内容以招募早期贡献者。

- [ ] 通过 `pptxgenjs` + `dom-to-pptx` 导出 PPTX（已锁定，详见 `docs/research/04-pptx-export.md`）
- [ ] 通过 Puppeteer-core 对系统 Chrome 进行 PDF 导出
- [ ] 演示可用：meditation app、case study one-pager、pitch deck
- [ ] 内置 template gallery
- [ ] 带 API key + model picker 的 Settings 页面

## Phase 3 — Killer interactions

**目标**：交付那些让我们区别于“又一个 AI HTML generator”的东西。

- [ ] 内联评论 → 通过 `data-open-design-id` + str_replace 实现的 AI 补丁循环（已锁定，详见 `docs/research/02-inline-comment-and-sliders.md`）
- [ ] 通过 `design_params` JSON + CSS 变量（锁定，同一来源）生成的 AI 自定义滑块
- [ ] 带 snapshot rollback 的 version timeline

## Phase 4 — Ecosystem features

**目标**：代码库感知 + 交付。

- [ ] Codebase scanner → design system extraction
- [ ] Web Capture（按需 Playwright）
- [ ] 通用 artifact handoff bundle
- [ ] 全部八个杀手级演示可用

## Phase 5 — Release polish

**目标**：1.0 质量。

- [ ] Mac notarization + Windows Authenticode
- [ ] Homebrew Cask + winget + scoop manifests
- [ ] Auto-update（opt-in）
- [ ] 安装体积预算已验证 ≤ 80 MB
- [ ] Onboarding flow ≤ 3 steps
- [ ] Documentation site（Fumadocs）
- [ ] 公开 1.0 release

## Deferred（1.0 之后）

已跟踪，但不在关键路径上：

- 实时协作
- MCP server interface（把设计生成暴露给 Claude Code 等）
- Claude Artifacts `<artifact>` 标签兼容（从 claude.ai 导入）
- 面向任意 IDE/CLI 的 artifact bundle 消费协议
- 托管 demo site（web build）
- Linux installer
- Mobile companion（只读）

## Anti-goals

在路线图讨论中我们会拒绝的事情：

- 内置支付/计费
- 用户账号/云同步
- 图库素材库
- 自定义模型微调
- 团队管理控制台
