-- ============================================================
-- Learn English App - Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Create app_users table (stores user profiles and guest session tokens)
CREATE TABLE IF NOT EXISTS public.app_users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'متعلم',
    level TEXT NOT NULL DEFAULT 'A1',
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT,
    placement_completed INTEGER NOT NULL DEFAULT 0,
    session_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Default user #1 for backward compatibility
INSERT INTO public.app_users (id, name, level, xp, streak, placement_completed)
VALUES (1, 'متعلم', 'A1', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Create word_progress table
CREATE TABLE IF NOT EXISTS public.word_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL DEFAULT 1,
    word_id TEXT NOT NULL,
    word TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    level TEXT NOT NULL,
    stage INTEGER NOT NULL DEFAULT 0,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    pronunciation_score INTEGER NOT NULL DEFAULT 0,
    ease_factor NUMERIC NOT NULL DEFAULT 2.5,
    interval_days INTEGER NOT NULL DEFAULT 1,
    next_review_date TEXT,
    last_reviewed_date TEXT,
    is_learned INTEGER NOT NULL DEFAULT 0,
    is_mastered INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, word_id)
);

-- 3. Create daily_activity table
CREATE TABLE IF NOT EXISTS public.daily_activity (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL DEFAULT 1,
    date TEXT NOT NULL,
    words_learned INTEGER NOT NULL DEFAULT 0,
    words_reviewed INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    minutes_studied INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, date)
);

-- 4. Create placement_results table
CREATE TABLE IF NOT EXISTS public.placement_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL DEFAULT 1,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    level TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create story_progress table
CREATE TABLE IF NOT EXISTS public.story_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL DEFAULT 1,
    unit_id TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, unit_id)
);

-- 6. Create dictionary_cache table
CREATE TABLE IF NOT EXISTS public.dictionary_cache (
    word TEXT PRIMARY KEY,
    meaning_ar TEXT NOT NULL,
    phonetic TEXT,
    part_of_speech_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create roleplay_sessions table
CREATE TABLE IF NOT EXISTS public.roleplay_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL DEFAULT 1,
    scenario_id TEXT NOT NULL,
    unit_id TEXT,
    level TEXT NOT NULL,
    turns_count INTEGER NOT NULL DEFAULT 0,
    target_words_used INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 30,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, scenario_id)
);

-- ============================================================
-- Row Level Security (RLS) & Policies
-- ============================================================

ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to app_users" ON public.app_users;
CREATE POLICY "Public full access to app_users" ON public.app_users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.word_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to word_progress" ON public.word_progress;
CREATE POLICY "Public full access to word_progress" ON public.word_progress FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to daily_activity" ON public.daily_activity;
CREATE POLICY "Public full access to daily_activity" ON public.daily_activity FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.placement_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to placement_results" ON public.placement_results;
CREATE POLICY "Public full access to placement_results" ON public.placement_results FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to story_progress" ON public.story_progress;
CREATE POLICY "Public full access to story_progress" ON public.story_progress FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.roleplay_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to roleplay_sessions" ON public.roleplay_sessions;
CREATE POLICY "Public full access to roleplay_sessions" ON public.roleplay_sessions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.dictionary_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access to dictionary_cache" ON public.dictionary_cache;
CREATE POLICY "Public full access to dictionary_cache" ON public.dictionary_cache FOR ALL USING (true) WITH CHECK (true);
