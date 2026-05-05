import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const workflowsDir = new URL("../workflows/", import.meta.url);
const minimumMajors = new Map([
  ["actions/checkout", 6],
  ["actions/github-script", 8],
  ["actions/setup-node", 6],
  ["actions/upload-artifact", 6],
  ["github/codeql-action/analyze", 4],
  ["github/codeql-action/init", 4],
  ["github/codeql-action/upload-sarif", 4],
  ["pnpm/action-setup", 6],
]);

const usesPattern = /^\s*(?:-\s*)?uses:\s*([^@\s]+)@v?(\d+)\b/;
const files = await readdir(workflowsDir);
const failures = [];

for (const file of files.filter((name) => /\.ya?ml$/.test(name))) {
  const content = await readFile(new URL(file, workflowsDir), "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const match = line.match(usesPattern);
    if (!match) return;

    const [, action, majorText] = match;
    const minimumMajor = minimumMajors.get(action);
    if (minimumMajor === undefined) return;

    const major = Number.parseInt(majorText, 10);
    if (major < minimumMajor) {
      failures.push(
        `${join(".github/workflows", file)}:${index + 1} uses ${action}@v${major}; use v${minimumMajor}+ for Node 24`,
      );
    }
  });
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
