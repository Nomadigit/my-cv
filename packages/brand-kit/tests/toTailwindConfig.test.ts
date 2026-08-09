import { describe, expect, it } from "vitest";
import { toTailwindConfig } from "../src/transformers/toTailwindConfig";
import { validateBrand } from "../src/validate";
import { fullBrand, invalidBrand, minimalBrand } from "./fixtures";

describe("toTailwindConfig", () => {
  it("maps colors, font family, sizes, weights, and radius for a full brand", () => {
    const config = toTailwindConfig(fullBrand);
    expect(config.theme.extend.colors).toMatchObject({
      primary: "#1a73e8",
      secondary: "#34a853",
      accent: "#fbbc04",
      success: "#188038",
      text: "#111111",
      background: "#ffffff",
      border: "#e0e0e0",
    });
    expect(config.theme.extend.fontFamily.web).toEqual(["Inter", "Helvetica Neue", "sans-serif"]);
    expect(config.theme.extend.fontSize).toMatchObject({ h1: "32px", body: "16px" });
    expect(config.theme.extend.fontWeight).toMatchObject({ regular: "400", bold: "700" });
    expect(config.theme.extend.borderRadius).toEqual({ DEFAULT: "6px" });
  });

  it("omits optional theme keys that have no source data on a minimal brand", () => {
    const config = toTailwindConfig(minimalBrand);
    expect(config.theme.extend.colors).toEqual({
      primary: "#1a73e8",
      text: "#111111",
      background: "#ffffff",
    });
    expect(config.theme.extend.borderRadius).toBeUndefined();
  });

  it("never receives invalid brand data because validation runs first", () => {
    expect(() => validateBrand(invalidBrand)).toThrow(/failed schema validation/);
  });
});
