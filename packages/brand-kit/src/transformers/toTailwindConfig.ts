import type { BrandFile } from "../types";

export interface TailwindThemeExtend {
  colors: Record<string, string>;
  fontFamily: Record<string, string[]>;
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, string>;
  lineHeight?: Record<string, string>;
  borderRadius?: Record<string, string>;
}

export interface TailwindConfigFragment {
  theme: { extend: TailwindThemeExtend };
}

export function toTailwindConfig(brand: BrandFile): TailwindConfigFragment {
  const colors: Record<string, string> = {
    primary: brand.colors.primary,
    text: brand.colors.text,
    background: brand.colors.background,
  };
  if (brand.colors.secondary) colors.secondary = brand.colors.secondary;
  if (brand.colors.accent) colors.accent = brand.colors.accent;
  if (brand.colors.border) colors.border = brand.colors.border;
  if (brand.colors.semantic) {
    for (const [key, value] of Object.entries(brand.colors.semantic)) {
      if (typeof value === "string") colors[key] = value;
    }
  }

  const extend: TailwindThemeExtend = {
    colors,
    fontFamily: {
      web: [brand.typography.webFont.family, ...(brand.typography.webFont.fallback ?? [])],
    },
  };

  if (Object.keys(brand.typography.sizes).length > 0) {
    extend.fontSize = { ...brand.typography.sizes };
  }
  if (Object.keys(brand.typography.weights).length > 0) {
    extend.fontWeight = Object.fromEntries(
      Object.entries(brand.typography.weights).map(([key, value]) => [key, String(value)])
    );
  }
  if (brand.typography.lineHeight && Object.keys(brand.typography.lineHeight).length > 0) {
    extend.lineHeight = Object.fromEntries(
      Object.entries(brand.typography.lineHeight).map(([key, value]) => [key, String(value)])
    );
  }
  if (brand.spacing.borderRadius !== undefined) {
    extend.borderRadius = { DEFAULT: `${brand.spacing.borderRadius}px` };
  }

  return { theme: { extend } };
}
