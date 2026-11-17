-- Add rules_agreed and rules_agreed_at to school_competition_registrations
ALTER TABLE school_competition_registrations
  ADD COLUMN IF NOT EXISTS rules_agreed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rules_agreed_at TIMESTAMP;
