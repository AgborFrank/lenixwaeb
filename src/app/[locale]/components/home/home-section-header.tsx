import { home } from "@/lib/home-styles";

interface HomeSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: HomeSectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <header className={`mb-12 lg:mb-14 max-w-3xl ${isCenter ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? <p className={`${home.eyebrow} mb-3`}>{eyebrow}</p> : null}
      <h2 className={isCenter ? home.titleCenter : home.title}>{title}</h2>
      {description ? (
        <p className={`${home.lead} mt-4 ${isCenter ? "mx-auto" : ""}`}>{description}</p>
      ) : null}
    </header>
  );
}
