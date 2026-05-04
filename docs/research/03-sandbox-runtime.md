# Research 03 — Sandbox Runtime Selection

**日期**：2026-04-18 · **状态**：决策已记录

## 决策

**主方案**：Tauri WebView iframe `srcdoc` + esbuild-wasm + import maps，并本地捆绑常见 deps。
**兜底（在线模式）**：网络可用时使用 Sandpack，以获得更丰富的 npm 生态。
**拒绝**：WebContainers、pure CDN。

## 为什么

- ✅ **完全离线** — 将约 5MB esbuild-wasm + 本地缓存的 `react`/`vue`/`tailwind` ESM 打包进 Tauri resources 或 Node 24 本地缓存
- ✅ **Apache-2.0 / MIT** — 无商业许可证、无按席位收费
- ✅ **无 COOP/COEP 要求** — 避免把 sandbox 设计绑定到某个桌面壳版本的隔离行为
- ✅ **无 HTTP server** — 直接 `file://` 可用
- ✅ **Hot reload < 50ms**，通过 srcdoc rewrite 或 service-worker partial update
- ✅ **Bundle impact ~5MB** — 在我们的 80MB 总预算内

## 对比矩阵

| Feature          | Sandpack | WebContainers | esbuild-wasm | Pure CDN | Tauri WebView |
| ---------------- | :------: | :-----------: | :----------: | :------: | :-----------: |
| React            |    5     |       5       |      5       |    3     |       4       |
| Vue SFC          |    5     |       5       |      3       |    3     |       3       |
| Tailwind         |    4     |       5       |      4       |    4     |       4       |
| Real npm install |    3     |     **5**     |      1       |    1     |       1       |
| Offline          |    2     |     **1**     |    **5**     |    1     |     **5**     |
| HMR              |    5     |       5       |      4       |    3     |       5       |
| Bundle size      |    4     |       2       |      3       |  **5**   |     **5**     |
| Tauri fit        |    3     |       2       |      4       |    4     |     **5**     |
| Engineering cost |  **5**   |       4       |      2       |  **5**   |       3       |

## 为什么每个被拒方案不可行

### WebContainers — 已拒绝

- ToS 要求商业许可证；社区报告约 $27k/year 报价
- 强依赖 `staticblitz.com` runtime fetch — 永不离线
- COOP/COEP 要求会增加桌面 WebView 调试和跨平台一致性风险
- 三重否决

### Pure CDN（esm.sh）— 已拒绝

- 不兼容离线；第一次 import = HTTP request
- esm.sh 在中国大陆可访问性不稳定（对我们的用户群是 deal-breaker）
- 无原生 JSX 支持（仍然需要 transpiler）
- 多个 esm.sh URL 会带来 React singleton 问题

### Sandpack — 降级为 fallback

- 自托管 bundler 需要 Node 16 build chain（自 Vercel deprecation 后已损坏）
- 桌面 WebView 访问 codesandbox.io 子域 bundlers 时可能遇到 CORS 和在线可用性问题
- Offline issue #1223 截至 2024-10 仍未关闭
- 在线体验优秀 — 保留为 opt-in mode

## 架构

```
[AI generates code]
  ↓
[esbuild-wasm in Web Worker]  ← .wasm preloaded from extraResources
  ↓ transpile/bundle <200ms
[Import map resolver]  ← local ESM cache: react, react-dom, vue, tailwind
  ↓
[<iframe sandbox="allow-scripts" srcdoc="...">]
  ↓ postMessage
[Main renderer collects console/errors]
```

## 实现说明

- esbuild-wasm `initialize()` 只能调用一次 → 维护 global singleton，谨慎处理 HMR
- Vue SFC 需要 `@vue/compiler-sfc`（约 500KB gzip 额外体积）— 除非更早需要，否则推迟到 v0.5
- Sandbox attribute：仅 `allow-scripts`；永远不要 `allow-same-origin`（会让 iframe 逃逸到 parent DOM）
- 使用 Tauri custom protocol 或 Node 24 本地服务提供 cached deps，避免依赖远程 CDN

## 工作量估计

- Core sandbox runtime：完整功能集 7-10 天（包括 Vue SFC、dep precaching）
- Minimum viable（仅 React，无 precache）：3 天

## 来源

1. https://github.com/codesandbox/sandpack — Apache-2.0，performance benchmarks
2. https://webcontainers.io/enterprise — commercial license terms
3. https://v2.tauri.app/reference/config/ — Tauri build/dev URL 与资源配置
4. https://github.com/codesandbox/sandpack/issues/1223 — offline limitation
5. https://github.com/NimbleLabs/vibe-coding-bundler — esbuild-wasm reference impl
6. https://v2.tauri.app/security/ — Tauri security best practices
