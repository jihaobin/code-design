# 架构

代码库的高层形态。详细的模块 README 位于各个 `packages/*/README.md`。

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

## 包职责

- **`apps/desktop`** — Tauri v2 桌面包装 + React renderer。Tauri 只负责窗口、打包和权限边界；业务逻辑、存储编排、模型调用和导出逻辑都在 Node 24 / TypeScript packages 中实现。`src-tauri` 只保留最小 bootstrap，不写自定义 Rust 业务代码。
- **`packages/core`** — 生成编排。接收用户提示词 + 设计系统 + 历史 → 调用 `providers` → 流式输出 artifacts → 发出 UI 订阅的事件。
- **`packages/providers`** — 包装 `@mariozechner/pi-ai`，并补上 `docs/research/05-pi-ai-boundary.md` 中记录的六项缺失能力。应用代码绝不直接导入 provider SDK。
- **`packages/runtime`** — Sandbox 预览。负责 iframe `srcdoc`、esbuild-wasm worker、import map 解析，以及内联评论和滑块绑定的 overlay script。
- **`packages/ui`** — open-design 设计 tokens（CSS variables）+ 基于 Radix 的组件 primitives + Tailwind preset。由 `apps/desktop` 使用。
- **`packages/artifacts`** — artifact 类型（HTML / SVG / slide deck / asset bundle）的 Zod schemas + `<artifact>` 标签流式解析器。
- **`packages/exporters`** — PDF、PPTX、ZIP。每个 exporter 都是自己的 subpath export，并通过动态 import 保持冷启动 bundle 精简。
- **`packages/templates`** — 内置演示提示词和 starter templates。运行时读取，不打包进 core。
- **`packages/shared`** — 跨 packages 共享的普通类型、工具函数和 zod schemas。无运行时依赖。

## 数据流：一次生成

1. 用户在 chat panel 中输入提示词
2. `desktop/renderer` 调用 Node 24 本地服务/sidecar 暴露的 `core.generate({ prompt, designSystem, history })`
3. `core` 构建提示词上下文（system prompt + design system + chat history）
4. `core` 调用 `providers.streamArtifacts(model, context)`
5. `providers` 调用 pi-ai `stream()`，并在 `text_delta` 事件上运行 `<artifact>` parser state machine
6. `core` 发出 `artifact:start` / `artifact:chunk` / `artifact:end` 事件
7. `desktop/renderer` 通过 postMessage 把 chunks 管道传入 `runtime` iframe；`runtime` 逐步重建 `srcdoc`
8. 在 `artifact:end` 时，`core` 通过 Node 24 存储层把 snapshot 持久化到 SQLite

## 数据流：内联评论

1. 用户点击 iframe 中的元素
2. Overlay script（位于 `runtime` 中）通过 postMessage 把选中元素信息发送给 renderer
3. Renderer 显示评论弹窗
4. 提交时调用 `core.applyComment({ artifactId, elementId, comment })`
5. `core` 构建 str_replace prompt，并调用 `providers.structuredComplete()`
6. 返回的 patch 应用于 artifact 的 HTML
7. 新版本 snapshot 写入 SQLite；iframe 重建

## 数据流：拖动滑块

无模型调用。`runtime` 直接调用 `iframe.contentDocument.documentElement.style.setProperty(cssVar, value)`。在 `mouseup` 时，新值作为 artifact metadata 的一部分持久化到 SQLite。

## 不得跨越的边界

- ❌ `apps/desktop` 从 `@anthropic-ai/sdk` 或 `openai` 导入 — 必须通过 `packages/providers`
- ❌ `packages/core` 从 `apps/desktop` 或 React 导入
- ❌ `packages/ui` 知道 LLM 或 artifacts
- ❌ Exporters 被打包进主应用 shell — 必须动态导入
- ❌ 在 `src-tauri` 增加自定义 Rust 业务逻辑 — 本地能力应优先放在 Node 24 / TypeScript packages
- ❌ 任何 renderer 代码绕过 Node 24 存储层直接写磁盘
