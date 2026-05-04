# 研究 07 — 前 5 分钟易用性模式

**日期**：2026-04-18 · **状态**：决策已记录

## 决策

采用 v0.dev / Cherry Studio 的打法：先交付价值，再要求用户提供凭证。v0.1 锁定三根支柱：

1. **硬编码默认系统提示词**，在所有模型提供商上强制保障设计质量（Tailwind + shadcn 风格 + Lucide + 禁用靛蓝/蓝色 + 响应式 + 悬停过渡）。这是杠杆最高的一项改动。
2. **首次运行优先走免费层路径**，通过 OpenRouter `openrouter/free`（或内置演示 key，轮换、限流）。用户至少生成 1 个设计后，才要求他们提供自己的 key。
3. **流式输出，并在 ≤ 200 ms 内展示骨架屏**。感知延迟降低 40-60%（Stanford HCI 2024）。

## 本周可快速落地的事项（已进行中或已排队）

| #   | 事项                                                                    | 负责人 / 位置                                                         | 状态   |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ |
| 1   | 默认系统提示词（Tailwind + shadcn + Lucide + 禁用靛蓝 + 响应式 + 过渡） | `wt/first-demo` → `packages/templates/src/system/design-generator.md` | 进行中 |
| 2   | 通过 OpenRouter 免费路由提供免费层路径                                  | `wt/onboarding` → 欢迎步骤中的“免费试用”按钮                          | 进行中 |
| 3   | 带 3 个入门标签和交互式缩略图的空状态                                   | `wt/preview-ux` → `EmptyState.tsx`                                    | 进行中 |
| 4   | 流式输出 + 200 ms 骨架屏                                                | `wt/first-demo` 合入后的后续事项                                      | 已排队 |
| 5   | 可跳过的新手引导（在 key 步骤突出显示“跳过 — 先使用免费模型”链接）      | `wt/onboarding` 待确认                                                | 进行中 |

## v0.1 发布检查清单（10 个二元标准）

- [ ] 从启动到首次 AI 输出 ≤ 90 秒（包括设置）
- [ ] 用户提供任何 key 之前，应用就能产出内容（免费 / 演示 / 本地）
- [ ] 首次运行时已预选默认模型；不存在空选择器
- [ ] 空状态至少有 3 个可点击的入门标签
- [ ] 提交后 200 ms 内出现可见反馈（骨架屏 / 加载指示器 / 首个流式 token）
- [ ] 每个新手引导步骤都可跳过，并有合理默认值
- [ ] 默认系统提示词在所有提供商上强制执行固定设计系统
- [ ] API key 输入是单个字段，并带内联校验
- [ ] 粘贴检测（图片 / URL / 代码 → 优雅处理）
- [ ] 非技术用户使用 5 分钟后，能用 1 句话描述这个应用（找 3 个人测试）

## “开源粗糙感”的前 5 个风险

1. 不同模型之间输出不一致 — 修复：跨提供商使用单一系统提示词
2. 首次运行时模型选择器为空
3. 没有流式输出 — 空白 4 秒后一次性甩出结果
4. 泛泛的“出现了一些问题”错误
5. 原生 WebView 窗口边框 / 默认字体 → 让人感觉像“业余项目”

## 默认系统提示词（已锁定）

```
你是一名专家级 UI 设计师和前端工程师。请使用 Tailwind 工具类、
shadcn/ui 约定和 Lucide React 图标，生成完整、可用于生产环境的
HTML/React。

要求：
1. 使用 Inter 或 Geist 作为主字体。
2. 避免靛蓝或皇家蓝 — 优先使用中性灰 / zinc / slate 作为基底，并搭配一种强调色。
3. 移动端优先的响应式布局。
4. 包含悬停状态 + 焦点环 + transition-all duration-200。
5. 自定义颜色使用兼容 oklch 的颜色值。
6. 不要使用 Lorem Ipsum — 编写真实可信的文案。
7. 通过 `dark:` 前缀包含深色模式支持。
8. 只输出组件代码，不要解释。
```

该提示词已提交到 `packages/templates/src/system/design-generator.md`，并由 `packages/core/src/index.ts` 使用。更新它需要提交 PR，并附上研究报告风格的理由说明。

## 三个演示提示词（跨模型）

1. **SaaS 分析仪表盘** — 在 Anthropic Claude 上效果最好（布局 + 数据可视化）
2. **移动端新手引导流程** — 在 OpenAI GPT 上效果最好（表单 + 微交互）
3. **AI 生产力落地页** — 在 Gemini 上效果最好（组件系统 + 令牌）

用于 `packages/templates/src/index.ts` 的 `BUILTIN_DEMOS`（除了已有的四个：冥想应用、案例研究、融资演示文稿、营销素材）。

## 来源（关键）

- v0 系统提示词泄露（2025 年 4 月）：<https://leaked-system-prompts.com/prompts/v0/v0_20250428>
- Cherry Studio 新手引导设计：<https://github.com/CherryHQ/cherry-studio/issues/13421>
- Bolt 高效提示词编写：<https://support.bolt.new/docs/prompting-effectively>
- OpenRouter 免费模型路由：<https://openrouter.ai/docs/guides/get-started/free-models-router-playground>
- Tonik 空状态激活模式：<https://www.tonik.com/blog/empty-state-design-activation-patterns>
- Athenic 流式输出研究：<https://getathenic.com/blog/streaming-llm-responses-real-time-ux>

完整来源列表（20 条参考资料）已归档在 2026-04-18 的对话日志中。
