import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

function deepMergeMissing(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMergeMissing(out[key], value);
    } else if (!(key in out)) {
      out[key] = value;
    }
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(root, "messages/en/wallet.json"), "utf8"));

for (const locale of locales) {
  const filePath = path.join(root, `messages/${locale}/wallet.json`);
  const current = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const merged = deepMergeMissing(current, en);
  fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Merged missing keys into messages/${locale}/wallet.json`);
}

console.log("Done. New keys fall back to EN until translated.");
