import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DecisionCard } from "./decision-card";

const entry = {
  candidate: { id: "ada", name: "Ada Lovelace", contact: "ada@x.com", roleAppliedFor: "Backend Engineer", message: "hi", links: [], source: "file", receivedAt: "t" },
  bucket: "worth_your_time" as const,
  reason: "Rebuilt a payments pipeline.",
  context: ["Active GitHub, real systems work"],
  draft: { subject: "Let's talk", body: "Thanks for sending this over.", tone: "yes" as const },
  preparedBy: ["screener", "responder"] as const,
  status: "pending" as const,
};
const inks = { screener: "#1", researcher: "#2", responder: "#3" };

describe("DecisionCard", () => {
  it("formats the bucket into plain English, not the enum", () => {
    render(<DecisionCard entry={entry as any} inks={inks} />);
    expect(screen.getByText("Shortlist")).toBeInTheDocument();
    expect(screen.queryByText("worth_your_time")).not.toBeInTheDocument();
  });
  it("shows the applicant, reason, context, and drafted reply", () => {
    render(<DecisionCard entry={entry as any} inks={inks} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText(/payments pipeline/)).toBeInTheDocument();
    expect(screen.getByText(/Active GitHub/)).toBeInTheDocument();
    expect(screen.getByText(/Thanks for sending this over/)).toBeInTheDocument();
  });
  it("renders a monogram for each preparing agent", () => {
    render(<DecisionCard entry={entry as any} inks={inks} />);
    expect(screen.getByLabelText("screener")).toBeInTheDocument();
    expect(screen.getByLabelText("responder")).toBeInTheDocument();
  });
});
