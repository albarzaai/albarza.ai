type Env = { RESEND_API_KEY?: string; EMAIL_FROM?: string };

const T = {
  verify: { ar: ["أكّد بريدك الإلكتروني", "مرحباً بك في البرزة. اضغط على الزر لتأكيد بريدك الإلكتروني.", "تأكيد البريد"], en: ["Confirm your email", "Welcome to Albarza. Click the button to confirm your email address.", "Confirm email"] },
  reset: { ar: ["إعادة تعيين كلمة المرور", "طلبت إعادة تعيين كلمة المرور. الرابط صالح لمدة ساعة. إن لم تطلب ذلك فتجاهل هذه الرسالة.", "إعادة التعيين"], en: ["Reset your password", "You asked to reset your password. The link works for one hour. If this wasn't you, ignore this email.", "Reset password"] },
  change: { ar: ["تأكيد البريد الجديد", "اضغط على الزر لتأكيد أن هذا هو بريدك الجديد في البرزة.", "تأكيد"], en: ["Confirm your new email", "Click the button to confirm this is your new email on Albarza.", "Confirm"] },
} as const;

export function tpl(kind: keyof typeof T, locale: string, url: string): [string, string] {
  const [subject, text, cta] = T[kind][locale === "en" ? "en" : "ar"];
  const dir = locale === "en" ? "ltr" : "rtl";
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
  return [subject, `<div dir="${dir}" style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;color:#16120a"><h2>${esc(subject)}</h2><p>${esc(text)}</p><p><a href="${esc(url)}" style="display:inline-block;background:#bd9b5f;color:#16120a;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">${esc(cta)}</a></p><p style="color:#6a5e46;font-size:12px">${esc(url)}</p></div>`];
}

export async function sendEmail(env: Env, to: string, subject: string, html: string) {
  if (!env.RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM ?? "Albarza <no-reply@albarza.ai>", to: [to], subject, html }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
}
