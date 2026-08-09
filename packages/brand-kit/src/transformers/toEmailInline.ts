import type { BrandFile } from "../types";

const DEFAULT_MAX_WIDTH = "600px";
const DEFAULT_PADDING = "16px";

export interface EmailInlineStyles {
  body: string;
  container: string;
  heading: string;
  text: string;
}

export interface EmailTableWrapper {
  open: string;
  close: string;
}

export interface EmailInlineOutput {
  inline: EmailInlineStyles;
  styleTag: string;
  table: EmailTableWrapper;
}

function styleString(declarations: Record<string, string | undefined>): string {
  return Object.entries(declarations)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([prop, value]) => `${prop}:${value};`)
    .join("");
}

export function toEmailInline(brand: BrandFile): EmailInlineOutput {
  const email = brand.layout.email ?? {};
  const maxWidth = email.maxWidth ?? DEFAULT_MAX_WIDTH;
  const padding = email.contentPadding ?? DEFAULT_PADDING;
  const fontFamily = [brand.typography.webFont.family, ...(brand.typography.webFont.fallback ?? [])].join(
    ", "
  );

  const inline: EmailInlineStyles = {
    body: styleString({
      margin: "0",
      padding: "0",
      background: brand.colors.background,
      "font-family": fontFamily,
    }),
    container: styleString({
      width: "100%",
      "max-width": maxWidth,
      margin: "0 auto",
      padding,
      background: brand.colors.background,
    }),
    heading: styleString({
      "font-family": fontFamily,
      color: brand.colors.primary,
      "font-size": brand.typography.sizes.h2 ?? brand.typography.sizes.h1,
      "font-weight": brand.typography.weights.bold !== undefined ? String(brand.typography.weights.bold) : undefined,
      margin: "0 0 12px 0",
    }),
    text: styleString({
      "font-family": fontFamily,
      color: brand.colors.text,
      "font-size": brand.typography.sizes.body,
      "line-height": brand.typography.lineHeight?.body !== undefined ? String(brand.typography.lineHeight.body) : undefined,
      margin: "0 0 12px 0",
    }),
  };

  const styleTag = [
    "<style>",
    `  body { margin: 0; padding: 0; background: ${brand.colors.background}; }`,
    `  .email-container { width: 100% !important; max-width: ${maxWidth}; margin: 0 auto; }`,
    `  @media only screen and (max-width: ${maxWidth}) {`,
    "    .email-container { width: 100% !important; }",
    "  }",
    "</style>",
  ].join("\n");

  const table: EmailTableWrapper = {
    open: `<table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="${inline.container}"><tr><td>`,
    close: "</td></tr></table>",
  };

  return { inline, styleTag, table };
}
