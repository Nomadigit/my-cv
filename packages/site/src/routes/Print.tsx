import { ResumeSections } from "../components/ResumeSections";
import type { ResumeData } from "../types";

export interface PrintProps {
  resume: ResumeData;
  logoText?: string;
}

export function Print({ resume, logoText }: PrintProps) {
  return (
    <div className="page print-page">
      <main className="resume">
        <ResumeSections resume={resume} logoText={logoText} />
      </main>
    </div>
  );
}
