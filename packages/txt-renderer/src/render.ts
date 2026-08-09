import fs from "fs";
import path from "path";
import { loadResume, OUTPUT_DIR } from "@my-cv/shared";

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  return `${start} - ${end || "Present"}`;
}

function section(title: string): string {
  return `=== ${title} ===`;
}

function renderTxt(): string {
  const resume = loadResume();
  const { basics, work = [], education = [], skills = [], languages = [], projects = [], awards = [] } = resume;

  const blocks: string[] = [];

  const headerLines = [basics?.name, basics?.label].filter(Boolean);
  if (basics?.location?.city) {
    headerLines.push([basics.location.city, basics.location.countryCode].filter(Boolean).join(", "));
  }
  for (const profile of basics?.profiles ?? []) {
    headerLines.push(`${profile.network}: ${profile.url}`);
  }
  blocks.push(headerLines.join("\n"));

  if (basics?.summary) {
    blocks.push(`${section("SUMMARY (LinkedIn About)")}\n\n${basics.summary}`);
  }

  for (const job of work) {
    const range = formatDateRange(job.startDate, job.endDate);
    const lines = [`${section(`EXPERIENCE — ${job.name}`)}`, "", `${job.position}${range ? ` (${range})` : ""}`];
    for (const highlight of job.highlights ?? []) {
      lines.push(`• ${highlight}`);
    }
    blocks.push(lines.join("\n"));
  }

  if (education.length > 0) {
    const lines = [section("EDUCATION")];
    for (const edu of education) {
      const range = formatDateRange(edu.startDate, edu.endDate);
      lines.push("");
      lines.push(`${edu.studyType ? `${edu.studyType}, ` : ""}${edu.area} — ${edu.institution}${range ? ` (${range})` : ""}`);
    }
    blocks.push(lines.join("\n"));
  }

  if (skills.length > 0) {
    const lines = [section("SKILLS")];
    for (const group of skills) {
      lines.push("");
      lines.push(`${group.name}: ${(group.keywords ?? []).join(", ")}`);
    }
    blocks.push(lines.join("\n"));
  }

  if (projects.length > 0) {
    for (const project of projects) {
      const lines = [section(`PROJECTS — ${project.name}`)];
      if (project.description) {
        lines.push("");
        lines.push(project.description);
      }
      for (const highlight of project.highlights ?? []) {
        lines.push(`• ${highlight}`);
      }
      blocks.push(lines.join("\n"));
    }
  }

  if (awards.length > 0) {
    const lines = [section("AWARDS")];
    for (const award of awards) {
      lines.push("");
      lines.push(`${award.title} — ${award.awarder ?? ""} (${award.date ?? ""})`);
    }
    blocks.push(lines.join("\n"));
  }

  if (languages.length > 0) {
    const lines = [section("LANGUAGES")];
    for (const lang of languages) {
      lines.push(`• ${lang.language}: ${lang.fluency}`);
    }
    blocks.push(lines.join("\n"));
  }

  return blocks.join("\n\n") + "\n";
}

function main() {
  const txt = renderTxt();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, "linkedin.txt");
  fs.writeFileSync(outPath, txt, "utf-8");
  console.log(`Wrote ${outPath}`);
}

main();
