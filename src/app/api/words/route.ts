import { NextResponse } from 'next/server';
import { getAllWordProgress } from '@/lib/db';
import { getWord } from '@/lib/words';
import { getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getGuestUserId();
    const progress = await getAllWordProgress(userId);
    
    // Enrich word progress with full word details from words data
    const enriched = progress.map(p => {
      const details = getWord(p.word_id);
      return {
        ...p,
        meaningAr: details?.meaningAr || (details as any)?.meaning || '—',
        meaningEn: details?.meaningEn || '',
        phonetic: details?.phonetic || '',
        category: details?.category || '',
        partOfSpeechAr: details?.partOfSpeechAr || '',
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
