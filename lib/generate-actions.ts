"use server";

import { z } from "zod";

export type GenState = { ok: boolean; error?: string } | null;

const schema = z.object({
  tool: z.enum(["video", "image", "lip-sync", "upscale", "text-to-voice", "voice-changer"]),
  prompt: z.string().trim().max(2000).optional(),
  model: z.string().max(60).optional(),
  ratio: z.string().max(10).optional(),
  duration: z.string().max(10).optional(),
  quality: z.string().max(20).optional(),
  count: z.string().max(2).optional(),
  voice: z.string().max(60).optional(),
  language: z.string().max(20).optional(),
});

// Validation lives on the server. Enqueueing to the Hono/Queues backend is wired in a later phase.
export async function generateAction(_: GenState, form: FormData): Promise<GenState> {
  const data = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const r = schema.safeParse(data);
  if (!r.success) return { ok: false, error: "invalid" };
  if (["video", "image", "text-to-voice"].includes(r.data.tool) && !r.data.prompt) return { ok: false, error: "prompt" };
  return { ok: true };
}
