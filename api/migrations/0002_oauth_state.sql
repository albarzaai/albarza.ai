-- Short-lived login attempts for "Sign in with Google": the random state (hashed) and PKCE verifier, valid for 10 minutes and used once.
CREATE TABLE oauth_state (
  id TEXT PRIMARY KEY,
  verifier TEXT NOT NULL,
  next TEXT NOT NULL,
  locale TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
