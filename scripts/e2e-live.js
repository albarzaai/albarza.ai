// Real-browser check of the live site. Fails on: an error page (including Chrome's own), a same-origin request that fails or answers 4xx/5xx,
// an uncaught page error, or a flow that does not reach its expected state. Run after every deploy and on a schedule.
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "https://albarza.ai";
const LIVE = process.env.LIVE_CHECK_HEADER || "";
const CI_CAPTCHA = process.env.CI_CAPTCHA || "";
const TEST_EMAIL = `ci-live-${Date.now().toString(36)}@example.com`;
const TEST_PASSWORD = "CiLive-" + Math.random().toString(36).slice(2, 10) + "Aa1";
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
  // The pass header goes to our own site only, never to third parties.
  if (LIVE) await ctx.route((u) => u.origin === BASE, (route) => route.continue({ headers: { ...route.request().headers(), "x-live-check": LIVE } }));

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

  // 4b. Sign-up, "Check your email", Resend, login of an unconfirmed account, forgot-password: the human check is replaced by the CI token.
  await step("signup flow", async () => {
    if (!CI_CAPTCHA) { console.log("no CI_CAPTCHA: skipping form flows"); return; }
    const page = await ctx.newPage();
    await watch(page, "signup flow");
    const inject = () => page.evaluate((t) => { const f = document.querySelector("form"); let i = f.querySelector('input[name="cf-turnstile-response"]'); if (!i) { i = document.createElement("input"); i.type = "hidden"; i.name = "cf-turnstile-response"; f.appendChild(i); } i.value = t; document.querySelector("form button.btn-gold").disabled = false; }, CI_CAPTCHA);
    await page.goto(BASE + "/en/signup", { waitUntil: "load", timeout: 60000 });
    await page.click('button:has-text("email")');
    await page.fill("#name", "Live Check"); await page.fill("#email", TEST_EMAIL); await page.fill("#password", TEST_PASSWORD);
    await page.check('input[name=agree]');
    await inject(); await page.click("form button.btn-gold");
    await page.waitForURL(/verify-email/, { timeout: 20000 }).catch(() => fail("signup flow", `did not reach the confirm-email page (${page.url()})`));
    sane(page, "signup flow");
    await page.click('button:has-text("Resend")');
    await page.waitForSelector('[role="status"]', { timeout: 15000 }).catch(() => fail("signup flow", "Resend gave no confirmation"));
    // Logging in before confirming must answer cleanly, not crash.
    await page.goto(BASE + "/en/login", { waitUntil: "load", timeout: 60000 });
    await page.click('button:has-text("email")');
    await page.fill("#email", TEST_EMAIL); await page.fill("#password", TEST_PASSWORD);
    await inject(); await page.click("form button.btn-gold");
    await page.waitForTimeout(4000);
    sane(page, "login flow");
    if (!/\/login/.test(page.url())) fail("login flow", `unexpected page ${page.url()}`);
    // Forgot password.
    await page.goto(BASE + "/en/forgot-password", { waitUntil: "load", timeout: 60000 });
    await page.fill("#email", TEST_EMAIL); await inject(); await page.click("form button.btn-gold");
    await page.waitForSelector('[role="status"]', { timeout: 15000 }).catch(() => fail("forgot flow", "no confirmation"));
    await page.close();
  });

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
