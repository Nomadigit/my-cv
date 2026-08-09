import fs from "fs";
import path from "path";
import { execSync, spawn, ChildProcess } from "child_process";
import { chromium } from "playwright";
import { loadResume, loadBrand, OUTPUT_DIR } from "@my-cv/shared";

// Compiled output lives at packages/pdf-renderer/dist/render.js, so three
// levels up from __dirname is the repo root regardless of the caller's cwd.
const REPO_ROOT = path.resolve(__dirname, "../../../");
const SITE_DIR = path.join(REPO_ROOT, "packages", "site");
const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

function siteIsBuilt(): boolean {
  return fs.existsSync(path.join(SITE_DIR, "dist", "index.html"));
}

function buildSite(): void {
  console.log("Building /packages/site before rendering PDF...");
  execSync("npm run build -w @my-cv/site", { cwd: REPO_ROOT, stdio: "inherit" });
}

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url} to respond`);
}

function startPreviewServer(): ChildProcess {
  // Spawn the vite binary directly (rather than via `npm run`) so killing
  // this one process actually stops the server instead of leaving an
  // orphaned grandchild behind when the wrapping npm process is killed.
  const viteBin = path.join(REPO_ROOT, "node_modules", ".bin", "vite");
  return spawn(viteBin, ["preview", "--port", String(PREVIEW_PORT), "--strictPort"], {
    cwd: SITE_DIR,
    stdio: "ignore",
  });
}

async function main() {
  // Validate data up front so a schema violation fails loudly before we
  // spend time building the site / launching a browser.
  loadResume();
  loadBrand();

  const siteUrlEnv = process.env.SITE_URL;
  let previewProcess: ChildProcess | undefined;
  let printUrl: string;

  if (siteUrlEnv) {
    printUrl = `${siteUrlEnv.replace(/\/$/, "")}/print`;
  } else {
    if (!siteIsBuilt()) {
      buildSite();
    }
    previewProcess = startPreviewServer();
    await waitForServer(PREVIEW_URL);
    printUrl = `${PREVIEW_URL}/print`;
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(printUrl, { waitUntil: "networkidle" });

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const outPath = path.join(OUTPUT_DIR, "resume.pdf");

    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "12mm", bottom: "15mm", left: "12mm" },
    });

    await browser.close();
    console.log(`Wrote ${outPath}`);
  } finally {
    previewProcess?.kill();
  }
}

main().catch((err) => {
  console.error("Failed to render PDF:", err);
  process.exit(1);
});
