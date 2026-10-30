-- Every change to a user's credits, so balances can be audited and refunds are traceable.
CREATE TABLE credit_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX credit_ledger_user ON credit_ledger(user_id, created_at);
