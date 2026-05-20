-- Community Topics table
CREATE TABLE IF NOT EXISTS community_topics (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    hero_image_url TEXT,
    hero_image_public_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Sections table
CREATE TABLE IF NOT EXISTS community_sections (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL,
    content TEXT,
    section_type VARCHAR(50) DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Images table
CREATE TABLE IF NOT EXISTS community_images (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    public_id VARCHAR(255),
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Events table
CREATE TABLE IF NOT EXISTS community_events (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date VARCHAR(100),
    event_type VARCHAR(50) DEFAULT 'past',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Stats table
CREATE TABLE IF NOT EXISTS community_stats (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Image Albums table
CREATE TABLE IF NOT EXISTS community_image_albums (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add album_id column to community_images (for grouping images into albums)
ALTER TABLE community_images ADD COLUMN IF NOT EXISTS album_id INTEGER REFERENCES community_image_albums(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_topics_slug ON community_topics(slug);
CREATE INDEX IF NOT EXISTS idx_community_sections_topic ON community_sections(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_images_topic ON community_images(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_events_topic ON community_events(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_stats_topic ON community_stats(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_image_albums_topic ON community_image_albums(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_images_album ON community_images(album_id);
