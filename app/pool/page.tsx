"use client";
import { useEffect, useState } from "react";
import type { Pool } from "@/lib/schema/pool";

const VERDICT_LABEL: Record<string, string> = {
  worth_your_time: "Shortlist",
  maybe: "Worth a look",
  pass: "Keep for later",
};

export default function PoolPage() {
  const [pool, setPool] = useState<Pool | null>(null);
  useEffect(() => {
    fetch("/api/pool").then((r) => r.json()).then(setPool).catch(() => setPool(null));
  }, []);

  const kept = (pool?.people ?? [])
    .filter((p) => p.keep)
    .sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1));

  return (
    <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>Your pool</h1>
          <p style={{ color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
            Everyone worth keeping, across every round. Nobody good gets lost.
          </p>
        </div>
        <a href="/board" style={{ color: "var(--primary)", fontSize: "0.875rem", whiteSpace: "nowrap" }}>This run&rsquo;s board →</a>
      </div>

      {pool && kept.length === 0 && (
        <p style={{ fontFamily: "var(--serif)", marginTop: "2rem" }}>
          Nobody kept yet. Run Sift on some inbound and the people worth remembering land here.
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
        {kept.map((p) => (
          <li key={p.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontFamily: "var(--font-sans)" }}>{p.name || p.contact}</strong>
              <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.13em", color: "var(--muted-foreground)" }}>
                {VERDICT_LABEL[p.lastVerdict] ?? p.lastVerdict}
              </span>
            </div>
            {p.keepFor && <p style={{ fontFamily: "var(--serif)", marginTop: "0.25rem" }}>{p.keepFor}</p>}
            {p.roles.length > 0 && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
                Seen for: {p.roles.join(", ")}
              </p>
            )}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: "3rem", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--muted-foreground)" }}>
        made by <a href="https://rwhq.io/sift" style={{ color: "var(--primary)" }}>Re:Work</a>. want the human version?
      </footer>
    </main>
  );
}
