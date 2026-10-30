import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { dirOf, isLocale, locales } from "@/lib/i18n";
import { t } from "@/lib/dict";
import { ErrorBeacon } from "@/components/ErrorBeacon";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "block", preload: true });
const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-kufi", display: "block", preload: true });

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);
  return { title: `${d.brand} — ${d.heroTitle}`, description: d.heroSub, icons: { icon: "/brand/favicon.svg" } };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${inter.variable} ${kufi.variable}`}>
      <body>{children}<ErrorBeacon /></body>
    </html>
  );
}
