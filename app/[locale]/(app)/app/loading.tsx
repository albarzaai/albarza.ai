export default function Loading() {
  return (
    <div className="p-5 md:p-8" aria-busy="true">
      <div className="skeleton mb-6 h-8 w-48 rounded-xl" />
      <div className="columns-2 gap-3 md:columns-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className={`skeleton mb-3 rounded-2xl ${i % 3 === 0 ? "h-72" : "h-44"}`} />)}</div>
    </div>
  );
}
