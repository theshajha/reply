import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { addToPool } from "@/agent/tools/add_to_pool";
import { readPool } from "@/lib/pool";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "sift-")); process.env.REPLY_YOURS_DIR = dir; });
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("add_to_pool", () => {
  it("adds a person and persists keep and keepFor", async () => {
    await addToPool({ name: "Ada", contact: "ada@x.com", role: "Staff", verdict: "pass", keep: true, keepFor: "Senior later" });
    const pool = readPool();
    expect(pool.people).toHaveLength(1);
    expect(pool.people[0].keep).toBe(true);
    expect(pool.people[0].keepFor).toBe("Senior later");
  });

  it("does not duplicate the same person seen for a second role", async () => {
    await addToPool({ name: "Ada", contact: "ada@x.com", role: "Staff", verdict: "pass", keep: true, keepFor: "Senior later" });
    await addToPool({ name: "Ada", contact: "ada@x.com", role: "Senior", verdict: "worth_your_time", keep: true, keepFor: "" });
    const pool = readPool();
    expect(pool.people).toHaveLength(1);
    expect(pool.people[0].roles).toEqual(["Staff", "Senior"]);
    expect(pool.people[0].lastVerdict).toBe("worth_your_time");
  });
});
