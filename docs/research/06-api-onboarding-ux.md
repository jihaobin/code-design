# Research 06 — API Key Onboarding UX

**日期**：2026-04-18 · **状态**：决策已记录

## 决策

采用以 Cherry Studio + Msty 为模型的 **3-step first-run flow**，并提供**强制性的 zero-config path**（免费 OpenRouter 或内置 demo key），让用户在被要求提供任何 key 之前就能生成一个设计。

## Top 5 must-haves（PR review 中由 CI 检查）

1. **Zero-config first run** — OpenRouter free model 作为默认值，或有限内置 demo key（5/day）。用户先看到价值，再被要求做任何事。
2. **Smart key detection + live validation** — paste → 根据前缀检测 provider → 500ms debounce → ping `/v1/models` → 显示 model count 或具体错误。
3. **每个 provider 都有内联 “How to get this key” 链接** — 直接链接，不是通用 FAQ。以 Msty 的完整表格（endpoint / key URL / visibility / pricing）为模型。
4. **具体错误消息** — 区分 401 / 402 / 429 / network。每个错误都有可操作的下一步和链接。
5. **System keychain storage** — macOS Keychain / Windows Credential Manager / Linux Secret Service。Config TOML 只存引用。

## 3-step flow（UI 草图）

**Step 1 — Welcome + path picker**

```
🚀 Try free now (OpenRouter free tier)   ← default
🔑 Use my API key
🖥️ Use local model (Ollama detected)     ← only if detected
```

**Step 2A — Key paste（如果选择 path B）**

```
[Paste sk-ant-...        ]   ← auto-detects Anthropic
✓ Recognized: Anthropic Claude
✓ Format valid
✓ Connected (3 models available)

[How to get an Anthropic key →]
```

按前缀自动检测：`sk-ant-` Anthropic，`sk-or-` OpenRouter，`sk-` OpenAI，`AIza` Google，`xai-` xAI，`gsk_` Groq。

**Step 3 — Model defaults**

```
Primary design model:   [claude-sonnet-4-6 ▼]  (recommended)
Fast completion model:  [claude-haiku-3 ▼]    (recommended)
Estimated cost: ~$0.01-0.05 per design session
```

## 要避免的 Top 10 anti-patterns

1. **首屏要求 API key** — 流失的 #1 原因。始终提供免费路径。
2. **没有 “where to get key” 链接** — 会把用户送去 Google。
3. **模糊错误** — “API call failed”，不区分 401/402/429。
4. **不透明的 key precedence** — 用户以为订阅坏了，因为无效 BYOK key 静默覆盖了（Cursor 的错误）。
5. **Google Gemini 复杂度** — GCP project + billing + ID verification（45 min）。改为通过 OpenRouter 路由 Gemini。
6. **在配置文件中存储 key** — 使用系统钥匙串，配置文件只保存引用。
7. **没有粘贴验证** — 用户在设置 30 分钟后，直到第一次消息才发现 key 错了。
8. **手动输入 model ID** — 从 `/v1/models` 自动获取。
9. **切换模型清空上下文** — 保留聊天，或明确警告。
10. **没有 free tier，也没有 OpenRouter integration** — 用户撞上 “fund your account first” 墙然后离开。

## 最佳参考实现

| 能力                   | Best-in-class                                                     | 原因                                                     |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| Zero-config path       | Cherry Studio（CherryIN OAuth）/ OpenRouter / Msty（local Gemma） | 多种已验证模式                                           |
| Browser OAuth          | Claude Code                                                       | 完全跳过 key copy-paste                                  |
| Provider key links     | Msty 的 “Find API Keys” 文档                                      | 每个 provider 都有 endpoint + URL + visibility + pricing |
| Auto model discovery   | Cherry Studio + Open WebUI                                        | 首次保存时静默获取                                       |
| Multi-key per provider | Cherry Studio（comma-separated，round-robin）                     | 对 power-user 友好                                       |
| Ollama auto-detect     | Msty / Cherry Studio / Jan                                        | 显示在 first-run picker 中                               |

## open-codesign 实现计划

- **Phase 0.1（整体路线图的 Phase 1）**：交付 Step 1 + Step 2A + Step 3，仅支持 Anthropic + OpenAI + OpenRouter。v0.1 跳过 Google Gemini（如需要则通过 OpenRouter 路由）。
- **Phase 0.2**：添加 Ollama auto-detection。
- **Phase 0.3**：在 “More providers” expander 后添加 `pi-ai` 的 22 providers。
- **Phase 0.4**：当 Anthropic public OAuth 可用时，添加 browser OAuth。
- **Always**：每个 key 都保存在 OS keychain。Config TOML 只存引用。

## 来源

Highlights:

- Cherry Studio Issue #13421 + PR #13774 — onboarding wizard implementation
- Msty Find API Keys docs — provider info template
- OpenRouter free models router — zero-config pattern
- Claude Code Authentication Guide — OAuth as CLI gold standard
- Ankur Sethi blog on Gemini API frustration — 318 HN upvotes，anti-pattern reference

Full source list（22 references）recorded in conversation log on 2026-04-18.
