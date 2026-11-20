import { NextResponse } from 'next/server';
import { getWordsForReview } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getGuestUserId();
    const words = await getWordsForReview(userId);
    return NextResponse.json({ success: true, data: words });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
