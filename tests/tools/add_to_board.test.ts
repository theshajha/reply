import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { z } from "zod";
import { addToBoard } from "@/agent/tools/add_to_board";
import { readBoard } from "@/lib/yours";
import { BoardEntry } from "@/lib/schema/board";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "sift-")); process.env.SIFT_YOURS_DIR = dir; });
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const entry: z.input<typeof BoardEntry> = {
  candidate: { id: "ada", name: "Ada", contact: "ada@x.com", roleAppliedFor: "Eng", message: "hi", source: "file", receivedAt: "t" },
  bucket: "worth_your_time",
  reason: "Real systems work.",
  preparedBy: ["screener"],
};

describe("add_to_board", () => {
  it("creates the board and appends an entry", async () => {
    await addToBoard({ role: "Eng", entry });
    const board = readBoard();
    expect(board.role).toBe("Eng");
    expect(board.entries).toHaveLength(1);
  });

  it("upserts by candidate id rather than duplicating", async () => {
    await addToBoard({ role: "Eng", entry });
    await addToBoard({ role: "Eng", entry: { ...entry, reason: "Updated.", preparedBy: ["screener", "responder"] } });
    const board = readBoard();
    expect(board.entries).toHaveLength(1);
    expect(board.entries[0].reason).toBe("Updated.");
  });
});
