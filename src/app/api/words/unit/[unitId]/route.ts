import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

// GET /api/words/unit/[unitId] — returns progress for all words in one unit for current guest
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const userId = await getGuestUserId();
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT word_id, stage, is_learned, total_attempts, correct_attempts,
                next_review_date, updated_at
         FROM word_progress
         WHERE user_id = ? AND unit_id = ?
         ORDER BY updated_at DESC`
      )
      .all(userId, unitId);
    return NextResponse.json({ success: true, data: rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
