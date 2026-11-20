import { NextResponse } from 'next/server';
import { getPlacementQuestions, determineLevelFromScore, getAllUnits } from '@/lib/words';
import { savePlacementResult, addXP, markLowerLevelWordsAsKnown } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const questions = getPlacementQuestions();
    return NextResponse.json({ success: true, data: questions });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const { score, total, answers } = await req.json();

    // Use adaptive scoring if detailed answers are provided
    const level = determineLevelFromScore(score, total, answers);
    savePlacementResult(score, total, level, userId);
    addXP(50, userId);

    // Auto-mark all words BELOW the user's level as known (stage=5)
    // so the user doesn't waste time on "Yes", "Hello" if they're B1+
    const allUnits = getAllUnits();
    const wordsToMark = allUnits.flatMap(u =>
      u.words.map(w => ({ id: w.id, word: w.word, unitId: u.id, level: u.level ?? 'A1' }))
    );
    markLowerLevelWordsAsKnown(level, wordsToMark, userId);

    return NextResponse.json({ success: true, data: { level } });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
