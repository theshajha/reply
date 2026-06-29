import { defineTool } from "eve/tools";
import { never } from "eve/tools/approval";
import { z } from "zod";
import { gmailClient, createDraft } from "@/lib/gmail";

export default defineTool({
  description: "Create a Gmail draft of an approved reply, threaded to the applicant. The operator opens Gmail and sends it. This is the default for every reply.",
  inputSchema: z.object({ to: z.string(), subject: z.string(), body: z.string() }),
  approval: never(),
  execute: async (msg) => ({ draftId: await createDraft(gmailClient(), msg) }),
});
