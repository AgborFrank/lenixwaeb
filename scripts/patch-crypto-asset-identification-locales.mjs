import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

const translationsPath = path.join(__dirname, "crypto-asset-identification-locale-data.json");
const translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));

for (const locale of locales) {
  const data = translations[locale];
  if (!data) {
    console.warn(`Missing translation for ${locale}`);
    continue;
  }
  const outPath = path.join(root, `messages/${locale}/crypto-asset-identification.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated messages/${locale}/crypto-asset-identification.json`);
}

console.log("Crypto asset identification locale patch complete.");
