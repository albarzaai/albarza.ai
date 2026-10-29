import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

type Env = { API?: { fetch(url: string, init?: RequestInit): Promise<Response> }; INTERNAL_AUTH_SECRET?: string };

export type ImageResult = { ok: true; image: string } | { ok: false; error: "rate" | "unavailable" | "blocked" };

// The Gemini key lives only in the api.albarza.ai Worker. This frontend reaches it over a private service binding.
export async function generateImage(prompt: string, aspect?: string, quality: "flash" | "pro" = "flash"): Promise<ImageResult> {
  const env = getCloudflareContext().env as unknown as Env;
  if (!env.API || !env.INTERNAL_AUTH_SECRET) return { ok: false, error: "unavailable" };

  const userIp = (await headers()).get("cf-connecting-ip") ?? undefined;
  let res: Response;
  try {
    res = await env.API.fetch("https://api.albarza.ai/v1/generate/image", {
      method: "POST",
      headers: { "content-type": "application/json", "x-internal-auth": env.INTERNAL_AUTH_SECRET },
      body: JSON.stringify({ prompt, aspect, quality, userIp }),
    });
  } catch {
    return { ok: false, error: "unavailable" };
  }
  if (res.status === 429) return { ok: false, error: "rate" };
  if (res.status === 422) return { ok: false, error: "blocked" };
  if (!res.ok) return { ok: false, error: "unavailable" };
  const json = (await res.json().catch(() => null)) as { image?: string } | null;
  return json?.image ? { ok: true, image: json.image } : { ok: false, error: "unavailable" };
}
