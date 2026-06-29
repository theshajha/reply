import { defineTool } from "eve/tools";
import { z } from "zod";
import { writeBoard } from "@/lib/yours";

export async function clearBoard(input: { role: string }): Promise<{ ok: true }> {
  writeBoard({ role: input.role, generatedAt: new Date().toISOString(), entries: [] });
  return { ok: true };
}

export default defineTool({
  description: "Clear the triage board before a fresh run.",
  inputSchema: z.object({ role: z.string() }),
  execute: clearBoard,
});
