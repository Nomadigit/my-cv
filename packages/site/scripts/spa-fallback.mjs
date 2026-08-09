import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

// GitHub Pages is a static host: it 404s any path without a matching file,
// which breaks direct/deep-link navigation to client-side routes like
// /print (react-router's BrowserRouter never gets a chance to handle it).
// Serving a copy of index.html as 404.html is the standard workaround —
// GitHub Pages falls back to it on an unmatched path, and the app then
// picks up the route on load.
fs.copyFileSync(path.join(DIST_DIR, "index.html"), path.join(DIST_DIR, "404.html"));

console.log("Copied dist/index.html to dist/404.html for SPA routing on GitHub Pages");
