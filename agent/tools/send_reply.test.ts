import { describe, it, expect } from "vitest";
import { assertSendAllowed } from "./send_reply";

describe("send gate", () => {
  it("throws a plain-language refusal when send is off", () => {
    expect(() => assertSendAllowed({ send: false } as any)).toThrow(/draft/i);
  });
  it("allows send when explicitly enabled", () => {
    expect(() => assertSendAllowed({ send: true } as any)).not.toThrow();
  });
});
