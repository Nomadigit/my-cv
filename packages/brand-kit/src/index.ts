export { validateBrand, checkBrand } from "./validate";
export type { ValidationResult } from "./validate";
export type { BrandFile, ColorValue, FontStack } from "./types";

export { toWebCss, brandToCssVariables, cssVariablesToRootBlock } from "./transformers/toWebCss";
export type { CssVariables } from "./transformers/toWebCss";

export { toTailwindConfig } from "./transformers/toTailwindConfig";
export type { TailwindConfigFragment, TailwindThemeExtend } from "./transformers/toTailwindConfig";

export { toDocxStyles } from "./transformers/toDocxStyles";
export type { DocxStyles, DocxRunStyle } from "./transformers/toDocxStyles";

export { toPdfCss } from "./transformers/toPdfCss";

export { toEmailInline } from "./transformers/toEmailInline";
export type { EmailInlineOutput, EmailInlineStyles, EmailTableWrapper } from "./transformers/toEmailInline";
