import fs from "fs";
import path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { loadResume, loadBrand, OUTPUT_DIR } from "@my-cv/shared";
import { toDocxStyles } from "@my-cv/brand-kit";

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

function main() {
  const resume = loadResume();
  const brand = loadBrand();
  const { basics, work = [], education = [], skills = [], languages = [], projects = [], awards = [] } = resume;

  const styles = toDocxStyles(brand);
  const small = styles.small ?? styles.body;
  // No distinct "name" style in brand-kit's docx output — scale heading1 up to
  // keep the same visual ratio the hand-rolled styling used (40hp / 28hp ≈ 1.4).
  const nameSize = Math.round(styles.heading1.size * 1.4);

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: styles.colors.primary } },
      children: [
        new TextRun({ text, bold: true, color: styles.heading1.color, font: styles.heading1.font, size: styles.heading1.size }),
      ],
    });

  const subheading = (text: string) =>
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({ text, bold: true, color: styles.heading3.color, font: styles.heading3.font, size: styles.heading3.size }),
      ],
    });

  const body = (text: string) =>
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text, color: styles.body.color, font: styles.body.font, size: styles.body.size })],
    });

  const bullet = (text: string) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text, color: styles.body.color, font: styles.body.font, size: styles.body.size })],
    });

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({ text: basics?.name ?? "", bold: true, color: styles.colors.primary, font: styles.heading1.font, size: nameSize }),
      ],
    })
  );
  if (basics?.label) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: basics.label, italics: true, color: small.color, font: small.font, size: small.size })],
      })
    );
  }
  const contactBits = [
    basics?.location?.city && [basics.location.city, basics.location.countryCode].filter(Boolean).join(", "),
    ...(basics?.profiles ?? []).map((p) => p.url),
  ].filter(Boolean) as string[];
  if (contactBits.length > 0) {
    children.push(body(contactBits.join("  |  ")));
  }

  if (basics?.summary) {
    children.push(heading("Summary"));
    children.push(body(basics.summary));
  }

  if (work.length > 0) {
    children.push(heading("Experience"));
    for (const job of work) {
      const range = formatDateRange(job.startDate, job.endDate);
      children.push(subheading(`${job.position} — ${job.name}${range ? ` (${range})` : ""}`));
      for (const highlight of job.highlights ?? []) {
        children.push(bullet(highlight));
      }
    }
  }

  if (education.length > 0) {
    children.push(heading("Education"));
    for (const edu of education) {
      const range = formatDateRange(edu.startDate, edu.endDate);
      children.push(
        subheading(`${edu.studyType ? `${edu.studyType}, ` : ""}${edu.area} — ${edu.institution}${range ? ` (${range})` : ""}`)
      );
    }
  }

  if (skills.length > 0) {
    children.push(heading("Skills"));
    for (const group of skills) {
      children.push(body(`${group.name}: ${(group.keywords ?? []).join(", ")}`));
    }
  }

  if (projects.length > 0) {
    children.push(heading("Projects"));
    for (const project of projects) {
      children.push(subheading(project.name ?? ""));
      if (project.description) children.push(body(project.description));
      for (const highlight of project.highlights ?? []) {
        children.push(bullet(highlight));
      }
    }
  }

  if (awards.length > 0) {
    children.push(heading("Awards"));
    for (const award of awards) {
      children.push(bullet(`${award.title} — ${award.awarder ?? ""} (${award.date ? formatDate(award.date) : ""})`));
    }
  }

  if (languages.length > 0) {
    children.push(heading("Languages"));
    for (const lang of languages) {
      children.push(bullet(`${lang.language}: ${lang.fluency}`));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, "resume.docx");

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outPath, buffer);
    console.log(`Wrote ${outPath}`);
  });
}

main();
