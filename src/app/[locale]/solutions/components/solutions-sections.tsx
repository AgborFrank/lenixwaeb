import { getTranslations } from "next-intl/server";
import SolutionSplit from "./solution-split";
import PaymentsSection from "./payments-section";
import SecuritySection from "./security-section";

export default async function SolutionsSections() {
  const recovery = await getTranslations("Solutions.Recovery");
  const lending = await getTranslations("Solutions.Lending");

  return (
    <>
      <SolutionSplit
        id="recovery"
        eyebrow={recovery("eyebrow")}
        title={recovery("title")}
        description={recovery("description")}
        points={[
          recovery("points.chains"),
          recovery("points.evidence"),
          recovery("points.terms"),
        ]}
        href="/crypto-recovery"
        cta={recovery("cta")}
        image="/assets/img/investigate.webp"
        imageAlt={recovery("title")}
        imageFirst
        muted
      />

      <PaymentsSection />

      <SolutionSplit
        id="lending"
        eyebrow={lending("eyebrow")}
        title={lending("title")}
        description={lending("description")}
        points={[lending("points.credit"), lending("points.ltv"), lending("points.custody")]}
        href="/crypto-loan"
        cta={lending("cta")}
        image="/assets/img/BringDeFiIntelligence.webp"
        imageAlt={lending("title")}
        imageFirst={false}
        muted
      />

      <SecuritySection />
    </>
  );
}
