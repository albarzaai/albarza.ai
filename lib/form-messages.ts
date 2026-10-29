const MSG: Record<string, { ar: string; en: string }> = {
  bad_credentials: { ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", en: "Incorrect email or password." },
  locked: { ar: "تم قفل الحساب مؤقتاً بسبب محاولات كثيرة. حاول بعد 15 دقيقة.", en: "Too many attempts. The account is locked for 15 minutes." },
  rate_limited: { ar: "طلبات كثيرة. انتظر دقيقة ثم حاول مجدداً.", en: "Too many requests. Wait a minute and try again." },
  unverified: { ar: "فعّل بريدك الإلكتروني أولاً. راجع صندوق الوارد.", en: "Please confirm your email first. Check your inbox." },
  unavailable: { ar: "الخدمة غير متاحة حالياً. حاول لاحقاً.", en: "Service is unavailable right now. Please try again later." },
  captcha: { ar: "تعذّر التحقق الأمني. أعد المحاولة.", en: "Security check failed. Please retry." },
  google_unavailable: { ar: "تسجيل الدخول عبر Google غير متاح حالياً.", en: "Google sign-in is not available right now." },
  google_cancelled: { ar: "تم إلغاء تسجيل الدخول عبر Google.", en: "Google sign-in was cancelled." },
  google_failed: { ar: "تعذّر تسجيل الدخول عبر Google. حاول مجدداً.", en: "Google sign-in failed. Please try again." },
  google_unverified: { ar: "بريد Google غير مؤكد.", en: "Your Google email is not verified." },
  invalid_token: { ar: "الرابط غير صالح أو منتهي.", en: "This link is invalid or has expired." },
};
export const formMessage = (m: string | undefined, locale: "ar" | "en") => (m && MSG[m] ? MSG[m][locale] : null);
