import { google } from "googleapis";
import { createHash } from "node:crypto";
import { InboundCandidate } from "./schema/inbound";

export interface GmailApi {
  users: {
    messages: {
      list: (p: any) => Promise<{ data: { messages?: { id?: string | null }[] } }>;
      get: (p: any) => Promise<{ data: any }>;
      send?: (p: any) => Promise<{ data: { id?: string | null } }>;
    };
    drafts: {
      create: (p: any) => Promise<{ data: { id?: string | null } }>;
    };
  };
}

export function gmailClient(): GmailApi {
  const oauth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.gmail({ version: "v1", auth: oauth }) as unknown as GmailApi;
}

const URL_RE = /\bhttps?:\/\/[^\s"')]+/g;
const header = (headers: any[], name: string) =>
  headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";

function parseFrom(from: string): { name: string; email: string } {
  const m = from.match(/^(.*?)\s*<([^>]+)>$/);
  if (m) return { name: m[1].replace(/"/g, "").trim(), email: m[2].trim() };
  return { name: from.trim(), email: from.trim() };
}

export async function listInbound(gmail: GmailApi, label: string): Promise<InboundCandidate[]> {
  const list = await gmail.users.messages.list({ userId: "me", labelIds: [label], maxResults: 100 });
  const out: InboundCandidate[] = [];
  for (const ref of list.data.messages ?? []) {
    const msg = await gmail.users.messages.get({ userId: "me", id: ref.id, format: "full" });
    const headers = msg.data.payload?.headers ?? [];
    const { name, email } = parseFrom(header(headers, "From"));
    const subject = header(headers, "Subject");
    const raw = msg.data.payload?.body?.data ?? "";
    const message = raw ? Buffer.from(raw, "base64url").toString("utf8") : "";
    out.push(InboundCandidate.parse({
      id: createHash("sha1").update(`${email}|${subject}`).digest("hex").slice(0, 12),
      name, contact: email, roleAppliedFor: subject, message,
      links: Array.from(new Set(message.match(URL_RE) ?? [])),
      source: "gmail", receivedAt: header(headers, "Date"),
    }));
  }
  return out;
}

function rfc822({ to, subject, body }: { to: string; subject: string; body: string }): string {
  const lines = [`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/plain; charset=utf-8", "", body];
  return Buffer.from(lines.join("\r\n")).toString("base64url");
}

export async function createDraft(gmail: GmailApi, msg: { to: string; subject: string; body: string }): Promise<string> {
  const res = await gmail.users.drafts.create({ userId: "me", requestBody: { message: { raw: rfc822(msg) } } });
  return res.data.id ?? "";
}

export async function sendMessage(gmail: GmailApi, msg: { to: string; subject: string; body: string }): Promise<string> {
  if (!gmail.users.messages.send) throw new Error("send not available");
  const res = await gmail.users.messages.send({ userId: "me", requestBody: { raw: rfc822(msg) } });
  return res.data.id ?? "";
}
