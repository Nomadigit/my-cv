import type { Brand } from "./generated/brand";

export type CssVariables = Record<string, string>;

export function brandToCssVariables(brand: Brand): CssVariables {
  return {
    "--color-primary": brand.colors.primary,
    "--color-secondary": brand.colors.secondary,
    "--color-text": brand.colors.text,
    "--color-background": brand.colors.background,
    "--font-heading": brand.fonts.heading,
    "--font-body": brand.fonts.body,
  };
}

export function cssVariablesToRootBlock(vars: CssVariables): string {
  const lines = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`);
  return `:root {\n${lines.join("\n")}\n}\n`;
}

export function brandToCssRoot(brand: Brand): string {
  return cssVariablesToRootBlock(brandToCssVariables(brand));
}
