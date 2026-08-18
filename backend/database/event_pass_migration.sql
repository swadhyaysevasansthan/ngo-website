-- QR Event Pass & Check-In System
-- Run this migration on your PostgreSQL database.
-- Additive only — does not alter any existing tables.

-- ============================================================
-- EVENTS
-- One row per physical event (e.g. "Swadhyay Annual Day 2026").
-- status flow:  draft → active → completed | cancelled
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    event_date  DATE,
    venue       VARCHAR(255),
    status      VARCHAR(20)  NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug   ON events(slug);

-- ============================================================
-- SCANNER DEVICES
-- Each physical phone / tablet used at an entry gate gets one
-- row.  device_code acts like a username (e.g. "MAIN-GATE-01").
-- password_hash stores a bcrypt hash — same pattern as judges.
-- is_active lets the admin disable a device mid-event without
-- invalidating passes.
-- event_id optionally restricts a scanner to a single event so
-- it cannot check in passes belonging to a different event.
-- ============================================================
CREATE TABLE IF NOT EXISTS scanner_devices (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    device_code   VARCHAR(50)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    event_id      INTEGER REFERENCES events(id) ON DELETE SET NULL,
    gate          VARCHAR(100),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    last_seen_at  TIMESTAMP WITH TIME ZONE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scanner_devices_event  ON scanner_devices(event_id);
CREATE INDEX IF NOT EXISTS idx_scanner_devices_active ON scanner_devices(is_active);

-- ============================================================
-- EVENT PASSES
--
-- pass_number  — human-readable (e.g. "SNEPC-2026-0001"),
--                printed on the physical card.
--
-- qr_token     — cryptographically secure random token
--                (hex from crypto.randomBytes(32), 64 chars).
--                This is what gets embedded in the QR code.
--                UNIQUE at DB level as a hard guard; the
--                application adds a SELECT FOR UPDATE transaction
--                for concurrent-scan safety.
--                Never store the guest name in the QR itself.
--
-- status flow: ISSUED → CHECKED_IN   (one-way, via scanner)
--              ISSUED → CANCELLED    (admin action only)
--
-- checked_in_by — FK to scanner_devices, populated on SUCCESS.
-- gate          — denormalised from scanner_devices at check-in
--                 time so it survives device deletion.
-- ============================================================
CREATE TABLE IF NOT EXISTS event_passes (
    id            SERIAL PRIMARY KEY,
    event_id      INTEGER     NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    pass_number   VARCHAR(30) UNIQUE NOT NULL,
    guest_name    VARCHAR(255) NOT NULL,
    mobile        VARCHAR(20),
    email         VARCHAR(255),
    category      VARCHAR(100),
    qr_token      VARCHAR(128) UNIQUE NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ISSUED'
                  CHECK (status IN ('ISSUED', 'CHECKED_IN', 'CANCELLED')),
    issued_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_in_by INTEGER REFERENCES scanner_devices(id) ON DELETE SET NULL,
    gate          VARCHAR(100),
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hot-path index: every scan does a point-lookup by qr_token
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_passes_qr_token ON event_passes(qr_token);
-- Admin: list / filter passes for an event
CREATE INDEX IF NOT EXISTS idx_event_passes_event    ON event_passes(event_id);
-- Admin: filter by status (ISSUED / CHECKED_IN / CANCELLED)
CREATE INDEX IF NOT EXISTS idx_event_passes_status   ON event_passes(status);
-- Admin: search passes by guest name, mobile, pass number
CREATE INDEX IF NOT EXISTS idx_event_passes_guest    ON event_passes(guest_name);
CREATE INDEX IF NOT EXISTS idx_event_passes_mobile   ON event_passes(mobile);
CREATE INDEX IF NOT EXISTS idx_event_passes_number   ON event_passes(pass_number);

-- ============================================================
-- CHECKIN LOGS
-- Append-only audit trail.  Every scan attempt is recorded,
-- whether it succeeded or not.  Never UPDATE or DELETE rows.
--
-- pass_id   — NULL if the scanned token was not found in the DB.
-- raw_token — what was actually scanned, for forensics.
-- action    — SCAN (APK) or MANUAL_CHECKIN (admin fallback).
-- result    — SUCCESS | ALREADY_CHECKED_IN | INVALID |
--             CANCELLED | WRONG_EVENT
-- ============================================================
CREATE TABLE IF NOT EXISTS checkin_logs (
    id         SERIAL PRIMARY KEY,
    event_id   INTEGER NOT NULL REFERENCES events(id),
    pass_id    INTEGER REFERENCES event_passes(id),
    scanner_id INTEGER REFERENCES scanner_devices(id),
    gate       VARCHAR(100),
    action     VARCHAR(30) NOT NULL
               CHECK (action IN ('SCAN', 'MANUAL_CHECKIN')),
    result     VARCHAR(30) NOT NULL
               CHECK (result IN (
                   'SUCCESS',
                   'ALREADY_CHECKED_IN',
                   'INVALID',
                   'CANCELLED',
                   'WRONG_EVENT'
               )),
    raw_token  VARCHAR(128),
    ip_address INET,
    user_agent TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkin_logs_event      ON checkin_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_pass       ON checkin_logs(pass_id);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_scanner    ON checkin_logs(scanner_id);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_scanned_at ON checkin_logs(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_result     ON checkin_logs(result);
