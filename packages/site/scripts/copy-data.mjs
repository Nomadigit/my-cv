import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { toWebCss } from "@my-cv/brand-kit";
import { loadResume, loadBrand } from "@my-cv/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const OUT_THEME_CSS = path.resolve(__dirname, "../src/theme.css");

fs.mkdirSync(OUT_DATA_DIR, { recursive: true });

const resume = loadResume();
const brand = loadBrand();

fs.writeFileSync(path.join(OUT_DATA_DIR, "resume.json"), JSON.stringify(resume, null, 2));
fs.writeFileSync(path.join(OUT_DATA_DIR, "brand.json"), JSON.stringify(brand, null, 2));
fs.writeFileSync(OUT_THEME_CSS, toWebCss(brand));

console.log(`Copied data into ${OUT_DATA_DIR} and generated ${OUT_THEME_CSS}`);
