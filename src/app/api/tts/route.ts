import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// In-memory cache for fast replay of common words and phrases
const ttsCache = new Map<string, Buffer>();
const MAX_CACHE_ENTRIES = 500;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawText = searchParams.get('text') || '';
    const text = rawText.trim().slice(0, 500); // Limit length to 500 characters
    const voice = searchParams.get('voice') || 'en-US-JennyNeural';

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const cacheKey = `${voice}:${text}`;
    if (ttsCache.has(cacheKey)) {
      const cached = ttsCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cached.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const timeout = setTimeout(() => {
        tts.close();
        reject(new Error('TTS timeout'));
      }, 10000);

      audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      audioStream.on('end', () => {
        clearTimeout(timeout);
        tts.close();
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err) => {
        clearTimeout(timeout);
        tts.close();
        reject(err);
      });
    });

    if (ttsCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, buffer);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    // Re-throw Next.js internal prerender bailout errors
    if (error?.digest?.startsWith?.('NEXT_') || error?.message?.includes?.('bail out')) {
      throw error;
    }
    console.error('Edge TTS Error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
