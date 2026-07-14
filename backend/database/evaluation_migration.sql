-- Judge Management & Competition Evaluation Module
-- Run this migration on your PostgreSQL database.
-- Additive only — does not alter participants/submissions/admins.

-- ============================================================
-- JUDGES (separate identity space from `admins`)
-- ============================================================
CREATE TABLE IF NOT EXISTS judges (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- COMPETITIONS — generalization/adapter layer.
-- source_table tells the backend which existing table an entry's
-- raw submission data lives in, so the same evaluation schema
-- below can serve photography today and painting/etc later
-- without any table changes here.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_competitions (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    source_table VARCHAR(50) NOT NULL DEFAULT 'submissions',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ENTRIES — the anonymized layer judges actually see.
-- entry_number is generated once and never recalculated, so
-- "Entry #001" means the same thing to every judge forever.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_entries (
    id SERIAL PRIMARY KEY,
    competition_id INTEGER NOT NULL REFERENCES evaluation_competitions(id) ON DELETE CASCADE,
    entry_number VARCHAR(10) NOT NULL,
    source_id INTEGER NOT NULL, -- e.g. submissions.id
    participant_id VARCHAR(50) NOT NULL REFERENCES participants(participant_id),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disqualified')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (competition_id, entry_number),
    UNIQUE (competition_id, source_id)
);

CREATE INDEX IF NOT EXISTS idx_eval_entries_competition ON evaluation_entries(competition_id);
CREATE INDEX IF NOT EXISTS idx_eval_entries_participant ON evaluation_entries(participant_id);

-- ============================================================
-- SETTINGS — one row per competition, drives every toggle in
-- the Competition Settings page.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_settings (
    competition_id INTEGER PRIMARY KEY REFERENCES evaluation_competitions(id) ON DELETE CASCADE,
    round1_status VARCHAR(10) NOT NULL DEFAULT 'closed' CHECK (round1_status IN ('open', 'closed')),
    allow_reevaluation BOOLEAN NOT NULL DEFAULT false,
    qualification_method VARCHAR(10) NOT NULL DEFAULT 'top_n' CHECK (qualification_method IN ('top_n', 'min_score')),
    qualification_value INTEGER NOT NULL DEFAULT 10,
    verification_status VARCHAR(10) NOT NULL DEFAULT 'closed' CHECK (verification_status IN ('open', 'closed')),
    round2_status VARCHAR(10) NOT NULL DEFAULT 'closed' CHECK (round2_status IN ('open', 'closed')),
    round2_scoring_enabled BOOLEAN NOT NULL DEFAULT false,
    frozen BOOLEAN NOT NULL DEFAULT false,
    results_published BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SCORES — current score per judge/entry/round. Whole numbers
-- 0-5 only, no remarks, matching the brief exactly.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_scores (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL REFERENCES evaluation_entries(id) ON DELETE CASCADE,
    judge_id INTEGER NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    round INTEGER NOT NULL CHECK (round IN (1, 2)),
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (entry_id, judge_id, round)
);

CREATE INDEX IF NOT EXISTS idx_eval_scores_entry ON evaluation_scores(entry_id);
CREATE INDEX IF NOT EXISTS idx_eval_scores_judge ON evaluation_scores(judge_id);

-- ============================================================
-- SCORE AUDIT LOG — append-only, every modification recorded,
-- never overwritten.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_score_audit (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL REFERENCES evaluation_entries(id) ON DELETE CASCADE,
    judge_id INTEGER NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    old_score INTEGER,
    new_score INTEGER NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eval_audit_entry ON evaluation_score_audit(entry_id);
CREATE INDEX IF NOT EXISTS idx_eval_audit_judge ON evaluation_score_audit(judge_id);

-- ============================================================
-- QUALIFICATION / VERIFICATION — derived Round-1 results plus
-- the admin-driven identity-verification state machine.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_qualifications (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL UNIQUE REFERENCES evaluation_entries(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL DEFAULT 0,
    conflict_level VARCHAR(10) NOT NULL DEFAULT 'LOW' CHECK (conflict_level IN ('LOW', 'MEDIUM', 'HIGH')),
    qualified BOOLEAN NOT NULL DEFAULT false,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'not_applicable'
        CHECK (verification_status IN ('not_applicable', 'pending_verification', 'verified', 'disqualified', 'needs_clarification')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eval_qual_entry ON evaluation_qualifications(entry_id);

-- ============================================================
-- WINNERS — manual admin assignment only, never automatic.
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluation_winners (
    id SERIAL PRIMARY KEY,
    competition_id INTEGER NOT NULL REFERENCES evaluation_competitions(id) ON DELETE CASCADE,
    entry_id INTEGER NOT NULL REFERENCES evaluation_entries(id) ON DELETE CASCADE,
    prize_type VARCHAR(20) NOT NULL CHECK (prize_type IN ('first', 'second', 'third', 'consolation')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (competition_id, entry_id)
);

-- ============================================================
-- SEED — one competition for the existing photography contest,
-- sourced from the `submissions` table, with default settings.
-- ============================================================
INSERT INTO evaluation_competitions (slug, name, source_table)
VALUES ('snpc2026-photography', 'SNPC 2026 Photography Competition', 'submissions')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO evaluation_settings (competition_id)
SELECT id FROM evaluation_competitions WHERE slug = 'snpc2026-photography'
ON CONFLICT (competition_id) DO NOTHING;
