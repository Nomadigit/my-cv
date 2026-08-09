const path = require("path");
const { loadResume, loadBrand } = require(path.join(__dirname, "..", "dist", "src", "index.js"));

try {
  loadResume();
  loadBrand();
  console.log("resume.json and brand.json are valid.");
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
