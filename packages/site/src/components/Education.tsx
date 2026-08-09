import type { EducationItem } from "../types";

export interface EducationProps {
  education?: EducationItem[];
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

export function Education({ education }: EducationProps) {
  if (!education || education.length === 0) return null;
  return (
    <section className="section">
      <h2>Education</h2>
      {education.map((edu, i) => (
        <div className="entry" key={`${edu.institution}-${i}`}>
          <div className="entry-header">
            <span className="entry-title">
              {edu.studyType ? `${edu.studyType}, ` : ""}
              {edu.area} — {edu.institution}
            </span>
            <span className="entry-dates">{formatDateRange(edu.startDate, edu.endDate)}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
