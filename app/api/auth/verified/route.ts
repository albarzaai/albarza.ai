import { cookies } from "next/headers";
import { PENDING, pendingConfirmed } from "@/lib/pending";

// Polled by the "Check your email" page. Answers only for the address in this browser's own cookie.
export async function GET() {
  const verified = await pendingConfirmed();
  if (verified) (await cookies()).delete(PENDING);
  return Response.json({ verified }, { headers: { "cache-control": "no-store" } });
}
