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

function hexNoHash(hex: string): string {
  return hex.replace("#", "");
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  return `${start} – ${end || "Present"}`;
}

function main() {
  const resume = loadResume();
  const brand = loadBrand();
  const { basics, work = [], education = [], skills = [], languages = [], projects = [], awards = [] } = resume;

  const primaryColor = hexNoHash(brand.colors.primary);
  const textColor = hexNoHash(brand.colors.text);
  const headingFont = brand.fonts.heading;
  const bodyFont = brand.fonts.body;

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor } },
      children: [new TextRun({ text, bold: true, color: primaryColor, font: headingFont, size: 28 })],
    });

  const subheading = (text: string) =>
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [new TextRun({ text, bold: true, color: textColor, font: headingFont, size: 24 })],
    });

  const body = (text: string) =>
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text, color: textColor, font: bodyFont, size: 22 })],
    });

  const bullet = (text: string) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text, color: textColor, font: bodyFont, size: 22 })],
    });

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({ text: basics?.name ?? "", bold: true, color: primaryColor, font: headingFont, size: 40 })],
    })
  );
  if (basics?.label) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: basics.label, italics: true, color: textColor, font: bodyFont, size: 24 })],
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
      children.push(bullet(`${award.title} — ${award.awarder ?? ""} (${award.date ?? ""})`));
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
