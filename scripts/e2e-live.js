// Real-browser check of the live site. Fails on: an error page (including Chrome's own), a same-origin request that fails or answers 4xx/5xx,
// an uncaught page error, or a flow that does not reach its expected state. Run after every deploy and on a schedule.
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "https://albarza.ai";
const problems = [];
const fail = (where, what) => { problems.push(`${where}: ${what}`); console.log(`::error title=live check::${where}: ${what}`); };

async function watch(page, where) {
  page.on("pageerror", (e) => fail(where, `page error: ${e.message.slice(0, 200)}`));
  page.on("requestfailed", (r) => { if (r.url().startsWith(BASE) && !/_rsc=|\/api\/client-error/.test(r.url()) && r.failure()?.errorText !== "net::ERR_ABORTED") fail(where, `request failed ${r.url().slice(BASE.length, BASE.length + 80)} (${r.failure()?.errorText})`); });
  page.on("response", (r) => { if (r.url().startsWith(BASE) && r.status() >= 400 && !/favicon/.test(r.url())) fail(where, `HTTP ${r.status()} ${r.request().method()} ${r.url().slice(BASE.length, BASE.length + 80)}`); });
}
const sane = (page, where) => { if (page.url().startsWith("chrome-error:")) fail(where, "browser error page"); };

const step = async (name, fn) => { try { await fn(); } catch (e) { fail(name, e.message.split("\n")[0].slice(0, 200)); } };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  // 1. Public pages open cleanly.
  for (const path of ["/ar", "/en", "/en/pricing", "/en/video-generator", "/en/image-generator", "/en/login", "/en/signup", "/ar/signup"]) {
    const page = await ctx.newPage();
    await watch(page, path);
    const res = await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 }).catch((e) => { fail(path, `did not load: ${e.message.slice(0, 120)}`); return null; });
    if (res && res.status() !== 200) fail(path, `status ${res.status()}`);
    sane(page, path);
    await page.close();
  }

  await step("steps 2-5", async () => {
  // 2. The signed-in area is closed without a session.
  {
    const page = await ctx.newPage();
    await page.goto(BASE + "/en/app", { waitUntil: "load", timeout: 60000 });
    if (!/\/en\/login/.test(page.url())) fail("/en/app", `not redirected to login (${page.url()})`);
    await page.close();
  }

  // 3. "Resend email": the form works end to end (sets the pending cookie the way sign-up does, with an address that has no account).
  {
    await ctx.addCookies([{ name: "__Host-albarza_pending", value: "live-check@example.com", url: BASE, secure: true, httpOnly: true, sameSite: "Lax" }]);
    const page = await ctx.newPage();
    await watch(page, "resend");
    await page.goto(BASE + "/en/verify-email", { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1500);
    console.log("resend page title:", await page.title(), page.url());
    await page.click('button:has-text("Resend")');
    await page.waitForSelector('[role="status"]', { timeout: 15000 }).catch(() => fail("resend", "no confirmation after clicking Resend"));
    sane(page, "resend");
    await page.close();
  }

  // 4. Sign-up form: the bot check script is requested and the form renders (the form itself needs a human to pass the check).
  {
    const page = await ctx.newPage();
    let asked = false;
    page.on("request", (r) => { if (r.url().includes("challenges.cloudflare.com")) asked = true; });
    await page.goto(BASE + "/en/signup", { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.click('button:has-text("email")');
    await page.waitForSelector("#password", { timeout: 10000 }).catch(() => fail("signup", "form did not open"));
    await page.waitForTimeout(1500);
    if (!asked) fail("signup", "bot check script was not requested");
    await page.close();
  }

  // 5. Backend health: API, database, Google sign-in.
  {
    const h = await (await ctx.request.get(BASE + "/api/health")).json().catch(() => null);
    if (!h || h.api !== 200 || !h.database) fail("health", `API or database down: ${JSON.stringify(h)}`);
    if (h && !h.googleEnabled) fail("health", "Google sign-in disabled");
    if (h && h.googleStartProbe !== 200) fail("health", `Google start probe ${h.googleStartProbe}`);
  }

  });

  await browser.close();
  if (problems.length) { console.log(`\n${problems.length} problem(s)`); process.exit(1); }
  console.log("live check: all good");
})();
