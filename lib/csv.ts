import { parse } from "csv-parse/sync";
import { createHash } from "node:crypto";
import { InboundCandidate } from "./schema/inbound";

export function candidateId(contact: string, role: string): string {
  return createHash("sha1").update(`${contact.toLowerCase()}|${role.toLowerCase()}`).digest("hex").slice(0, 12);
}

const URL_RE = /\bhttps?:\/\/[^\s"')]+/g;

function toCandidate(row: Record<string, string>, source: string): InboundCandidate {
  const contact = row.contact ?? row.email ?? "";
  const role = row.role ?? row.roleAppliedFor ?? "";
  const message = row.message ?? "";
  const links = Array.from(new Set(message.match(URL_RE) ?? []));
  return InboundCandidate.parse({
    id: candidateId(contact, role),
    name: row.name ?? "",
    contact,
    roleAppliedFor: role,
    message,
    // Guard: InboundCandidate.resumeUrl is z.string().url() (validates in zod@4),
    // so only pass a value that is actually a URL; a malformed cell must not crash ingest.
    resumeUrl: row.resume_url && /^https?:\/\//i.test(row.resume_url) ? row.resume_url : undefined,
    links,
    source,
    receivedAt: row.received_at ?? row.receivedAt ?? "",
  });
}

export function parseInbound(content: string, filename: string): InboundCandidate[] {
  const source = `file:${filename}`;
  if (filename.endsWith(".json")) {
    const arr = JSON.parse(content) as Record<string, string>[];
    return arr.map((r) => toCandidate(r, source));
  }
  const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true }) as Record<string, string>[];
  return rows.map((r) => toCandidate(r, source));
}
