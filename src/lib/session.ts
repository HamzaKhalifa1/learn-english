import { cookies } from 'next/headers';
import { getDb, User } from './db';

export const GUEST_COOKIE_NAME = 'learn_guest_session';

/**
 * Retrieves or lazily creates a unique Guest User for the current visitor.
 * Reads the 'learn_guest_session' cookie. If not found or if the token doesn't
 * exist in SQLite, creates a new guest user with initial level 'A1' and 0 XP.
 */
export async function getOrCreateGuestUser(): Promise<User> {
  const db = getDb();
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  } catch {
    // Outside request context
  }

  if (token) {
    const existing = db
      .prepare('SELECT * FROM users WHERE session_token = ?')
      .get(token) as User | undefined;
    if (existing) {
      return existing;
    }

    // Token exists in cookie but user not yet in DB: insert
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
      // In case of concurrent insert
      const retry = db
        .prepare('SELECT * FROM users WHERE session_token = ?')
        .get(token) as User | undefined;
      if (retry) return retry;
    }
  }

  // Fallback to default user 1 if no cookie
  const user1 = db.prepare('SELECT * FROM users WHERE id = 1').get() as User | undefined;
  if (user1) return user1;

  // If user 1 doesn't exist, create it
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
