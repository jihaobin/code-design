import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vite-plus/test";

function read(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("Tailwind theme integration", () => {
  it("exports a Tailwind v4 theme stylesheet from the ui package", () => {
    const packageJson = JSON.parse(read("packages/ui/package.json")) as {
      exports?: Record<string, string>;
    };
    const themePath = packageJson.exports?.["./theme.css"];
    const themeCss = read("packages/ui/src/theme.css");
    const tokensCss = read("packages/ui/src/tokens.css");

    expect(themePath).toBe("./src/theme.css");
    if (themePath !== "./src/theme.css") throw new Error("Missing ./theme.css export");
    expect(read(`packages/ui/${themePath.slice(2)}`)).toContain("@theme");
    expect(themeCss).toContain("var(--codesign-color-background)");
    expect(themeCss).not.toContain("--color-background: var(--color-background)");
    expect(tokensCss).toContain("--codesign-color-background:");
    expect(tokensCss).toContain("--color-background: var(--codesign-color-background)");
  });

  it("desktop imports Tailwind and the shared theme stylesheet", () => {
    const desktopCss = read("apps/desktop/src/styles.css");
    const desktopPackage = JSON.parse(read("apps/desktop/package.json")) as {
      dependencies?: Record<string, string>;
    };

    expect(desktopPackage.dependencies?.["tailwindcss"]).toBe("catalog:");
    expect(desktopCss).toContain('@import "tailwindcss"');
    expect(desktopCss).toContain('@import "@open-codesign/ui/theme.css"');
  });

  it("Vite uses the Tailwind CSS plugin", () => {
    const workspace = read("pnpm-workspace.yaml");
    const desktopViteConfig = read("apps/desktop/vite.config.ts");

    expect(workspace).toContain("@tailwindcss/vite");
    expect(desktopViteConfig).toContain('from "@tailwindcss/vite"');
    expect(desktopViteConfig).toContain("tailwindcss()");
  });
});
