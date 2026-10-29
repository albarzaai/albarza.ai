#!/usr/bin/env bash
# After deploy: sign up a throwaway account through the live API, read it back, then delete it. Reports each status as a workflow annotation.
set -u
API=https://api.albarza.ai/v1
H=(-H "content-type: application/json" -H "x-internal-auth: ${INTERNAL_AUTH_SECRET}" -H "x-client-ip: 192.0.2.$((RANDOM % 250 + 1))" -H "x-client-ua: ci-smoke")
EM="ci-smoke-$(date +%s)@example.com"; PW="CiSm0ke-$(openssl rand -hex 6)Aa"
note() { echo "::notice title=accounts smoke::$1"; }
bad()  { echo "::error title=accounts smoke::$1"; }
OUT=$(curl -s -m 40 -o /tmp/su.json -w '%{http_code}' "${H[@]}" -X POST "$API/auth/signup" -d "{\"email\":\"$EM\",\"password\":\"$PW\",\"name\":\"CI Smoke\",\"locale\":\"en\"}")
BODY=$(head -c 300 /tmp/su.json)
if [ "$OUT" != "200" ]; then bad "signup returned $OUT: $BODY (503 = D1 binding missing; 500/1102 = Worker CPU limit hashing the password; 5xx = see Worker logs)"; exit 0; fi
TOK=$(python3 -c "import json;print(json.load(open('/tmp/su.json')).get('sessionToken',''))")
[ -n "$TOK" ] || { note "signup ok, but no session returned (email provider configured: verification required)"; exit 0; }
ME=$(curl -s -m 20 -o /dev/null -w '%{http_code}' "${H[@]}" -H "authorization: Bearer $TOK" "$API/me")
DEL=$(curl -s -m 20 -o /dev/null -w '%{http_code}' "${H[@]}" -H "authorization: Bearer $TOK" -X POST "$API/me/delete" -d "{\"confirm\":\"DELETE\",\"password\":\"$PW\"}")
note "signup=$OUT me=$ME delete=$DEL"
[ "$ME" = "200" ] && [ "$DEL" = "200" ] || bad "me=$ME delete=$DEL"
exit 0
