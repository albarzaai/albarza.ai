import { cookies } from "next/headers";
import { api } from "./session";

export const PENDING = process.env.NODE_ENV === "production" ? "__Host-albarza_pending" : "albarza_pending";

// True when the address this browser signed up with has been confirmed (for instance from a phone). The cookie is cleared once it is.
export async function pendingConfirmed(): Promise<boolean> {
  const jar = await cookies();
  const em = jar.get(PENDING)?.value;
  if (!em || em.length > 254) return false;
  const r = await api<{ verified?: boolean }>("/auth/verification-status", { body: { email: em, locale: "en" } });
  return r.ok && r.data.verified === true;
}
