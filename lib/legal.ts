import type { LegalSection } from "@/components/LegalPage";
const s = (har: string, hen: string, par: string, pen: string): LegalSection => ({ h: { ar: har, en: hen }, p: { ar: par, en: pen } });

export const terms: LegalSection[] = [
  s("القبول والأهلية", "Acceptance and eligibility", "باستخدامك البرزة فإنك توافق على هذه الشروط. يجب ألا يقل عمرك عن ١٨ عاماً أو أن تملك موافقة ولي الأمر.", "By using Albarza you agree to these terms. You must be 18 or have guardian consent."),
  s("الحساب والأمان", "Account and security", "أنت مسؤول عن سرية بيانات دخولك وعن كل نشاط يتم عبر حسابك.", "You are responsible for your credentials and all activity under your account."),
  s("الاستخدام المقبول", "Acceptable use", "يُحظر إنشاء محتوى مخالف للقوانين السارية في دولة الإمارات، ومنه المحتوى المسيء أو المضلل أو المنتهك للخصوصية أو حقوق الملكية الفكرية، أو انتحال شخصيات حقيقية.", "Content that violates UAE law is prohibited, including abusive, misleading or privacy- or IP-infringing content, and impersonation of real people."),
  s("الأرصدة والمدفوعات", "Credits and payments", "تُحتسب الأرصدة عند كل عملية توليد وتُعرض التكلفة قبل التأكيد. الأسعار بالدرهم الإماراتي وتشمل ضريبة القيمة المضافة ٥٪.", "Credits are consumed per generation and shown before you confirm. Prices are in AED and include 5% VAT."),
  s("ملكية المحتوى", "Content ownership", "تحتفظ بحقوقك على ما تنشئه، وتمنحنا ترخيصاً محدوداً لتشغيل الخدمة وتقديمها لك فقط.", "You keep rights to what you create and grant us a limited licence solely to operate the service."),
  s("وسم المحتوى المُولَّد", "Labelling AI content", "قد يُشترط وسم المحتوى المُولَّد بالذكاء الاصطناعي عند نشره إعلانياً وفق الأنظمة المعمول بها.", "AI-generated content may need to be labelled when published as advertising under applicable rules."),
  s("إنهاء الخدمة", "Termination", "يجوز لنا تعليق الحساب عند مخالفة الشروط، ويمكنك حذف حسابك في أي وقت من الإعدادات.", "We may suspend accounts that breach these terms; you can delete your account anytime in Settings."),
  s("القانون الواجب التطبيق", "Governing law", "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة وتختص محاكمها بنظر أي نزاع.", "These terms are governed by the laws of the UAE and its courts have jurisdiction."),
];
export const privacy: LegalSection[] = [
  s("من نحن", "Who we are", "البرزة هي المتحكم في بياناتك الشخصية وفق المرسوم بقانون اتحادي رقم ٤٥ لسنة ٢٠٢١.", "Albarza is the controller of your personal data under Federal Decree-Law No. 45 of 2021."),
  s("البيانات التي نجمعها", "Data we collect", "الاسم والبريد الإلكتروني وبيانات الدخول والأوصاف والملفات التي ترفعها والمحتوى المُولَّد وبيانات الاستخدام الفنية.", "Name, email, credentials, prompts, uploaded files, generated content and technical usage data."),
  s("أساس المعالجة والغرض", "Lawful basis and purpose", "نعالج بياناتك لتقديم الخدمة وتنفيذ العقد، ولأمن المنصة، وبموافقتك للرسائل التسويقية.", "We process data to deliver the service, for platform security, and with your consent for marketing."),
  s("التدريب على بياناتك", "Training on your data", "لا نستخدم أوصافك أو ملفاتك أو مخرجاتك لتدريب النماذج.", "We do not use your prompts, files or outputs to train models."),
  s("المشاركة والنقل خارج الدولة", "Sharing and cross-border transfers", "نشارك البيانات مع مزودي النماذج والاستضافة والدفع بالقدر اللازم وبضمانات تعاقدية، وعند النقل خارج الدولة نلتزم بمتطلبات القانون.", "We share data with model, hosting and payment providers as needed under contractual safeguards, and meet legal requirements for transfers outside the UAE."),
  s("الاحتفاظ بالبيانات", "Retention", "نحتفظ بالبيانات ما دام حسابك نشطاً، ونحذفها خلال مدة معقولة بعد حذف الحساب إلا ما يلزم قانوناً.", "We keep data while your account is active and delete it within a reasonable period after deletion, except where the law requires otherwise."),
  s("حقوقك", "Your rights", "لك حق الوصول والتصحيح والنقل والحذف والاعتراض وسحب الموافقة، من الإعدادات أو عبر التواصل معنا.", "You may access, correct, port, delete, object and withdraw consent in Settings or by contacting us."),
  s("الأمان", "Security", "نستخدم التشفير أثناء النقل والتخزين وضوابط وصول صارمة ومراجعات أمنية دورية.", "We use encryption in transit and at rest, strict access controls and regular security reviews."),
];
export const refund: LegalSection[] = [
  s("الاشتراكات", "Subscriptions", "يمكن إلغاء الاشتراك في أي وقت ويستمر حتى نهاية فترة الفوترة.", "You can cancel anytime; the plan stays active until the end of the billing period."),
  s("الأرصدة", "Credits", "الأرصدة غير المستخدمة قابلة للاسترجاع خلال ١٤ يوماً من الشراء. لا تُسترجع الأرصدة المستهلكة إلا عند فشل التوليد.", "Unused credits are refundable within 14 days of purchase. Consumed credits are refunded only when a generation fails."),
  s("كيفية الطلب", "How to request", "تواصل معنا عبر صفحة الاتصال وسنرد خلال يوم عمل.", "Contact us via the contact page and we reply within a business day."),
];
export const cookies: LegalSection[] = [
  s("ما هي ملفات الارتباط", "What cookies are", "ملفات نصية صغيرة تُخزَّن على جهازك لتشغيل الموقع وتحسينه.", "Small text files stored on your device to run and improve the site."),
  s("ما نستخدمه", "What we use", "ملفات ضرورية للدخول والأمان، وملفات تفضيلات للغة، وتحليلات اختيارية بموافقتك.", "Essential cookies for login and security, preference cookies for language, and optional analytics with your consent."),
  s("إدارة التفضيلات", "Managing preferences", "يمكنك تغيير اختياراتك في أي وقت من إعدادات المتصفح أو من الإعدادات.", "You can change your choices anytime in your browser or in Settings."),
];
