import type { AwardItem } from "../types";

export interface AwardsProps {
  awards?: AwardItem[];
}

function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  if (d) return `${d}.${m}.${y}`;
  if (m) return `${m}.${y}`;
  return y;
}

export function Awards({ awards }: AwardsProps) {
  if (!awards || awards.length === 0) return null;
  return (
    <section className="section">
      <h2>Awards</h2>
      <ul>
        {awards.map((award, i) => (
          <li key={i}>
            <strong>{award.title}</strong>
            {award.awarder ? ` — ${award.awarder}` : ""}
            {award.date ? ` (${formatDate(award.date)})` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
