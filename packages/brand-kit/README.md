# @my-cv/brand-kit

Single source of truth for a brand (`brand.json`), validated against a JSON Schema and
translated into ready-to-use outputs for the web, documents (DOCX/PDF), and HTML email —
without any of the three channels needing to know about the other two.

## Install (workspace-local)

This package lives in the `my-cv` npm workspace as `@my-cv/brand-kit`. From the repo root:

```bash
npm run build -w @my-cv/brand-kit
npm run test -w @my-cv/brand-kit
```

## Usage

```ts
import {
  validateBrand,
  toWebCss,
  toTailwindConfig,
  toDocxStyles,
  toPdfCss,
  toEmailInline,
} from "@my-cv/brand-kit";
import brandJson from "./examples/acme-brand.json";

const brand = validateBrand(brandJson); // throws with a detailed message if brandJson is invalid

toWebCss(brand); //         -> ":root { --color-primary: ...; } \n @media (prefers-color-scheme: dark) { ... }"
toTailwindConfig(brand); // -> { theme: { extend: { colors, fontFamily, fontSize, ... } } }
toDocxStyles(brand); //     -> { colors, heading1, heading2, heading3, body, small? } for docx.Document
toPdfCss(brand); //         -> "@page { size: A4; margin: ...; } body { font-family: ...; } ..."
toEmailInline(brand); //    -> { inline: {...}, styleTag: "<style>...</style>", table: { open, close } }
```

Every transformer is a pure function: `(brand: BrandFile) => string | object`. None of them
read files, mutate their input, or throw on missing *optional* fields — they fall back to
sane defaults instead. Validation is a separate, explicit step (`validateBrand`), so a
transformer never has to guard against malformed data itself.

### Validation

```ts
import { validateBrand, checkBrand } from "@my-cv/brand-kit";

validateBrand(data); // BrandFile, or throws Error("brand.json failed schema validation:\n  - /colors/text must be string\n  ...")
checkBrand(data); //    { valid: boolean; errors: string } — non-throwing variant
```

### Forward compatibility

The schema keeps `additionalProperties: true` throughout, and every generated TypeScript
type carries a `[k: string]: unknown` index signature. Adding a new field to `brand.json` in
the future will pass validation and won't break existing transformers — they simply won't
read the new field until you teach them to.

## Field → output reference

| `brand.json` field                 | `toWebCss`                              | `toTailwindConfig`               | `toDocxStyles`                | `toPdfCss`                     | `toEmailInline`                  |
| ----------------------------------- | ---------------------------------------- | --------------------------------- | ------------------------------ | -------------------------------- | ---------------------------------- |
| `colors.primary/secondary/accent`   | `--color-primary` etc.                   | `theme.extend.colors.*`           | `colors.*` (hex, no `#`)       | heading color                    | `heading` color                    |
| `colors.semantic.*`                 | `--color-success` etc.                   | `theme.extend.colors.success` etc. | —                               | —                                 | —                                   |
| `colors.text` / `background`        | `--color-text` / `--color-background`    | `theme.extend.colors.*`           | `colors.text` / `colors.background` | `body` color/background     | `body`/`container`/`text` colors   |
| `colors.border`                     | `--color-border`                         | `theme.extend.colors.border`      | `colors.border`                | —                                 | —                                   |
| `colors.darkMode.*`                 | `@media (prefers-color-scheme: dark)` block | —                               | —                               | —                                 | —                                   |
| `typography.webFont`                | `--font-web-family`                      | `theme.extend.fontFamily.web`     | —                               | —                                 | `font-family` on body/heading/text |
| `typography.printFont`              | —                                         | —                                  | `font` on every style           | `body { font-family }`           | —                                   |
| `typography.sizes.*`                | `--font-size-*`                          | `theme.extend.fontSize`           | `size` (converted to half-points) | `font-size` on body/h1/h2/h3   | `heading`/`text` `font-size`       |
| `typography.weights.*`              | `--font-weight-*`                        | `theme.extend.fontWeight`         | `bold` flag on headings         | —                                 | `heading` `font-weight`            |
| `typography.lineHeight.*`           | `--line-height-*`                        | `theme.extend.lineHeight`         | —                               | `line-height` on body/headings   | `text` `line-height`               |
| `spacing.unit`                      | `--spacing-unit`                         | —                                  | —                               | —                                 | —                                   |
| `spacing.borderRadius`              | `--radius`                               | `theme.extend.borderRadius`       | —                               | —                                 | —                                   |
| `layout.document.pageSize/margins`  | —                                         | —                                  | —                               | `@page { size; margin }`         | —                                   |
| `layout.email.maxWidth/contentPadding` | —                                      | —                                  | —                               | —                                 | `container` width/padding, `<style>` media query |

Fields not listed (`meta`, `identity`, `logo`, `letterhead`, `voice`) are part of the brand
record but aren't consumed by any transformer yet — they're metadata for humans and other
tooling (e.g. a future letterhead renderer).

## Structure

```
schema/brand.schema.json     JSON Schema (draft-07), source of truth for validation + types
src/
  generated/brand.ts         generated by json-schema-to-typescript (gitignored, regenerate via `npm run generate-types`)
  types.ts                   re-exports the generated BrandFile/ColorValue/FontStack types
  validate.ts                validateBrand() / checkBrand() via ajv + ajv-formats
  transformers/
    toWebCss.ts               brand -> CSS custom properties (+ dark mode media query)
    toTailwindConfig.ts       brand -> tailwind.config theme.extend fragment
    toDocxStyles.ts           brand -> style object for the `docx` package
    toPdfCss.ts               brand -> print CSS (@page, fonts, colors)
    toEmailInline.ts          brand -> inline styles + <style> fallback + table wrapper
  index.ts                    public API
examples/acme-brand.json     realistic filled-in example, exercised by tests/example.test.ts
tests/                        vitest: fixtures.ts + 3+ cases per transformer
```

## Tests

Each transformer has at least three cases: a fully-populated brand, a brand with only
required fields (checking defaults), and confirmation that `validateBrand` rejects invalid
data before it ever reaches a transformer. Run them with:

```bash
npm run test -w @my-cv/brand-kit
```
