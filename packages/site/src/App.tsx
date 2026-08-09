import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Site } from "./routes/Site";
import { Print } from "./routes/Print";
import resumeData from "./data/resume.json";
import brandData from "./data/brand.json";
import type { ResumeData, BrandData } from "./types";

const resume = resumeData as ResumeData;
const brand = brandData as BrandData;

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Site resume={resume} logoText={brand.logoText} />} />
        <Route path="/print" element={<Print resume={resume} logoText={brand.logoText} />} />
      </Routes>
    </BrowserRouter>
  );
}
