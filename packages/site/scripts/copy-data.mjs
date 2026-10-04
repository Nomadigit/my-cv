import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { toWebCss } from "@nomadigit/brand";
import { loadResume, loadBrand } from "@my-cv/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const OUT_THEME_CSS = path.resolve(__dirname, "../src/theme.css");
const OUT_PUBLIC_BRAND = path.resolve(__dirname, "../public/brand");

fs.mkdirSync(OUT_DATA_DIR, { recursive: true });

const resume = loadResume();
const brand = loadBrand();

fs.writeFileSync(path.join(OUT_DATA_DIR, "resume.json"), JSON.stringify(resume, null, 2));
fs.writeFileSync(path.join(OUT_DATA_DIR, "brand.json"), JSON.stringify(brand, null, 2));
fs.writeFileSync(OUT_THEME_CSS, toWebCss(brand));

// Favicons come from the brand package; public/ files are served from the site base path.
const require = createRequire(import.meta.url);
const faviconDir = path.join(path.dirname(require.resolve("@nomadigit/brand/package.json")), "assets/favicon");
fs.mkdirSync(OUT_PUBLIC_BRAND, { recursive: true });
for (const file of ["favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
  fs.copyFileSync(path.join(faviconDir, file), path.join(OUT_PUBLIC_BRAND, file));
}

console.log(`Copied data into ${OUT_DATA_DIR} and generated ${OUT_THEME_CSS}`);
