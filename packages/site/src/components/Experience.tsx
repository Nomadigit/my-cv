import type { WorkItem } from "../types";

export interface ExperienceProps {
  work?: WorkItem[];
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  return `${start} – ${end || "Present"}`;
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
