"use client";

import { usePathname } from "next/navigation";
import { FeedSkeleton } from "@/components/Feed";

const Bar = ({ className }: { className: string }) => <div className={`skeleton ${className}`} />;

// Mirrors app/[locale]/(app)/app/page.tsx element for element (same wrappers, spacing, grid columns, aspect ratios and text line heights).
const Banner = ({ buttons = 1 }: { buttons?: number }) => (
  <section className="relative mt-5 flex min-h-[320px] items-end overflow-hidden rounded-3xl border border-white/10 md:min-h-[366px]">
    <div className="skeleton absolute inset-0" />
    <div className="relative flex w-full flex-wrap items-end justify-between gap-4 p-6 md:p-[60px]">
      <div>
        <Bar className="h-6 w-20 rounded-full" />
        <Bar className="mt-3 h-9 w-72 max-w-full rounded-lg md:h-10" />
        <Bar className="mt-2 h-7 w-80 max-w-full rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        {Array.from({ length: buttons }, (_, i) => <Bar key={i} className="h-10 w-28 rounded-full" />)}
        <Bar className="size-9 rounded-full" />
      </div>
    </div>
  </section>
);
const Cards = ({ count, cols, desc = true }: { count: number; cols: string; desc?: boolean }) => (
  <div className={`mt-5 grid gap-4 ${cols}`}>
    {Array.from({ length: count }, (_, i) => (
      <article key={i}>
        <Bar className="aspect-[16/9] w-full rounded-xl border border-white/10" />
        <Bar className="mt-3 h-6 w-3/4 rounded-md" />
        {desc && <Bar className="mt-0 h-5 w-full rounded-md" />}
      </article>
    ))}
  </div>
);

function HomeSkeleton() {
  return (
    <div aria-busy="true">
      <header className="flex h-[76px] items-center px-5 md:px-8"><Bar className="h-6 w-16 rounded-md" /></header>
      <main className="mx-auto max-w-[1100px] px-5 pb-16 md:px-4">
        <Banner />
        <Cards count={5} cols="grid-cols-2 md:grid-cols-5" />
        <Banner />
        <Cards count={3} cols="grid-cols-1 md:grid-cols-3" />
        <Banner />
        <Cards count={3} cols="grid-cols-1 md:grid-cols-3" />
        <Banner buttons={2} />
        <Cards count={4} cols="grid-cols-2 md:grid-cols-4" desc={false} />
      </main>
    </div>
  );
}

export default function Loading() {
  const path = usePathname();
  if (/^\/(ar|en)\/app\/?$/.test(path)) return <HomeSkeleton />;
  const four = /\/app\/(reshoot|video)/.test(path);
  return (
    <div aria-busy="true">
      <header className="flex h-[76px] items-center px-5 md:px-8"><Bar className="h-6 w-24 rounded-md" /></header>
      <main className="px-5 pb-72 md:px-8"><FeedSkeleton max={four ? 4 : 5} /></main>
    </div>
  );
}
