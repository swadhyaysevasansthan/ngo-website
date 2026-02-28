-- Participants table
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    participant_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(30) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    college_name VARCHAR(255) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year_of_study VARCHAR(20) CHECK (year_of_study IN ('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate')),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(20) CHECK (category IN ('nature', 'wildlife')),
    payment_status BOOLEAN DEFAULT false,
    payment_id VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    declaration_accepted BOOLEAN DEFAULT false,
    has_submitted BOOLEAN DEFAULT false
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    participant_id VARCHAR(50) REFERENCES participants(participant_id),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    amount INTEGER,
    currency VARCHAR(10),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    participant_id VARCHAR(50) NOT NULL REFERENCES participants(participant_id),
    capture_location TEXT NOT NULL,
    capture_date DATE NOT NULL,
    camera_model TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    image_width INT NOT NULL,
    image_height INT NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email logs table
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    participant_id VARCHAR(20),
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_participant_email ON participants(email);
CREATE INDEX idx_participant_id ON participants(participant_id);
CREATE INDEX idx_submission_participant ON submissions(participant_id);
CREATE INDEX idx_email_logs_participant ON email_logs(participant_id);

-- Insert default admin (replace hash with real bcrypt hash)
INSERT INTO admins (username, password_hash, email)
VALUES ('admin', '$2b$10$eHVfjy0hgrfjA2I0OQ0Gy.WrOwMLNqNP1VD6ds00/jC.C6mE420DG', 'admin@snpc2026.com');
