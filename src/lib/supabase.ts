import { createClient } from '@supabase/supabase-js';

let supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://gghrobrmecbalfjrwlkb.supabase.co';

// Auto-correct typo: 'balffrwlkb' -> 'balfjrwlkb'
if (supabaseUrl.includes('balffrwlkb')) {
  supabaseUrl = supabaseUrl.replace('balffrwlkb', 'balfjrwlkb');
}

let supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_v7ZykRJZ-NTwFTr4dc_kEg_yZ9TZkZo';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
