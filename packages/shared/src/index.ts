export { loadResume, loadBrand } from "./load";
export { applyConfidentialOverrides } from "./confidential";
export { validateResume, assertValidResume } from "./validate";
export type { ValidationResult } from "./validate";
export { DATA_DIR, OUTPUT_DIR, RESUME_JSON_PATH, BRAND_JSON_PATH } from "./paths";
export type { ResumeSchema } from "./generated/resume";
export type { BrandFile } from "@my-cv/brand-kit";
