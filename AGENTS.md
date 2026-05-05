# AGENTS.md — open-design

本仓库中 Claude Code（及任何 AI 编码代理）的操作指南。在进行更改前请先阅读此文件。

## 本项目是什么

open-design 是一款基于 Tauri 封装的桌面应用，能够将自然语言提示转化为设计产物（HTML 原型、PDF、PPTX 演示文稿、营销素材）。它是 Anthropic 旗下 Claude Design 的开源替代方案，通过 `pi-ai` 支持多提供商模型，并采用本地优先的存储模式。

完整愿景及已确定的决策内容详见 `docs/VISION.md`。在提出架构变更建议前，请先阅读该文档。

## 硬性约束（不得违反）

这些是项目级别的承诺，而非偏好设置：

1. **安装体积预算：≤ 80 MB。** 若添加依赖项导致超出此限制，需在 PR 中说明体积差异及替代方案。CI 将强制执行此标准。
2. **不捆绑模型运行时。** 安装程序中不附带 Ollama、llama.cpp、Python 或浏览器二进制文件。请使用系统安装或按需延迟下载。
3. **仅支持 BYOK 模式。** 默认不代理 API 调用、不关联云账户、不收集遥测数据。用户凭证将保存在 `~/.config/open-design/config.toml` 中（）。
4. **本地优先存储。** 设计稿、历史记录和代码库扫描数据均存储在磁盘上（通过 `better-sqlite3` 使用 SQLite）。无需强制云同步。
5. **仅兼容 Apache-2.0 许可证。** 拒绝 GPL/AGPL/SSPL/专有依赖项。添加任何内容前需检查许可证。
6. **延迟加载重型功能。** PPTX 导出、网页抓取、代码库扫描等功能必须在首次使用时动态导入，而非在应用启动时加载。

## 技术栈与规范

- **工具链**：Vite+（`vp`）是安装、开发、构建、检查、测试和打包任务的统一入口点。
- **包管理器**：Vite+ 将任务委托给由 Corepack 锁定的 `pnpm`；切勿为项目变更调用 `npm` 或 `yarn`。工作区在 `pnpm-workspace.yaml` 中声明。
- **构建编排**：通过 `vp run` 执行 Vite 任务；请勿在关键路径中引入第二个任务编排器。
- **代码检查与格式化**：Vite+ 的 `vp check` 基于 Oxlint、Oxfmt 和 tsgolint 实现。请勿引入其他格式化工具或代码检查工具栈。
- **测试**：Vite+ `vp test`，基于 Vitest 实现。测试 API 从 `vite-plus/test` 导入，而非 `vitest`。
- **TypeScript**：`strict: true`，`verbatimModuleSyntax: true`，`moduleResolution: "bundler"`。禁止使用 `any`。
- **提交**：遵循 Conventional Commits 规范，由 commitlint 强制执行。
- **版本管理**：使用 Changesets。请勿手动编辑 `CHANGELOG.md`。
- **Node**: 仅支持 24 LTS（通过 `.nvmrc` + `engines` 锁定）。
- **模型层**：所有 LLM 调用均通过 `@mariozechner/pi-ai` 进行。请勿在应用代码中直接导入提供商 SDK；若 pi-ai 缺少某项功能，请将其作为轻量扩展添加至 `packages/providers`。

### 前端技术栈（已锁定）

- **UI 框架**：React 19 + Vite+ 管理的 Vite
- **样式**：Tailwind v4 + CSS 变量（令牌位于 `packages/ui` 中）
- **状态管理**：Zustand（不引入 Redux / Recoil / MobX）
- **路由**：初期使用原生 `useState` 进行视图切换；仅当路由数量超过 5 个时采用 TanStack Router
- **组件**：Radix UI 基础组件 + 位于 `packages/ui` 中的自定义 shadcn 风格封装
- **图标**：仅使用 `lucide-react`
- **表单**：原生 `<form>` + `FormData`（不引入 react-hook-form / formik）
- **动画**：Tailwind 过渡效果（不引入 framer-motion / motion）
- **桌面封装**：Tauri v2。Tauri 仅用于原生窗口管理、操作系统打包以及受限的权限控制下的 shell/sidecar 访问。
- **Rust 边界**：不包含自定义 Rust 业务逻辑。保持生成的 Tauri 启动代码最小化；将产品逻辑放在 Node 24 / TypeScript 包中。
- **沙箱渲染器**：Tauri WebView iframe `srcdoc` + esbuild-wasm + import maps（参见 `docs/research/03-sandbox-runtime.md`）
- **存储**：使用 better-sqlite3 存储设计历史；配置采用 TOML 文件（不使用不透明的应用商店二进制块）

## 仓库布局

```
apps/
desktop/           # Tauri 桌面外壳 + React 渲染器
packages/
```

core/ # 生成编排（提示词 → 产物流水线）
providers/ # pi-ai 适配器 + 自定义提供者扩展
runtime/ # 沙箱渲染器（基于 iframe 的预览）
ui/ # open-design 设计令牌与组件
artifacts/ # 制品模式（HTML / React / SVG / PPTX）
exporters/ # PDF / PPTX / ZIP 导出器（懒加载）
templates/ # 内置演示提示词与入门模板
shared/ # 类型、工具函数、Zod 模式
docs/ # 愿景、路线图、原则、RFC 文档
examples/ # Claude Design 公开演示的复现示例

````

## 在此处处理任务

- **在进行任何非微小改动前，务必先阅读 `docs/VISION.md` 和 `docs/PRINCIPLES.md`**。这些约束条件不可协商。
- **对于涉及超过 5 次工具调用或 3 个文件的任务，请使用"基于文件的规划工作流"**。规划文件存放于 `.claude/workspace/` 目录下。
- **使用 git worktrees 进行并行工作。** 工作流程请参见 `docs/COLLABORATION.md`。切勿在同一检出目录中运行两个不相关的功能分支。
- **在开始涉及沙盒/行内评论/滑块/PPTX/pi-ai 功能的工作前，请先查看 `docs/RESEARCH_QUEUE.md`**——相关研究可能尚未完成，决策也未最终确定。
- **遵循精简预算原则。** 在添加依赖项之前：先寻找轻量级替代方案，考虑内联实现，并确认是否可以将其设为同级依赖。
- **UI 必须使用 `packages/ui` 中的令牌。** 不要在应用代码中硬编码颜色、字体或间距。如果缺少某个令牌，请先将其添加到 `packages/ui` 中。
- **不要进行“面向未来”的设计抽象。** 三行相似的代码是可以接受的。除非我们有两个实际的调用者，否则不要引入工厂模式、插件系统或配置驱动的调度。
- **不要添加解释代码功能的注释。** 命名应该承担这一职责。仅在代码行为令人意外时，注释说明其 _原因_。
- **对磁盘上所有持久化内容进行 schema 版本化管理。** 配置文件、SQLite 表、IPC 负载、导出的 bundle 格式——所有内容都携带 `schemaVersion` 字段，以便我们能够在不破坏旧安装的情况下进行迁移。

## 应避免的事项

- ❌ 将 `node_modules`、构建输出或 `.env*` 文件添加到 git 中
- ❌ 在应用代码中从提供商 SDK（`@anthropic-ai/sdk`、`openai`、`@google/genai`）导入
- ❌ 编写在 SDK 层面模拟 LLM 的测试——应在 `core` 边界处进行模拟
- ❌ 未经用户明确选择加入，添加跟踪、分析或自动更新功能
- ❌ 硬编码任何路径；应遵循 XDG 基础目录和 Tauri 应用路径 API
- ❌ 在 `src-tauri` 下添加自定义 Rust 产品逻辑；仅将其保留为薄壳层
- ❌ 在主进程中进行同步 I/O 操作

## 常用命令

```bash
vp install              # 通过 Vite+ / pnpm 安装
vp check                # Oxfmt + Oxlint + 类型感知检查
vp test                 # 通过 Vite+ 运行 Vitest
vp run -r build         # 构建工作区包和应用程序
vp run @open-design/desktop#desktop:dev
vp run @open-design/desktop#desktop:build
````

## 待定问题 / 待研究事项

请参阅 `docs/RESEARCH_QUEUE.md`。不要过早锁定仍在调查中的问题的答案。
