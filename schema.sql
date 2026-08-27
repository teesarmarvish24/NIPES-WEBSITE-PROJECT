-- AMSO manuscript archive schema.
-- Run this once against your D1 database (dashboard: D1 > your database > Console)
-- after creating it, before the archive page will work.

CREATE TABLE IF NOT EXISTS manuscripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  email TEXT NOT NULL,
  conference TEXT,
  abstract TEXT,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_manuscripts_status ON manuscripts (status);
