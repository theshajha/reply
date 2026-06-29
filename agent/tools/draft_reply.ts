import { defineTool } from "eve/tools";
import { never } from "eve/tools/approval";
import { z } from "zod";
import { gmailClient, createDraft } from "@/lib/gmail";

export default defineTool({
  description: "Create a Gmail draft of a message to an applicant, threaded to them. The operator opens Gmail and sends it. Use only when the operator wants to reach out to someone, usually from the shortlist.",
  inputSchema: z.object({ to: z.string(), subject: z.string(), body: z.string() }),
  approval: never(),
  execute: async (msg) => ({ draftId: await createDraft(gmailClient(), msg) }),
});
