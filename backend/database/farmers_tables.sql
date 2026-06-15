-- 1. farmers (Main table)
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    slug VARCHAR(255) UNIQUE NOT NULL,

    designation VARCHAR(255),

    location VARCHAR(255),

    short_bio TEXT,

    detailed_bio TEXT,

    profile_image TEXT,

    cover_image TEXT,

    phone VARCHAR(50),

    email VARCHAR(255),

    website TEXT,

    instagram TEXT,

    facebook TEXT,

    address TEXT,

    categories JSONB DEFAULT '[]',

    achievements JSONB DEFAULT '[]',

    products JSONB DEFAULT '[]',

    gallery JSONB DEFAULT '[]',

    is_featured BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Farmers categories
CREATE TABLE farmer_categories (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO farmer_categories(name)
VALUES
('Organic Farming'),
('Natural Farming'),
('Agro Tourism'),
('Dairy Farming'),
('Wellness'),
('Permaculture');