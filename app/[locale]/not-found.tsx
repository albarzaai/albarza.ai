import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center text-center">
      <div>
        <p className="text-7xl font-bold">404</p>
        <h1 className="mt-4 text-3xl font-semibold">الصفحة غير موجودة · Page not found</h1>
        <Link href="/ar" className="btn btn-gold mt-8">العودة للرئيسية</Link>
      </div>
    </main>
  );
}
