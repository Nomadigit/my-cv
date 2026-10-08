# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An npm-workspaces monorepo that generates a resume website, PDF, DOCX, Markdown, and LinkedIn-ready
text file from two source-of-truth data files:

- `data/resume.json` — content, in [JSON Resume](https://jsonresume.org/schema/) format.
- `data/brand.json` — **CV-specific overrides only** (print font sizes in pt, A4 margins, logo off).
  The brand itself (colors, fonts, logo, spacing, dark mode) comes from the external package
  `@nomadigit/brand` (github.com/Nomadigit/brand, pinned to a tag or commit in the root `package.json`).
  `loadBrand()` deep-merges the overrides onto the package's `tokens/brand.json` and validates the
  result against the package's schema. To change brand colors/fonts, change the brand repo and bump
  the tag here; don't redefine them in `data/brand.json`.

**Resume edits always go in `data/resume.json`, CV-only brand tweaks in `data/brand.json`, never in
a package's own copy or in generated output.** `packages/site/src/data/*` and `packages/site/src/theme.css` are
generated (gitignored) — don't hand-edit them, they get overwritten on every build.

There's also a legacy standalone `resume.json` at the repo root (Danil Shubin's original single-file
CV, pre-dating this monorepo). It's independent of `data/resume.json` and isn't consumed by any
package here.

## Structure

- `@nomadigit/brand` (external, `git+https://github.com/Nomadigit/brand.git#vX.Y.Z`) — brand tokens,
  schema, `BrandFile` type, `validateBrand()` and the transformers (`toWebCss`, `toDocxStyles`, …),
  plus self-hosted fonts (`@nomadigit/brand/fonts.css`) and favicons. Moved out of this repo
  (formerly `packages/brand-kit`). npm 12 blocks git dependencies by default; the root `.npmrc`
  sets `allow-git=root`, which only covers dependencies of the root package, so the brand is
  declared **only in the root `package.json`** (workspaces resolve it from the hoisted
  `node_modules`). Don't add it to `packages/*/package.json` — npm then refuses the install.
- `packages/shared` — `loadResume()`/`loadBrand()` (data-loading layer only). `loadResume()` uses
  its own ajv-based `validateResume()` against `data/schema/resume.schema.json` (TS types generated
  from that schema into `src/generated/`, gitignored). `loadBrand()` merges `data/brand.json` onto
  `@nomadigit/brand`'s tokens and calls its `validateBrand()`; shared has no brand schema or
  transformer logic of its own.
- `packages/site` — the only package using React (Vite + TS). Presentational components take only
  props; `/` is the interactive route, `/print` is the print-optimized route used by pdf-renderer.
  Its `predev`/`prebuild` script (`scripts/copy-data.mjs`) copies `data/*.json` into `src/data/` and
  calls `@nomadigit/brand`'s `toWebCss()` to generate `src/theme.css`, and copies the brand
  favicons into `public/brand/` (gitignored). `main.tsx` imports `@nomadigit/brand/fonts.css`.
- `packages/pdf-renderer` — Playwright; screenshots `/print` to `output/resume.pdf`. Builds and
  serves `packages/site` locally via `vite preview` unless `SITE_URL` is set. `page.pdf()`'s
  `format`/`margin` come from `brand.layout.document` (falling back to A4/15mm/12mm if unset).
- `packages/docx-renderer` — plain Node, no React, no templating — builds `output/resume.docx`
  using `@nomadigit/brand`'s `toDocxStyles()` for fonts/sizes/colors.
- `packages/md-renderer`, `txt-renderer` — plain Node, build `output/resume.md` /
  `output/linkedin.txt` from resume data only; brand.json has no styling concept in plain text, so
  they just call `loadBrand()` as a validation gate (consistent with the other renderers) without
  consuming its fields.

All renderers validate data via `@my-cv/shared` before generating and exit non-zero with a schema
error message on invalid data.

## Commands

- `npm run build:all` — validate data, then build md/txt/docx/site/pdf outputs, in that order.
- `npm run dev` — serve `packages/site` with hot reload.
- `npm run build:<md|txt|docx|site|pdf>` — build one output in isolation.
- Playwright's Chromium needs a one-time `npx playwright install --with-deps chromium` per machine;
  `--with-deps` requires sudo (present in the GitHub Actions runner, not necessarily in every
  sandbox).

## Conventions

- Node packages (`shared`, `pdf-renderer`, `docx-renderer`, `md-renderer`,
  `txt-renderer`) compile with `tsc` to CommonJS. Only `packages/site` uses React/JSX and is
  bundled with Vite.
- `packages/shared`'s generated `ResumeSchema` type comes from `data/schema/resume.schema.json` —
  if you change that schema, re-run `npm run build -w @my-cv/shared` to regenerate it. The `BrandFile`
  type and brand schema live in `@nomadigit/brand`; upgrade with
  `npm install "@nomadigit/brand@git+https://github.com/Nomadigit/brand.git#vX.Y.Z"` (a plain
  `npm install` after editing the tag keeps the old commit from the lockfile).
- Visual changes follow the Nomadigit brand rules (`node_modules/@nomadigit/brand/AGENTS.md`):
  colors only via CSS variables from `theme.css` (`--color-*`), never the accent for text. Contacts
  use the mono font (`--font-mono-family`, Geist Mono); dates, labels and numbers stay in Onest
  (`tabular-nums`), no italics.
- Git history exists; check `git status` / `git log` before assuming the working tree is clean.
