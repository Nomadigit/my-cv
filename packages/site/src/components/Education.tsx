import type { EducationItem } from "../types";

export interface EducationProps {
  education?: EducationItem[];
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  return `${start} – ${end || "Present"}`;
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
