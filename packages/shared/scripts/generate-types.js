const path = require("path");
const fs = require("fs");

const DATA_SCHEMA_DIR = path.resolve(__dirname, "../../../data/schema");
const OUT_DIR = path.resolve(__dirname, "../src/generated");

async function main() {
  const { compileFromFile } = await import("json-schema-to-typescript");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const resumeTs = await compileFromFile(
    path.join(DATA_SCHEMA_DIR, "resume.schema.json"),
    { cwd: DATA_SCHEMA_DIR, style: { singleQuote: true } }
  );
  fs.writeFileSync(path.join(OUT_DIR, "resume.ts"), resumeTs);

  const brandTs = await compileFromFile(
    path.join(DATA_SCHEMA_DIR, "brand.schema.json"),
    { cwd: DATA_SCHEMA_DIR, style: { singleQuote: true } }
  );
  fs.writeFileSync(path.join(OUT_DIR, "brand.ts"), brandTs);

  console.log("Generated types in", OUT_DIR);
}

main().catch((err) => {
  console.error("Failed to generate types:", err);
  process.exit(1);
});
