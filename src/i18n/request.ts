import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    // Load multiple namespaces for this locale
    const [common, about] = await Promise.all([
        import(`../../messages/${locale}/common.json`),
        import(`../../messages/${locale}/about.json`).catch(() => ({ default: {} })),
    ]);

    return {
        locale,
        messages: {
            ...common.default,
            ...(Object.keys(about.default).length > 0 ? { About: about.default } : {}),
        },
    };
});
