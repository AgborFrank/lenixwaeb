import Image from "next/image";
import Link from "next/link";
import { home } from "@/lib/home-styles";

interface SolutionSplitProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  imageFirst?: boolean;
  muted?: boolean;
}

export default function SolutionSplit({
  id,
  eyebrow,
  title,
  description,
  points,
  href,
  cta,
  image,
  imageAlt,
  imageFirst = true,
  muted = false,
}: SolutionSplitProps) {
  const media = (
    <div className={`${home.card} relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]`}>
      <Image src={image} alt={imageAlt} fill className={home.mediaImage} sizes="(max-width: 1024px) 100vw, 560px" />
    </div>
  );

  const copy = (
    <div>
      <p className={home.eyebrow}>{eyebrow}</p>
      <h2 className={`${home.title} mt-3 mb-6`}>{title}</h2>
      <p className={`${home.lead} mb-8 text-neutral-300`}>{description}</p>
      <ul className="space-y-4 mb-8 list-none p-0 m-0">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" aria-hidden />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className={home.btnPrimary}>
        {cta}
      </Link>
    </div>
  );

  return (
    <section id={id} className={`${home.section} ${muted ? home.sectionMuted : "bg-black"} scroll-mt-24`}>
      <div className={home.container}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={imageFirst ? undefined : "lg:order-2"}>{imageFirst ? media : copy}</div>
          <div className={imageFirst ? undefined : "lg:order-1"}>{imageFirst ? copy : media}</div>
        </div>
      </div>
    </section>
  );
}
