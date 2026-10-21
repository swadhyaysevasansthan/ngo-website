-- ========================================================================
-- Database Performance Index Optimization Migration
-- Run these in Aiven PostgreSQL query editor or psql.
-- Using CONCURRENTLY avoids table locking during index creation in production.
-- ========================================================================

-- 1. Accelerates teacher lookups by registration_id
-- Eliminates full table scans on competition_registration_teachers
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_teachers_registration_id 
ON competition_registration_teachers(registration_id);

-- 2. Accelerates review version lookups for LATERAL join and getVersions
-- Speeds up admin review queries and single review fetch
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_review_versions_review_id_created 
ON review_versions(review_id, created_at DESC);

-- 3. Accelerates school competition registration lookups by request_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_school_comp_reg_request_id 
ON school_competition_registrations(request_id);

-- 4. Accelerates school competition registration listing by type and submission time
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_school_comp_reg_comp_type 
ON school_competition_registrations(competition_type, submitted_at DESC);
