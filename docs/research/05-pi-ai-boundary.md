# Research 05 — pi-ai Capability Boundary

**日期**：2026-04-18 · **状态**：决策已记录

## 决策

**使用 `@mariozechner/pi-ai`（当前 catalog 固定为 `^0.72.1`）作为 LLM transport layer。固定到稳定版本。把缺失能力包装在 `packages/providers` 中。不要 fork。**

## pi-ai 给我们的能力 ✅

| 能力                       | 说明                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 22 providers               | Anthropic / OpenAI / Gemini / Bedrock / Mistral / OpenRouter / xAI / Groq / GitHub Copilot / Vercel AI Gateway / etc. |
| Ollama / LM Studio / vLLM  | 通过带自定义 `baseUrl` 的 `openai-completions` provider                                                               |
| Streaming (SSE)            | `AssistantMessageEventStream` AsyncIterable；events：`text_delta` / `thinking_delta` / `toolcall_delta`               |
| Tool use                   | 使用 TypeBox 的统一 `Tool<TParameters extends TSchema>` interface；按 provider 自动翻译                               |
| Image input                | `ImageContent { type, data: base64, mimeType }`；非 vision models 会静默忽略                                          |
| Anthropic prompt caching   | `CacheRetention = "none" \| "short" \| "long"` enum，`cache_control` injection                                        |
| Token + cost tracking      | 每个 event 都有 `Usage { input, output, cacheRead, cacheWrite, cost: {...} }`                                         |
| Context overflow detection | `isContextOverflow()` 跨 provider regex                                                                               |
| API key management         | Env var auto-detect（22 providers）+ `options.apiKey` override                                                        |
| Partial JSON parsing       | 通过 `partial-json` 流式解析 tool args                                                                                |

## pi-ai 缺失的能力 ❌

| 缺口                                  | 影响                               | 缓解                                                                                         |
| ------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| **Structured output / JSON schema**   | `design_params` slider JSON 需要它 | 使用 forced tool calls（Anthropic）+ `onPayload` hook 注入 `text.format`（OpenAI）的 wrapper |
| **`<artifact>` tag streaming parser** | 需要兼容 Claude Artifacts protocol | 在 `packages/core` 中基于 `text_delta` events 做 state machine                               |
| **PDF / audio input**                 | 对 design briefs 有用              | 推迟到 `packages/providers` 边界内实现；应用代码不直接导入 provider SDK                      |
| **Auto provider fallback**            | 鲁棒性                             | `streamWithFallback([m1, m2])` wrapper                                                       |
| **Provider-level retry**              | 只有 Gemini CLI 有                 | `completeWithRetry()` exponential backoff wrapper                                            |
| **Zod → Tool helper**                 | 便利性                             | 使用现有 `zod-to-json-schema` dep 的 3-line util                                             |

## 要在 `packages/providers` 中构建的 wrappers

```ts
// 1. structured output
export async function structuredComplete<T>(
  model: Model<any>,
  context: Context,
  schema: TSchema | ZodSchema
): Promise<T>

// 2. artifact streaming
export async function* streamArtifacts(
  model: Model<any>,
  context: Context
): AsyncIterable<ArtifactEvent>  // emits start/chunk/end per <artifact>

// 3. fallback
export async function streamWithFallback(
  models: Model<any>[],
  context: Context
): Promise<AssistantMessage>

// 4. retry
export async function completeWithRetry(
  model: Model<any>,
  context: Context,
  opts?: { maxRetries?: number; baseDelayMs?: number }
): Promise<AssistantMessage>

// 5. zod helper
export function zodToTool<T extends ZodTypeAny>(
  name: string, description: string, schema: T
): Tool

// 6. PDF input (provider-boundary extension)
export async function completeWithPdf(
  pdfBase64: string, prompt: string
): Promise<string>  // implemented only inside packages/providers
```

## 维护风险

| 指标                | 值                                       |
| ------------------- | ---------------------------------------- |
| Stars               | 36,864                                   |
| Repo age            | ~8 个月                                  |
| Releases            | ~8 个月约 292 次（1-2/day）              |
| Top contributor     | badlogic（Mario Zechner）— 2,850 commits |
| Second contributor  | mitsuhiko（Armin Ronacher）— 41 commits  |
| New contributor PRs | 默认自动关闭；maintainer 每日 review     |
| Bus factor          | **1** — 长期风险高                       |

**短期（6-12 个月）**：风险很低。活跃度很好。
**长期**：防御性地固定版本；保持 wrappers 足够薄，使切换 transport 只是 packages/providers swap。

## 为什么不 fork

- 更新节奏是 1-2 releases/day — heavy fork = merge hell
- 架构干净；custom providers 通过 `registerApiProvider()` 注册（无需 fork）
- 缺失功能都能干净地放在我们的 `packages/providers` 层
- 如果 PDF/audio 变关键，**提交 PR** — Mario 合并很快

## 为什么不直接用 SDKs

- 22 providers；重新构建这个抽象要数月
- 会丢失：prompt caching、streaming events、tool unification、cost tracking、retry on overflow
- 我们会很糟糕地重新发明 pi-ai

## 来源

1. https://github.com/badlogic/pi-mono — main repo
2. https://www.npmjs.com/package/@mariozechner/pi-ai — version history
3. `packages/ai/src/types.ts` — `KnownProvider` enum，full type surface
4. `packages/ai/src/providers/anthropic.ts` — caching impl reference
5. `packages/coding-agent/src/core/agent-session.ts` — retry pattern reference
6. Claude Artifacts-style parser references — production usage pattern for custom artifact tag parsing
