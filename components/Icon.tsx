const P: Record<string, string> = {
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01",
  video: "M3 6h12v12H3zM15 10l6-3v10l-6-3",
  lip: "M12 3a9 9 0 100 18 9 9 0 000-18zM8 14c1 2 7 2 8 0M9 9.5h.01M15 9.5h.01",
  upscale: "M4 20V10h6M4 20l8-8M14 4h6v6M20 4l-8 8",
  mic: "M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3zM5 11a7 7 0 0014 0M12 18v3",
  wave: "M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0",
  assets: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  folder: "M3 6h6l2 2h10v11H3z",
  card: "M3 6h18v12H3zM3 10h18",
  gear: "M12 9a3 3 0 100 6 3 3 0 000-6zM19 12l2-1-2-4-2 1-2-1V5h-4v2l-2 1-2-1-2 4 2 1v0l-2 1 2 4 2-1 2 1v2h4v-2l2-1 2 1 2-4z",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5",
  filter: "M3 6h18M6 12h12M10 18h4",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  chev: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  up: "M12 16V5M7 10l5-5 5 5M5 19h14",
  spark: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 3v4M17 5h4",
  close: "M6 6l12 12M18 6L6 18",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  play: "M7 4v16l13-8z",
  library: "M4 4h4v16H4zM10 4h4v16h-4zM16 6l4 1-3 13-4-1z",
  tutorial: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5",
  template: "M5 3h14v18H5zM9 8h6M9 12h6",
};
export function Icon({ n, size = 18, className = "" }: { n: keyof typeof P | string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={P[n] ?? P.spark} />
    </svg>
  );
}
