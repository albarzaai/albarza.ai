import { planName } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// Golden is gold and Diamond is diamond blue wherever the plan name appears (the gradients read on both the cream site and the dark app).
const tone: Record<string, string> = {
  creator: "bg-gradient-to-r from-[#b8892f] via-[#f0d27a] to-[#b8892f] bg-clip-text text-transparent",
  studio: "bg-gradient-to-r from-[#2aa3d6] via-[#8fe0ff] to-[#5b8cff] bg-clip-text text-transparent",
};

export const planAccent: Record<string, string> = { creator: "!border-[#d9b25f]", studio: "!border-[#5fc6e8]" };

export function PlanName({ id, locale, className = "" }: { id: string; locale: Locale; className?: string }) {
  const label = planName[id]?.[locale] ?? id;
  return <span className={`${tone[id] ?? ""} ${className}`}>{label}</span>;
}
