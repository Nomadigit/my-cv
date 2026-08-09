# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An npm-workspaces monorepo that generates a resume website, PDF, DOCX, Markdown, and LinkedIn-ready
text file from two source-of-truth data files:

- `data/resume.json` — content, in [JSON Resume](https://jsonresume.org/schema/) format.
- `data/brand.json` — design tokens (colors, fonts, logo text).

**Resume/brand edits always go in `data/resume.json` / `data/brand.json`, never in a package's own
copy or in generated output.** `packages/site/src/data/*` and `packages/site/src/theme.css` are
generated (gitignored) — don't hand-edit them, they get overwritten on every build.

There's also a legacy standalone `resume.json` at the repo root (Danil Shubin's original single-file
CV, pre-dating this monorepo). It's independent of `data/resume.json` and isn't consumed by any
package here.

## Structure

- `packages/shared` — `loadResume()`/`loadBrand()`, ajv-based `validateResume()`/`validateBrand()`
  against `data/schema/*.schema.json`, TS types generated from those schemas via
  `json-schema-to-typescript` (output to `src/generated/`, gitignored, regenerated on every build),
  and `theme.ts` (brand → CSS variables).
- `packages/site` — the only package using React (Vite + TS). Presentational components take only
  props; `/` is the interactive route, `/print` is the print-optimized route used by pdf-renderer.
  Its `predev`/`prebuild` scripts copy `data/*.json` into `src/data/` and generate `src/theme.css`.
- `packages/pdf-renderer` — Playwright; screenshots `/print` to `output/resume.pdf`. Builds and
  serves `packages/site` locally via `vite preview` unless `SITE_URL` is set.
- `packages/docx-renderer`, `md-renderer`, `txt-renderer` — plain Node, no React, no templating —
  build `output/resume.docx`, `output/resume.md`, `output/linkedin.txt` directly from the data.

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

- Node packages (`shared`, `pdf-renderer`, `docx-renderer`, `md-renderer`, `txt-renderer`) compile
  with `tsc` to CommonJS. Only `packages/site` uses React/JSX and is bundled with Vite.
- `packages/shared`'s generated types (`ResumeSchema`, `Brand`) come from
  `data/schema/resume.schema.json` / `brand.schema.json` — if you change a schema, re-run
  `npm run build -w @my-cv/shared` to regenerate them before relying on the new shape.
- This is now a git repository (`git init` has been run), but nothing has been committed yet as of
  this file's writing — check `git status` before assuming history exists.
