"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center p-6 text-center">
      <div><h1 className="text-2xl font-semibold">حدث خطأ ما · Something went wrong</h1><button onClick={reset} className="btn btn-gold mt-6">حاول مرة أخرى · Try again</button></div>
    </div>
  );
}
