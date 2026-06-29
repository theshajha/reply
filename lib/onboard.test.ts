import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildPreferences, scaffoldYours } from "./onboard";

describe("buildPreferences", () => {
  it("maps draft choice to send=false and respects research/gmail", () => {
    const p = buildPreferences({ mode: "draft", research: true, gmail: true });
    expect(p.send).toBe(false);
    expect(p.adapters).toEqual(["file", "gmail"]);
  });
  it("send mode flips send on", () => {
    expect(buildPreferences({ mode: "send", research: false, gmail: false }).send).toBe(true);
  });
});

describe("scaffoldYours", () => {
  let root: string;
  beforeEach(() => { root = mkdtempSync(join(tmpdir(), "sift-")); mkdirSync(join(root, "yours.example")); writeFileSync(join(root, "yours.example", "role.md"), "x"); });
  afterEach(() => rmSync(root, { recursive: true, force: true }));
  it("creates yours/ when missing and is a no-op when present", () => {
    expect(scaffoldYours(join(root, "yours.example"), join(root, "yours"))).toBe(true);
    expect(existsSync(join(root, "yours", "role.md"))).toBe(true);
    expect(scaffoldYours(join(root, "yours.example"), join(root, "yours"))).toBe(false);
  });
});
