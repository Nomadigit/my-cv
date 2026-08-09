import { Link } from "react-router-dom";
import { ResumeSections } from "../components/ResumeSections";
import type { ResumeData } from "../types";

export interface SiteProps {
  resume: ResumeData;
  logoText?: string;
}

export function Site({ resume, logoText }: SiteProps) {
  return (
    <div className="page site-page">
      <nav className="print-link">
        <Link to="/print">View print-friendly version</Link>
      </nav>
      <main className="resume">
        <ResumeSections resume={resume} logoText={logoText} />
      </main>
    </div>
  );
}
