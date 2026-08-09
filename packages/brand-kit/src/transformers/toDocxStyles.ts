import type { BrandFile } from "../types";

export interface DocxRunStyle {
  font: string;
  size: number;
  bold?: boolean;
  color: string;
}

export interface DocxStyles {
  colors: Record<string, string>;
  heading1: DocxRunStyle;
  heading2: DocxRunStyle;
  heading3: DocxRunStyle;
  body: DocxRunStyle;
  small?: DocxRunStyle;
}

function hexNoHash(color: string): string {
  return color.startsWith("#") ? color.slice(1).toUpperCase() : color.toUpperCase();
}

/** docx sizes are expressed in half-points; CSS sizes here are assumed to be px or pt. */
function toHalfPoints(size: string | undefined, fallbackPt: number): number {
  if (!size) return Math.round(fallbackPt * 2);
  const match = size.match(/^([\d.]+)\s*(px|pt)?$/);
  if (!match) return Math.round(fallbackPt * 2);
  const value = parseFloat(match[1]);
  const unit = match[2] ?? "px";
  const points = unit === "pt" ? value : value * 0.75;
  return Math.round(points * 2);
}

export function toDocxStyles(brand: BrandFile): DocxStyles {
  const colors: Record<string, string> = {
    primary: hexNoHash(brand.colors.primary),
    text: hexNoHash(brand.colors.text),
    background: hexNoHash(brand.colors.background),
  };
  if (brand.colors.secondary) colors.secondary = hexNoHash(brand.colors.secondary);
  if (brand.colors.accent) colors.accent = hexNoHash(brand.colors.accent);
  if (brand.colors.border) colors.border = hexNoHash(brand.colors.border);

  const font = brand.typography.printFont.family;
  const { sizes } = brand.typography;

  const styles: DocxStyles = {
    colors,
    heading1: { font, size: toHalfPoints(sizes.h1, 24), bold: true, color: colors.primary },
    heading2: { font, size: toHalfPoints(sizes.h2, 18), bold: true, color: colors.primary },
    heading3: { font, size: toHalfPoints(sizes.h3, 14), bold: true, color: colors.text },
    body: { font, size: toHalfPoints(sizes.body, 11), color: colors.text },
  };

  if (sizes.small) {
    styles.small = { font, size: toHalfPoints(sizes.small, 9), color: colors.text };
  }

  return styles;
}
