import { defineTool } from "eve/tools";
import { z } from "zod";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { yoursDir } from "@/lib/yours";
import { parseInbound } from "@/lib/csv";
import { InboundCandidate } from "@/lib/schema/inbound";

export async function ingestFile(_input: Record<string, never>): Promise<{ candidates: InboundCandidate[] }> {
  const inboundDir = join(yoursDir(), "inbound");
  if (!existsSync(inboundDir)) return { candidates: [] };
  const candidates: InboundCandidate[] = [];
  for (const f of readdirSync(inboundDir)) {
    if (!/\.(csv|json)$/i.test(f)) continue;
    candidates.push(...parseInbound(readFileSync(join(inboundDir, f), "utf8"), f));
  }
  return { candidates };
}

export default defineTool({
  description: "Ingest all applicant files dropped under yours/inbound/ (CSV or JSON).",
  inputSchema: z.object({}),
  execute: ingestFile,
});
