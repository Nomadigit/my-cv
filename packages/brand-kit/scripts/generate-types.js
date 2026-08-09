const path = require("path");
const fs = require("fs");

const SCHEMA_DIR = path.resolve(__dirname, "../schema");
const OUT_DIR = path.resolve(__dirname, "../src/generated");

async function main() {
  const { compileFromFile } = await import("json-schema-to-typescript");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const brandTs = await compileFromFile(path.join(SCHEMA_DIR, "brand.schema.json"), {
    cwd: SCHEMA_DIR,
    style: { singleQuote: true },
  });
  fs.writeFileSync(path.join(OUT_DIR, "brand.ts"), brandTs);

  console.log("Generated types in", OUT_DIR);
}

main().catch((err) => {
  console.error("Failed to generate types:", err);
  process.exit(1);
});
