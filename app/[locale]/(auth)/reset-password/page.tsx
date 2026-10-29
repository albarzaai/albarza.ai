import { AuthFrame } from "@/components/AuthFrame";
import { ResetForm } from "@/components/Forms";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const locale = (await params).locale as Locale;
  const token = (await searchParams).token ?? "";
  const valid = /^[A-Za-z0-9_-]{32,64}$/.test(token);
  return (
    <AuthFrame locale={locale} art={5}>
      {valid ? <ResetForm locale={locale} token={token} /> : <p className="text-center text-sm">{locale === "ar" ? "رابط إعادة التعيين غير صالح. اطلب رابطاً جديداً." : "This reset link is not valid. Request a new one."}</p>}
    </AuthFrame>
  );
}
