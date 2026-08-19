import { loadEnvFile } from "./env";
import type { ResumeSchema } from "./generated/resume";

type Basics = NonNullable<ResumeSchema["basics"]>;
type Profile = NonNullable<Basics["profiles"]>[number];

function upsertTelegramProfile(profiles: Profile[] | undefined, handle: string): Profile[] {
  const username = handle.replace(/^@/, "");
  const entry: Profile = { network: "Telegram", username, url: `https://t.me/${username}` };
  const list = profiles ? [...profiles] : [];
  const idx = list.findIndex((p) => p.network?.toLowerCase() === "telegram");
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry };
  } else {
    list.push(entry);
  }
  return list;
}

// Overlays contact fields (phone, email, address, Telegram handle) from repo-root .env / process.env
// onto resume.basics, so real contact details never need to live in the committed resume.json.
// Fields are left untouched when the corresponding env var is unset.
export function applyConfidentialOverrides(resume: ResumeSchema): ResumeSchema {
  loadEnvFile();
  const basics: Basics = { ...(resume.basics ?? {}) };

  if (process.env.RESUME_PHONE) basics.phone = process.env.RESUME_PHONE;
  if (process.env.RESUME_EMAIL) basics.email = process.env.RESUME_EMAIL;
  if (process.env.RESUME_ADDRESS || process.env.RESUME_CITY || process.env.RESUME_COUNTRY_CODE) {
    basics.location = {
      ...(basics.location ?? {}),
      ...(process.env.RESUME_ADDRESS ? { address: process.env.RESUME_ADDRESS } : {}),
      ...(process.env.RESUME_CITY ? { city: process.env.RESUME_CITY } : {}),
      ...(process.env.RESUME_COUNTRY_CODE ? { countryCode: process.env.RESUME_COUNTRY_CODE } : {}),
    };
  }
  if (process.env.RESUME_TELEGRAM) {
    basics.profiles = upsertTelegramProfile(basics.profiles, process.env.RESUME_TELEGRAM);
  }

  return { ...resume, basics };
}
