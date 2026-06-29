import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Pool } from "./schema/pool";
import { personId, readPool, writePool, upsertPerson, type PersonSighting } from "./pool";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "sift-")); process.env.SIFT_YOURS_DIR = dir; });
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const sighting = (over: Partial<PersonSighting> = {}): PersonSighting => ({
  name: "Ada", contact: "ada@x.com", role: "Staff Engineer",
  verdict: "pass", keep: true, keepFor: "Senior next round", links: [], ...over,
});

describe("pool", () => {
  it("returns an empty pool when none exists", () => {
    expect(readPool().people).toEqual([]);
  });

  it("personId is stable and ignores case and surrounding space", () => {
    expect(personId(" Ada@X.com ")).toBe(personId("ada@x.com"));
  });

  it("folds the same person across roles into one entry and accumulates roles", () => {
    let pool: Pool = { people: [] };
    pool = upsertPerson(pool, sighting(), "2026-01-01T00:00:00Z");
    pool = upsertPerson(pool, sighting({ role: "Senior Engineer", keepFor: "fits this opening now" }), "2026-04-01T00:00:00Z");
    expect(pool.people).toHaveLength(1);
    expect(pool.people[0].roles).toEqual(["Staff Engineer", "Senior Engineer"]);
    expect(pool.people[0].keepFor).toBe("fits this opening now");
    expect(pool.people[0].firstSeen).toBe("2026-01-01T00:00:00Z");
    expect(pool.people[0].lastSeen).toBe("2026-04-01T00:00:00Z");
  });

  it("round-trips through writePool and readPool", () => {
    const pool = upsertPerson({ people: [] }, sighting(), "2026-01-01T00:00:00Z");
    writePool(pool);
    const back = readPool();
    expect(back.people[0].contact).toBe("ada@x.com");
    expect(back.people[0].keep).toBe(true);
  });
});
