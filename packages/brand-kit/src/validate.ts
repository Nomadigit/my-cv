import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import schema from "../schema/brand.schema.json";
import type { BrandFile } from "./types";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let validator: ValidateFunction | undefined;

export interface ValidationResult {
  valid: boolean;
  errors: string;
}

export function checkBrand(data: unknown): ValidationResult {
  validator ??= ajv.compile(schema);
  const valid = validator(data);
  if (valid) {
    return { valid: true, errors: "" };
  }
  const errors = (validator.errors ?? [])
    .map((e) => `  - ${e.instancePath || "/"} ${e.message}`)
    .join("\n");
  return { valid: false, errors: `brand.json failed schema validation:\n${errors}` };
}

export function validateBrand(data: unknown): BrandFile {
  const result = checkBrand(data);
  if (!result.valid) {
    throw new Error(result.errors);
  }
  return data as BrandFile;
}
