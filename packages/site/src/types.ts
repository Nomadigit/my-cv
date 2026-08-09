export interface Profile {
  network: string;
  username?: string;
  url: string;
}

export interface Basics {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Profile[];
}

export interface WorkItem {
  name: string;
  position: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationItem {
  institution: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface SkillGroup {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface LanguageItem {
  language: string;
  fluency?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  highlights?: string[];
  url?: string;
}

export interface AwardItem {
  title: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface ResumeData {
  basics?: Basics;
  work?: WorkItem[];
  education?: EducationItem[];
  skills?: SkillGroup[];
  projects?: ProjectItem[];
  awards?: AwardItem[];
  languages?: LanguageItem[];
}

export interface BrandData {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logoText: string;
}
