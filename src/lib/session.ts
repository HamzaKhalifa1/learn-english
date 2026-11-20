import { cookies } from 'next/headers';
import { getDb, User } from './db';
import { supabase, isSupabaseConfigured } from './supabase';

export const GUEST_COOKIE_NAME = 'learn_guest_session';

/**
 * Retrieves or lazily creates a unique Guest User for the current visitor.
 * Reads the 'learn_guest_session' cookie. Supports both Supabase (cloud)
 * and SQLite (local fallback).
 */
export async function getOrCreateGuestUser(): Promise<User> {
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  } catch {
    // Outside request context
  }

  // 1. Supabase Mode (Vercel / Cloud)
  if (isSupabaseConfigured && supabase) {
    if (token) {
      const { data: existing } = await supabase
        .from('app_users')
        .select('*')
        .eq('session_token', token)
        .maybeSingle();

      if (existing) {
        return existing as User;
      }

      // Create new user in Supabase
      const { data: created } = await supabase
        .from('app_users')
        .insert({
          name: 'متعلم',
          level: 'A1',
          xp: 0,
          streak: 0,
          placement_completed: 0,
          session_token: token,
        })
        .select()
        .single();

      if (created) return created as User;
    }

    // Default user fallback in Supabase
    const { data: user1 } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (user1) return user1 as User;

    const { data: created1 } = await supabase
      .from('app_users')
      .upsert({ id: 1, name: 'متعلم', level: 'A1', xp: 0, streak: 0, placement_completed: 0 })
      .select()
      .single();

    return (created1 || {
      id: 1,
      name: 'متعلم',
      level: 'A1',
      xp: 0,
      streak: 0,
      placement_completed: 0,
      created_at: new Date().toISOString(),
    }) as User;
  }

  // 2. Local SQLite Mode
  const db = getDb();
  if (token) {
    const existing = db
      .prepare('SELECT * FROM users WHERE session_token = ?')
      .get(token) as User | undefined;
    if (existing) return existing;

    try {
      const res = db
        .prepare(
          `INSERT INTO users (name, level, xp, streak, placement_completed, session_token)
           VALUES ('متعلم', 'A1', 0, 0, 0, ?)`
        )
        .run(token);
      return db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(Number(res.lastInsertRowid)) as User;
    } catch {
      const retry = db
        .prepare('SELECT * FROM users WHERE session_token = ?')
        .get(token) as User | undefined;
      if (retry) return retry;
    }
  }

  const user1 = db.prepare('SELECT * FROM users WHERE id = 1').get() as User | undefined;
  if (user1) return user1;

  const res = db
    .prepare(
      `INSERT INTO users (id, name, level, xp, streak, placement_completed)
       VALUES (1, 'متعلم', 'A1', 0, 0, 0)`
    )
    .run();
  return db.prepare('SELECT * FROM users WHERE id = 1').get() as User;
}

export async function getGuestUserId(): Promise<number> {
  const user = await getOrCreateGuestUser();
  return user.id;
}
