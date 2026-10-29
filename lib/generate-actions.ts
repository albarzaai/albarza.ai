"use server";

import { z } from "zod";
import { generateImage } from "@/lib/gemini";

export type GenState = { ok: boolean; error?: "invalid" | "prompt" | "rate" | "unavailable" | "blocked"; image?: string; at?: number } | null;

const s = (n: number) => z.string().trim().max(n).optional();
const schema = z.object({
  cat: z.enum(["image", "video", "audio"]),
  mode: z.enum(["createImage", "createArtwork", "createVideo", "editVideo", "extendVideo", "motionControl", "voiceover", "musicGenerator", "voiceChanger"]),
  prompt: z.string().trim().max(2000).optional(),
  model: s(60), aspect: s(10), outputs: s(2), resolution: s(10), duration: s(10), audio: s(5), enhance: s(5),
  voice: s(60), language: s(20), lyrics: s(20), genre: s(30), length: s(10), creativity: s(10), moodboard: s(80),
});
const needsPrompt = new Set(["createImage", "createArtwork", "createVideo", "editVideo", "extendVideo", "voiceover", "musicGenerator"]);

// All validation is server-side. Images go to Gemini; other modes are enqueued by the backend in a later phase.
export async function generateAction(_: GenState, form: FormData): Promise<GenState> {
  const data = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const r = schema.safeParse(data);
  if (!r.success) return { ok: false, error: "invalid", at: Date.now() };
  if (needsPrompt.has(r.data.mode) && !r.data.prompt) return { ok: false, error: "prompt", at: Date.now() };
  if (r.data.mode === "createImage" || r.data.mode === "createArtwork") {
    const img = await generateImage(r.data.prompt!, r.data.aspect);
    if (!img.ok) return { ok: false, error: img.error, at: Date.now() };
    return { ok: true, image: img.image, at: Date.now() };
  }
  return { ok: true, at: Date.now() };
}
