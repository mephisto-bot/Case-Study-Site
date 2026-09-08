-- =========================================================================
-- CIH CASE STUDY REGISTRATION & USERS SCHEMA FOR SUPABASE
-- Run this in your Supabase Project Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    attendee_type TEXT NOT NULL DEFAULT 'GUEST',
    media_consent BOOLEAN NOT NULL DEFAULT true,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast email & session lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (email);
CREATE INDEX IF NOT EXISTS idx_registrations_session_date ON public.registrations (session_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts from the public registration web form
DROP POLICY IF EXISTS "Allow public registration insert" ON public.registrations;
CREATE POLICY "Allow public registration insert" 
ON public.registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading registrations
DROP POLICY IF EXISTS "Allow public registration select" ON public.registrations;
CREATE POLICY "Allow public registration select" 
ON public.registrations 
FOR SELECT 
TO anon, authenticated 
USING (true);


-- 2. Create users/profiles table for attendee & alumni accounts
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'guest',
    is_alumni BOOLEAN NOT NULL DEFAULT false,
    alumni_cohort TEXT,
    is_mentor_volunteer BOOLEAN NOT NULL DEFAULT false,
    mentor_focus_areas TEXT[] DEFAULT '{}',
    mentor_bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts/upserts for sign up
DROP POLICY IF EXISTS "Allow public user insert" ON public.users;
CREATE POLICY "Allow public user insert" 
ON public.users 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public user update" ON public.users;
CREATE POLICY "Allow public user update" 
ON public.users 
FOR UPDATE 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow public user select" ON public.users;
CREATE POLICY "Allow public user select" 
ON public.users 
FOR SELECT 
TO anon, authenticated 
USING (true);
