// Image generation through Gemini. The key lives only in this Worker.
const MODELS = { flash: "gemini-2.5-flash-image", pro: "gemini-3-pro-image-preview" } as const;

export type Quality = keyof typeof MODELS;
export type ImageOutcome = { ok: true; image: string } | { ok: false; reason: "unavailable" | "blocked" };

export async function generateImageData(key: string, prompt: string, aspect: string | undefined, quality: Quality): Promise<ImageOutcome> {
  const text = aspect ? `${prompt}\n\nAspect ratio: ${aspect}` : prompt;
  const call = (model: string) =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ text }] }], generationConfig: { responseModalities: ["IMAGE"] } }),
      signal: AbortSignal.timeout(55_000),
    });
  let res: Response;
  try {
    res = await call(MODELS[quality]);
    // The pro model is a preview: fall back to the stable one if it is unavailable.
    if (!res.ok && quality === "pro") res = await call(MODELS.flash);
  } catch {
    return { ok: false, reason: "unavailable" };
  }
  if (!res.ok) return { ok: false, reason: "unavailable" };
  const json = (await res.json().catch(() => null)) as { candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[] } | null;
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  const mime = part?.inlineData?.mimeType, data = part?.inlineData?.data;
  if (!data || !mime || !/^image\/(png|jpeg|webp)$/.test(mime) || data.length > 8_000_000) return { ok: false, reason: "blocked" };
  return { ok: true, image: `data:${mime};base64,${data}` };
}
