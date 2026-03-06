import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "fr", "es", "de", "ar", "pt", "zh", "it", "vi", "tl", "tr", "hi", "id"],
    defaultLocale: "en",
});
