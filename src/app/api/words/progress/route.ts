import { NextResponse } from 'next/server';
import { upsertWordProgress, updateWordStage, addXP, getWordProgress, getDb } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const body = await req.json();
    const { action, wordId, word, unitId, level, stage, correct } = body;

    if (action === 'start') {
      // Create record if it doesn't exist yet
      upsertWordProgress({
        word_id: wordId,
        word: word ?? wordId,
        unit_id: unitId ?? '',
        level: level ?? 'A1',
        stage: 1,
        user_id: userId,
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      // If record doesn't exist (e.g. pre-quiz fast-track), create it first
      const existing = getWordProgress(wordId, userId);
      if (!existing && word && unitId) {
        upsertWordProgress({
          word_id: wordId,
          word,
          unit_id: unitId,
          level: level ?? 'A1',
          stage: 1,
          user_id: userId,
        });
      }

      updateWordStage(wordId, stage, correct, userId);

      // Award XP per stage (only on correct or non-quiz stages)
      const xpMap: Record<number, number> = {
        1: 2,   // Recognition
        2: 3,   // Meaning
        3: 5,   // Pronunciation
        4: 5,   // Sentence
        5: 10,  // Quiz (learned!)
      };
      if (correct !== false) {
        addXP(xpMap[stage] ?? 2, userId);
      }

      return NextResponse.json({ success: true });
    }

    // ── Bulk mark known words (fast-track pre-unit test) ────────────────
    if (action === 'bulk-mark-known') {
      const db = getDb();
      const insertOrUpdate = db.prepare(`
        INSERT INTO word_progress (
          user_id, word_id, word, unit_id, level, stage,
          is_learned, total_attempts, correct_attempts,
          last_reviewed_date, next_review_date, updated_at
        )
        VALUES (
          ?, ?, ?, ?, ?, 5,
          1, 1, 1,
          date('now'), date('now', '+3 days'), datetime('now')
        )
        ON CONFLICT(user_id, word_id) DO UPDATE SET
          stage = 5,
          is_learned = 1,
          total_attempts = total_attempts + 1,
          correct_attempts = correct_attempts + 1,
          last_reviewed_date = date('now'),
          next_review_date = date('now', '+3 days'),
          updated_at = datetime('now')
      `);

      const wordList = (body.words || []) as Array<{
        wordId: string;
        word: string;
        unitId: string;
        level: string;
      }>;

      const run = db.transaction(() => {
        for (const item of wordList) {
          insertOrUpdate.run(userId, item.wordId, item.word, item.unitId, item.level || 'A1');
        }
      });
      run();

      addXP(wordList.length * 10, userId);
      return NextResponse.json({ success: true, count: wordList.length });
    }

    // ── Reset all words in a unit (for re-study) ─────────────────────────
    if (action === 'reset-unit') {
      const db = getDb();
      db.prepare(`
        UPDATE word_progress
        SET stage = 0,
            is_learned = 0,
            is_mastered = 0,
            next_review_date = NULL,
            updated_at = datetime('now')
        WHERE user_id = ? AND unit_id = ?
      `).run(userId, unitId);
      return NextResponse.json({ success: true });
    }

    // ── Reset a single word (for re-study one word) ──────────────────────
    if (action === 'reset-word') {
      const db = getDb();
      db.prepare(`
        UPDATE word_progress
        SET stage = 0,
            is_learned = 0,
            is_mastered = 0,
            next_review_date = NULL,
            updated_at = datetime('now')
        WHERE user_id = ? AND word_id = ?
      `).run(userId, wordId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action' },
      { status: 400 }
    );
  } catch (e) {
    console.error('Progress API error:', e);
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
