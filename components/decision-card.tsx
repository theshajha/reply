import type { BoardEntry, AgentId } from "@/lib/schema/board";

const BUCKET_LABEL: Record<string, string> = {
  worth_your_time: "Shortlist",
  maybe: "Worth a look",
  pass: "Keep for later",
};

export function DecisionCard({ entry, inks }: { entry: BoardEntry; inks: Record<AgentId, string> }) {
  return (
    <article style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "0.75rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ fontFamily: "var(--font-sans)" }}>{entry.candidate.name}</strong>
        <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.13em", color: "var(--muted-foreground)" }}>
          {BUCKET_LABEL[entry.bucket]}
        </span>
      </header>
      <p style={{ fontFamily: "var(--serif)", marginTop: "0.25rem" }}>{entry.reason}</p>
      {entry.context.length > 0 && (
        <ul style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", listStyle: "none", padding: 0, margin: "0.5rem 0" }}>
          {entry.context.map((c, i) => (
            <li key={i} style={{ fontSize: "0.75rem", border: "1px solid var(--border)", borderRadius: "9999px", padding: "0.1rem 0.6rem" }}>{c}</li>
          ))}
        </ul>
      )}
      {entry.draft && (
        <blockquote style={{ fontFamily: "var(--serif)", borderLeft: "2px solid var(--primary)", paddingLeft: "0.75rem", marginTop: "0.75rem", whiteSpace: "pre-wrap" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{entry.draft.subject}</div>
          {entry.draft.body}
        </blockquote>
      )}
      <footer style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem" }}>
        {entry.preparedBy.map((a) => (
          <span key={a} aria-label={a} title={a}
            style={{ width: 18, height: 18, borderRadius: "9999px", background: inks[a], color: "white", fontSize: "0.6rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {a[0].toUpperCase()}
          </span>
        ))}
      </footer>
    </article>
  );
}
