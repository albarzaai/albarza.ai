import { api, getToken } from "@/lib/session";

// Right of access: everything we hold about the signed-in user, as a JSON download.
export async function GET() {
  const token = await getToken();
  if (!token) return new Response("unauthorized", { status: 401 });
  const r = await api("/me/export", { token });
  if (!r.ok) return new Response("unavailable", { status: r.status === 401 ? 401 : 502 });
  return new Response(JSON.stringify(r.data, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": 'attachment; filename="albarza-data.json"', "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}
