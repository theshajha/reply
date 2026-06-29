import { defineTool } from "eve/tools";
import { z } from "zod";
import { readPool } from "@/lib/pool";

export default defineTool({
  description: "Read the durable pool of people kept from past inbound. Use at the start of a run to surface anyone already kept who might fit the role being hired for now, so strong past applicants resurface instead of getting lost. Returns the kept people with their roles, keepFor notes, and links.",
  inputSchema: z.object({}),
  execute: async () => {
    const pool = readPool();
    const kept = pool.people
      .filter((p) => p.keep)
      .sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1));
    return { total: pool.people.length, kept };
  },
});
