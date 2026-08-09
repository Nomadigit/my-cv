import { describe, expect, it } from "vitest";
import exampleBrand from "../examples/acme-brand.json";
import { validateBrand } from "../src/validate";
import { toDocxStyles } from "../src/transformers/toDocxStyles";
import { toEmailInline } from "../src/transformers/toEmailInline";
import { toPdfCss } from "../src/transformers/toPdfCss";
import { toTailwindConfig } from "../src/transformers/toTailwindConfig";
import { toWebCss } from "../src/transformers/toWebCss";

describe("examples/acme-brand.json", () => {
  it("validates against the schema and runs cleanly through every transformer", () => {
    const brand = validateBrand(exampleBrand);
    expect(() => toWebCss(brand)).not.toThrow();
    expect(() => toTailwindConfig(brand)).not.toThrow();
    expect(() => toDocxStyles(brand)).not.toThrow();
    expect(() => toPdfCss(brand)).not.toThrow();
    expect(() => toEmailInline(brand)).not.toThrow();
  });
});
