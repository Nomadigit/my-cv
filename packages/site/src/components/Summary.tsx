export interface SummaryProps {
  summary?: string;
}

export function Summary({ summary }: SummaryProps) {
  if (!summary) return null;
  return (
    <section className="section">
      <h2>Summary</h2>
      <p>{summary}</p>
    </section>
  );
}
