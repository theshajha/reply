"use client";
import { useEffect, useState } from "react";
import type { Board } from "@/lib/schema/board";
import { DecisionCard } from "@/components/decision-card";

const INKS = {
  screener: "var(--ink-screener)",
  researcher: "var(--ink-researcher)",
  responder: "var(--ink-responder)",
};

const SECTIONS = [
  { bucket: "worth_your_time", label: "Shortlist" },
  { bucket: "maybe", label: "Worth a look" },
  { bucket: "pass", label: "Keep for later" },
] as const;

export default function BoardPage() {
  const [board, setBoard] = useState<Board | null>(null);
  useEffect(() => {
    fetch("/api/board").then((r) => r.json()).then(setBoard).catch(() => setBoard(null));
  }, []);

  return (
    <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>Sift</h1>
          <p style={{ color: "var(--muted-foreground)", marginTop: "0.25rem" }}>The right candidates, without reading the pile.</p>
        </div>
        <a href="/" style={{ color: "var(--primary)", fontSize: "0.875rem", whiteSpace: "nowrap" }}>Talk to Sift →</a>
      </div>

      {board && board.entries.length === 0 && (
        <p style={{ fontFamily: "var(--serif)", marginTop: "2rem" }}>
          Drop your inbound into <code>yours/inbound/</code>, then say <b>run</b> in the chat.
        </p>
      )}

      {SECTIONS.map((s) => {
        const items = board?.entries.filter((e) => e.bucket === s.bucket) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={s.bucket} style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary)" }}>
              {s.label}
            </h2>
            {items.map((e) => (
              <DecisionCard key={e.candidate.id} entry={e} inks={INKS} />
            ))}
          </section>
        );
      })}

      <footer style={{ marginTop: "3rem", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--muted-foreground)" }}>
        made by <a href="https://rwhq.io/sift" style={{ color: "var(--primary)" }}>Re:Work</a>. want the human version?
      </footer>
    </main>
  );
}
