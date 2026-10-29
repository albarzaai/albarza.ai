const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
export const b64url = (b: ArrayBuffer | Uint8Array) => b64(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export const randomToken = (bytes = 32) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));
export const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

// Constant-time string comparison via digests.
export async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  return crypto.subtle.timingSafeEqual(x, y);
}

// Password hashes look like "pbkdf2-sha512$<iterations>$<salt>$<hash>", so the cost can be raised later without breaking old hashes.
async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password.normalize("NFKC")), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-512", salt: salt as BufferSource, iterations }, key, 512);
}
export async function hashPassword(password: string, iterations: number) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2-sha512$${iterations}$${b64(salt)}$${b64(await derive(password, salt, iterations))}`;
}
export async function verifyPassword(password: string, stored: string | null) {
  // Unknown users are checked against a dummy hash so response time does not reveal whether an account exists.
  const dummy = "pbkdf2-sha512$100000$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";
  const [alg, it, salt, hash] = (stored ?? dummy).split("$");
  if (alg !== "pbkdf2-sha512") return false;
  const out = b64(await derive(password, unb64(salt), Math.min(Number(it) || 100000, 600000)));
  const ok = await safeEqual(out, hash);
  return stored !== null && ok;
}
