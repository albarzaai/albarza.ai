// Placeholder shown until the first page arrives. Column count follows the same breakpoints as the real grid through CSS only,
// so the first paint is already correct on every screen (no JS-driven switch, no jump).
export function FeedSkeleton({ max = 5, row = false }: { max?: 4 | 5; row?: boolean }) {
  const cell = (i: number) => <div key={i} className={`skeleton w-full rounded-2xl ${i % 3 !== 1 ? "aspect-[3/4.2]" : "aspect-[4/3]"}`} />;
  if (row) return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton aspect-video rounded-2xl" />)}</div>;
  const block = (n: number, cls: string) => (
    <div className={`items-start gap-3 ${cls}`} aria-busy="true">
      {Array.from({ length: n }, (_, c) => <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">{Array.from({ length: 3 }, (_, r) => cell(r * n + c))}</div>)}
    </div>
  );
  return <>{block(2, "flex md:hidden")}{block(3, "hidden md:flex xl:hidden")}{block(max, "hidden xl:flex")}</>;
}
