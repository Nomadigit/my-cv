# my-cv

Single source of truth → website / PDF / DOCX / Markdown / LinkedIn text.

All output formats are generated from two files:

- `data/resume.json` — resume content, in [JSON Resume](https://jsonresume.org/schema/) format.
- `data/brand.json` — design tokens (colors, fonts, logo text) shared by every renderer.

Edit those two files and re-run the build; every output (site, PDF, DOCX, MD, TXT) picks up the change.

## Repository structure

```
data/
  resume.json          source of truth for content
  brand.json            source of truth for design tokens
  schema/
    resume.schema.json  JSON Resume schema (used for validation + type generation)
    brand.schema.json   schema for brand.json

packages/
  shared/         loadResume()/loadBrand() + ajv validation + generated TS types + theme.ts
  site/           React + Vite site (the only package that uses React), with a `/` interactive
                  route and a `/print` print-optimized route used by pdf-renderer
  pdf-renderer/   Playwright script: builds/serves the site (or hits SITE_URL), screenshots
                  `/print` to output/resume.pdf
  docx-renderer/  builds output/resume.docx directly with the `docx` package
  md-renderer/    builds output/resume.md
  txt-renderer/   builds output/linkedin.txt (plain text, LinkedIn-profile-ready sections)

output/           generated artifacts (gitignored except for a .gitkeep)
```

## Updating your resume

1. Edit `data/resume.json` (and `data/brand.json` for colors/fonts).
2. Run `npm run build:all` (see below) — this validates the data against the JSON schemas first
   and fails with a clear error if something doesn't conform.
3. All five outputs (`output/resume.pdf`, `output/resume.docx`, `output/resume.md`,
   `output/linkedin.txt`, and `packages/site/dist`) are regenerated from the same data.

Never hand-edit anything under `output/` or inside a renderer's own source data — edits belong in
`data/resume.json` / `data/brand.json` only.

## Local development

```bash
npm install
npm run build:all   # validate data, then build md, txt, docx, site, and pdf outputs
npm run dev          # serve packages/site with hot reload at http://localhost:5173
```

Individual builds:

```bash
npm run build:md
npm run build:txt
npm run build:docx
npm run build:site
npm run build:pdf
```

`build:pdf` needs a Playwright Chromium install once per machine:

```bash
npx playwright install --with-deps chromium
```

By default `build:pdf` builds `packages/site` and serves it locally (via `vite preview`) to
render `/print`. To point it at an already-deployed site instead, set `SITE_URL`:

```bash
SITE_URL=https://your-username.github.io/your-repo npm run build:pdf
```

## Deployment (GitHub Actions)

`.github/workflows/build.yml` runs on every push that touches `data/**`, or manually via
"Run workflow". It validates the data, builds and deploys `packages/site` to GitHub Pages, then
renders the PDF (against the just-deployed Pages URL), DOCX, MD, and TXT outputs and attaches them
to a new GitHub Release tagged `v-YYYY-MM-DD-<short-sha>`.

One-time repository setup required:

- **Settings → Pages → Source**: set to **GitHub Actions** (not "Deploy from a branch").
- No extra secrets are needed — the workflow uses the default `GITHUB_TOKEN`, with
  `contents: write`, `pages: write`, and `id-token: write` permissions declared in the workflow
  file itself.
