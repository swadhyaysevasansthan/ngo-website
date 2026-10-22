-- Quiz Settings Migration
-- Stores quizzes and their access codes, and the question bank code.
-- Run once against your PostgreSQL database.

-- Quizzes table: each quiz has a title, description, url, duration, questions count
CREATE TABLE IF NOT EXISTS quiz_entries (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT 'Environmental Awareness Quiz',
  description TEXT NOT NULL DEFAULT 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices.',
  url         TEXT NOT NULL,
  duration    TEXT NOT NULL DEFAULT '10 minutes',
  questions   TEXT NOT NULL DEFAULT '25 questions',
  access_code TEXT NOT NULL,         -- plain-text code (admin visible)
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- App-level key-value settings (used for question bank code etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed question bank code default (only if row doesn't exist)
INSERT INTO app_settings (key, value)
VALUES ('question_bank_access_code', 'changeme')
ON CONFLICT (key) DO NOTHING;

-- Seed example quizzes matching the current hardcoded data (optional – remove if you want to start fresh)
INSERT INTO quiz_entries (title, description, url, duration, questions, access_code, sort_order)
VALUES
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.cloud.microsoft/r/cTy6LQ4iAA', '10 minutes', '25 questions', 'quiz1code', 0),
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.cloud.microsoft/r/VwQZw1VScf', '10 minutes', '25 questions', 'quiz2code', 1),
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.office.com/r/2wg712yyez', '10 minutes', '25 questions', 'quiz3code', 2),
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.office.com/r/mnC4kzj354', '10 minutes', '25 questions', 'quiz4code', 3),
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.office.com/r/EaijAT2Mvp', '10 minutes', '25 questions', 'quiz5code', 4),
  ('Environmental Awareness Quiz', 'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.', 'https://forms.office.com/r/XKp6WJHZST', '10 minutes', '25 questions', 'quiz6code', 5)
ON CONFLICT DO NOTHING;
