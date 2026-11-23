// S16 of odd/tasks/site-pages.md and the T13 verifier (L31): invariants of the workflow that pushes to main.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const wf = readFileSync(join(import.meta.dirname, "..", ".github/workflows/refresh-release.yml"), "utf8");

describe("refresh-release workflow (S16)", () => {
  it("runs hourly off the hour and on dispatch, main only", () => {
    expect(wf).toMatch(/cron: "([1-5]\d|[1-9]) \* \* \* \*"/);
    expect(wf).toMatch(/^\s+workflow_dispatch:/m);
    expect(wf).toContain("if: github.ref == 'refs/heads/main'");
  });

  it("grants only contents: write", () => {
    const block = /^permissions:\n((?: {2}.+\n)+)/m.exec(wf)?.[1] ?? "";
    expect(block.trim()).toBe("contents: write");
  });

  it("pins every action to a full SHA", () => {
    const uses = [...wf.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1] ?? "");
    expect(uses.length).toBeGreaterThan(0);
    for (const u of uses) expect(u).toMatch(/@[0-9a-f]{40}$/);
  });

  it("never interpolates ${{ }} inside run scripts", () => {
    for (const m of wf.matchAll(/run: \|\n((?:\s{10}.*\n?)+)/g)) expect(m[1]).not.toContain("${{");
  });

  it("does not leave the write token in the checkout while dependencies, build and tests run", () => {
    expect(wf).toMatch(/persist-credentials: false/);
    const push = wf.slice(wf.indexOf("Commit and push"));
    expect(push).toContain("GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}");
  });

  it("gates build and test before committing only the snapshot, without force", () => {
    const iBuild = wf.indexOf("pnpm build");
    const iTest = wf.indexOf("pnpm test");
    const iPush = wf.indexOf("git push");
    expect(iBuild).toBeGreaterThan(wf.indexOf("pnpm refresh:release"));
    expect(iTest).toBeGreaterThan(iBuild);
    expect(iPush).toBeGreaterThan(iTest);
    expect(wf).toContain("git add -- src/data/release-snapshot.json");
    expect(wf).not.toMatch(/push[^\n]*(--force|-f\b)/);
  });
});
