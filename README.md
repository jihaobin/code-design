# open-design

> Open-source AI design tool — prompt to interactive prototype, slide deck, and marketing assets. Multi-model, BYOK, runs on your laptop.

[愿景](./docs/VISION.md) · [路线图](./docs/ROADMAP.md)

---

**Status**: Pre-alpha — scaffolding and package spikes are in place, but the app is not usable yet.

open-design is an open-source desktop app for turning natural-language prompts into HTML prototypes, PDF one-pagers, PPTX decks, and design-system-aware mockups. Built as the open counterpart to Claude Design, with multi-provider model support and a local-first storage model.

## What exists today

- Tauri v2 + React desktop shell with a static chat panel and preview pane.
- `@open-design/core` exposes a blocking `generate()` function that calls the provider layer and parses `<artifact>` tags from a completed model response.
- `@open-design/providers` lazy-loads `@mariozechner/pi-ai` and currently exposes one non-streaming `complete()` helper plus API-key prefix detection.
- `@open-design/runtime` can build an iframe `srcdoc`, strip user CSP meta tags, inject the element-selection overlay, and apply CSS variable updates.
- `@open-design/exporters` only has raw HTML export ready; PDF, PPTX, and ZIP are still planned.
- Config files, OS keychain storage, SQLite history, onboarding, streaming UI, and end-to-end generation from the desktop app are not implemented yet.

## Why

- **Multi-model**: Anthropic, OpenAI, Gemini, DeepSeek, local models — bring your own key.
- **Local-first**: Your prompts, designs, and codebase scans never leave your laptop unless you opt in.
- **Lean**: Target install size ≤ 80 MB. Tauri wraps the desktop app; product logic stays in the Node 24 / TypeScript stack.
- **Portable artifacts**: Planned HTML/PDF/PPTX/ZIP export and Claude Artifacts interoperability, without depending on another project's ecosystem.

## Status & Roadmap

See [`docs/ROADMAP.md`](./docs/ROADMAP.md). MVP success criterion: replicate every public Claude Design demo.

## License

Apache-2.0 target. The root `LICENSE` file still needs to be added before public release.
