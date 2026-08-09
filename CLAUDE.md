# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An npm-workspaces monorepo that generates a resume website, PDF, DOCX, Markdown, and LinkedIn-ready
text file from two source-of-truth data files:

- `data/resume.json` — content, in [JSON Resume](https://jsonresume.org/schema/) format.
- `data/brand.json` — design tokens (identity, logo, colors, typography, spacing, layout), validated
  against `packages/brand-kit`'s schema — see `packages/brand-kit/README.md` for the full field
  reference and which renderer consumes which field.

**Resume/brand edits always go in `data/resume.json` / `data/brand.json`, never in a package's own
copy or in generated output.** `packages/site/src/data/*` and `packages/site/src/theme.css` are
generated (gitignored) — don't hand-edit them, they get overwritten on every build.

There's also a legacy standalone `resume.json` at the repo root (Danil Shubin's original single-file
CV, pre-dating this monorepo). It's independent of `data/resume.json` and isn't consumed by any
package here.

## Structure

- `packages/brand-kit` — the single source of truth for `brand.json`'s schema, TS types
  (`BrandFile`, generated via `json-schema-to-typescript` into `src/generated/`, gitignored), and
  `validateBrand()`. Also owns the brand → output transformers consumed by other packages:
  `toWebCss`, `toDocxStyles`, `toPdfCss`, `toTailwindConfig`, `toEmailInline`. Has its own
  vitest suite (`npm run test -w @my-cv/brand-kit`) and is written to be reusable outside this repo
  (its schema/examples/README don't assume anything CV-specific).
- `packages/shared` — `loadResume()`/`loadBrand()` (data-loading layer only). `loadResume()` uses
  its own ajv-based `validateResume()` against `data/schema/resume.schema.json` (TS types generated
  from that schema into `src/generated/`, gitignored). `loadBrand()` delegates entirely to
  `@my-cv/brand-kit`'s `validateBrand()` — shared has no brand schema, type, or transformer logic of
  its own.
- `packages/site` — the only package using React (Vite + TS). Presentational components take only
  props; `/` is the interactive route, `/print` is the print-optimized route used by pdf-renderer.
  Its `predev`/`prebuild` script (`scripts/copy-data.mjs`) copies `data/*.json` into `src/data/` and
  calls `@my-cv/brand-kit`'s `validateBrand()` + `toWebCss()` to generate `src/theme.css`.
- `packages/pdf-renderer` — Playwright; screenshots `/print` to `output/resume.pdf`. Builds and
  serves `packages/site` locally via `vite preview` unless `SITE_URL` is set. `page.pdf()`'s
  `format`/`margin` come from `brand.layout.document` (falling back to A4/15mm/12mm if unset).
- `packages/docx-renderer` — plain Node, no React, no templating — builds `output/resume.docx`
  using `@my-cv/brand-kit`'s `toDocxStyles()` for fonts/sizes/colors.
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

- Node packages (`brand-kit`, `shared`, `pdf-renderer`, `docx-renderer`, `md-renderer`,
  `txt-renderer`) compile with `tsc` to CommonJS. Only `packages/site` uses React/JSX and is
  bundled with Vite.
- `packages/shared`'s generated `ResumeSchema` type comes from `data/schema/resume.schema.json` —
  if you change that schema, re-run `npm run build -w @my-cv/shared` to regenerate it. The `BrandFile`
  type is generated separately inside `packages/brand-kit` from its own
  `packages/brand-kit/schema/brand.schema.json` — re-run `npm run build -w @my-cv/brand-kit` after
  changing that one (and update `data/brand.json` to match, since it's the schema `loadBrand()`
  validates against).
- This is now a git repository (`git init` has been run), but nothing has been committed yet as of
  this file's writing — check `git status` before assuming history exists.
