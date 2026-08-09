import type { LanguageItem } from "../types";

export interface LanguagesProps {
  languages?: LanguageItem[];
}

export function Languages({ languages }: LanguagesProps) {
  if (!languages || languages.length === 0) return null;
  return (
    <section className="section">
      <h2>Languages</h2>
      <ul className="languages-list">
        {languages.map((lang) => (
          <li key={lang.language}>
            {lang.language}
            {lang.fluency ? ` — ${lang.fluency}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
