import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    // Load multiple namespaces for this locale
    const [common, settings, about, contact, solutions, walletDecryption, cryptoAssetId, walletPage, financePage, bankingFinance, blockchainForensics, threatIntelligence, complianceInvestigations, deFiCompliance, lawEnforcement, onboardingPage, authPage] = await Promise.all([
        import(`../../messages/${locale}/common.json`),
        import(`../../messages/${locale}/settings.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/about.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/contact.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/solutions.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/wallet-decryption.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/crypto-asset-identification.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/wallet.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/finance.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/banking-finance.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/blockchain-forensics.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/threat-intelligence.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/compliance-investigations.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/defi-compliance.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/law-enforcement.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/onboarding.json`).catch(() => ({ default: {} })),
        import(`../../messages/${locale}/auth.json`).catch(() => ({ default: {} })),
    ]);

    const settingsMessages =
        Object.keys(settings.default).length > 0
            ? settings.default
            : locale === "en"
              ? {}
              : (await import("../../messages/en/settings.json")).default;

    const aboutMessages =
        Object.keys(about.default).length > 0
            ? about.default
            : locale === "en"
              ? {}
              : (await import("../../messages/en/about.json")).default;

    const contactMessages =
        Object.keys(contact.default).length > 0
            ? contact.default
            : locale === "en"
              ? {}
              : (await import("../../messages/en/contact.json")).default;

    const solutionsMessages =
        Object.keys(solutions.default).length > 0
            ? solutions.default
            : locale === "en"
              ? {}
              : (await import("../../messages/en/solutions.json")).default;

    return {
        locale,
        messages: {
            ...common.default,
            ...(Object.keys(settingsMessages).length > 0 ? { Settings: settingsMessages } : {}),
            ...(Object.keys(aboutMessages).length > 0 ? { About: aboutMessages } : {}),
            ...(Object.keys(contactMessages).length > 0 ? { Contact: contactMessages } : {}),
            ...(Object.keys(solutionsMessages).length > 0 ? { Solutions: solutionsMessages } : {}),
            ...(Object.keys(walletDecryption.default).length > 0 ? { WalletDecryption: walletDecryption.default } : {}),
            ...(Object.keys(cryptoAssetId.default).length > 0 ? { CryptoAssetIdentification: cryptoAssetId.default } : {}),
            ...(Object.keys(walletPage.default).length > 0 ? { WalletPage: walletPage.default } : {}),
            ...(Object.keys(financePage.default).length > 0 ? { FinancePage: financePage.default } : {}),
            ...(Object.keys(bankingFinance.default).length > 0 ? { BankingFinance: bankingFinance.default } : {}),
            ...(Object.keys(blockchainForensics.default).length > 0 ? { BlockchainForensics: blockchainForensics.default } : {}),
            ...(Object.keys(threatIntelligence.default).length > 0 ? { ThreatIntelligence: threatIntelligence.default } : {}),
            ...(Object.keys(complianceInvestigations.default).length > 0 ? { ComplianceInvestigations: complianceInvestigations.default } : {}),
            ...(Object.keys(deFiCompliance.default).length > 0 ? { DeFiCompliance: deFiCompliance.default } : {}),
            ...(Object.keys(lawEnforcement.default).length > 0 ? { LawEnforcement: lawEnforcement.default } : {}),
            ...(Object.keys(onboardingPage.default).length > 0 ? { Onboarding: onboardingPage.default } : {}),
            ...(Object.keys(authPage.default).length > 0 ? { Auth: authPage.default } : {}),
        },
    };
});
