CREATE TABLE visitor_stats (
    id SERIAL PRIMARY KEY,
    total_visitors BIGINT NOT NULL DEFAULT 5654
);

INSERT INTO visitor_stats (total_visitors)
SELECT 5654
WHERE NOT EXISTS (
    SELECT 1 FROM visitor_stats
);

CREATE TABLE visitor_logs (
    id SERIAL PRIMARY KEY,
    visitor_token TEXT UNIQUE,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);