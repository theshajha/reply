import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ingestFile } from "@/agent/tools/ingest_file";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "sift-"));
  process.env.SIFT_YOURS_DIR = dir;
  mkdirSync(join(dir, "inbound"), { recursive: true });
  writeFileSync(join(dir, "inbound", "a.csv"),
    "name,contact,role,message,received_at\nAda,ada@x.com,Eng,hi,2026-06-20T00:00:00Z\n");
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("ingest_file", () => {
  it("reads every file under yours/inbound/", async () => {
    const { candidates } = await ingestFile({});
    expect(candidates).toHaveLength(1);
    expect(candidates[0].name).toBe("Ada");
  });
});
