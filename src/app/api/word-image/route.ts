import { NextResponse } from 'next/server';
import { getCuratedWordVisual } from '@/lib/wordVisuals';

// In-memory cache for fast subsequent lookups
const imageCache = new Map<string, { imageUrl: string; source: string }>();

async function fetchWikiImage(word: string): Promise<string | null> {
  try {
    const cleanWord = word.trim().replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanWord)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'LearnEngApp/2.0 (education@learneng.local)',
      },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (json.thumbnail && json.thumbnail.source) {
      // Upscale thumbnail resolution if needed
      return json.thumbnail.source.replace(/\/\d+px-/, '/640px-');
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get('word')?.trim();

  if (!word) {
    return NextResponse.json({ success: false, error: 'Word parameter required' }, { status: 400 });
  }

  const key = word.toLowerCase();

  // 1. Check in-memory cache
  if (imageCache.has(key)) {
    return NextResponse.json({ success: true, ...imageCache.get(key) });
  }

  // 2. Check local curated high-def visual database first
  const curated = getCuratedWordVisual(key);
  if (curated) {
    const result = { imageUrl: curated.imageUrl, source: 'curated', emoji: curated.emoji };
    imageCache.set(key, result);
    return NextResponse.json({ success: true, ...result });
  }

  // 3. Smart Fallback to Wikipedia Encyclopedia Image
  const wikiImage = await fetchWikiImage(word);
  if (wikiImage) {
    const result = { imageUrl: wikiImage, source: 'wikipedia' };
    imageCache.set(key, result);
    return NextResponse.json({ success: true, ...result });
  }

  // 4. Return fallback default
  return NextResponse.json({
    success: true,
    imageUrl: null,
    source: 'none'
  });
}
