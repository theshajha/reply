import { describe, it, expect, vi } from "vitest";
import { listInbound, createDraft } from "./gmail";

function fakeGmail() {
  return {
    users: {
      messages: {
        list: vi.fn().mockResolvedValue({ data: { messages: [{ id: "m1" }] } }),
        get: vi.fn().mockResolvedValue({
          data: {
            payload: {
              headers: [
                { name: "From", value: "Ada <ada@x.com>" },
                { name: "Subject", value: "Backend Engineer" },
              ],
              body: { data: Buffer.from("Test?? https://github.com/ada").toString("base64url") },
            },
          },
        }),
      },
      drafts: { create: vi.fn().mockResolvedValue({ data: { id: "d1" } }) },
    },
  };
}

describe("gmail wrapper", () => {
  it("maps messages into InboundCandidate with extracted links", async () => {
    const gmail = fakeGmail() as any;
    const rows = await listInbound(gmail, "INBOX");
    expect(rows[0].message).toContain("Test??");
    expect(rows[0].contact).toBe("ada@x.com");
    expect(rows[0].name).toBe("Ada");
    expect(rows[0].links).toContain("https://github.com/ada");
    expect(rows[0].source).toBe("gmail");
  });

  it("creates a draft and returns its id", async () => {
    const gmail = fakeGmail() as any;
    const id = await createDraft(gmail, { to: "ada@x.com", subject: "Hi", body: "Thanks." });
    expect(id).toBe("d1");
    expect(gmail.users.drafts.create).toHaveBeenCalledOnce();
  });
});
