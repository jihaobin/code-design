# 研究 09 — 全面打磨 + 奇偶差距积压

**日期**：2026-04-18 · **状态**：已记录决策 — 前 10 项提升至 v0.1 必须完成

## 当前实现备注

本文记录的是研究后的 v0.1 必做积压，而不是当前完成清单。截至当前代码状态：Tauri/React shell、非流式 provider/core 第一层级、artifact parser、runtime overlay/srcdoc helper、UI tokens 和 raw HTML exporter 已存在；下方前 10 项大多仍未落地。

## v0.1 版本必须完成的 10 项任务（已锁定）

按合并优先级排序，并标注负责人：

1. **操作系统钥匙串存储**用于 API 密钥 — `wt/onboarding`（进行中，PR #1）
2. **流式生成**，骨架响应时间 ≤ 200 毫秒 — `wt/first-demo`（进行中，PR #4）
3. **React 错误边界**（应用外壳 + 每个面板） — `wt/reliability`（已排队）
4. **通过 `AbortController` 取消生成** — `wt/reliability`（已排队）
5. **pi-ai 单例缓存**（避免每次调用重复导入） — `wt/sandbox-hardening`（已排队）
6. **预览 iframe 的 CSP 注入** — `wt/sandbox-hardening`（已排队）
7. **沙箱 iframe 错误报告** — `wt/reliability`（已排队）
8. **空状态插图 + 加载骨架屏** — `wt/preview-ux`（进行中，PR #3）
9. **IPC + 产物模式版本控制** — `wt/compat`（已排队）
10. **Ollama 自动检测预设** — `wt/onboarding`（开发中；扩展功能）

当前仓库没有对应的开放 PR 元数据；上面的分支/PR 标注来自研究规划，需在实际分支创建后重新确认。

## v0.2 — v1.0 十大实用功能

1. 内联评论循环 — `wt/inline-comment`
2. AI 生成的自定义滑块 — `wt/sliders`
3. 三栏模型 A/B 测试 — `wt/ab-race`
4. 代码库 → 设计系统提取 — `wt/codebase-ds`
5. 网页抓取 + URL 样式窃取 — `wt/web-capture`
6. Mac/Windows 代码签名 — `wt/release-eng`
7. Homebrew Cask 公式 — `wt/release-eng`
8. PDF + PPTX 导出 — `wt/exporters`
9. `packages/ui` 的 Storybook — `wt/storybook`
10. WCAG 审计 + VoiceOver 冒烟测试 — `wt/a11y`

## 延迟至 1.0 版本之后

- 增量更新
- 变异测试
- 多用户实时协作（非目标功能）
- Linux Flatpak + Snap
- 音效、触控栏、触觉反馈

## 推荐的后续 5 个工作树（文件不重叠，每个≤5 天）

| #   | 分支                   | 范围                                                       | 所属文件                                                                | 天数 |
| --- | ---------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ---- |
| 1   | `wt/reliability`       | C1 C2 C5 C6 C7 C10 C11（边界、重试、取消、错误报告）       | App.tsx、providers/index.ts、runtime/overlay.ts、core/index.ts          | 3-4  |
| 2   | `wt/sandbox-hardening` | D4 D5 E1 E3（CSP、Tauri 权限审计、单例、部分 srcdoc 更新） | runtime/index.ts、main/index.ts（安全选项）、providers/index.ts（单例） | 2-3  |
| 3   | `wt/exporters`         | A7 A8 A9 A10（PDF、PPTX、ZIP、导出菜单）                   | packages/exporters/src/、main/index.ts（IPC）、App.tsx（工具栏）        | 4-5  |
| 4   | `wt/inline-comment`    | A2 A13 F10（完整评论循环、直接文本编辑、右键菜单）         | runtime/overlay.ts、core/index.ts、渲染器评论弹窗                       | 4-5  |
| 5   | `wt/compat`            | M1 M2 M4 M6（IPC 版本管理、配置模式、工件 schemaVersion）  | main/index.ts, shared/index.ts, main/migrations/                        | 1-2  |

**文件冲突说明**：

- `wt/reliability` 和 `wt/sandbox-hardening` 均修改了 `providers/index.ts` — 合并顺序：reliability 先合并，sandbox-hardening 在此基础上变基。
- `wt/exporters` 和 `wt/compat` 均修改了 `main/index.ts`（不同部分；变基操作简单）。
- `wt/inline-comment` 和 `wt/reliability` 均涉及 `runtime/overlay.ts`（存在重叠）；顺序：`reliability` 先合并。

## 完整待办事项

包含 13 个部分的详尽积压任务（A. 功能对等 / B. 差异化 / C. 可靠性 / D. 安全性 / E. 性能 / F. 用户体验打磨 / G. 无障碍 / H. 国际化 / I. 开发者体验 / J. 发布工程 / K. 文档 / L. 遥测 / M. 兼容性）已归档至 2026 年 4 月 18 日的对话记录中。每项任务均标注影响等级（高/中/低）+ 工作量（极小/小/中/大/极大）+ 建议负责人。将在 v0.1 发布后重新导入 GitHub Issues。

## 关键研究空白（延续）

**尚未获取来自 Claude Design 的导出 HTML 样本。** 在获取样本并逆向解析其产物格式之前，我们的模式均为暂定方案。请阻止锁定新持久化形态的 PR。
