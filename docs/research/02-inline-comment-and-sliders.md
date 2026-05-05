# Research 02 — Inline Comment + AI Slider POC

**日期**：2026-04-18 · **状态**：决策已记录

## 决策摘要

| 机制                    | 选定方案                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Element selection       | 在同源 srcdoc iframe 中注入 overlay script；按 `data-open-design-id`（优先）> `id` > XPath fallback 识别       |
| Comment-to-AI patch     | 向 LLM 发送元素 `outerHTML` + comment；要求返回 **str_replace** block（Anthropic `text_editor_20250728` 格式） |
| Cross-version stability | AI 必须在初始生成时为每个元素注入稳定的 `data-open-design-id`；后续 edits 通过 id 定位                         |
| Slider rendering        | AI 在 HTML 旁输出 `design_params` JSON；frontend 渲染 controls；通过 CSS variables 绑定                        |
| Slider update           | 直接在 iframe `:root` 上调用 `setProperty()` — value tweaks 不重新运行模型                                     |

## Element selection — 推荐实现

```js
// injected into iframe srcdoc
document.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.parent.postMessage(
      {
        type: "ELEMENT_SELECTED",
        id: e.target.dataset.openDesignId,
        xpath: getXPath(e.target),
        outerHTML: e.target.outerHTML.slice(0, 500),
        rect: e.target.getBoundingClientRect(),
      },
      "*",
    );
  },
  true,
);
```

## Patch protocol

System prompt 要求 str_replace blocks：

```
{exact text}
```

- 比重新发送完整 HTML 更便宜（约 500 tokens vs 10-50K）
- Aider benchmark：SEARCH/REPLACE 的 Claude 成功率高于 unified diff
- 添加 `flexible_search_and_replace`（whitespace-tolerant）以增强韧性

## Slider protocol

```typescript
interface DesignParam {
  id: string; // CSS var name (without --)
  label: string;
  type: "color" | "range" | "select" | "toggle";
  cssVar: string; // "--primary-color"
  defaultValue: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // "px" | "rem" | "%"
  options?: string[];
}
```

System prompt 规则：“Use CSS custom properties for all tunable values. Output design_params JSON after HTML. Maximum 8 sliders.”

## 已知陷阱

1. 同源要求 → 使用 `srcdoc`，永远不要用外部 `src`
2. AI 输出中的 CSP `<meta>` tags 可能阻止注入 → 在 preprocessing 时 strip
3. AI parameter hallucination（HTML 与 JSON 的 var name 不匹配）→ 要求 “declare after use” prompt structure
4. Color format mismatch（color picker `#rgb` vs HTML 中的 `oklch()`）→ format normalize layer
5. 参数过多 → 在 system prompt 中上限 8 个；UI 中折叠 groups
6. iframe CSS var scope：必须调用 `iframe.contentDocument.documentElement.style.setProperty()`，不是 parent 的

## 参考实现

- **stagewise**（github.com/stagewise-io/stagewise）— 6.5k stars，AGPL — XPath + iframe bridge 参考
- **layrr**（github.com/thetronjohnson/layrr）— MIT — click-to-Claude-Code direct fork 灵感
- **istarkov/ai-cli-edit** — XML edit prompt structure 参考
- **vercel-labs/json-render** — generative UI framework，包含 Slider/ColorPicker
- **CodePen slideVars** — auto CSS-var → control panel
- **yairEO/knobs**（1.2k stars）— CSS-var bound UI controls
- **v0 Design Mode** — CSS-var-driven sliders 的生产参考

## POC 工作量估计

- Inline comment loop：3-5 天
- AI slider loop：2-3 天
- 合计：两者约需 ~1 周专注工作

## 决策影响

- `packages/runtime` overlay script：打包为小型 TS module，通过 `srcdoc` 注入
- `packages/core` artifact schema：添加 `design_params` 字段
- System prompt template（`packages/templates/system/design-generator.md`）：固化 JSON output requirement
