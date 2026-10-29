-- Account role. Everyone is 'user'; 'admin' is granted only by the deploy step for a verified email.
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
