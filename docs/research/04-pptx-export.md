# Research 04 — PPTX Export Library Selection

**日期**：2026-04-18 · **状态**：决策已记录

## 决策

**主方案**：`pptxgenjs`（5k stars，MIT，Apache-2.0 兼容）+ `dom-to-pptx`（110 stars，MIT），用于 HTML-to-shape translation。
**兜底**：对包含 dom-to-pptx 无法转换的 CSS 的 slides，将 Headless Chromium screenshot 作为图片嵌入。
**拒绝**：python-pptx subprocess（Python runtime 成本）、Aspose FOSS（Node.js 方案不足）、pure screenshot（失去可编辑性）。

## 为什么

- ✅ **All-JS stack** — 无 Python runtime，bundle impact 约 5MB（相比 python-pptx 的 50-100MB）
- ✅ **MIT license** — 干净兼容 Apache-2.0
- ✅ **HTML-first** — dom-to-pptx 读取 `getComputedStyle()`，匹配 Claude Design 输出范式
- ✅ **DOM access native** — Tauri WebView renderer = browser-like DOM，dom-to-pptx 为 browser 设计
- ✅ **Active maintenance** — pptxgenjs v4.0.1（2025-06），每周 2.4M npm downloads
- ✅ **PowerPoint + Keynote + LibreOffice + Google Slides** 均确认兼容

## 对比

| Lib                 | License | Bundle    | HTML→PPTX        | Editability | CJK          | Maintenance  |
| ------------------- | ------- | --------- | ---------------- | ----------- | ------------ | ------------ |
| **pptxgenjs**       | MIT     | 2.5MB     | only `<table>`   | full        | chart bug    | active (5k★) |
| **dom-to-pptx**     | MIT     | +2.5MB    | **core feature** | full        | wrap bug     | new (110★)   |
| python-pptx         | MIT     | +50-100MB | none (manual)    | full        | controllable | slow (3k★)   |
| Headless screenshot | N/A     | 0         | N/A              | **none**    | 100%         | N/A          |
| Aspose FOSS         | MIT     | +20-80MB  | none             | full        | good         | new          |

## 架构

```
HTML/CSS slide (Tauri WebView renderer)
  ↓
dom-to-pptx.exportToPptx(element)  ← reads computed styles, emits pptxgenjs shape calls
  ↓
pptxgenjs assembly
  ↓
.pptx Buffer → fs.writeFile
```

对于包含不受支持 CSS 的元素（transform、复杂 SVG filter、dom-to-pptx 无法解析的 gradients）：

1. 对区域进行 `html2canvas` snapshot
2. 用覆盖该区域的 `pres.addImage(...)` 嵌入图片
3. 在上层叠加可编辑文字，以保留 title/subtitle 的可编辑性

## 已知陷阱

1. **dom-to-pptx 中的 CJK word-wrap bug**（issue #19，仍未关闭）— export 后 patch pptxgenjs `bodyPr`，加 `wrap="square"` + `normAutofit`
2. **pptxgenjs 无原生 font embedding**（issue #176，自 2017 起开放）— 有社区 `pptx-embed-fonts` 扩展；默认使用系统安装的 CJK fonts（PingFang/微软雅黑）来绕过
3. **Mac PowerPoint 上 chart CJK fonts**（issue #1420）— 将 charts 渲染为 PNG 并嵌入
4. **Tailwind v4 oklch colors** — dom-to-pptx v1.1.6 已支持
5. **Position: absolute + nested circles** — 曾是 bug，v1.1.1 已修复

## 工作量估计

| Module                           | LOC               |
| -------------------------------- | ----------------- |
| Base integration                 | ~150              |
| CJK word-wrap patch              | ~50               |
| Screenshot fallback              | ~80               |
| Multi-slide traversal            | ~40               |
| Font embed (community extension) | ~30               |
| **Total**                        | **~350 TS lines** |

## 参考实现

- **presenton**（github.com/presenton/presenton）— 4.7k stars，Apache-2.0 — 桌面 + Python PPTX（不同技术栈，仅作架构参考）
- **allweonedev/presentation-ai**（2.7k stars，MIT）— 使用 pptxgenjs；承认 “images don't translate one-to-one”
- **hugohe3/ppt-master**（5.6k stars，MIT）— AI 生成 python-pptx code

## 为什么不用 python-pptx（尽管 CJK 控制更好）

- 50-100MB Python runtime vs 我们的 80MB 总 bundle 预算 — 会消耗其中大部分
- 我们没有其他 Python 依赖；为一个功能引入整个 runtime 违反“默认精简”
- 桌面壳 + Python subprocess（`uv` venv）可行（presenton 已证明），但只有当我们在别处已经需要 Python 时才值得

## 来源

1. https://github.com/gitbrent/PptxGenJS — main library
2. https://github.com/atharva9167j/dom-to-pptx — HTML translation layer
3. https://github.com/scanny/python-pptx — Python alternative analysis
4. https://docs.aspose.org/slides/net/getting-started/license/ — Aspose FOSS license confirmation
5. https://github.com/presenton/presenton — reference desktop + PPTX stack
6. https://github.com/atharva9167j/dom-to-pptx/issues/19 — CJK word-wrap bug status
