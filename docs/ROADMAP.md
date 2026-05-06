# 路线图

活文档。随着研究落地和决策做出而更新。

## Phase 0 — Foundations（当前）

**目标**：仓库已经准备好接收代码。

- [x] 仓库已创建并初始化（当前 remote：`jihaobin/code-design`）
- [x] Vision、Principles、AGENTS.md 已起草
- [x] Vite+ + pnpm workspace + TypeScript + Oxlint/Oxfmt/Vitest scaffold
- [x] Tauri v2 + React renderer shell 已创建
- [x] 基础 packages 已创建：`core`、`providers`、`runtime`、`ui`、`artifacts`、`exporters`、`templates`、`shared`
- [x] CI：lint/typecheck/test 已配置（macOS、Windows、Ubuntu）
- [x] DCO 检查已配置
- [x] ISSUE/PR templates + CODEOWNERS 已添加
- [ ] Apache-2.0 license 文件尚未添加到仓库根目录
- [ ] CONTRIBUTING / CODE_OF_CONDUCT / SECURITY 等 standard OSS files 尚未添加
- [ ] CI size budget 尚未配置（`size-limit` / `bundlewatch` 未接入）
- [ ] Changesets 尚未配置（release workflow 当前会检测并跳过）

## Phase 1 — Spike（研究落地后）

**目标**：用一个演示验证架构。不做 UI 打磨。

初始研究已关闭，正在把第一层级实现接成可运行演示。

- [x] `packages/providers` 包装 pi-ai，当前导出非流式 `complete()`
- [x] `packages/core` 编排：prompt → model call → artifact parsing
- [x] `packages/runtime` 可构建 iframe `srcdoc` 并注入元素选择 overlay
- [x] `apps/desktop` Tauri wrapper + React renderer，带静态 chat panel + preview pane
- [ ] 将 `apps/desktop` 表单接入 `core.generate()`
- [ ] 将生成的 HTML artifact 渲染到 iframe preview
- [ ] API key / model picker / first-run onboarding
- [ ] 本地配置与 OS keychain
- [ ] SQLite 设计历史存储
- [ ] 可取消的生成与用户可见错误状态
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
