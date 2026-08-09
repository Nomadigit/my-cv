import { describe, expect, it } from "vitest";
import { toDocxStyles } from "../src/transformers/toDocxStyles";
import { validateBrand } from "../src/validate";
import { fullBrand, invalidBrand, minimalBrand } from "./fixtures";

describe("toDocxStyles", () => {
  it("converts hex colors (without '#') and px sizes to half-points for a full brand", () => {
    const styles = toDocxStyles(fullBrand);
    expect(styles.colors.primary).toBe("1A73E8");
    expect(styles.colors.background).toBe("FFFFFF");
    expect(styles.heading1.font).toBe("Georgia");
    // 32px -> 24pt -> 48 half-points
    expect(styles.heading1.size).toBe(48);
    expect(styles.heading1.bold).toBe(true);
    // 16px -> 12pt -> 24 half-points
    expect(styles.body.size).toBe(24);
    expect(styles.small).toBeDefined();
  });

  it("falls back to default sizes and omits `small` when sizes are missing", () => {
    const styles = toDocxStyles(minimalBrand);
    expect(styles.heading1.size).toBe(48); // fallback 24pt
    expect(styles.small).toBeUndefined();
  });

  it("is never called with invalid brand data because validation runs first", () => {
    expect(() => validateBrand(invalidBrand)).toThrow(/failed schema validation/);
  });
});
