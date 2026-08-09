import type { SkillGroup } from "../types";

export interface SkillsProps {
  skills?: SkillGroup[];
}

export function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="section">
      <h2>Skills</h2>
      {skills.map((group) => (
        <div className="skill-group" key={group.name}>
          <span className="skill-group-name">{group.name}:</span>{" "}
          <span className="skill-keywords">{(group.keywords ?? []).join(", ")}</span>
        </div>
      ))}
    </section>
  );
}
