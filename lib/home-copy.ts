// Copy for the Davinci-style home page (Arabic first, English second). Product claims stay factual: no invented user counts or ratings.
type L = { ar: string; en: string };
const l = (ar: string, en: string): L => ({ ar, en });

export const H = {
  title: l("كل إبداعك البصري. على منصة واحدة.", "All your visual creation. One platform."),
  sub: l("ادخل إلى أفضل نماذج الصور والفيديو في العالم، ضمن منصة واحدة قوية.", "Access the world's best AI models for images and video, all in one powerful suite."),
  cta: l("ابدأ الإبداع", "Start creating"),
  tag1: l("أنت تجلب الرؤية. ونحن نمضي بها أبعد.", "You bring the vision. We take it further."),
  tag2: l("انضم إلى المبدعين وفرق التسويق والمصممين في الخليج وحول العالم.", "Join creators, marketing teams and designers across the Gulf and beyond."),
  modelsA: l("نماذج رائدة للصور والفيديو.", "Top-tier image and video generation models."),
  modelsB: l("اشتراك واحد.", "One subscription."),
  featured: l("نماذج مميزة", "Featured models"),
  suite: l("منظومة ذكاء اصطناعي توليدي كاملة بقدرات مدمجة قوية", "A complete generative AI suite with powerful built-in capabilities"),
  channelsTitle: l("أنشئ أي شيء. لكل قناة.", "Create anything. For every channel."),
  channelsText: l("من التواصل الاجتماعي والإعلانات إلى الفيديو والهوية والتصوير والصوت: أنشئ وحرّر وكبّر محتوى إبداعياً عالي الجودة في دقائق. منظومة واحدة لكل حملة وكل صيغة وكل فكرة.", "From social media and ads to video, branding, photography and audio: generate, edit and scale high-quality creative in minutes. One unified AI suite for every campaign, every format and every idea."),
  channelsLink: l("اعرف المزيد عن البرزة برو", "Learn more about Albarza Pro"),
  appTitle: l("أنشئ أثناء تنقلك", "Create on the go"),
  appSub: l("قوة نماذج الذكاء الاصطناعي في جيبك: أنشئ الصور والفيديو والصوت من أي مكان دون الحاجة إلى حاسوب.", "The full power of AI models in your pocket. Generate images, videos and audio from anywhere, no desktop required."),
  appSoon: l("تطبيقا iOS وAndroid قادمان قريباً.", "iOS and Android apps are coming soon."),
  soon: l("قريباً", "Coming soon"),
  whyTitle: l("لماذا البرزة؟", "Why choose Albarza?"),
  whySub: l("أنشئ أسرع. أنشئ أذكى. أنشئ مع البرزة.", "Create faster. Create smarter. Create with Albarza."),
  planTitle: l("اختر خطتك", "Pick your plan"),
  planSub: l("ادخل إلى ميزات احترافية ونماذج متقدمة وتوليدات أكثر.", "Get access to pro features, advanced AI models and more generations."),
  faqTitle: l("الأسئلة الشائعة", "Frequently asked questions"),
};

export const featured: { name: string; cap: L }[] = [
  { name: "Seedream", cap: l("صور عالية الدقة وتعبيرية بعمق فني", "Expressive, high-fidelity visuals with artistic depth") },
  { name: "Nano Banana", cap: l("توليد سريع وخفيف للإبداع اليومي", "Fast, lightweight generation built for everyday creativity") },
  { name: "Sora", cap: l("حركة سينمائية نقية مع تحكم دقيق بالكاميرا", "Clean, cinematic motion with precise camera control") },
  { name: "Kling", cap: l("حركة سينمائية حادة مع التزام بالوصف", "Sharp, cinematic motion with strong prompt control") },
  { name: "Veo", cap: l("مشاهد واقعية متماسكة بتفاصيل سينمائية", "Realistic, continuous scenes with cinematic detail") },
  { name: "Seedance", cap: l("فيديو متعدد اللقطات بحركة مصقولة", "Multi-shot video with polished motion") },
];
export const modelNames = ["Sora", "Veo", "Nano Banana", "Kling", "Seedance", "Seedream", "Flux"];

export const suiteTabs: { key: string; label: L; prompt: L; soon?: boolean }[] = [
  { key: "image", label: l("توليد الصور", "Image Generation"), prompt: l("لقطة أزياء تحريرية لعارضة ببدلة كريمية وإكسسوارات ذهبية أمام جدار من الطين…", "Editorial fashion shot of a model in a cream suit with gold accessories against a terracotta wall…") },
  { key: "edit", label: l("تحرير الصور", "Image Editing"), prompt: l("غيّر الإضاءة إلى ضوء جانبي دافئ وأزل الخلفية الفوضوية…", "Switch to warm side lighting and remove the cluttered background…") },
  { key: "video", label: l("توليد الفيديو", "Video Generation"), prompt: l("فارس على جمل عند الغسق، ظلال طويلة وشمس برتقالية ضخمة…", "A lone rider on a camel at dusk, long shadows and a huge orange sun…") },
  { key: "vedit", label: l("تحرير الفيديو", "Video Editing"), prompt: l("اقطع إلى لقطة أوسع وأضف حركة كاميرا بطيئة…", "Cut to a wider shot and add a slow camera push-in…") },
  { key: "audio", label: l("توليد الصوت", "Audio Generation"), prompt: l("لحن عود هادئ مع إيقاع خفيف…", "A calm oud melody with a soft rhythm…"), soon: true },
];

export const channels: { lead: L; text: L }[] = [
  { lead: l("تغيير الحجم لكل منصة.", "Auto-resize for each platform."), text: l("حوّل تصاميمك تلقائياً إلى قياسات القنوات الاجتماعية والإعلانات والمواقع دون إعادة بناء التخطيط.", "Resize designs instantly for every channel, adapting to social, ads and web formats without rebuilding layouts.") },
  { lead: l("حوّل صور المنتجات إلى فيديوهات تجارية.", "Turn product photos into dynamic commercial videos."), text: l("حوّل لقطات المنتج الثابتة إلى فيديوهات قصيرة مصممة للأداء على الإعلانات والتواصل الاجتماعي والمتاجر.", "Transform still product shots into short-form videos designed for ads, socials and storefronts.") },
  { lead: l("كبّر الأصول بدقة عالية.", "Upscale assets for high-res ad formats."), text: l("ارفع الدقة مع الحفاظ على الوضوح والتفاصيل لشاشات كبيرة وإعلانات فاخرة.", "Increase resolution while preserving clarity and detail for large screens and premium ads.") },
  { lead: l("استبدل أو أزل بدقة وتحكم.", "Replace or remove with precision and control."), text: l("بدّل العناصر أو أعد ضبط الإضاءة والعمق والتركيب بسهولة.", "Swap elements or adjust lighting, depth and composition with full control.") },
];

export const whyCards: { icon: string; t: L; d: L }[] = [
  { icon: "spark", t: l("منصة الوسائط التوليدية الشاملة", "The all-in-one generative media platform"), d: l("أنشئ الصور والفيديو والمفاهيم البصرية بأحدث النماذج. أنشئ وحسّن وأعد المزج في مساحة واحدة، من الفكرة إلى المخرج النهائي.", "Generate images, videos and visual concepts using state-of-the-art AI models. Create, refine and remix in one seamless workspace, from first idea to final output.") },
  { icon: "lock", t: l("ذكاء اصطناعي تثق به. مصمم للمبدعين.", "AI you can trust. Built for creators."), d: l("لا تُستخدم بياناتك لتدريب النماذج دون إذنك. كل ما تنشئه يبقى لك، مع معالجة آمنة وحقوق استخدام واضحة.", "Your data is never used to train AI models without permission. Everything you create comes with clear usage rights and secure handling.") },
  { icon: "enhance", t: l("أدوات قوية. سير عمل بسيط.", "Powerful tools. Simple workflow."), d: l("أنشئ مرئيات احترافية دون تعقيد تقني. كرّر بسرعة واستكشف الاختلافات وحسّن النتائج في ثوانٍ.", "Create professional-grade visuals without technical complexity. Iterate fast, explore variations and fine-tune results in seconds.") },
  { icon: "pen", t: l("نصنع مستقبل الإبداع التوليدي", "Shaping the future of generative creativity"), d: l("انضم إلى المبدعين والمصممين والحكّائين الذين يستخدمون البرزة كل يوم، واحصل مبكراً على النماذج والميزات الجديدة.", "Join creators, designers and storytellers using Albarza every day. Get early access to new models, features and creative tools.") },
];

export const homeFaqs: { q: L; a: L }[] = [
  { q: l("ماذا يمكنني أن أنشئ بالبرزة؟", "What can I create with Albarza?"), a: l("تتيح لك البرزة إنشاء الصور والفيديو والصوت وتحريرها من مساحة عمل واحدة. اختر الأداة المناسبة للمشروع ثم النموذج الأنسب وحسّن النتيجة.", "Albarza lets you create images, videos and audio and edit them from one workspace. Choose the tool that fits the project, select the model that suits it, and refine the result.") },
  { q: l("كيف أبدأ مشروع صور؟", "How do I start an image project?"), a: l("افتح أداة الصور، اكتب وصفاً أو ارفع صورة مرجعية، اختر النموذج والنسبة ثم اضغط إنشاء.", "Open the image tool, write a prompt or upload a reference image, pick a model and aspect ratio, then click Generate.") },
  { q: l("هل يمكنني إنشاء فيديو من الصور؟", "Can I create videos from photos?"), a: l("نعم. ارفع صورة وصف الحركة المطلوبة وسيحرّكها نموذج الفيديو، مع إمكانية تحديد إطار البداية والنهاية.", "Yes. Upload a photo, describe the motion you want, and the video model animates it, with optional start and end frames.") },
  { q: l("هل يمكنني إنشاء محتوى من وصف نصي؟", "Can I create content from a text prompt?"), a: l("نعم. اكتب ما تتخيله بلغة طبيعية، عربية أو إنجليزية، وستحصل على صورة أو فيديو.", "Yes. Describe what you imagine in natural language, in Arabic or English, and you get an image or a video.") },
  { q: l("كيف أختار نموذج الذكاء الاصطناعي؟", "How do I choose an AI model?"), a: l("ابدأ بنموذج سريع للتجارب، ثم انتقل إلى نموذج أعلى جودة عندما تقترب من النتيجة النهائية. وصف كل نموذج يوضح نقاط قوته.", "Start with a fast model for experiments, then move to a higher-quality model as you near the final result. Each model's description shows its strengths.") },
  { q: l("هل يمكنني تعديل الصورة بعد إنشائها؟", "Can I edit an image after generating it?"), a: l("نعم. يمكنك تعديل الإضاءة والخلفية والعناصر أو تكبير الدقة بعد التوليد.", "Yes. You can adjust lighting, background and elements, or upscale the resolution after generating.") },
  { q: l("كيف يتم تسعير توليد الفيديو والصوت؟", "How are video and audio generations priced?"), a: l("يستهلك كل توليد رصيداً بحسب النموذج والمدة والدقة، وتظهر التكلفة قبل الإنشاء.", "Each generation uses credits based on the model, duration and resolution, and the cost is shown before you generate.") },
  { q: l("هل يمكنني استخدام البرزة على هاتفي؟", "Can I use Albarza on a phone?"), a: l("الموقع يعمل بالكامل على الجوال، وتطبيقا iOS وAndroid قادمان قريباً.", "The website works fully on mobile, and iOS and Android apps are coming soon.") },
  { q: l("أين أجد شروط الاستخدام والترخيص؟", "Where can I find usage and licensing terms?"), a: l("تجد شروط الاستخدام وسياسة الخصوصية وسياسة الاسترداد في أسفل كل صفحة.", "You can find the terms of use, privacy policy and refund policy in the footer of every page.") },
];
