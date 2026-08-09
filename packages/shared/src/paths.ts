import path from "path";

// Compiled output lives at packages/shared/dist/src/paths.js, so four levels
// up from __dirname is the repo root regardless of the caller's cwd.
const REPO_ROOT = path.resolve(__dirname, "../../../../");

export const DATA_DIR = path.join(REPO_ROOT, "data");
export const RESUME_JSON_PATH = path.join(DATA_DIR, "resume.json");
export const BRAND_JSON_PATH = path.join(DATA_DIR, "brand.json");
export const RESUME_SCHEMA_PATH = path.join(DATA_DIR, "schema", "resume.schema.json");
export const BRAND_SCHEMA_PATH = path.join(DATA_DIR, "schema", "brand.schema.json");
export const OUTPUT_DIR = path.join(REPO_ROOT, "output");
