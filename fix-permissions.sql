-- ============================================================
-- Fix Permissions & Disable RLS for Guest Sessions
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Grant full access on all tables and sequences to anon & authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. Disable Row Level Security (RLS) so the app can freely save progress and user results
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roleplay_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_cache DISABLE ROW LEVEL SECURITY;

-- 3. Ensure default user exists
INSERT INTO public.app_users (id, name, level, xp, streak, placement_completed)
VALUES (1, 'متعلم', 'A1', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
