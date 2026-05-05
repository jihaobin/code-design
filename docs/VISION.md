# 愿景 — open-design

已锁定的产品决策。需要通过 PR 更新，不要顺手改动。

## 一句话简介

开源桌面 AI 设计工具 — 从提示词生成交互原型、幻灯片和营销素材。多模型、BYOK、本地优先。

## 我们在构建什么

一个 Mac/Windows 桌面应用，让非设计师（创始人、产品经理、营销人员）和设计师都能把自然语言提示词转化为：

- 交互式 HTML 原型（移动端 + 桌面端）
- 单页 PDF 案例研究、报告、营销页面
- PPTX 幻灯片（融资演示、季度汇报、培训）
- 从用户现有代码库派生出的、感知设计系统的 mockup
- 可直接交付的素材包（ZIP）

这个产品是 Anthropic [Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs)（2026-04-17 发布）的开源对应物。我们的 MVP 目标是**复现 Claude Design 的每一个公开演示**。

## 我们不构建什么

- 不是 v0 / Bolt / Lovable — 我们不生成可部署的 React/Next.js 应用；我们输出可移交、可导出的设计 artifact。
- 不是 Figma 替代品 — 我们不做协作式矢量编辑。
- 不是 Canva 替代品 — 我们不提供图库素材库或模板市场。
- 不是托管 SaaS（至少 MVP 阶段不是）。

## 已锁定决策

| 决策        | 选择                                         | 理由                                                              |
| ----------- | -------------------------------------------- | ----------------------------------------------------------------- |
| 形态        | Tauri v2 桌面包装（Mac + Win）               | 更小安装体积；仅负责窗口和打包，产品逻辑留在 Node 24 / TypeScript |
| 运行时      | Node 24 LTS                                  | 统一开发、CLI、sidecar 和本地任务运行时；跟随当前 LTS             |
| 模型层      | `pi-ai`（多提供商）                          | 覆盖 Anthropic / OpenAI / Gemini / DeepSeek / OpenRouter / local  |
| 认证        | 无 — BYOK                                    | 无后端，不承担用户密钥责任                                        |
| 存储        | 本地 SQLite（`better-sqlite3`）+ 文件系统    | 本地优先，无云依赖                                                |
| 设计语言    | open-design 自有 tokens（Claude 风格克制感） | 不依赖外部项目；视觉系统集中在 `packages/ui`                      |
| 工具链      | Vite+ (`vp`) + pnpm workspace                | 一个入口管理 install/dev/build/check/test/package                 |
| Lint/格式化 | Vite+ Oxlint / Oxfmt / Vitest 体系           | 统一到 Vite+；避免多套 lint / format / test 工具并存              |
| 许可证      | Apache-2.0                                   | 专利授权；对企业友好                                              |
| 贡献者协议  | DCO（`Signed-off-by`）                       | 比 CLA 摩擦更小                                                   |

## 杀手级演示（v1.0 必须交付）

每个演示都必须能用单个提示词、在默认设置下、第一次尝试就复现：

1. **Calm Spaces 冥想应用** — 带手机框、柔和配色、交互式导航的移动端原型
2. **客户案例研究单页** — 深色主题、前后对比指标、CEO 引言、可导出为 PDF
3. **B2B SaaS 融资演示文稿** — 8-12 页幻灯片，可导出为 PPTX
4. **内联评论编辑** — 点击预览中的任意元素，写评论，AI 重写该区域
5. **AI 生成的可调滑块** — 模型输出可调参数（颜色/间距/字体），用户拖动细化
6. **代码库 → 设计系统** — 指向本地仓库，提取 tokens，并应用于后续所有生成
7. **Web Capture** — 粘贴 URL，将其抓取为设计参考以便后续迭代
8. **交付包** — 打包设计 artifact、源码、资产和意图 README，方便任何工程工具或人工实现

## 与 Claude Design 的差异

| 维度     | Claude Design     | open-design             |
| -------- | ----------------- | ----------------------- |
| 模型     | 仅 Opus 4.7       | 通过 pi-ai 支持多提供商 |
| 形态     | Web SaaS          | 本地桌面端              |
| 隐私     | 云端存储          | 本地优先                |
| 后端     | Anthropic + Canva | 无                      |
| 工程交付 | Claude Code       | 通用 artifact bundle    |
| 源码     | 闭源              | Apache-2.0              |
| 成本     | 订阅              | 只需 BYOK token 成本    |

## 非目标（明确）

- 实时多人协作
- 内置图库照片/图标库（改为链接到外部）
- 移动应用
- 自托管服务器模式
- 自定义内部模型

## 生态定位（暂缓）

MVP 后重新审视的两个生态方向。作为未来工作跟踪，现在不实现：

- **Claude 生态兼容**：解析 Claude Artifacts `<artifact>` 标签协议；把我们自己暴露为 Claude Code 的 MCP server
- **通用工程交付**：输出无供应商绑定的 artifact bundle，可被任意 IDE、CLI 或人工流程消费

## 版本里程碑

- `0.1` — 单提示词 → HTML 预览，一个模型提供商
- `0.2` — 三个杀手级演示可用
- `0.5` — 全部八个杀手级演示可用
- `1.0` — 安装体积预算绿色、签名安装包、所有演示通过 smoke tests
