import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

const translationsPath = path.join(__dirname, "wallet-locale-data.json");
if (!fs.existsSync(translationsPath)) {
  console.error("Missing scripts/wallet-locale-data.json — copy EN for now");
  process.exit(1);
}

const translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));

for (const locale of locales) {
  const data = translations[locale];
  if (!data) {
    console.warn(`Missing translation for ${locale}`);
    continue;
  }
  fs.writeFileSync(
    path.join(root, `messages/${locale}/wallet.json`),
    `${JSON.stringify(data, null, 2)}\n`
  );
  console.log(`Updated messages/${locale}/wallet.json`);
}

console.log("Wallet locale patch complete.");
