import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getGuestUserId();
    const stats = getStats(userId);
    return NextResponse.json({ success: true, data: stats });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
