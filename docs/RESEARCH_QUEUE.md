# 研究队列

跟踪会阻塞架构决策的调研。

## 已完成

| #   | 主题                            | 决策                                                                                                                 | 报告                                            |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 0   | Claude Design 初始产品调研      | 八个演示作为 v1.0 成功标准                                                                                           | （在对话中，2026-04-18）                        |
| 1   | Claude Design hands-on teardown | UI = 左侧聊天 / 右侧画布 + 滑块；需要获取一个导出的 HTML 样本用于逆向工程                                            | [01](research/01-claude-design-teardown.md)     |
| 2   | Inline comment + AI slider POC  | `data-codesign-id` 注入 + str_replace patch 用于评论；CSS variables + `design_params` JSON 用于滑块                  | [02](research/02-inline-comment-and-sliders.md) |
| 3   | Sandbox runtime selection       | **Tauri WebView iframe srcdoc + esbuild-wasm** 为主；Sandpack 兜底；拒绝 WebContainers                               | [03](research/03-sandbox-runtime.md)            |
| 4   | PPTX library selection          | **pptxgenjs + dom-to-pptx** 为主；截图兜底；因 bundle 体积拒绝 python-pptx                                           | [04](research/04-pptx-export.md)                |
| 5   | pi-ai capability boundary       | 使用 pi-ai，固定版本，在 `packages/providers` 中包装 6 项缺失能力；不要 fork                                         | [05](research/05-pi-ai-boundary.md)             |
| 6   | API key onboarding UX           | 3 步流程（welcome path picker / 带自动检测的粘贴 / model defaults）；必须有零配置路径；OS keychain 存储              | [06](research/06-api-onboarding-ux.md)          |
| 7   | 前 5 分钟易用模式               | 默认系统提示（Tailwind + shadcn + Lucide + 无靛蓝）；OpenRouter 免费层首次运行路径；流式传输 + 200 毫秒骨架屏        | [07](research/07-first-5-minutes.md)            |
| 8   | SEO + AI-SEO + GitHub 可发现性  | llms.txt + llms-full.txt；Schema.org JSON-LD；作为顶级 GEO 内容的对比页面；20 个主题；CITATION.cff；允许所有 AI 爬虫 | [08](research/08-seo-ai-seo.md)                 |
| 9   | 打磨 + 对等差距待办事项         | 前 10 项 v0.1 必做事项（边界、取消、CSP、单例、模式版本控制）；已识别 5 个下一个工作树                               | [09](research/09-polish-parity-backlog.md)      |

## 进行中

无。所有初始研究已于 2026-04-18 关闭。

## 未来 / 机会性

- 获取并逆向一个 Claude Design 导出的 HTML（阻塞最终 artifact schema）
- 比较 Vercel AI SDK `streamUI` 与我们计划中的 artifact stream parser（修饰性，不阻塞）
- 在低端硬件（M1 Air、8GB Win laptop）上分析 esbuild-wasm 冷启动
- 调研 free-tier API 选项（OpenRouter、Groq、Cerebras），用于“首次运行无需 key”体验

## 如何使用这个文件

- 不要在代码中做依赖仍处于进行中状态的行的决策 — 用该行编号提交 TODO
- 研究返回时：添加一条“Completed”记录，包含一句话决策 + 指向 `docs/research/` 中完整报告的链接
- 如果已完成的决策被推翻，保留原条目，添加新条目，并在新报告的 “Supersedes” 字段中解释
