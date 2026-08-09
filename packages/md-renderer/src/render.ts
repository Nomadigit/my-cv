import fs from "fs";
import path from "path";
import { loadResume, loadBrand, OUTPUT_DIR } from "@my-cv/shared";

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

function renderMarkdown(): string {
  const resume = loadResume();
  const { basics, work = [], education = [], skills = [], languages = [], projects = [], awards = [] } = resume;

  const lines: string[] = [];

  lines.push(`# ${basics?.name ?? ""}`);
  if (basics?.label) lines.push(`\n**${basics.label}**`);
  if (basics?.location?.city) {
    lines.push(`\n${[basics.location.city, basics.location.countryCode].filter(Boolean).join(", ")}`);
  }
  const links = (basics?.profiles ?? []).map((p) => `[${p.network}](${p.url})`).join(" · ");
  if (links) lines.push(`\n${links}`);

  if (basics?.summary) {
    lines.push(`\n## Summary\n\n${basics.summary}`);
  }

  if (work.length > 0) {
    lines.push(`\n## Experience`);
    for (const job of work) {
      const range = formatDateRange(job.startDate, job.endDate);
      lines.push(`\n### ${job.position} — ${job.name}${range ? ` (${range})` : ""}`);
      for (const highlight of job.highlights ?? []) {
        lines.push(`- ${highlight}`);
      }
    }
  }

  if (education.length > 0) {
    lines.push(`\n## Education`);
    for (const edu of education) {
      const range = formatDateRange(edu.startDate, edu.endDate);
      lines.push(`\n### ${edu.studyType ? `${edu.studyType}, ` : ""}${edu.area} — ${edu.institution}${range ? ` (${range})` : ""}`);
    }
  }

  if (skills.length > 0) {
    lines.push(`\n## Skills`);
    for (const group of skills) {
      lines.push(`\n**${group.name}**: ${(group.keywords ?? []).join(", ")}`);
    }
  }

  if (projects.length > 0) {
    lines.push(`\n## Projects`);
    for (const project of projects) {
      lines.push(`\n### ${project.name}`);
      if (project.description) lines.push(project.description);
      for (const highlight of project.highlights ?? []) {
        lines.push(`- ${highlight}`);
      }
    }
  }

  if (awards.length > 0) {
    lines.push(`\n## Awards`);
    for (const award of awards) {
      lines.push(`\n- **${award.title}** — ${award.awarder ?? ""} (${award.date ? formatDate(award.date) : ""})`);
    }
  }

  if (languages.length > 0) {
    lines.push(`\n## Languages`);
    for (const lang of languages) {
      lines.push(`- ${lang.language}: ${lang.fluency}`);
    }
  }

  return lines.join("\n") + "\n";
}

function main() {
  // Validate brand.json up front too, even though this renderer doesn't
  // consume it, so a schema violation is caught wherever build:all runs.
  loadBrand();
  const markdown = renderMarkdown();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, "resume.md");
  fs.writeFileSync(outPath, markdown, "utf-8");
  console.log(`Wrote ${outPath}`);
}

main();
