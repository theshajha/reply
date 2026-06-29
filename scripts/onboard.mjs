import { createInterface } from "node:readline/promises";
import { writeFileSync, appendFileSync, existsSync } from "node:fs";
import { cpSync } from "node:fs";
import { join } from "node:path";

// Inlined from lib/onboard.ts (Node v24 doesn't resolve .ts imports in ESM)
// Preferences schema parsing is tested in lib/onboard.test.ts
function buildPreferences(a) {
  return {
    send: a.mode === "send",
    research: a.research,
    adapters: a.gmail ? ["file", "gmail"] : ["file"],
    gmailLabel: "INBOX",
    inks: {
      screener: "hsl(240 28% 50%)",
      researcher: "hsl(92 26% 34%)",
      responder: "hsl(315 30% 50%)",
    },
  };
}

function scaffoldYours(srcDir, destDir) {
  if (existsSync(destDir)) return false;
  cpSync(srcDir, destDir, { recursive: true });
  return true;
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = async (q, d) => (await rl.question(`${q}${d ? ` (${d})` : ""}: `)) || d;

(async () => {
  console.log("\nSift onboarding. This writes to yours/ only; pull updates anytime without conflicts.\n");
  const created = scaffoldYours(join(process.cwd(), "yours.example"), join(process.cwd(), "yours"));
  console.log(created ? "Created yours/ from the templates." : "yours/ already exists, leaving it alone.");

  const mode = (await ask("Replies: draft in Gmail, or send directly", "draft")).startsWith("s") ? "send" : "draft";
  const research = (await ask("Let the Researcher read public links applicants include? y/n", "y")).startsWith("y");
  const gmail = (await ask("Connect Gmail now? y/n", "n")).startsWith("y");

  const prefs = buildPreferences({ mode, research, gmail });
  writeFileSync(join(process.cwd(), "yours", "preferences.json"), JSON.stringify(prefs, null, 2));
  console.log("Wrote yours/preferences.json:", prefs);

  if (!existsSync(".env.local")) writeFileSync(".env.local", "AI_GATEWAY_API_KEY=\n");
  if (gmail) {
    console.log("\nGmail setup:");
    console.log("1. Create an OAuth client (Desktop) at https://console.cloud.google.com/apis/credentials");
    console.log("2. Enable the Gmail API; add scopes gmail.readonly and gmail.compose");
    console.log("3. Get a refresh token (OAuth Playground or your own flow)");
    console.log("4. Put GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN in .env.local");
    appendFileSync(".env.local", "GOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nGOOGLE_REFRESH_TOKEN=\n");
  }
  console.log("\nDone. Drop inbound into yours/inbound/, then run: npx eve dev\n");
  await rl.close();
})();
