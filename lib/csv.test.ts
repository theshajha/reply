import { describe, it, expect } from "vitest";
import { parseInbound, candidateId } from "./csv";

const csv = `name,contact,role,message,resume_url,received_at
Ada,ada@x.com,Eng,"GitHub: https://github.com/ada",https://x.com/a.pdf,2026-06-20T10:00:00Z`;

describe("parseInbound", () => {
  it("maps CSV rows into InboundCandidate and extracts links from the message", () => {
    const rows = parseInbound(csv, "sample.csv");
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Ada");
    expect(rows[0].roleAppliedFor).toBe("Eng");
    expect(rows[0].resumeUrl).toBe("https://x.com/a.pdf");
    expect(rows[0].links).toContain("https://github.com/ada");
    expect(rows[0].source).toBe("file:sample.csv");
    expect(rows[0].id).toBe(candidateId("ada@x.com", "Eng"));
  });

  it("parses a JSON array too", () => {
    const json = JSON.stringify([
      { name: "Grace", contact: "g@x.com", role: "Eng", message: "hi", received_at: "2026-06-21T00:00:00Z" },
    ]);
    const rows = parseInbound(json, "in.json");
    expect(rows[0].name).toBe("Grace");
    expect(rows[0].source).toBe("file:in.json");
  });

  it("produces a stable id for the same contact + role", () => {
    expect(candidateId("a@x.com", "Eng")).toBe(candidateId("a@x.com", "Eng"));
  });

  it("does not crash on a malformed resume_url (drops it to undefined)", () => {
    const messy = `name,contact,role,message,resume_url,received_at
Bo,bo@x.com,Eng,hi,linkedin.com/in/bo,2026-06-20T00:00:00Z`;
    const rows = parseInbound(messy, "messy.csv");
    expect(rows[0].resumeUrl).toBeUndefined();
    expect(rows[0].name).toBe("Bo");
  });
});
