import { NextResponse } from 'next/server';
import { getDictionaryCache, saveDictionaryCache } from '@/lib/db';
import { lookupStoryWord } from '@/data/storyDictionary';
import wordsData from '@/data/words.json';

// In-memory cache for ultra-fast response
const memoryCache = new Map<string, {
  word: string;
  meaningAr: string;
  phonetic?: string;
  partOfSpeechAr?: string;
  isUnitWord?: boolean;
}>();

// Build curriculum word map once
const curriculumMap = new Map<string, {
  word: string;
  meaningAr: string;
  phonetic?: string;
  partOfSpeechAr?: string;
}>();

try {
  const data = wordsData as any;
  if (data?.levels) {
    Object.values(data.levels).forEach((lvl: any) => {
      lvl.units?.forEach((u: any) => {
        u.words?.forEach((w: any) => {
          curriculumMap.set(w.word.toLowerCase().trim(), {
            word: w.word,
            meaningAr: w.meaningAr,
            phonetic: w.phonetic,
            partOfSpeechAr: w.partOfSpeechAr,
          });
        });
      });
    });
  }
} catch {
  // ignore
}

async function fetchOnlineTranslation(word: string): Promise<{ meaningAr: string; phonetic?: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const [transRes, dictRes] = await Promise.allSettled([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|ar`, {
        signal: controller.signal,
      }),
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeout);

    let meaningAr = '';
    let phonetic: string | undefined;

    if (transRes.status === 'fulfilled' && transRes.value.ok) {
      const data = await transRes.value.json();
      if (data?.responseData?.translatedText) {
        meaningAr = data.responseData.translatedText;
      }
    }

    if (dictRes.status === 'fulfilled' && dictRes.value.ok) {
      const data = await dictRes.value.json();
      if (Array.isArray(data) && data[0]) {
        phonetic = data[0].phonetic || data[0].phonetics?.find((p: any) => p.text)?.text;
      }
    }

    if (meaningAr) {
      return { meaningAr, phonetic };
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawWord = searchParams.get('word')?.trim();

  if (!rawWord) {
    return NextResponse.json({ success: false, error: 'Word parameter required' }, { status: 400 });
  }

  const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) {
    return NextResponse.json({ success: false, error: 'Invalid word' }, { status: 400 });
  }

  // 1. In-memory cache
  if (memoryCache.has(clean)) {
    return NextResponse.json({ success: true, data: memoryCache.get(clean) });
  }

  // 2. Curriculum words map (780 words)
  if (curriculumMap.has(clean)) {
    const found = curriculumMap.get(clean)!;
    const res = { ...found, isUnitWord: true };
    memoryCache.set(clean, res);
    await saveDictionaryCache(clean, found.meaningAr, found.phonetic, found.partOfSpeechAr);
    return NextResponse.json({ success: true, data: res });
  }

  // 3. Database cache
  const dbCached = await getDictionaryCache(clean);
  if (dbCached) {
    const res = {
      word: rawWord,
      meaningAr: dbCached.meaning_ar,
      phonetic: dbCached.phonetic,
      partOfSpeechAr: dbCached.part_of_speech_ar,
      isUnitWord: false,
    };
    memoryCache.set(clean, res);
    return NextResponse.json({ success: true, data: res });
  }

  // 4. Built-in story dictionary
  const storyEntry = lookupStoryWord(clean);
  if (storyEntry) {
    const res = {
      word: rawWord,
      meaningAr: storyEntry.meaningAr,
      phonetic: storyEntry.phonetic,
      partOfSpeechAr: storyEntry.partOfSpeechAr,
      isUnitWord: false,
    };
    memoryCache.set(clean, res);
    await saveDictionaryCache(clean, storyEntry.meaningAr, storyEntry.phonetic, storyEntry.partOfSpeechAr);
    return NextResponse.json({ success: true, data: res });
  }

  // 5. Online fallback
  const online = await fetchOnlineTranslation(clean);
  if (online) {
    const res = {
      word: rawWord,
      meaningAr: online.meaningAr,
      phonetic: online.phonetic,
      partOfSpeechAr: undefined,
      isUnitWord: false,
    };
    memoryCache.set(clean, res);
    await saveDictionaryCache(clean, online.meaningAr, online.phonetic);
    return NextResponse.json({ success: true, data: res });
  }

  // Fallback if completely unknown
  return NextResponse.json({
    success: true,
    data: {
      word: rawWord,
      meaningAr: 'كلمة في سياق القصة',
      phonetic: undefined,
      partOfSpeechAr: undefined,
      isUnitWord: false,
    },
  });
}
