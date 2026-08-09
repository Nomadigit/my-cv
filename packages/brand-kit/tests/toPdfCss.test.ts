import { describe, expect, it } from "vitest";
import { toPdfCss } from "../src/transformers/toPdfCss";
import { validateBrand } from "../src/validate";
import { fullBrand, invalidBrand, minimalBrand } from "./fixtures";

describe("toPdfCss", () => {
  it("emits an @page rule from layout.document.margins and the printFont for a full brand", () => {
    const css = toPdfCss(fullBrand);
    expect(css).toContain("@page {");
    expect(css).toContain("size: A4;");
    expect(css).toContain("margin: 2cm 1.8cm 2cm 1.8cm;");
    expect(css).toContain('font-family: Georgia, "Times New Roman", serif;');
    expect(css).toContain("h1 { font-size: 32px; }");
  });

  it("falls back to A4 / 2cm margins when layout.document is absent on a minimal brand", () => {
    const css = toPdfCss(minimalBrand);
    expect(css).toContain("size: A4;");
    expect(css).toContain("margin: 2cm 2cm 2cm 2cm;");
    expect(css).not.toContain("h1, h2, h3");
  });

  it("never runs against invalid brand data because validation runs first", () => {
    expect(() => validateBrand(invalidBrand)).toThrow(/failed schema validation/);
  });
});
