"use server";

import { z } from "zod";
import { api, getToken } from "@/lib/session";

export type GenState = { ok: boolean; error?: "invalid" | "prompt" | "rate" | "unavailable" | "blocked" | "credits"; images?: string[]; credits?: number; at?: number } | null;

const s = (n: number) => z.string().trim().max(n).optional();
const schema = z.object({
  cat: z.enum(["image", "video", "audio"]),
  mode: z.enum(["createImage", "createArtwork", "createVideo", "editVideo", "extendVideo", "motionControl", "voiceover", "musicGenerator", "voiceChanger"]),
  prompt: z.string().trim().max(2000).optional(),
  model: s(60), aspect: s(10), outputs: s(2), resolution: s(10), duration: s(10), audio: s(5), enhance: s(5),
  voice: s(60), language: s(20), lyrics: s(20), genre: s(30), length: s(10), creativity: s(10), moodboard: s(80),
});
const needsPrompt = new Set(["createImage", "createArtwork", "createVideo", "editVideo", "extendVideo", "voiceover", "musicGenerator"]);

// All validation is server-side (here, then again in the API). Images are generated and charged by the API; other modes come in a later phase.
export async function generateAction(_: GenState, form: FormData): Promise<GenState> {
  const data = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const r = schema.safeParse(data);
  if (!r.success) return { ok: false, error: "invalid", at: Date.now() };
  if (needsPrompt.has(r.data.mode) && !r.data.prompt) return { ok: false, error: "prompt", at: Date.now() };
  if (r.data.mode === "createImage" || r.data.mode === "createArtwork") {
    const n = Math.min(4, Math.max(1, Number(r.data.outputs) || 1));
    const aspect = r.data.aspect && r.data.aspect !== "Auto" ? r.data.aspect : undefined;
    const quality = r.data.model?.includes("Pro") ? "pro" : "flash";
    // Sign-in, credit check and charge all happen in the API Worker; this only forwards the request with the visitor's own session.
    const res = await api<{ images?: string[]; credits?: number; error?: string }>("/me/generate/image", { token: await getToken(), body: { prompt: r.data.prompt, aspect, quality, n } });
    if (res.ok && res.data.images?.length) return { ok: true, images: res.data.images, credits: res.data.credits, at: Date.now() };
    const error = res.status === 402 ? "credits" : res.status === 429 ? "rate" : res.status === 422 ? "blocked" : "unavailable";
    return { ok: false, error, credits: res.data.credits, at: Date.now() };
  }
  return { ok: true, at: Date.now() };
}
