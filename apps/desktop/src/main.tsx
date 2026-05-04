import "@open-codesign/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="grid min-h-screen grid-cols-[minmax(280px,360px)_minmax(0,1fr)] max-[760px]:grid-cols-1">
      <section
        className="flex min-h-screen flex-col gap-6 border-r border-border bg-surface p-6 max-[760px]:min-h-auto max-[760px]:border-r-0 max-[760px]:border-b"
        aria-label="Chat"
      >
        <header>
          <p className="mb-2 text-xs font-bold tracking-normal text-text-muted uppercase">
            open-codesign
          </p>
          <h1 className="m-0 text-2xl leading-[1.15] font-bold">AI design workspace</h1>
        </header>
        <form className="flex flex-1 flex-col gap-3">
          <textarea
            className="min-h-45 resize-y rounded-md border border-border bg-background p-3 text-text-primary"
            aria-label="Design prompt"
            placeholder="Describe the design artifact you want to create..."
          />
          <button
            className="min-h-10 cursor-pointer rounded-md bg-accent font-bold text-surface transition-colors hover:bg-accent-hover"
            type="submit"
          >
            Generate
          </button>
        </form>
      </section>
      <section className="min-w-0 p-6" aria-label="Preview">
        <div className="grid min-h-[calc(100vh-48px)] place-items-center rounded-md border border-border bg-surface text-text-muted shadow-card max-[760px]:min-h-105">
          <p>Preview canvas</p>
        </div>
      </section>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
