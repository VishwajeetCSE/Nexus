-- =========================================================
-- NEXUS: CAMPUSPULSE GLOBAL - UNIFIED DATABASE SCHEMA
-- Hackathon Speed Architecture: Unified Multi-Campus Engine
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CAMPUSES TABLE
-- Stores campus metadata worldwide
CREATE TABLE IF NOT EXISTS campuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    developer_github_handle TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. POSTS TABLE
-- Unified collection storing alerts, announcements, and peer SOS queries
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    campus_id TEXT NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_role_tag TEXT NOT NULL CHECK (user_role_tag IN ('admin', 'club', 'student')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_tag TEXT NOT NULL CHECK (category_tag IN ('Official Alert', 'Fest/Events', 'Lost & Found', 'Exam Preparation', 'SOS Query')),
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    is_sos BOOLEAN DEFAULT false NOT NULL,
    is_anonymous BOOLEAN DEFAULT false NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ANSWERS / REPLIES TABLE (FOR PEER-TO-PEER SOS QUERIES)
CREATE TABLE IF NOT EXISTS post_answers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_role_tag TEXT NOT NULL DEFAULT 'student',
    content TEXT NOT NULL,
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    is_accepted BOOLEAN DEFAULT false NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. INDEXES FOR LIGHTNING FAST FEED FILTERING
CREATE INDEX IF NOT EXISTS idx_posts_campus_id ON posts(campus_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_tag ON posts(category_tag);
CREATE INDEX IF NOT EXISTS idx_posts_upvotes ON posts(upvotes_count DESC);
CREATE INDEX IF NOT EXISTS idx_answers_post_id ON post_answers(post_id);

-- 6. ROW LEVEL SECURITY (RLS) FOR OPEN READ / SECURE WRITE
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public insert campuses" ON campuses FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Public insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update post upvotes" ON posts FOR UPDATE USING (true);

CREATE POLICY "Public read answers" ON post_answers FOR SELECT USING (true);
CREATE POLICY "Public insert answers" ON post_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update answer upvotes" ON post_answers FOR UPDATE USING (true);

-- 7. INITIAL WORLDWIDE SEED DATA
INSERT INTO campuses (id, name, city, country, developer_github_handle, is_verified) VALUES
('bhopal-node', 'MANIT / RGPV University Hub', 'Bhopal', 'India', 'campus-dev-bhopal', true),
('polaris-blr', 'Polaris School of Technology', 'Bangalore', 'India', 'nexus-polaris', true),
('iitb-mum', 'IIT Bombay', 'Mumbai', 'India', 'iitb-foss', true),
('stanford-us', 'Stanford University', 'Stanford, CA', 'USA', 'stanford-tree-dev', true),
('nus-sg', 'National University of Singapore (NUS)', 'Singapore', 'Singapore', 'nus-hackers', true),
('oxford-uk', 'University of Oxford', 'Oxford', 'United Kingdom', 'oxford-oxon', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, campus_id, user_name, user_role_tag, title, content, category_tag, upvotes_count, is_sos, is_anonymous, timestamp) VALUES
('post-1', 'bhopal-node', 'Dean of Academic Affairs', 'admin', 'Official: End Semester Examination Schedule Finalized', 'The end-term examinations for all undergraduate and postgraduate engineering branches will commence from Dec 1st. Check the academic portal for slot bookings.', 'Official Alert', 42, false, false, NOW() - INTERVAL '2 hours'),
('post-2', 'bhopal-node', 'Robotics & AI Club', 'club', 'Annual RoboQuest 2026 Registration Open!', 'Get your bot kits ready! The annual inter-collegiate robotics sprint is back with a total prize pool of 100,000 INR. Hackathon track included.', 'Fest/Events', 29, false, false, NOW() - INTERVAL '5 hours'),
('post-3', 'bhopal-node', 'Rahul Sharma', 'student', 'Lost Blue HP Laptop Bag near Central Library Desk 4', 'Left my laptop bag with course notes and charger around 4 PM today near Desk 4. If found, please drop at the library reception or DM me.', 'Lost & Found', 14, false, false, NOW() - INTERVAL '1 day'),
('post-4', 'bhopal-node', 'Anonymous Student', 'student', 'URGENT SOS: Need past 3 years DSP question papers & notes', 'Professor changed the mid-term syllabus for Digital Signal Processing. Does anyone have verified handwritten notes or previous year answer keys?', 'SOS Query', 31, true, true, NOW() - INTERVAL '3 hours'),
('post-5', 'polaris-blr', 'Polaris Academic Directorate', 'admin', 'Winter Cohort AI & Distributed Systems Bootcamp', 'Registration closes this Friday for the 4-week industry mentorship sprint with top founders and architects.', 'Official Alert', 88, false, false, NOW() - INTERVAL '1 hour'),
('post-6', 'polaris-blr', 'Anonymous Student', 'student', 'SOS: Roommate needed near HSR Layout 5th Sector', 'Looking for a flatmate starting next month within walking distance of Polaris campus. Rent ~12k/month. Any leads?', 'SOS Query', 19, true, true, NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;
