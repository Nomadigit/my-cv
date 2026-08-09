import fs from "fs";
import { validateBrand } from "@my-cv/brand-kit";
import type { BrandFile } from "@my-cv/brand-kit";
import { RESUME_JSON_PATH, BRAND_JSON_PATH } from "./paths";
import { assertValidResume } from "./validate";
import type { ResumeSchema } from "./generated/resume";

export function loadResume(): ResumeSchema {
  const data = JSON.parse(fs.readFileSync(RESUME_JSON_PATH, "utf-8"));
  assertValidResume(data);
  return data as ResumeSchema;
}

export function loadBrand(): BrandFile {
  const data = JSON.parse(fs.readFileSync(BRAND_JSON_PATH, "utf-8"));
  return validateBrand(data);
}
