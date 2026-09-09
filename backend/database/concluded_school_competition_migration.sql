ALTER TABLE school_competition_registrations
  ADD COLUMN IF NOT EXISTS is_concluded BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS concluded_at TIMESTAMP;