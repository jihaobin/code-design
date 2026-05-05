# 协作与开发工作流程

我们如何在 open-design 上协同工作，与人类和 AI 智能体一起。

## 分支模型

`main` 分支始终保持可发布状态。我们从不合并任何失败的内容。从 `main` 分支出的分支遵循以下命名规则：

- `feat/<slug>` — 新增用户可见功能
- `fix/<slug>` — 错误修复
- `refactor/<slug>` — 内部重构，用户无感知变更
- `chore/<slug>` — 工具配置、依赖管理、发布流程相关
- `docs/<slug>` — 仅文档
- `wt/<slug>` — 代理驱动的工作树分支（合并后自动删除）

仅保留线性历史：使用变基，绝不合并提交。

## 工作树工作流（并行功能开发）

我们通过 `git worktree` 进行并行工作，而不是在同一个检出目录中同时编辑。工作树位于 `.claude/worktrees/` 目录下（该目录本身被 git 忽略）。

```bash
git worktree add -b wt/<slug> .claude/worktrees/<slug> main
cd .claude/worktrees/<slug>
vp install
# ...执行工作...
git push -u origin wt/<slug>
gh pr create --base main --head wt/<slug> --title "..."
# 合并后：
git worktree remove .claude/worktrees/<slug>
git branch -D wt/<slug>
```

当并行调度多个工作树代理时，每个代理的提示中必须包含一个"禁止修改的文件"部分，列出属于同级工作树的文件。这是避免合并冲突最可靠的方法。

## 功能如何发布

1. **想法** — 如果是探索性的，请发起一个 Discussion；如果已有明确范围，则创建一个 Issue。
2. **研究（如需）** — 在 `docs/RESEARCH_QUEUE.md` 中添加一行，将研究报告写入 `docs/research/NN-topic.md`，并在队列表中锁定决策结果。
3. **计划** — 对于超过 5 次工具调用或涉及 3 个以上文件的任务，在 `.claude/workspace/<slug>/task_plan.md` 中编写计划。引用相关的研究内容和 PRINCIPLES 章节。
4. **仅限第一层级** — 实现能运行的最简版本（参见 PRINCIPLES §5）。如果第一层级需要超过 2 天完成，说明范围过大。
5. **工作树分支** — 从主分支创建 `wt/<slug>`，推送并打开 PR。
6. **机器人审查** — Codex PR 审查自动触发（带有 `*open-design Bot*` 签名）。将其发现视为与人类审查者同等重要。
7. **人工审查** — 合并前至少需要一位人类批准。CODEOWNERS 会自动请求审查。
8. **合并** — 若 PR 提交记录混乱则使用压缩合并，否则使用变基合并。必须确保 CI 通过。
9. **清理** — 移除工作树，删除分支（`git push origin -d wt/<slug>`）。

## PR 描述要求

使用模板（`.github/PULL_REQUEST_TEMPLATE.md`）。每个 PR 必须将这些标记为绿色或进行说明：

- [ ] §5b 兼容性：每个公共 API / IPC / 配置键均附带版本号
- [ ] §5b 可升级性：持久化数据模式迁移已记录
- [ ] §5b 无冗余：已报告 `du -sh release/` 增量变化，生产依赖数量已注明
- [ ] §5b 优雅性：UI 仅使用设计令牌，过渡动画采用项目缓动函数，空状态/加载中/错误状态已优化

对于新增的生产依赖，PR 正文必须包含：

- 安装体积变化
- 许可证（必须兼容 Apache-2.0）
- 为何选择此方案而非其他替代方案
- 是否可作为对等依赖项

## Codex 机器人审查

在 `.github/workflows/codex-pr-review.yml` 中配置，并使用 `.github/prompts/codex-pr-review.md` 提示文件。该机器人：

- 在每个 PR 打开/同步时运行
- 跳过标记为 `bot-skip` 标签的 PR
- 每个头 SHA 仅发布一条审查意见；绝不重复
- 引用 `path:line`，提供具体的修复代码片段
- 按严重程度排序发现的问题：阻塞性 / 主要 / 次要 / 细节

如果机器人判断有误，请推送修复或回复评论；未经合理说明，不得将其静默处理。

## 问题分类

机器人通过 `.github/workflows/issue-auto-response.yml` 自动回复，用于过滤垃圾信息并解答简单问题。人工分类将在 48 小时内完成：

- `bug` + `needs-triage` → 是否可复现？分配负责人及里程碑
- `enhancement` + `needs-triage` → 是否符合愿景？加入路线图或附上说明后关闭
- `question` → 如果是开放性问题，请迁移至 Discussions

使用 `bot-skip` 标签可禁止机器人在特定 issue 上回复。

## 沟通渠道

| 需求                          | 位置                                  |
| ----------------------------- | ------------------------------------- |
| 开放式想法 / "我们是否应该……" | GitHub Discussions                    |
| 具体错误 / 限定功能请求       | GitHub Issues                         |
| 代码变更                      | Pull Request                          |
| 架构决策                      | `docs/research/` 中的研究报告 + 讨论  |
| 实时聊天                      | Discord（链接待定；在公开发布前填充） |
| 安全披露                      | GitHub 安全公告（私有）               |

## 编码代理基本规则

当派遣 Claude Code（或任何 AI）代理执行实施任务时：

1. 为其指定具体要创建/修改的文件，并列出"禁止触碰"清单
2. 引用相关的 PRINCIPLES 章节 + 按路径标注的研究报告
3. 要求其在推送前运行 `vp install && vp check && vp test && vp run -r build` 并确认所有检查通过
4. 要求 DCO 签名（`git commit -s`）
5. 限定范围为一个 PR；拒绝附带的重构
6. 使用标准模板打开 PR；未经人工审查不得合并

## 合并顺序约定

当多个工作树同时落地时：

1. 低耦合优先（纯模块/新包）
2. 后端优先于依赖它的前端
3. i18n/UX 外壳优先于使用其令牌的功能
4. 最后进行演示接线（这是集成层）

冲突几乎总是出现在 `apps/desktop/src/main/index.ts` 中（每个人都会添加一个 `register*Ipc()` 调用）。通过在标记注释附近添加新的注册行来缓解此问题，这样每个 PR 都能干净地变基。

## 优化工作流程（MVP 之后）

一旦我们有了真实用户，我们将每季度进行一次优化冲刺：

- 包体积审计：运行 `vp run @open-design/desktop#desktop:build`，与预算对比，增量超过 1 MB 时提交 issue
- 依赖审计：运行 `vp outdated`、`vp pm audit`，清理未使用的依赖
- 死代码清理：使用 `knip` 或类似工具；移除无用的导出
- Token 用量分析：分析哪些 Claude / OpenAI 调用成本最高；优化提示词和缓存策略
- 用户体验会话录制（仅限选择加入）：识别常见的流失点
- 模式迁移检查：是否存在低于当前版本的 `schemaVersion` 会阻止升级？

## 开源规范

- 友善待人。行为准则（贡献者公约 2.1）将严格执行。
- 在 `CHANGELOG.md` 中标注贡献者（Changesets 会自动完成此操作）。
- 新贡献者会获得一个 `good-first-issue` 标签列表和友好的首次回复。
- 避免过度参与。每个 PR 只需一位审阅者即可；评论轰炸会吓跑贡献者。

## 推迟（1.0 版本后）

- DCO 机器人集成（目前由 CI 脚本强制执行）
- 用于发布签名的 Sigstore / cosign
- OpenSSF 评分卡公开发布（取决于项目公开化）
- 按领域自动分配问题（参照 open-cowork 的模式）
- 具有分类结构的公共 Discord
