import type { BrandFile, FontStack } from "../types";

const DEFAULT_MARGIN = "2cm";
const DEFAULT_PAGE_SIZE = "A4";

function fontFamilyValue(font: FontStack): string {
  const stack = [font.family, ...(font.fallback ?? [])];
  return stack.map((name) => (name.includes(" ") ? `"${name}"` : name)).join(", ");
}

export function toPdfCss(brand: BrandFile): string {
  const document = brand.layout.document ?? {};
  const margins = document.margins ?? {};
  const pageSize = document.pageSize ?? DEFAULT_PAGE_SIZE;
  const top = margins.top ?? DEFAULT_MARGIN;
  const right = margins.right ?? DEFAULT_MARGIN;
  const bottom = margins.bottom ?? DEFAULT_MARGIN;
  const left = margins.left ?? DEFAULT_MARGIN;

  const fontFamily = fontFamilyValue(brand.typography.printFont);
  const { sizes } = brand.typography;

  const lines = [
    "@page {",
    `  size: ${pageSize};`,
    `  margin: ${top} ${right} ${bottom} ${left};`,
    "}",
    "",
    "body {",
    `  font-family: ${fontFamily};`,
    `  color: ${brand.colors.text};`,
    `  background: ${brand.colors.background};`,
    ...(sizes.body ? [`  font-size: ${sizes.body};`] : []),
    ...(brand.typography.lineHeight?.body !== undefined
      ? [`  line-height: ${brand.typography.lineHeight.body};`]
      : []),
    "}",
  ];

  if (sizes.h1 || sizes.h2 || sizes.h3) {
    lines.push("", "h1, h2, h3 {", `  color: ${brand.colors.primary};`);
    if (brand.typography.lineHeight?.heading !== undefined) {
      lines.push(`  line-height: ${brand.typography.lineHeight.heading};`);
    }
    lines.push("}");
    if (sizes.h1) lines.push("", `h1 { font-size: ${sizes.h1}; }`);
    if (sizes.h2) lines.push(`h2 { font-size: ${sizes.h2}; }`);
    if (sizes.h3) lines.push(`h3 { font-size: ${sizes.h3}; }`);
  }

  return lines.join("\n") + "\n";
}
