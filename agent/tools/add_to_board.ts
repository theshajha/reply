import { defineTool } from "eve/tools";
import { z } from "zod";
import { BoardEntry } from "@/lib/schema/board";
import { readBoard, writeBoard } from "@/lib/yours";

const Input = z.object({ role: z.string(), entry: BoardEntry });

export async function addToBoard(input: z.infer<typeof Input>): Promise<{ count: number }> {
  const { role, entry } = Input.parse(input);
  const board = readBoard();
  if (!board.role) board.role = role;
  if (!board.generatedAt) board.generatedAt = new Date().toISOString();
  const i = board.entries.findIndex((e) => e.candidate.id === entry.candidate.id);
  if (i >= 0) board.entries[i] = entry; else board.entries.push(entry);
  writeBoard(board);
  return { count: board.entries.length };
}

export default defineTool({
  description: "Add or update one applicant on the triage board (worth_your_time / maybe / pass), with the screener reason, optional research context, and the drafted reply.",
  inputSchema: Input,
  execute: addToBoard,
});
