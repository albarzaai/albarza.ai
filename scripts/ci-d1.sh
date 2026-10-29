#!/usr/bin/env bash
# Create (once) and migrate the albarza-db D1 database, then put its id into api/wrangler.jsonc.
# If the token cannot manage D1, the database binding is removed so the rest of the API still deploys (auth then answers 503).
set -u
cd "$(dirname "$0")/../api"
fail() {
  echo "::error title=D1::$1 Add the 'Account > D1 > Edit' permission to CLOUDFLARE_API_TOKEN. Accounts stay disabled until then."
  python3 - <<'PY'
import re
s = open("wrangler.jsonc").read()
s = re.sub(r'\n\s*// D1 database created[^\n]*\n\s*"d1_databases":[^\n]*\n', "\n", s)
open("wrangler.jsonc", "w").write(s)
PY
  exit 0
}
npx wrangler d1 create albarza-db >/tmp/d1-create.log 2>&1 || true
ID=$(npx wrangler d1 list --json 2>/tmp/d1-list.err | python3 -c "import sys,json
try:
    print(next(d['uuid'] for d in json.load(sys.stdin) if d['name']=='albarza-db'))
except Exception:
    pass")
[ -n "$ID" ] || fail "Could not find or create the albarza-db database."
sed -i "s/__D1_ID__/$ID/" wrangler.jsonc
npx wrangler d1 migrations apply albarza-db --remote || fail "Could not apply database migrations."
echo "D1 ready: $ID"
