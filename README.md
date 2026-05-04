# open-codesign

> Open-source AI design tool — prompt to interactive prototype, slide deck, and marketing assets. Multi-model, BYOK, runs on your laptop.

[愿景](./docs/VISION.zh.md) · [路线图](./docs/ROADMAP.zh.md)

---

**Status**: 🚧 Pre-alpha — designing in public. Not usable yet.

open-codesign is an open-source desktop app that turns natural-language prompts into HTML prototypes, PDF one-pagers, PPTX decks, and design-system-aware mockups. Built as the open counterpart to Claude Design, with multi-provider model support and a local-first storage model.

## Why

- **Multi-model**: Anthropic, OpenAI, Gemini, DeepSeek, local models — bring your own key.
- **Local-first**: Your prompts, designs, and codebase scans never leave your laptop unless you opt in.
- **Lean**: Target install size ≤ 80 MB. Tauri wraps the desktop app; product logic stays in the Node 24 / TypeScript stack.
- **Portable artifacts**: Exports HTML/PDF/PPTX/ZIP and keeps Claude Artifacts interoperability, without depending on another project's ecosystem.

## Status & Roadmap

See [`docs/ROADMAP.zh.md`](./docs/ROADMAP.zh.md). MVP success criterion: replicate every public Claude Design demo.

## License

Apache-2.0
