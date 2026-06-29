import { defineTool } from "eve/tools";
import { z } from "zod";
import { gmailClient, listInbound } from "@/lib/gmail";
import { readYours } from "@/lib/yours";

export default defineTool({
  description: "Ingest applicants from the connected Gmail label (opt-in; requires GOOGLE_* env vars).",
  inputSchema: z.object({}),
  execute: async () => {
    const { preferences } = readYours();
    const candidates = await listInbound(gmailClient(), preferences.gmailLabel);
    return { candidates };
  },
});
