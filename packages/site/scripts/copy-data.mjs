import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../");
const DATA_DIR = path.join(REPO_ROOT, "data");
const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const OUT_THEME_CSS = path.resolve(__dirname, "../src/theme.css");

fs.mkdirSync(OUT_DATA_DIR, { recursive: true });

const resume = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "resume.json"), "utf-8"));
const brand = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "brand.json"), "utf-8"));

fs.writeFileSync(path.join(OUT_DATA_DIR, "resume.json"), JSON.stringify(resume, null, 2));
fs.writeFileSync(path.join(OUT_DATA_DIR, "brand.json"), JSON.stringify(brand, null, 2));

const cssVars = {
  "--color-primary": brand.colors.primary,
  "--color-secondary": brand.colors.secondary,
  "--color-text": brand.colors.text,
  "--color-background": brand.colors.background,
  "--font-heading": brand.fonts.heading,
  "--font-body": brand.fonts.body,
};

const cssLines = Object.entries(cssVars).map(([key, value]) => `  ${key}: ${value};`);
const css = `:root {\n${cssLines.join("\n")}\n}\n`;

fs.writeFileSync(OUT_THEME_CSS, css);

console.log(`Copied data into ${OUT_DATA_DIR} and generated ${OUT_THEME_CSS}`);
