# 架构

代码库的高层形态。本文区分**当前实现**和**目标架构**：当前实现是可在仓库中验证的行为，目标架构来自愿景和研究结论，尚未全部落地。

## 鸟瞰图

```
                          ┌──────────────────────────────┐
                          │      apps/desktop (Tauri)    │
                          │  ┌────────────┬───────────┐  │
                          │  │ Chat panel │  Canvas   │  │
                          │  └─────┬──────┴─────┬─────┘  │
                          └────────┼────────────┼────────┘
                                   │            │
                         ┌─────────▼──┐    ┌────▼─────────┐
                         │  core      │    │  runtime     │
                         │ (orchestra │    │ (sandbox     │
                         │  tion)     │    │  renderer)   │
                         └──┬─────────┘    └──────────────┘
                            │
              ┌─────────────┼──────────────┐
              ▼             ▼              ▼
       ┌──────────┐  ┌──────────┐  ┌────────────┐
       │providers │  │artifacts │  │ exporters  │
       │ (pi-ai + │  │ (schema) │  │ (PDF/PPTX) │
       │ wrappers)│  └──────────┘  └────────────┘
       └──────────┘
```

## 当前实现状态

- `apps/desktop` 已有 Tauri v2 + React shell，页面是静态聊天栏和预览占位画布；尚未接入 `core.generate()`、设置页、存储或导出菜单。
- `packages/core` 已有阻塞式 `generate()`：组装 system/user/history 消息，调用 `providers.complete()`，再用 `<artifact>` parser 从完整文本中提取 HTML artifact。它还没有流式事件、设计系统上下文、SQLite 持久化或评论补丁 API。
- `packages/providers` 已包装 `@mariozechner/pi-ai` 的非流式 `completeSimple()`，并通过动态 `import()` 延迟加载 pi-ai。`structuredComplete()`、`streamArtifacts()`、重试、缓存、PDF 输入等仍是待实现接口。
- `packages/runtime` 已能构造 iframe `srcdoc`、移除用户 HTML 中的 CSP meta、注入元素选择 overlay，并暴露 CSS 变量更新 helper。esbuild-wasm、import maps、iframe 错误上报、局部重建尚未实现。
- `packages/artifacts` 已实现单 artifact `<artifact>` 标签流式解析器。Zod artifact schema 目前在 `packages/shared` 中；还没有 artifact schema version 字段。
- `packages/exporters` 目前只声明格式并实现 raw HTML 写盘；PDF/PPTX/ZIP subpath export 在 `package.json` 中预留，但对应源码尚未实现。
- `packages/templates` 目前只有 4 个内置 demo prompt，不是完整八个 Claude Design 演示，也没有独立 system prompt 文件。
- `packages/ui` 已提供 CSS tokens、Tailwind v4 theme stylesheet、Tailwind preset，以及 `Button` / `Card` 两个 React 组件。
- 持久化配置、OS keychain、SQLite 历史、Node sidecar/IPC 边界目前尚未实现。

## 包职责

- **`apps/desktop`** — Tauri v2 桌面包装 + React renderer。Tauri 只负责窗口、打包和权限边界；业务逻辑、存储编排、模型调用和导出逻辑都应放在 Node 24 / TypeScript packages 中。`src-tauri` 只保留最小 bootstrap，不写自定义 Rust 业务代码。
- **`packages/core`** — 生成编排。当前接收用户提示词、历史、模型引用和 API key，调用 `providers.complete()`，返回解析出的 artifacts。目标形态会加入设计系统上下文、流式事件和持久化边界。
- **`packages/providers`** — 包装 `@mariozechner/pi-ai`，并逐步补上 `docs/research/05-pi-ai-boundary.md` 中记录的缺失能力。应用代码绝不直接导入 provider SDK。
- **`packages/runtime`** — Sandbox 预览。当前负责 iframe `srcdoc`、CSP meta 移除、overlay 注入和 CSS 变量更新；目标形态会加入 esbuild-wasm worker、import map 解析、错误上报和更完整的内联评论/滑块绑定。
- **`packages/ui`** — open-design 设计 tokens（CSS variables）+ Tailwind v4 theme/preset +少量 React primitives。由 `apps/desktop` 使用。
- **`packages/artifacts`** — `<artifact>` 标签解析器。目标形态会承载 artifact 类型（HTML / SVG / slide deck / asset bundle）的版本化 schema。
- **`packages/exporters`** — 导出边界。当前仅 raw HTML export 可用；PDF、PPTX、ZIP 仍需通过动态 import 落地。
- **`packages/templates`** — 内置演示提示词和 starter templates。当前只有 4 个 demo prompt。
- **`packages/shared`** — 跨 packages 共享的普通类型、工具函数和 zod schemas。无运行时依赖。

## 当前数据流：一次生成

1. 调用方传入 `core.generate({ prompt, history, model, apiKey, baseUrl? })`。
2. `core` 使用内置默认 system prompt、历史消息和用户提示词构建消息数组。
3. `core` 调用 `providers.complete(model, messages, opts)`。
4. `providers` 动态导入 `@mariozechner/pi-ai`，调用 `completeSimple()`，将 text blocks 拼成完整文本。
5. `core` 用 `createArtifactParser()` 解析完整文本中的 `<artifact>` 标签。
6. `core` 返回 `{ message, artifacts, inputTokens, outputTokens, costUsd }`。

当前桌面 renderer 还没有调用这条数据流。

## 目标数据流：流式生成

1. 用户在 chat panel 中输入提示词。
2. `desktop/renderer` 通过已审查的 Node 24 sidecar/IPC 边界调用 `core.generate()` 或后续 streaming API。
3. `core` 构建提示词上下文（system prompt + design system + chat history）。
4. `providers` 调用 pi-ai streaming API，并在 text delta 上运行 `<artifact>` parser。
5. `core` 发出 `artifact:start` / `artifact:chunk` / `artifact:end` 事件。
6. `desktop/renderer` 将 chunks 管道传入 `runtime` iframe；`runtime` 逐步重建 `srcdoc`。
7. 在 `artifact:end` 时，Node 24 存储层把 snapshot 持久化到 SQLite。

## 目标数据流：内联评论

1. 用户点击 iframe 中的元素
2. Overlay script（位于 `runtime` 中）通过 postMessage 把选中元素信息发送给 renderer
3. Renderer 显示评论弹窗
4. 提交时调用 `core.applyComment({ artifactId, elementId, comment })`
5. `core` 构建 str_replace prompt，并调用 `providers.structuredComplete()`
6. 返回的 patch 应用于 artifact 的 HTML
7. 新版本 snapshot 写入 SQLite；iframe 重建

当前只实现了 overlay 的元素选择消息；评论 UI、`core.applyComment()`、结构化 patch 和持久化尚未实现。

## 当前与目标数据流：拖动滑块

当前 `runtime.applyCssVar()` 已能对 iframe document 调用 `documentElement.style.setProperty(cssVar, value)`。目标形态仍然是无模型调用；在 `mouseup` 时，新值作为 artifact metadata 的一部分持久化到 SQLite。

## 不得跨越的边界

- ❌ `apps/desktop` 从 `@anthropic-ai/sdk` 或 `openai` 导入 — 必须通过 `packages/providers`
- ❌ `packages/core` 从 `apps/desktop` 或 React 导入
- ❌ `packages/ui` 知道 LLM 或 artifacts
- ❌ Exporters 被打包进主应用 shell — 必须动态导入
- ❌ 在 `src-tauri` 增加自定义 Rust 业务逻辑 — 本地能力应优先放在 Node 24 / TypeScript packages
- ❌ 任何 renderer 代码绕过 Node 24 存储层直接写磁盘
