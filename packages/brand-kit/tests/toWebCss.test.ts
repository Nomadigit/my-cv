import { describe, expect, it } from "vitest";
import { toWebCss } from "../src/transformers/toWebCss";
import { validateBrand } from "../src/validate";
import { fullBrand, invalidBrand, minimalBrand } from "./fixtures";

describe("toWebCss", () => {
  it("renders a :root block with core color and font variables for a full brand", () => {
    const css = toWebCss(fullBrand);
    expect(css).toContain(":root {");
    expect(css).toContain("--color-primary: #1a73e8;");
    expect(css).toContain("--color-secondary: #34a853;");
    expect(css).toContain("--color-success: #188038;");
    expect(css).toContain('--font-web-family: Inter, "Helvetica Neue", sans-serif;');
    expect(css).toContain("--font-size-h1: 32px;");
    expect(css).toContain("--spacing-unit: 8px;");
    expect(css).toContain("--radius: 6px;");
  });

  it("emits a prefers-color-scheme: dark block only when colors.darkMode is set", () => {
    const css = toWebCss(fullBrand);
    expect(css).toContain("@media (prefers-color-scheme: dark) {");
    expect(css).toContain("--color-background: #202124;");
  });

  it("falls back to sane defaults and omits optional variables/dark block for a minimal brand", () => {
    const css = toWebCss(minimalBrand);
    expect(css).toContain("--color-primary: #1a73e8;");
    expect(css).toContain("--font-weight-regular: 400;");
    expect(css).not.toContain("--color-secondary");
    expect(css).not.toContain("@media (prefers-color-scheme: dark)");
  });

  it("rejects invalid brand data before it ever reaches the transformer", () => {
    expect(() => validateBrand(invalidBrand)).toThrow(/failed schema validation/);
  });
});
