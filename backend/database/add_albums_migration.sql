-- Run this migration to add album support
-- Execute this on your PostgreSQL database

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_image_albums_topic ON community_image_albums(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_images_album ON community_images(album_id);
