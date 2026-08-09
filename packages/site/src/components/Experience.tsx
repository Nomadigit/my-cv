import type { WorkItem } from "../types";

export interface ExperienceProps {
  work?: WorkItem[];
}

function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  if (d) return `${d}.${m}.${y}`;
  if (m) return `${m}.${y}`;
  return y;
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  return `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
}

export function Experience({ work }: ExperienceProps) {
  if (!work || work.length === 0) return null;
  return (
    <section className="section">
      <h2>Experience</h2>
      {work.map((job, i) => (
        <div className="entry" key={`${job.name}-${job.position}-${i}`}>
          <div className="entry-header">
            <span className="entry-title">
              {job.position} — {job.name}
            </span>
            <span className="entry-dates">{formatDateRange(job.startDate, job.endDate)}</span>
          </div>
          {job.highlights && job.highlights.length > 0 && (
            <ul>
              {job.highlights.map((highlight, j) => (
                <li key={j}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
