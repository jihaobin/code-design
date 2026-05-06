# 工程原则

这些不是指导建议。它们是 CI 强制执行的约束。违反其中任何一条的 PR 都需要在描述中明确申请豁免。

## 1. 默认精简

**安装体积预算：Mac 和 Windows 安装包均 ≤ 80 MB。**

- ❌ 不要捆绑 Python、浏览器二进制文件或任何模型 runtime
- ✅ Node 24 是项目运行时基线；桌面应用需要本地 Node 24 或受审查的按需 Node sidecar 方案
- ❌ 不要捆绑任何 LLM weights
- ✅ 重型功能（PPTX export、web capture、codebase scan）必须在首次使用时通过动态 `import()` 加载
- ✅ Tauri 只作为桌面窗口和打包层；不要把业务逻辑放进 Rust
- ✅ 使用 Vite+ + Rolldown；产出仅 ESM 的输出；积极 tree-shake
- ✅ CI 最终必须运行安装体积 / bundle 预算检查 — 当前仓库尚未接入 `size-limit` / `bundlewatch`

**依赖预算：生产依赖 ≤ 30 个。**

- ❌ 不要用 `lodash`、`moment`、`axios` — 使用 Web standard equivalents
- ❌ 不要用 utility-belt libs（优先选择一次性的小包，而不是厨房水槽式大包）
- ✅ 新增 prod dep 需要在 PR 描述中列出：安装体积、许可证、考虑过的替代方案
- ✅ 当 consumer 可以提供时，优先使用 peer deps

## 2. 首次运行愉悦

**目标：下载 → 第一次生成设计 ≤ 90 秒，包括模型认证。**

- ✅ 通过 Homebrew Cask、winget、scoop 和直接 `.dmg` / `.exe` 分发
- ✅ Mac notarization + Windows Authenticode — 没有“unknown developer”警告
- ✅ Onboarding ≤ 3 步：选择模型 → 运行一个内置演示 → 完成。可跳过。
- ✅ 根据 API key 前缀自动检测 provider（`sk-ant-…` → Anthropic、`sk-…` → OpenAI 等）
- ✅ 提供 free-tier 路径：为 OpenRouter free models 捆绑配置，让用户无需 key 也能尝试
- ✅ 单页 Settings，最多 4 个 tabs（Models、Appearance、Storage、Advanced）— 不是 10+ 个

## 3. 配置是人类可读的

- ✅ Config 位于 `~/.config/open-design/config.toml` — TOML，不是 JSON，不是二进制
- ✅ 每个 setting 都有 CLI 等价项：`open-design config set anthropic.key=…`
- ✅ 一条命令导出/导入（`open-design config export > backup.toml`）
- ❌ 不用不透明 app-store blobs；config 不用 SQLite
- ✅ 默认值记录在 `docs/CONFIG.md` 中，包含每个 key

## 4. 本地优先，无意外联网

- ❌ 没有 analytics、telemetry 或未经明确 opt-in 的“phone home”
- ❌ 没有用户不可见 UI 的自动后台下载（model lists、templates）
- ✅ Settings 中可访问网络请求审计 dashboard（查看谁调用了谁）
- ✅ Auto-update 是 opt-in，默认不开启

## 5. 先做最简单可用版本

每个功能分三层交付。在第 1 层有真实用户之前，我们绝不进入第 2 层。

- **Tier 1（笨但可用）**：最难受的路径，不考虑 edge cases，必要时硬编码。先发这个。
- **Tier 2（处理常见情况）**：只有在第 1 层被使用、并知道实际 edge cases 后才做。
- **Tier 3（生产级）**：只有使用证明它重要时才做。

具体示例：

| 功能             | Tier 1（先发布）                            | Tier 2                                              | Tier 3                                  |
| ---------------- | ------------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| Inline comment   | 每次评论都把整个 HTML 重新发给模型          | 带稳定 `data-open-design-id` 的 str_replace patches | Optimistic UI + diff streaming          |
| Custom sliders   | 每个设计固定 3 个滑块（color/spacing/font） | AI 输出 `design_params` JSON                        | 每个滑块的 AI explanation tooltips      |
| Multi-model A/B  | 顺序运行，显示在 tabs 中                    | 并行 streams，三列                                  | 输出之间的 diff highlighting            |
| URL style steal  | 只截图，发送给 vision model                 | DOM scrape + computed style extraction              | Component-level pattern matching        |
| Codebase → DS    | 只读 `tailwind.config.js`                   | 遍历 `**/*.css` 查找 variables                      | 设计 tokens 的完整 AST analysis         |
| PPTX export      | 每个 HTML 页面一张 slide，嵌入 screenshot   | dom-to-pptx 生成可编辑 shapes                       | Font embedding + CJK patches            |
| Reverse Redesign | 单次 vision call，输出新 HTML               | 多步 refine loop                                    | 带 brand preservation 的 style transfer |

经验法则：**如果第 1 层需要超过 2 天，这个功能对 first cut 来说就太有野心 — 选择一个更简单的第 1 层。**

## 5b. 兼容、可升级、永不臃肿、始终优雅

这四项约束对每个 PR 都是不可妥协的。请在 PR 描述中逐一标注。

- **兼容性**：每个公共 API、每个 IPC 通道、每个配置键都带有版本号（`v1`、`v2`……）。当接口发生变更时，新旧版本需至少共存一个次要版本。禁止静默修改数据结构。
- **可升级性**：每个功能都需附带清晰的升级路径文档。若一级功能需要演进为二级功能，边界应已存在（无需完全重写）。持久化数据（配置、SQLite、历史记录）需携带`schema_version`；迁移脚本应存放在显眼位置。
- **无冗余膨胀**：每个 PR 需报告 `du -sh release/` 的增量变化。新增超过 1 MB 需提供合理解释。新增任何生产依赖需在 PR 描述中说明（许可证/体积/为何不选替代方案/能否作为对等依赖）。生产依赖总数上限为 30 个。
- **默认优雅**：可见 UI 必须仅使用 `packages/ui` 中的设计令牌，过渡动画必须采用项目标准缓动函数（`cubic-bezier(0.16, 1, 0.3, 1)`），间距需遵循 4 像素刻度，字体排版需使用 Plus Jakarta Sans + JetBrains Mono 组合。禁止使用现成的"AI 应用美学"（无意义的渐变、玻璃态效果）。空状态、加载状态和错误状态需与正常路径保持同等精细度。

当 PR 审查者询问"这符合 §5b 条款吗？"时，答案必须四项全部达标——而非四项中的三项。

## 6. 不做过早抽象

- ❌ 没有 2+ 个真实调用方时，不要 factory patterns、plugin systems 或 DI containers
- ❌ 一个 `switch` 能解决时，不要 config-driven dispatch
- ✅ 三行相似代码没关系。第四行再抽取。
- ✅ 删除死代码，而不是保留 `// removed` 注释

## 7. 注释解释 _为什么_，而不是 _做什么_

- ❌ 私有函数不要 JSDoc
- ❌ 不要 “// loops over the array” 这种注释
- ✅ 当读者会惊讶时才注释：workaround、隐藏约束、微妙 invariant
- ✅ 最多一条短行 — 永远不要多段落 block

## 8. UI 使用 tokens，而不是 literals

- ❌ app code 中不要硬编码 `#fff`、`16px`、`font-family: …`
- ✅ 所有视觉属性都来自 `packages/ui` tokens
- ✅ 使用前先把 tokens 加到 `packages/ui`
- ✅ Tailwind config 使用同一套 tokens — 不要分叉

## 9. 测试放在正确边界

- ✅ Vite+ `vp test` / Vitest 单元测试，与源码同置（`foo.ts` → `foo.test.ts`）
- ✅ 测试 API 从 `vite-plus/test` 导入
- ✅ Playwright E2E 针对构建后的 app，而不是 mocked harness
- ✅ 在 `core` 边界 mock LLM，绝不在 SDK 层 mock
- ❌ 不要给 prompts 做 snapshot tests（它们会腐烂）

## 10. 错误要么用户可见，要么抛出，绝不静默吞掉

**不要静默 fallback。失败必须响亮。** Fallback 会隐藏 bug，让调试变得痛苦。把每一个 fallback 都当作必须在 code review 中说明理由的技术债。

禁止模式：

- ❌ `catch (e) {}` — 空 catch blocks
- ❌ `catch (e) { return defaultValue }` — 用 fallback 值掩盖真实错误
- ❌ `catch (e) { return null }` 后面调用方检查 `if (x === null)` — null-check fallback chain
- ❌ `try { primaryProvider() } catch { fallbackProvider() }` — 静默切换 provider
- ❌ 当 undefined 表示“上游出错了”时使用 `value ?? sensible_default`
- ❌ 用 optional chaining（`?.`）吞掉缺失数据，而不是验证

允许：

- ✅ 带上下文抛出：`throw new Error('PPTX export failed: ' + e.message, { cause: e })`
- ✅ 在 UI 中显示可操作消息：“Anthropic API key invalid — open Settings”
- ✅ 以 WARN/ERROR 级别记录结构化上下文
- ✅ 真正有意图的 fallback chain，并且链中的每一步都有日志：model A failed → user sees notice → asks if try model B

例外：在*系统边界*（加载可能尚不存在的用户配置、解析用户可能写坏的 JSON）处，当 defaults 对应清晰定义的“首次运行”状态时，默认值可以接受 — 并且该默认值本身已记录。

拿不准时，抛出。带 stack trace 的响亮 crash 总比安静的错误答案有用。

## 11. PR 小而可审、已签名

- ✅ 一个 PR 一个关注点；rebase，不 merge
- ✅ Conventional Commits subject；body 解释*为什么*
- ✅ 要求 DCO `Signed-off-by`（用 `git commit -s` 配置）
- ✅ 合并前所有 CI 绿色；禁止 force-push 到 main
