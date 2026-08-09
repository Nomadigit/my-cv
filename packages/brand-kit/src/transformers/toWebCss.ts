import type { BrandFile, FontStack } from "../types";

export type CssVariables = Record<string, string>;

function fontFamilyValue(font: FontStack): string {
  const stack = [font.family, ...(font.fallback ?? [])];
  return stack.map((name) => (name.includes(" ") ? `"${name}"` : name)).join(", ");
}

export function brandToCssVariables(brand: BrandFile): CssVariables {
  const vars: CssVariables = {
    "--color-primary": brand.colors.primary,
    "--color-text": brand.colors.text,
    "--color-background": brand.colors.background,
    "--font-web-family": fontFamilyValue(brand.typography.webFont),
    "--font-weight-regular": String(brand.typography.weights.regular ?? 400),
    "--font-weight-medium": String(brand.typography.weights.medium ?? 500),
    "--font-weight-bold": String(brand.typography.weights.bold ?? 700),
  };

  if (brand.colors.secondary) vars["--color-secondary"] = brand.colors.secondary;
  if (brand.colors.accent) vars["--color-accent"] = brand.colors.accent;
  if (brand.colors.border) vars["--color-border"] = brand.colors.border;
  if (brand.colors.semantic) {
    for (const [key, value] of Object.entries(brand.colors.semantic)) {
      if (typeof value === "string") vars[`--color-${key}`] = value;
    }
  }

  for (const [key, value] of Object.entries(brand.typography.sizes)) {
    vars[`--font-size-${key}`] = value;
  }

  if (brand.typography.lineHeight) {
    for (const [key, value] of Object.entries(brand.typography.lineHeight)) {
      vars[`--line-height-${key}`] = String(value);
    }
  }

  if (brand.spacing.unit !== undefined) vars["--spacing-unit"] = `${brand.spacing.unit}px`;
  if (brand.spacing.borderRadius !== undefined) vars["--radius"] = `${brand.spacing.borderRadius}px`;

  return vars;
}

function darkModeCssVariables(brand: BrandFile): CssVariables {
  const darkMode = brand.colors.darkMode;
  if (!darkMode) return {};

  const vars: CssVariables = {};
  if (darkMode.primary) vars["--color-primary"] = darkMode.primary;
  if (darkMode.secondary) vars["--color-secondary"] = darkMode.secondary;
  if (darkMode.accent) vars["--color-accent"] = darkMode.accent;
  if (darkMode.text) vars["--color-text"] = darkMode.text;
  if (darkMode.background) vars["--color-background"] = darkMode.background;
  if (darkMode.border) vars["--color-border"] = darkMode.border;
  return vars;
}

export function cssVariablesToRootBlock(vars: CssVariables, selector = ":root"): string {
  const lines = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

export function toWebCss(brand: BrandFile): string {
  const root = cssVariablesToRootBlock(brandToCssVariables(brand));
  const darkVars = darkModeCssVariables(brand);

  if (Object.keys(darkVars).length === 0) {
    return root;
  }

  const darkBlock = cssVariablesToRootBlock(darkVars);
  const indented = darkBlock
    .trimEnd()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

  return `${root}\n@media (prefers-color-scheme: dark) {\n${indented}\n}\n`;
}
