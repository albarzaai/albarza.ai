#!/usr/bin/env python3
"""Apply edge protection to the albarza.ai zone through the Cloudflare API.

Idempotent. Needs CLOUDFLARE_API_TOKEN with Zone Settings:Edit, Zone WAF:Edit and DNS:Edit.
Each step reports on its own so one plan limit does not hide the rest.
"""
import hashlib, json, os, sys, urllib.request, urllib.error

TOKEN = os.environ["CLOUDFLARE_API_TOKEN"]
ZONE_NAME = os.environ.get("ZONE_NAME", "albarza.ai")
BASE = "https://api.cloudflare.com/client/v4"


def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        try:
            return json.load(e)
        except Exception:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}"}]}


failed = []


def step(name, res):
    ok = res.get("success")
    print(("ok   " if ok else "FAIL ") + name + ("" if ok else " -> " + "; ".join(e.get("message", "") for e in res.get("errors", []))))
    if not ok:
        failed.append(name)
        msg = "; ".join(e.get("message", "") for e in res.get("errors", []))
        print(f"::error title=harden-zone::{name}: {msg}")


zones = call("GET", f"/zones?name={ZONE_NAME}")
if not zones.get("result"):
    sys.exit(f"zone {ZONE_NAME} not found for this token: {zones.get('errors')}")
zid = zones["result"][0]["id"]

# Transport security
for key, value in {
    "ssl": "strict",
    "always_use_https": "on",
    "min_tls_version": "1.2",
    "tls_1_3": "on",
    "automatic_https_rewrites": "on",
    "opportunistic_encryption": "on",
    "security_level": "high",
    "browser_check": "on",
    "email_obfuscation": "on",
    "hotlink_protection": "on",
    "challenge_ttl": 1800,
}.items():
    step(f"setting {key}={value}", call("PATCH", f"/zones/{zid}/settings/{key}", {"value": value}))

step("HSTS", call("PATCH", f"/zones/{zid}/settings/security_header", {"value": {"strict_transport_security": {
    "enabled": True, "max_age": 31536000, "include_subdomains": True, "preload": True, "nosniff": True}}}))
r = call("PATCH", f"/zones/{zid}/dnssec", {"status": "active"})
print("ok   DNSSEC (add the DS record at your registrar)" if r.get("success") else "warn DNSSEC skipped: " + "; ".join(e.get("message", "") for e in r.get("errors", [])))
step("Bot Fight Mode", call("PUT", f"/zones/{zid}/bot_management", {"fight_mode": True, "enable_js": True}))

# WAF custom rules: block scanners and unusual methods.
# The live check (CI) proves it is ours with a header only someone holding the Cloudflare token can compute; the rule only skips the challenge layers.
live = hashlib.sha256(("live-check:" + TOKEN).encode()).hexdigest()
waf = [
    {"description": "Live check (secret header)", "action": "skip", "enabled": True,
     "expression": f'http.request.headers["x-live-check"][0] eq "{live}"',
     "action_parameters": {"ruleset": "current", "products": ["bic", "securityLevel", "uaBlock", "rateLimit"]}},
    {"description": "Block common probe paths", "action": "block", "enabled": True,
     "expression": '(http.request.uri.path contains "/.env") or (http.request.uri.path contains "/.git") or (http.request.uri.path contains "/wp-admin") or (http.request.uri.path contains "/wp-login") or (http.request.uri.path contains "/xmlrpc.php") or (http.request.uri.path contains "phpmyadmin") or (http.request.uri.path contains "/.aws")'},
    {"description": "Block unexpected HTTP methods", "action": "block", "enabled": True,
     "expression": 'not http.request.method in {"GET" "HEAD" "POST" "OPTIONS"}'},
    {"description": "Challenge high threat scores", "action": "managed_challenge", "enabled": True,
     "expression": "cf.threat_score gt 30"},
]
step("WAF custom rules", call("PUT", f"/zones/{zid}/rulesets/phases/http_request_firewall_custom/entrypoint", {"rules": waf}))

# Edge rate limiting (free plan: one rule, 10 s window). Static assets are excluded: one page view fetches dozens of them and must not count as abuse.
rl = [{"description": "Rate limit per IP", "action": "block", "enabled": True,
       "expression": 'not starts_with(http.request.uri.path, "/_next/") and not starts_with(http.request.uri.path, "/media/") and not starts_with(http.request.uri.path, "/brand/") and not starts_with(http.request.uri.path, "/fonts/")',
       "ratelimit": {"characteristics": ["ip.src", "cf.colo.id"], "period": 10, "requests_per_period": 250, "mitigation_timeout": 10}}]
step("Rate limiting", call("PUT", f"/zones/{zid}/rulesets/phases/http_ratelimit/entrypoint", {"rules": rl}))

# Managed WAF rulesets
# Speed: compression, protocols, tiered cache.
for key, value in {"brotli": "on", "early_hints": "on", "http3": "on", "0rtt": "on", "ipv6": "on"}.items():
    step(f"setting {key}={value}", call("PATCH", f"/zones/{zid}/settings/{key}", {"value": value}))
step("Tiered cache", call("PATCH", f"/zones/{zid}/argo/tiered_caching", {"value": "on"}))

# Edge-cache pages for an hour. Static assets keep their own headers; the cache is purged after every deploy.
step("Cache rule (HTML at the edge)", call("PUT", f"/zones/{zid}/rulesets/phases/http_request_cache_settings/entrypoint", {"rules": [{
    "description": "Cache site pages at the edge",
    "expression": '(http.host in {"albarza.ai" "www.albarza.ai"}) and not starts_with(http.request.uri.path, "/_next/") and not starts_with(http.request.uri.path, "/media/") and not starts_with(http.request.uri.path, "/brand/") and not starts_with(http.request.uri.path, "/api/")',
    "action": "set_cache_settings", "enabled": True,
    "action_parameters": {"cache": True, "edge_ttl": {"mode": "override_origin", "default": 3600}, "browser_ttl": {"mode": "override_origin", "default": 0}}}]}))
step("Purge cache", call("POST", f"/zones/{zid}/purge_cache", {"purge_everything": True}))

# Pro plans and above use the full Cloudflare Managed Ruleset; free plans get the Free Managed Ruleset.
managed = lambda rid, name: call("PUT", f"/zones/{zid}/rulesets/phases/http_request_firewall_managed/entrypoint", {"rules": [
    {"action": "execute", "expression": "true", "description": name, "action_parameters": {"id": rid}}]})
res = managed("efb7b8c949ac4650a09736fc376e9aee", "Cloudflare Managed Ruleset")
if not res.get("success"):
    res = managed("77454fe2d30c4220b5701f6fdfb893ba", "Cloudflare Free Managed Ruleset")
step("Managed WAF ruleset", res)

print("\nfailed steps:", failed or "none")
sys.exit(1 if failed else 0)
