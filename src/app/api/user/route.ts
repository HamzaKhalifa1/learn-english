import { NextResponse } from 'next/server';
import { addXP, getDb } from '@/lib/db';
import { getOrCreateGuestUser, getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const user = await getOrCreateGuestUser();
    return NextResponse.json({ success: true, data: user });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const body = await req.json();

    // Add XP
    if (body.xp) addXP(body.xp, userId);

    // Update user level upon graduation
    if (body.action === 'update-level' && body.level) {
      const db = getDb();
      db.prepare('UPDATE users SET level = ? WHERE id = ?').run(body.level, userId);
      return NextResponse.json({ success: true, level: body.level });
    }

    // Reset placement test — allows re-taking the test
    if (body.action === 'reset-placement') {
      const db = getDb();
      db.prepare('UPDATE users SET placement_completed = 0, level = ? WHERE id = ?').run('A1', userId);
      db.prepare('DELETE FROM placement_results WHERE user_id = ?').run(userId);
      // Also clear all word progress so they start fresh
      db.prepare('DELETE FROM word_progress WHERE user_id = ?').run(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
