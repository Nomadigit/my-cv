export { loadResume, loadBrand } from "./load";
export { validateResume, validateBrand, assertValidResume, assertValidBrand } from "./validate";
export type { ValidationResult } from "./validate";
export { brandToCssVariables, cssVariablesToRootBlock, brandToCssRoot } from "./theme";
export type { CssVariables } from "./theme";
export { DATA_DIR, OUTPUT_DIR, RESUME_JSON_PATH, BRAND_JSON_PATH } from "./paths";
export type { ResumeSchema } from "./generated/resume";
export type { Brand } from "./generated/brand";
