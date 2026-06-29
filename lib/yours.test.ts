import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readBoard, writeBoard, readYours } from "./yours";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "sift-"));
  process.env.SIFT_YOURS_DIR = dir;
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("yours layer", () => {
  it("returns an empty board when none exists", () => {
    expect(readBoard().entries).toEqual([]);
  });

  it("round-trips a board", () => {
    writeBoard({ role: "Eng", generatedAt: "t", entries: [] });
    expect(readBoard().role).toBe("Eng");
  });

  it("reads role, voice, and validated preferences", () => {
    writeFileSync(join(dir, "role.md"), "# Backend Eng");
    writeFileSync(join(dir, "voice.md"), "Thanks for reaching out.");
    writeFileSync(join(dir, "preferences.json"), JSON.stringify({ send: true }));
    const y = readYours();
    expect(y.role).toContain("Backend Eng");
    expect(y.preferences.send).toBe(true);
    expect(y.preferences.adapters).toEqual(["file"]);
  });
});
