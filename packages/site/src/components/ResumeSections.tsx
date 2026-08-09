import type { ResumeData } from "../types";
import { Header } from "./Header";
import { Summary } from "./Summary";
import { Experience } from "./Experience";
import { Education } from "./Education";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Awards } from "./Awards";
import { Languages } from "./Languages";

export interface ResumeSectionsProps {
  resume: ResumeData;
  logoText?: string;
}

export function ResumeSections({ resume, logoText }: ResumeSectionsProps) {
  return (
    <>
      <Header basics={resume.basics} logoText={logoText} />
      <Summary summary={resume.basics?.summary} />
      <Experience work={resume.work} />
      <Education education={resume.education} />
      <Skills skills={resume.skills} />
      <Projects projects={resume.projects} />
      <Awards awards={resume.awards} />
      <Languages languages={resume.languages} />
    </>
  );
}
