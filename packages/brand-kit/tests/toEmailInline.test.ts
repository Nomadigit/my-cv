import { describe, expect, it } from "vitest";
import { toEmailInline } from "../src/transformers/toEmailInline";
import { validateBrand } from "../src/validate";
import { fullBrand, invalidBrand, minimalBrand } from "./fixtures";

describe("toEmailInline", () => {
  it("builds inline styles, a <style> fallback block, and a table wrapper for a full brand", () => {
    const result = toEmailInline(fullBrand);
    expect(result.inline.container).toContain("max-width:600px;");
    expect(result.inline.body).toContain(`background:${fullBrand.colors.background};`);
    expect(result.inline.heading).toContain(`color:${fullBrand.colors.primary};`);
    expect(result.styleTag).toContain("<style>");
    expect(result.styleTag).toContain("max-width: 600px");
    expect(result.table.open).toContain('role="presentation"');
    expect(result.table.open).toContain("<table");
    expect(result.table.close).toBe("</td></tr></table>");
  });

  it("falls back to the default 600px max width when layout.email is absent", () => {
    const result = toEmailInline(minimalBrand);
    expect(result.inline.container).toContain("max-width:600px;");
    expect(result.styleTag).toContain("max-width: 600px");
  });

  it("is guarded by schema validation before any transformer runs", () => {
    expect(() => validateBrand(invalidBrand)).toThrow(/failed schema validation/);
  });
});
