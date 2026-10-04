import fs from "fs";
import { validateBrand } from "@nomadigit/brand";
import type { BrandFile } from "@nomadigit/brand";
import { RESUME_JSON_PATH, BRAND_JSON_PATH } from "./paths";
import { assertValidResume } from "./validate";
import { applyConfidentialOverrides } from "./confidential";
import type { ResumeSchema } from "./generated/resume";

export function loadResume(): ResumeSchema {
  const data = JSON.parse(fs.readFileSync(RESUME_JSON_PATH, "utf-8"));
  assertValidResume(data);
  return applyConfidentialOverrides(data as ResumeSchema);
}

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/** Objects merge key by key; arrays and primitives in `override` replace the base value. */
function deepMerge(base: Json, override: Json): Json {
  const out: Json = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = isObject(value) && isObject(out[key]) ? deepMerge(out[key] as Json, value) : value;
  }
  return out;
}

/**
 * The Nomadigit brand from @nomadigit/brand, with the CV-specific overrides in
 * data/brand.json (print sizes, page margins, ...) layered on top, then validated.
 */
export function loadBrand(): BrandFile {
  const overrides = JSON.parse(fs.readFileSync(BRAND_JSON_PATH, "utf-8"));
  // Read through the package's "exports" map (./tokens.json -> tokens/brand.json).
  const baseBrand = JSON.parse(fs.readFileSync(require.resolve("@nomadigit/brand/tokens.json"), "utf-8")) as Json;
  const { $schema: _schema, ...base } = baseBrand;
  return validateBrand(deepMerge(base, overrides));
}
