import { api } from "@/lib/session";

// Reports only status codes, so a broken accounts backend is visible without logs. No secrets, no user data.
export async function GET() {
  const status = await api("/auth/google/status");
  const login = await api("/auth/login", { body: { email: "health-check@example.invalid", password: "not-a-real-password" } });
  return Response.json({ api: status.status, database: status.status !== 503, loginProbe: login.status }, { headers: { "cache-control": "no-store" } });
}
