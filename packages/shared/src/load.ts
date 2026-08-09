import fs from "fs";
import { RESUME_JSON_PATH, BRAND_JSON_PATH } from "./paths";
import { assertValidResume, assertValidBrand } from "./validate";
import type { ResumeSchema } from "./generated/resume";
import type { Brand } from "./generated/brand";

export function loadResume(): ResumeSchema {
  const data = JSON.parse(fs.readFileSync(RESUME_JSON_PATH, "utf-8"));
  assertValidResume(data);
  return data as ResumeSchema;
}

export function loadBrand(): Brand {
  const data = JSON.parse(fs.readFileSync(BRAND_JSON_PATH, "utf-8"));
  assertValidBrand(data);
  return data as Brand;
}
