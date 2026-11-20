-- ============================================================
-- Complete Schema & Permissions Setup for Supabase
-- ============================================================

-- 1. Create roleplay_sessions if missing
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

-- 2. Create dictionary_cache if missing
CREATE TABLE IF NOT EXISTS public.dictionary_cache (
    word TEXT PRIMARY KEY,
    meaning_ar TEXT NOT NULL,
    phonetic TEXT,
    part_of_speech_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Grant full permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Disable RLS on all tables
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roleplay_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_cache DISABLE ROW LEVEL SECURITY;

-- 5. Default user
INSERT INTO public.app_users (id, name, level, xp, streak, placement_completed)
VALUES (1, 'متعلم', 'A1', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
