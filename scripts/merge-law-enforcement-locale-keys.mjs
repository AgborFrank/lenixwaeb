import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

const en = JSON.parse(
  fs.readFileSync(path.join(root, "messages/en/law-enforcement.json"), "utf8")
);

for (const locale of locales) {
  const filePath = path.join(root, `messages/${locale}/law-enforcement.json`);
  let current = {};
  if (fs.existsSync(filePath)) {
    current = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  fs.writeFileSync(filePath, `${JSON.stringify({ ...en, ...current }, null, 2)}\n`);
  console.log(`Wrote messages/${locale}/law-enforcement.json`);
}

console.log("Done.");
