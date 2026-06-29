import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { gmailClient, sendMessage } from "@/lib/gmail";
import { readYours } from "@/lib/yours";
import type { Preferences } from "@/lib/schema/preferences";

export function assertSendAllowed(preferences: Preferences): void {
  if (!preferences.send) {
    throw new Error("Sending is off. Sift creates a Gmail draft you send yourself. Turn on send in yours/preferences.json (or re-run onboarding) to send directly.");
  }
}

export default defineTool({
  description: "Send an approved reply directly. Off by default; only works when send is enabled in preferences. Always pauses for human approval first.",
  inputSchema: z.object({ to: z.string(), subject: z.string(), body: z.string() }),
  approval: always(),
  execute: async (msg) => {
    assertSendAllowed(readYours().preferences);
    return { messageId: await sendMessage(gmailClient(), msg) };
  },
});
