"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguagePickerProps {
  showFullName?: boolean;
  isDark?: boolean;
  menuSide?: "top" | "bottom";
}

function getFlagCode(localeCode: string) {
  switch (localeCode) {
    case "en":
      return "us";
    case "fr":
      return "fr";
    case "es":
      return "es";
    case "de":
      return "de";
    case "ar":
      return "ae";
    case "pt":
      return "pt";
    case "zh":
      return "cn";
    case "it":
      return "it";
    case "vi":
      return "vn";
    case "tl":
      return "ph";
    case "tr":
      return "tr";
    case "hi":
      return "in";
    case "id":
      return "id";
    default:
      return "us";
  }
}

export function LanguagePicker({
  showFullName = false,
  isDark = false,
  menuSide = "bottom",
}: LanguagePickerProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as (typeof routing.locales)[number] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[14px] font-medium transition-colors ${!showFullName ? "uppercase" : ""} ${
            isDark
              ? "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
              : "border-gray-200 text-white hover:bg-white/10"
          }`}
          aria-label="Change language"
        >
          <span
            className={`fi fi-${getFlagCode(locale)} fis flex h-4 w-4 items-center justify-center overflow-hidden rounded-full shadow-sm`}
            style={{ fontSize: "16px" }}
          />
          {showFullName ? t(`languages.${locale}`) : locale}
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={menuSide}
        align="end"
        className="w-56 max-h-80 overflow-y-auto border-neutral-800 bg-neutral-900 p-1 text-white shadow-lg"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-neutral-400">
          {t("languagePicker.title")}
        </DropdownMenuLabel>

        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer px-2 py-1.5 text-sm focus:bg-white/5 focus:text-white ${
              locale === loc ? "text-yellow-400" : "text-neutral-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`fi fi-${getFlagCode(loc)} fis flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm`}
                style={{ fontSize: "16px" }}
              />
              <span>{t(`languages.${loc}`)}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
