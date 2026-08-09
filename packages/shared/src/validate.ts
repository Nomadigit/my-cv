import fs from "fs";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { RESUME_SCHEMA_PATH } from "./paths";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function compile(schemaPath: string): ValidateFunction {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  return ajv.compile(schema);
}

let resumeValidator: ValidateFunction | undefined;

export interface ValidationResult {
  valid: boolean;
  errors: string;
}

function runValidation(validator: ValidateFunction, data: unknown, label: string): ValidationResult {
  const valid = validator(data);
  if (valid) {
    return { valid: true, errors: "" };
  }
  const errors = (validator.errors ?? [])
    .map((e) => `  - ${e.instancePath || "/"} ${e.message}`)
    .join("\n");
  return { valid: false, errors: `${label} failed schema validation:\n${errors}` };
}

export function validateResume(data: unknown): ValidationResult {
  resumeValidator ??= compile(RESUME_SCHEMA_PATH);
  return runValidation(resumeValidator, data, "resume.json");
}

export function assertValidResume(data: unknown): void {
  const result = validateResume(data);
  if (!result.valid) {
    throw new Error(result.errors);
  }
}
