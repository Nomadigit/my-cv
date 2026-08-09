import type { ProjectItem } from "../types";

export interface ProjectsProps {
  projects?: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null;
  return (
    <section className="section">
      <h2>Projects</h2>
      {projects.map((project) => (
        <div className="entry" key={project.name}>
          <div className="entry-header">
            <span className="entry-title">{project.name}</span>
          </div>
          {project.description && <p>{project.description}</p>}
          {project.highlights && project.highlights.length > 0 && (
            <ul>
              {project.highlights.map((highlight, j) => (
                <li key={j}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
