import { NextResponse } from 'next/server';
import {
  upsertWordProgress,
  updateWordStage,
  addXP,
  getWordProgress,
  bulkMarkWordsKnown,
  resetUnitProgress,
  resetWordProgress,
} from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const body = await req.json();
    const { action, wordId, word, unitId, level, stage, correct } = body;

    if (action === 'start') {
      // Create record if it doesn't exist yet
      await upsertWordProgress({
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
      const existing = await getWordProgress(wordId, userId);
      if (!existing && word && unitId) {
        await upsertWordProgress({
          word_id: wordId,
          word,
          unit_id: unitId,
          level: level ?? 'A1',
          stage: 1,
          user_id: userId,
        });
      }

      await updateWordStage(wordId, stage, correct, userId);

      // Award XP per stage (only on correct or non-quiz stages)
      const xpMap: Record<number, number> = {
        1: 2,   // Recognition
        2: 3,   // Meaning
        3: 5,   // Pronunciation
        4: 5,   // Sentence
        5: 10,  // Quiz (learned!)
      };
      if (correct !== false) {
        await addXP(xpMap[stage] ?? 2, userId);
      }

      return NextResponse.json({ success: true });
    }

    // ── Bulk mark known words (fast-track pre-unit test) ────────────────
    if (action === 'bulk-mark-known') {
      const wordList = (body.words || []) as Array<{
        wordId: string;
        word: string;
        unitId: string;
        level: string;
      }>;

      await bulkMarkWordsKnown(wordList, userId);
      return NextResponse.json({ success: true, count: wordList.length });
    }

    // ── Reset all words in a unit (for re-study) ─────────────────────────
    if (action === 'reset-unit') {
      await resetUnitProgress(unitId, userId);
      return NextResponse.json({ success: true });
    }

    // ── Reset a single word (for re-study one word) ──────────────────────
    if (action === 'reset-word') {
      await resetWordProgress(wordId, userId);
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
